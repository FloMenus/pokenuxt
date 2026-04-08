import type {
  GenerationResponse,
  GetAllPokemonOptions,
  Pokemon,
  PokemonListResponse,
  TypeResponse,
} from "~/types/pokemon";
import type { PokemonType } from "~/types/type";

const BASE_URL = "https://pokeapi.co/api/v2/pokemon";
const API_BASE_URL = "https://pokeapi.co/api/v2";
const LIMIT = 60;

export const pokemonService = {
  async getAll(
    page: number = 1,
  ): Promise<{ pokemons: Pokemon[]; total: number }> {
    const offset = (page - 1) * LIMIT;

    const list = await $fetch<PokemonListResponse>(BASE_URL, {
      query: { limit: LIMIT, offset },
    });

    const results = await Promise.allSettled(
      list.results.map(async (result) => {
        const data = await $fetch<any>(result.url);
        const image =
          data.sprites.other["official-artwork"].front_default ??
          data.sprites.front_default;

        if (!image) throw new Error('no image')

        return {
          id: data.id,
          name: data.name,
          image,
          types: data.types.map((t: any) => t.type.name) as PokemonType[],
        } satisfies Pokemon;
      }),
    );

    const pokemons = results
      .filter((r): r is PromiseFulfilledResult<Pokemon> => r.status === 'fulfilled')
      .map((r) => r.value);

    return { pokemons, total: list.count };
  },

  async getAllWithOptions(
    page: number = 1,
    options: GetAllPokemonOptions = {},
  ): Promise<{ pokemons: Pokemon[]; total: number }> {
    const generations = options.generation ?? [];
    const types = options.types ?? [];

    const hasGeneration = generations.length > 0;
    const hasTypes = types.length > 0;

    if (
      !hasGeneration &&
      !hasTypes
    ) {
      return this.getAll(page);
    }

    if (hasGeneration && generations.some((generation) => generation < 1 || generation > 9)) {
      throw new Error("Each generation must be between 1 and 9");
    }

    let allowedNames: Set<string> | null = null;

    /* Filter by generation */
    if (hasGeneration) {
      const generationSets = await Promise.all(
        generations.map(async (generation) => {
          const generationData = await $fetch<GenerationResponse>(
            `${API_BASE_URL}/generation/${generation}`,
          );
          return new Set(
            generationData.pokemon_species.map((species) => species.name),
          );
        }),
      );

      const namesFromGenerations = new Set<string>();
      generationSets.forEach((generationSet) => {
        generationSet.forEach((name) => namesFromGenerations.add(name));
      });

      allowedNames = namesFromGenerations;
    }

    /* Filter by types */
    if (hasTypes) {
      const typeSets = await Promise.all(
        types.map(async (type) => {
          const typeData = await $fetch<TypeResponse>(`${API_BASE_URL}/type/${type}`);
          return new Set(typeData.pokemon.map((entry) => entry.pokemon.name));
        }),
      );

      const [firstTypeSet, ...otherTypeSets] = typeSets;
      const namesMatchingAllTypes = otherTypeSets.reduce<Set<string>>((acc, currentSet) => {
        return new Set([...acc].filter((name) => currentSet.has(name)));
      }, new Set(firstTypeSet));

      allowedNames = allowedNames
        ? new Set([...allowedNames].filter((name) => namesMatchingAllTypes.has(name)))
        : namesMatchingAllTypes;
    }

    const allFilteredNames = [...(allowedNames ?? new Set<string>())].sort();
    const total = allFilteredNames.length;

    const offset = (page - 1) * LIMIT;

    const pageNames = allFilteredNames.slice(offset, offset + LIMIT);

    const results = await Promise.allSettled(
      pageNames.map(async (name) => {
        const data = await $fetch<any>(`${BASE_URL}/${name}`);
        const image =
          data.sprites.other["official-artwork"].front_default ??
          data.sprites.front_default;

        if (!image) throw new Error('no image')

        return {
          id: data.id,
          name: data.name,
          image,
          types: data.types.map((t: any) => t.type.name) as PokemonType[],
        } satisfies Pokemon;
      }),
    );

    const pokemons = results
      .filter((r): r is PromiseFulfilledResult<Pokemon> => r.status === 'fulfilled')
      .map((r) => r.value);

    return { pokemons, total };
  },
};
