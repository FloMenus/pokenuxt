import type {
  EvolutionChainNode,
  EvolutionConditions,
  EvolutionPokemon,
  GenerationResponse,
  GetAllPokemonOptions,
  Pokemon,
  PokemonDetail,
  PokemonForm,
  PokemonListResponse,
  TypeResponse,
} from "~/types/pokemon";
import type { PokemonType } from "~/types/type";

const BASE_URL = "https://pokeapi.co/api/v2/pokemon";

let nameListCache: string[] | null = null;
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

        if (!image) throw new Error("no image");

        return {
          id: data.id,
          name: data.name,
          image,
          types: data.types.map((t: any) => t.type.name) as PokemonType[],
        } satisfies Pokemon;
      }),
    );

    const pokemons = results
      .filter(
        (r): r is PromiseFulfilledResult<Pokemon> => r.status === "fulfilled",
      )
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

    if (!hasGeneration && !hasTypes) {
      return this.getAll(page);
    }

    if (
      hasGeneration &&
      generations.some((generation) => generation < 1 || generation > 9)
    ) {
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
          const typeData = await $fetch<TypeResponse>(
            `${API_BASE_URL}/type/${type}`,
          );
          return new Set(typeData.pokemon.map((entry) => entry.pokemon.name));
        }),
      );

      const [firstTypeSet, ...otherTypeSets] = typeSets;
      const namesMatchingAllTypes = otherTypeSets.reduce<Set<string>>(
        (acc, currentSet) => {
          return new Set([...acc].filter((name) => currentSet.has(name)));
        },
        new Set(firstTypeSet),
      );

      allowedNames = allowedNames
        ? new Set(
            [...allowedNames].filter((name) => namesMatchingAllTypes.has(name)),
          )
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

        if (!image) throw new Error("no image");

        return {
          id: data.id,
          name: data.name,
          image,
          types: data.types.map((t: any) => t.type.name) as PokemonType[],
        } satisfies Pokemon;
      }),
    );

    const pokemons = results
      .filter(
        (r): r is PromiseFulfilledResult<Pokemon> => r.status === "fulfilled",
      )
      .map((r) => r.value);

    return { pokemons, total };
  },

  async getById(id: number | string): Promise<PokemonDetail> {
    const [data, species] = await Promise.all([
      $fetch<any>(`${BASE_URL}/${id}`),
      $fetch<any>(`${API_BASE_URL}/pokemon-species/${id}`).catch(() => null),
    ]);

    const image =
      data.sprites.other["official-artwork"].front_default ??
      data.sprites.front_default;

    const stats = data.stats.map((s: any) => ({
      name: s.stat.name,
      value: s.base_stat,
    }));

    const abilities = data.abilities.map((a: any) => ({
      name: a.ability.name,
      isHidden: a.is_hidden,
    }));

    let description = "";
    if (species) {
      const entry =
        species.flavor_text_entries.find(
          (e: any) => e.language.name === "fr",
        ) ??
        species.flavor_text_entries.find((e: any) => e.language.name === "en");
      if (entry) {
        description = entry.flavor_text.replace(/[\n\f\r]/g, " ");
      }
    }

    return {
      id: data.id,
      name: data.name,
      image,
      types: data.types.map((t: any) => t.type.name) as PokemonType[],
      height: data.height,
      weight: data.weight,
      stats,
      abilities,
      description,
    };
  },

  async getNameList(): Promise<string[]> {
    if (nameListCache) return nameListCache;
    const list = await $fetch<PokemonListResponse>(BASE_URL, {
      query: { limit: 2000, offset: 0 },
    });
    nameListCache = list.results.map((r) => r.name);
    return nameListCache;
  },

  async getByNames(names: string[]): Promise<Pokemon[]> {
    const results = await Promise.allSettled(
      names.map(async (name) => {
        const data = await $fetch<any>(`${BASE_URL}/${name}`);
        const image =
          data.sprites.other["official-artwork"].front_default ??
          data.sprites.front_default;
        if (!image) throw new Error("no image");
        return {
          id: data.id,
          name: data.name,
          image,
          types: data.types.map((t: any) => t.type.name) as PokemonType[],
        } satisfies Pokemon;
      }),
    );
    return results
      .filter(
        (r): r is PromiseFulfilledResult<Pokemon> => r.status === "fulfilled",
      )
      .map((r) => r.value);
  },

  async getForms(id: number | string): Promise<PokemonForm[]> {
    const species = await $fetch<any>(`${API_BASE_URL}/pokemon-species/${id}`);

    if (species.varieties.length <= 1) return [];

    const baseName: string = species.name;

    function formatFormName(pokemonName: string, isDefault: boolean): string {
      if (isDefault) return "Normale";
      const suffix = pokemonName.startsWith(baseName + "-")
        ? pokemonName.slice(baseName.length + 1)
        : pokemonName;
      const labels: Record<string, string> = {
        mega: "Méga",
        "mega-x": "Méga X",
        "mega-y": "Méga Y",
        gmax: "Gigamax",
        alola: "Alola",
        galar: "Galar",
        hisui: "Hisui",
        paldea: "Paldea",
        origin: "Origine",
        sky: "Céleste",
        zen: "Zen",
        pirouette: "Pirouette",
        attack: "Attaque",
        defense: "Défense",
        speed: "Vitesse",
        heat: "Chaleur",
        wash: "Lavage",
        frost: "Gel",
        fan: "Ventilateur",
        mow: "Tonte",
        primal: "Primo",
        therian: "Totémique",
        "low-key": "Sobre",
        amped: "Amplifié",
        "ice-rider": "Cavalier Glace",
        "shadow-rider": "Cavalier Ombre",
        dusk: "Crépuscule",
        midnight: "Minuit",
        "dusk-mane": "Crinière Crépuscule",
        "dawn-wings": "Ailes Aurore",
        school: "Banc",
        original: "Originel",
        crowned: "Couronné",
        incarnate: "Incarné",
        complete: "Complet",
        "ten-percent": "10%",
        "battle-bond": "Lien Combat",
        "eternal-flower": "Fleur Éternelle",
        meteor: "Météore",
      };

      return (
        labels[suffix] ??
        suffix
          .split("-")
          .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
          .join(" ")
      );
    }

    const results = await Promise.allSettled(
      species.varieties.map(async (variety: any) => {
        const data = await $fetch<any>(variety.pokemon.url);
        const image =
          data.sprites.other["official-artwork"].front_default ??
          data.sprites.front_default;

        if (!image) throw new Error("no image");

        return {
          id: data.id,
          name: data.name,
          formName: formatFormName(data.name, variety.is_default),
          isDefault: variety.is_default,
          image,
          types: data.types.map((t: any) => t.type.name) as PokemonType[],
        } satisfies PokemonForm;
      }),
    );

    return results
      .filter(
        (r): r is PromiseFulfilledResult<PokemonForm> =>
          r.status === "fulfilled",
      )
      .map((r) => r.value);
  },

  async getEvolutionChain(id: number | string): Promise<EvolutionChainNode> {
    const species = await $fetch<any>(`${API_BASE_URL}/pokemon-species/${id}`);
    const chainData = await $fetch<any>(species.evolution_chain.url);

    function collectNames(node: any): string[] {
      return [node.species.name, ...node.evolves_to.flatMap(collectNames)];
    }

    const allNames = collectNames(chainData.chain);

    const pokemonMap = new Map<string, EvolutionPokemon>();
    await Promise.allSettled(
      allNames.map(async (name: string) => {
        const data = await $fetch<any>(`${BASE_URL}/${name}`);
        const image =
          data.sprites.other["official-artwork"].front_default ??
          data.sprites.front_default;
        if (image)
          pokemonMap.set(name, { id: data.id, name: data.name, image });
      }),
    );

    function buildNode(node: any, details: any[]): EvolutionChainNode | null {
      const pokemon = pokemonMap.get(node.species.name);
      if (!pokemon) return null;
      const children = node.evolves_to
        .map((child: any) => buildNode(child, child.evolution_details))
        .filter(
          (n: EvolutionChainNode | null): n is EvolutionChainNode => n !== null,
        );
      return {
        pokemon,
        conditions: details.map(
          (d: any): EvolutionConditions => ({
            trigger: d.trigger.name,
            minLevel: d.min_level ?? undefined,
            item: d.item?.name ?? undefined,
            heldItem: d.held_item?.name ?? undefined,
            minHappiness: d.min_happiness ?? undefined,
            minBeauty: d.min_beauty ?? undefined,
            minAffection: d.min_affection ?? undefined,
            timeOfDay: d.time_of_day || undefined,
            knownMove: d.known_move?.name ?? undefined,
            knownMoveType: d.known_move_type?.name ?? undefined,
            location: d.location?.name ?? undefined,
            needsRain: d.needs_overworld_rain || undefined,
            tradeSpecies: d.trade_species?.name ?? undefined,
            turnUpsideDown: d.turn_upside_down || undefined,
          }),
        ),
        evolvesTo: children,
      };
    }

    const root = buildNode(chainData.chain, []);
    if (!root) throw new Error("Failed evolution chain");
    return root;
  },
};
