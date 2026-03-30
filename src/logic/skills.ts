export interface Skill {
  name: string;
  ability: string;
  abilityKey: keyof {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
}

export const SKILLS: Skill[] = [
  { name: 'Acrobatics', ability: 'DEX', abilityKey: 'dexterity' },
  { name: 'Animal Handling', ability: 'WIS', abilityKey: 'wisdom' },
  { name: 'Arcana', ability: 'INT', abilityKey: 'intelligence' },
  { name: 'Athletics', ability: 'STR', abilityKey: 'strength' },
  { name: 'Deception', ability: 'CHA', abilityKey: 'charisma' },
  { name: 'History', ability: 'INT', abilityKey: 'intelligence' },
  { name: 'Insight', ability: 'WIS', abilityKey: 'wisdom' },
  { name: 'Intimidation', ability: 'CHA', abilityKey: 'charisma' },
  { name: 'Investigation', ability: 'INT', abilityKey: 'intelligence' },
  { name: 'Medicine', ability: 'WIS', abilityKey: 'wisdom' },
  { name: 'Nature', ability: 'INT', abilityKey: 'intelligence' },
  { name: 'Perception', ability: 'WIS', abilityKey: 'wisdom' },
  { name: 'Performance', ability: 'CHA', abilityKey: 'charisma' },
  { name: 'Persuasion', ability: 'CHA', abilityKey: 'charisma' },
  { name: 'Religion', ability: 'INT', abilityKey: 'intelligence' },
  { name: 'Sleight of Hand', ability: 'DEX', abilityKey: 'dexterity' },
  { name: 'Stealth', ability: 'DEX', abilityKey: 'dexterity' },
  { name: 'Survival', ability: 'WIS', abilityKey: 'wisdom' },
];
