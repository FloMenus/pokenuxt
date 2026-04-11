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

export interface PokemonStat {
  name: string;
  value: number;
}

export interface PokemonAbility {
  name: string;
  isHidden: boolean;
}

export interface PokemonDetail extends Pokemon {
  height: number;
  weight: number;
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  description: string;
}

export interface PokemonForm {
  id: number;
  name: string;
  formName: string;
  image: string;
  types: PokemonType[];
  isDefault: boolean;
}

export interface EvolutionConditions {
  trigger: string;
  minLevel?: number;
  item?: string;
  heldItem?: string;
  minHappiness?: number;
  minBeauty?: number;
  minAffection?: number;
  timeOfDay?: string;
  knownMove?: string;
  knownMoveType?: string;
  location?: string;
  needsRain?: boolean;
  tradeSpecies?: string;
  turnUpsideDown?: boolean;
}

export interface EvolutionPokemon {
  id: number;
  name: string;
  image: string;
}

export interface EvolutionChainNode {
  pokemon: EvolutionPokemon;
  conditions: EvolutionConditions[];
  evolvesTo: EvolutionChainNode[];
}

export interface GenerationResponse {
  pokemon_species: Array<{ name: string }>;
}

export interface TypeResponse {
  pokemon: Array<{ pokemon: { name: string } }>;
}
