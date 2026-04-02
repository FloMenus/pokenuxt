import type { PokemonType } from "./type";

export interface PokemonListResult {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListResult[];
}

export interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: PokemonType[];
}
