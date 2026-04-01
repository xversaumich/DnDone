export interface ClassOption {
  value: string;
  label: string;
}

export interface ClassRecommendations {
  abilityScores: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  skills: string[];
  skillChoices?: number; // Number of skills to choose
  skillOptions?: string[]; // List of skills to choose from
  features: string;
  equipment: string;
}

export const CLASSES: ClassOption[] = [
  { value: '', label: 'Select a class...' },
  { value: 'Barbarian', label: 'Barbarian' },
  { value: 'Bard', label: 'Bard' },
  { value: 'Cleric', label: 'Cleric' },
  { value: 'Druid', label: 'Druid' },
  { value: 'Fighter', label: 'Fighter' },
  { value: 'Monk', label: 'Monk' },
  { value: 'Paladin', label: 'Paladin' },
  { value: 'Ranger', label: 'Ranger' },
  { value: 'Rogue', label: 'Rogue' },
  { value: 'Sorcerer', label: 'Sorcerer' },
  { value: 'Warlock', label: 'Warlock' },
  { value: 'Wizard', label: 'Wizard' },
];

export const CLASS_RECOMMENDATIONS: Record<string, ClassRecommendations> = {
  Barbarian: {
    abilityScores: { strength: 16, dexterity: 14, constitution: 15, intelligence: 8, wisdom: 12, charisma: 10 },
    skills: [],
    skillChoices: 2,
    skillOptions: ['Acrobatics', 'Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival'],
    features: 'Rage: In battle, you fight with primal ferocity. You can rage as a bonus action.\n\nUnarmored Defense: While not wearing armor, your AC equals 10 + DEX modifier + CON modifier.',
    equipment: 'Greataxe\nTwo handaxes\nExplorer\'s pack\nFour javelins',
  },
  Bard: {
    abilityScores: { strength: 8, dexterity: 14, constitution: 12, intelligence: 10, wisdom: 10, charisma: 16 },
    skills: [],
    skillChoices: 3,
    skillOptions: ['Acrobatics', 'Animal Handling', 'Arcana', 'Athletics', 'Deception', 'History', 'Insight', 'Intimidation', 'Investigation', 'Medicine', 'Nature', 'Perception', 'Performance', 'Persuasion', 'Religion', 'Sleight of Hand', 'Stealth', 'Survival'],
    features: 'Bardic Inspiration: You can inspire others through stirring words or music. Use a bonus action to grant one creature within 60 feet a d6 inspiration die.\n\nSpellcasting: You can cast bard spells using Charisma as your spellcasting ability.',
    equipment: 'Rapier\nLute (musical instrument)\nLeather armor\nDagger\nEntertainer\'s pack',
  },
  Cleric: {
    abilityScores: { strength: 14, dexterity: 10, constitution: 13, intelligence: 8, wisdom: 16, charisma: 12 },
    skills: [],
    skillChoices: 2,
    skillOptions: ['History', 'Insight', 'Medicine', 'Persuasion', 'Religion'],
    features: 'Divine Domain: Choose a divine domain related to your deity.\n\nSpellcasting: You can cast cleric spells using Wisdom as your spellcasting ability.\n\nChannel Divinity: You can channel divine energy to fuel magical effects.',
    equipment: 'Mace\nScale mail\nLight crossbow and 20 bolts\nShield\nHoly symbol\nPriest\'s pack',
  },
  Druid: {
    abilityScores: { strength: 8, dexterity: 12, constitution: 14, intelligence: 10, wisdom: 16, charisma: 10 },
    skills: [],
    skillChoices: 2,
    skillOptions: ['Arcana', 'Animal Handling', 'Insight', 'Medicine', 'Nature', 'Perception', 'Religion', 'Survival'],
    features: 'Druidic: You know Druidic, the secret language of druids.\n\nSpellcasting: You can cast druid spells using Wisdom as your spellcasting ability.\n\nWild Shape: You can use your action to magically assume the shape of a beast.',
    equipment: 'Wooden shield\nScimitar\nLeather armor\nExplorer\'s pack\nDruidic focus',
  },
  Fighter: {
    abilityScores: { strength: 16, dexterity: 14, constitution: 15, intelligence: 10, wisdom: 12, charisma: 8 },
    skills: [],
    skillChoices: 2,
    skillOptions: ['Acrobatics', 'Animal Handling', 'Athletics', 'History', 'Insight', 'Intimidation', 'Perception', 'Survival'],
    features: 'Fighting Style: You adopt a particular style of fighting as your specialty (e.g., Archery, Defense, Dueling).\n\nSecond Wind: You can use a bonus action to regain hit points equal to 1d10 + your fighter level.',
    equipment: 'Chain mail\nLongsword\nShield\nLight crossbow and 20 bolts\nDungeoneer\'s pack',
  },
  Monk: {
    abilityScores: { strength: 10, dexterity: 16, constitution: 14, intelligence: 8, wisdom: 15, charisma: 10 },
    skills: [],
    skillChoices: 2,
    skillOptions: ['Acrobatics', 'Athletics', 'History', 'Insight', 'Religion', 'Stealth'],
    features: 'Unarmored Defense: While not wearing armor or wielding a shield, your AC equals 10 + DEX modifier + WIS modifier.\n\nMartial Arts: You can use DEX instead of STR for attack and damage rolls with unarmed strikes and monk weapons.',
    equipment: 'Shortsword\n10 darts\nExplorer\'s pack',
  },
  Paladin: {
    abilityScores: { strength: 16, dexterity: 10, constitution: 14, intelligence: 8, wisdom: 10, charisma: 15 },
    skills: [],
    skillChoices: 2,
    skillOptions: ['Athletics', 'Insight', 'Intimidation', 'Medicine', 'Persuasion', 'Religion'],
    features: 'Divine Sense: You can detect the presence of celestials, fiends, and undead within 60 feet.\n\nLay on Hands: You have a pool of healing power that can restore hit points.\n\nSpellcasting: You can cast paladin spells using Charisma.',
    equipment: 'Longsword\nShield\nChain mail\n5 javelins\nHoly symbol\nPriest\'s pack',
  },
  Ranger: {
    abilityScores: { strength: 10, dexterity: 16, constitution: 14, intelligence: 8, wisdom: 15, charisma: 10 },
    skills: [],
    skillChoices: 3,
    skillOptions: ['Animal Handling', 'Athletics', 'Insight', 'Investigation', 'Nature', 'Perception', 'Stealth', 'Survival'],
    features: 'Favored Enemy: You have significant experience studying and tracking specific types of enemies.\n\nNatural Explorer: You are skilled at navigating and surviving in certain types of terrain.\n\nSpellcasting: You can cast ranger spells using Wisdom.',
    equipment: 'Longbow\nQuiver with 20 arrows\nLeather armor\nTwo shortswords\nExplorer\'s pack',
  },
  Rogue: {
    abilityScores: { strength: 8, dexterity: 16, constitution: 14, intelligence: 12, wisdom: 10, charisma: 13 },
    skills: [],
    skillChoices: 4,
    skillOptions: ['Acrobatics', 'Animal Handling', 'Arcana', 'Athletics', 'Deception', 'History', 'Insight', 'Intimidation', 'Investigation', 'Medicine', 'Nature', 'Perception', 'Performance', 'Persuasion', 'Religion', 'Sleight of Hand', 'Stealth', 'Survival'],
    features: 'Sneak Attack: Once per turn, you can deal extra damage to one creature you hit if you have advantage on the attack roll.\n\nThieves\' Cant: You know thieves\' cant, a secret mix of dialect, jargon, and code.',
    equipment: 'Rapier\nShortbow and quiver with 20 arrows\nBurglar\'s pack\nLeather armor\nTwo daggers\nThieves\' tools',
  },
  Sorcerer: {
    abilityScores: { strength: 8, dexterity: 14, constitution: 15, intelligence: 10, wisdom: 10, charisma: 16 },
    skills: [],
    skillChoices: 2,
    skillOptions: ['Arcana', 'Deception', 'Insight', 'Intimidation', 'Persuasion', 'Religion'],
    features: 'Sorcerous Origin: Choose the source of your innate magical power (e.g., Draconic Bloodline, Wild Magic).\n\nSpellcasting: You can cast sorcerer spells using Charisma as your spellcasting ability.\n\nFont of Magic: You can tap into deep wellsprings of magic to create spell slots.',
    equipment: 'Light crossbow and 20 bolts\nComponent pouch\nDungeoneer\'s pack\nTwo daggers',
  },
  Warlock: {
    abilityScores: { strength: 8, dexterity: 14, constitution: 14, intelligence: 10, wisdom: 12, charisma: 16 },
    skills: [],
    skillChoices: 2,
    skillOptions: ['Arcana', 'Deception', 'History', 'Intimidation', 'Investigation', 'Nature', 'Religion'],
    features: 'Otherworldly Patron: You have made a pact with an otherworldly being (e.g., The Fiend, The Great Old One).\n\nPact Magic: You can cast warlock spells using Charisma. Your spell slots recharge on a short rest.\n\nEldritch Invocations: You learn magical invocations that grant special abilities.',
    equipment: 'Light crossbow and 20 bolts\nComponent pouch\nScholar\'s pack\nLeather armor\nTwo daggers',
  },
  Wizard: {
    abilityScores: { strength: 8, dexterity: 14, constitution: 14, intelligence: 16, wisdom: 12, charisma: 10 },
    skills: [],
    skillChoices: 2,
    skillOptions: ['Arcana', 'History', 'Insight', 'Investigation', 'Medicine', 'Religion'],
    features: 'Spellcasting: You can cast wizard spells using Intelligence as your spellcasting ability.\n\nArcane Recovery: Once per day when you finish a short rest, you can recover some expended spell slots.\n\nSpellbook: You have a spellbook containing your known spells.',
    equipment: 'Quarterstaff\nComponent pouch\nScholar\'s pack\nSpellbook',
  },
};

export const SPELLCASTING_CLASSES = ['Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger', 'Sorcerer', 'Warlock', 'Wizard'];

export const CLASS_SAVING_THROWS: Record<string, string[]> = {
  Barbarian: ['Strength', 'Constitution'],
  Bard: ['Dexterity', 'Charisma'],
  Cleric: ['Wisdom', 'Charisma'],
  Druid: ['Intelligence', 'Wisdom'],
  Fighter: ['Strength', 'Constitution'],
  Monk: ['Strength', 'Dexterity'],
  Paladin: ['Wisdom', 'Charisma'],
  Ranger: ['Strength', 'Dexterity'],
  Rogue: ['Dexterity', 'Intelligence'],
  Sorcerer: ['Constitution', 'Charisma'],
  Warlock: ['Wisdom', 'Charisma'],
  Wizard: ['Intelligence', 'Wisdom'],
};
