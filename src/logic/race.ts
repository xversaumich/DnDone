export interface RaceOption {
  value: string;
  label: string;
}

export interface RaceRecommendations {
  skills: string[];
  skillChoices?: number; // Number of skills to choose
  features: string;
}

export const RACES: RaceOption[] = [
  { value: '', label: 'Select a race...' },
  { value: 'Dragonborn', label: 'Dragonborn' },
  { value: 'Dwarf', label: 'Dwarf' },
  { value: 'Elf', label: 'Elf' },
  { value: 'Gnome', label: 'Gnome' },
  { value: 'Half-Elf', label: 'Half-Elf' },
  { value: 'Half-Orc', label: 'Half-Orc' },
  { value: 'Halfling', label: 'Halfling' },
  { value: 'Human', label: 'Human' },
  { value: 'Tiefling', label: 'Tiefling' },
];

export const RACE_RECOMMENDATIONS: Record<string, RaceRecommendations> = {
  Dragonborn: {
    skills: [],
    features: 'Draconic Ancestry: You have draconic ancestry. Choose one type of dragon (determines breath weapon and damage resistance).\n\nBreath Weapon: You can use your action to exhale destructive energy.\n\nDamage Resistance: You have resistance to the damage type associated with your draconic ancestry.',
  },
  Dwarf: {
    skills: [],
    features: 'Darkvision: You can see in dim light within 60 feet as if it were bright light.\n\nDwarven Resilience: You have advantage on saving throws against poison and resistance to poison damage.\n\nDwarven Combat Training: You have proficiency with battleaxe, handaxe, light hammer, and warhammer.\n\nStonecunning: Whenever you make an Intelligence (History) check related to the origin of stonework, you are considered proficient.',
  },
  Elf: {
    skills: ['Perception'],
    features: 'Darkvision: You can see in dim light within 60 feet as if it were bright light.\n\nKeen Senses: You have proficiency in the Perception skill.\n\nFey Ancestry: You have advantage on saving throws against being charmed, and magic can\'t put you to sleep.\n\nTrance: Elves don\'t need to sleep. Instead, they meditate deeply for 4 hours a day.',
  },
  Gnome: {
    skills: [],
    features: 'Darkvision: You can see in dim light within 60 feet as if it were bright light.\n\nGnome Cunning: You have advantage on all Intelligence, Wisdom, and Charisma saving throws against magic.\n\nSmall Size: Your size is Small.',
  },
  'Half-Elf': {
    skills: [],
    skillChoices: 2,
    features: 'Darkvision: You can see in dim light within 60 feet as if it were bright light.\n\nFey Ancestry: You have advantage on saving throws against being charmed, and magic can\'t put you to sleep.\n\nSkill Versatility: You gain proficiency in two skills of your choice.',
  },
  'Half-Orc': {
    skills: ['Intimidation'],
    features: 'Darkvision: You can see in dim light within 60 feet as if it were bright light.\n\nMenacing: You gain proficiency in the Intimidation skill.\n\nRelentless Endurance: When you are reduced to 0 hit points but not killed outright, you can drop to 1 hit point instead (once per long rest).\n\nSavage Attacks: When you score a critical hit with a melee weapon, you can roll one of the weapon\'s damage dice one additional time.',
  },
  Halfling: {
    skills: [],
    features: 'Lucky: When you roll a 1 on an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll.\n\nBrave: You have advantage on saving throws against being frightened.\n\nHalfling Nimbleness: You can move through the space of any creature that is larger than you.\n\nSmall Size: Your size is Small.',
  },
  Human: {
    skills: [],
    features: 'Ability Score Increase: Your ability scores each increase by 1.\n\nVersatile: Humans are adaptable and diverse, with no specific racial features but a bonus to all ability scores.',
  },
  Tiefling: {
    skills: [],
    features: 'Darkvision: You can see in dim light within 60 feet as if it were bright light.\n\nHellish Resistance: You have resistance to fire damage.\n\nInfernal Legacy: You know the thaumaturgy cantrip. At 3rd level, you can cast hellish rebuke once per long rest. At 5th level, you can cast darkness once per long rest. Charisma is your spellcasting ability.',
  },
};
