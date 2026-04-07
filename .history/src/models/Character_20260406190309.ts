export interface SpellSlot {
  total: number;
  expended: number;
}

export interface Spell {
  name: string;
  prepared: boolean;
}

export interface Character {
  name: string;
  race: string;
  class: string;
  level: number;
  background: string;
  alignment: string;

  abilityScores: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };

  skills: Record<string, boolean>;
  savingThrows: Record<string, boolean>;

  hp: {
    current: number;
    max: number;
  };

  ac: number;
  speed: number;

  // ⭐ Add these two fields
  deathSaveSuccesses: number;
  deathSaveFailures: number;

  features: string;
  equipment: string;

  cantrips: string[];
  spellSlots: SpellSlot[];
  spellsByLevel: Spell[][];
}