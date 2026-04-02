import type { Pokemon, PokemonListResponse } from "~/types/pokemon";
import type { PokemonType } from "~/types/type";

const BASE_URL = "https://pokeapi.co/api/v2/pokemon";
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
};
