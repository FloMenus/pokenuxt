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

export interface GetAllPokemonOptions {
  name?: string;
  generation?: number[];
  types?: PokemonType[];
}

export interface GenerationResponse {
  pokemon_species: Array<{ name: string }>;
}

export interface TypeResponse {
  pokemon: Array<{ pokemon: { name: string } }>;
}
