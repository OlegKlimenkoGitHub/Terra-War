
export enum PlayerType {
  HUMAN = 'HUMAN',
  AI = 'AI'
}

export interface Player {
  id: string;
  name: string;
  color: string;
  type: PlayerType;
}

export interface Design {
  id: string;
  playerId: string;
  name: string;
  engineCount: number;
  armor: number;
  cargoCapacity: number;
  gunCount: number;
  gunLength: number; // Used for penetration logic
  cost: number; // Calculated material cost
}

export interface Unit {
  id: string;
  designId: string;
  ownerId: string;
  locationId: string; // Country ID where the unit physically is
  hp: number; // Simplified: 1 (alive) or 0 (dead) for this game ruleset
  cargo: {
    colonists: number;
    materials: number;
    population: number; // Transformed to colonists on load, but tracked for UI
  };
}

export interface Army {
  id: string;
  ownerId: string;
  locationId: string; // Country ID
  destinationId: string | null; // Country ID if moving
  unitIds: string[];
}

export interface FactoryQueueItem {
  designId: string;
  progress: number; // Material spent so far
  totalCost: number;
}

export interface Country {
  id: string; // ISO-3166-1 alpha-2 code (e.g., 'US', 'CN')
  iso3: string; // ISO-3166-1 alpha-3 code (e.g., 'USA', 'CHN') for GeoJSON
  name: string;
  ownerId: string | null;
  population: number;
  maxPopulation: number; // Based on country size
  colonists: number;
  materials: number;
  // Factory
  factoryQueue: FactoryQueueItem | null;
  // Stats
  lastTurnStats?: {
    materialsProduced: number;
    materialsConsumed: number;
    unitsProduced: number;
  };
  // Geometry for map
  path?: string; // DEPRECATED: Used for SVG map
  neighbors: string[]; // IDs of neighbor countries
  center: { lat: number, lng: number }; // Geographic center
}

export interface CombatLog {
  id: string;
  locationId: string;
  turn: number;
  attackerId: string;
  defenderId: string;
  winnerId: string;
  // Snapshots of units involved for replay
  attackerUnits: { id: string; designId: string }[];
  defenderUnits: { id: string; designId: string }[];
  
  rounds: CombatRound[];
  bombardmentResult?: {
    colonistsKilled: number;
    populationKilled: number;
    invaded: boolean;
  };
}

export interface CombatRound {
  attackerShot?: { unitId: string; targetId: string; hit: boolean; destroyed: boolean; damage: number };
  defenderShot?: { unitId: string; targetId: string; hit: boolean; destroyed: boolean; damage: number };
}

export interface GameState {
  turn: number;
  players: Player[];
  countries: Country[];
  designs: Design[];
  units: Unit[];
  armies: Army[];
  combatLogs: CombatLog[];
  selectedCountryId: string | null;
  humanPlayerId: string;
  gameStatus: 'LOBBY' | 'PLAYING' | 'GAME_OVER';
  winnerId: string | null;
}

export const CONSTANTS = {
  POPULATION_GROWTH: 1.5,
  BASE_POPULATION: 100,
  COST_PER_ENGINE: 1,
  COST_PER_ARMOR: 1,
  COST_PER_CARGO: 1,
  COST_PER_GUN_LENGTH: 1, // Multiplied by gun count
};