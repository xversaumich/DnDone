import { useState } from 'react';
import { AbilityScore } from './components/AbilityScore';
import { SkillItem } from './components/SkillItem';
import { StatBox } from './components/StatBox';
import { SavingThrow } from './components/SavingThrow';
import { SpellList } from './components/SpellList';
import { Scroll, Swords, Sparkles } from 'lucide-react';

interface SpellSlot {
  total: number;
  expended: number;
}

interface Spell {
  name: string;
  prepared: boolean;
}

interface Character {
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
  features: string;
  equipment: string;
  cantrips: string[];
  spellSlots: SpellSlot[];
  spellsByLevel: Spell[][];
}

const SKILLS = [
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

const CLASSES = [
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

const RACES = [
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

const BACKGROUNDS = [
  { value: '', label: 'Select a background...', description: '' },
  { value: 'Acolyte', label: 'Acolyte', description: 'You spent your life in service to a temple, learning sacred rites and prayers.' },
  { value: 'Charlatan', label: 'Charlatan', description: 'You are a master of deception, having made your way through lies and schemes.' },
  { value: 'Criminal', label: 'Criminal', description: 'You have a history of breaking the law and living in the shadows.' },
  { value: 'Entertainer', label: 'Entertainer', description: 'You thrive in front of an audience, performing to delight and inspire.' },
  { value: 'Folk Hero', label: 'Folk Hero', description: 'You come from humble origins but have risen to defend the common people.' },
  { value: 'Guild Artisan', label: 'Guild Artisan', description: 'You are a skilled member of an artisan\'s guild with expertise in a particular craft.' },
  { value: 'Hermit', label: 'Hermit', description: 'You lived in isolation, seeking enlightenment or hiding from your past.' },
  { value: 'Noble', label: 'Noble', description: 'You were born into privilege and wealth, with connections to high society.' },
  { value: 'Outlander', label: 'Outlander', description: 'You grew up in the wilderness, far from civilization and its comforts.' },
  { value: 'Sage', label: 'Sage', description: 'You are dedicated to scholarly pursuits and the acquisition of knowledge.' },
  { value: 'Sailor', label: 'Sailor', description: 'You have sailed the seas and know the ways of ships and sailors.' },
  { value: 'Soldier', label: 'Soldier', description: 'You have trained in warfare and seen the horrors of battle.' },
];

const ALIGNMENTS = [
  { value: '', label: 'Select alignment...', description: '' },
  { value: 'Lawful Good', label: 'Lawful Good', description: 'You act with compassion and honor, following a strict moral code.' },
  { value: 'Neutral Good', label: 'Neutral Good', description: 'You do your best to help others without regard for law or chaos.' },
  { value: 'Chaotic Good', label: 'Chaotic Good', description: 'You act as your conscience directs, with little regard for rules.' },
  { value: 'Lawful Neutral', label: 'Lawful Neutral', description: 'You follow law, tradition, or a personal code without bias toward good or evil.' },
  { value: 'True Neutral', label: 'True Neutral', description: 'You prefer to steer clear of moral questions and side with the natural order.' },
  { value: 'Chaotic Neutral', label: 'Chaotic Neutral', description: 'You follow your whims and value personal freedom above all else.' },
  { value: 'Lawful Evil', label: 'Lawful Evil', description: 'You methodically take what you want within the bounds of tradition and loyalty.' },
  { value: 'Neutral Evil', label: 'Neutral Evil', description: 'You do whatever you can get away with, without compassion or qualms.' },
  { value: 'Chaotic Evil', label: 'Chaotic Evil', description: 'You act with arbitrary violence, driven by greed, hatred, or bloodlust.' },
];

interface ClassRecommendations {
  abilityScores: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  skills: string[];
  features: string;
  equipment: string;
}

interface RaceRecommendations {
  skills: string[];
  skillChoices?: number; // Number of skills to choose
  features: string;
}

interface BackgroundRecommendations {
  skills: string[];
  equipment: string;
  feature: string;
}

const CLASS_RECOMMENDATIONS: Record<string, ClassRecommendations> = {
  Barbarian: {
    abilityScores: { strength: 16, dexterity: 14, constitution: 15, intelligence: 8, wisdom: 12, charisma: 10 },
    skills: ['Athletics', 'Intimidation', 'Perception', 'Survival'],
    features: 'Rage: In battle, you fight with primal ferocity. You can rage as a bonus action.\n\nUnarmored Defense: While not wearing armor, your AC equals 10 + DEX modifier + CON modifier.',
    equipment: 'Greataxe\nTwo handaxes\nExplorer\'s pack\nFour javelins',
  },
  Bard: {
    abilityScores: { strength: 8, dexterity: 14, constitution: 12, intelligence: 10, wisdom: 10, charisma: 16 },
    skills: ['Performance', 'Persuasion', 'Deception', 'Acrobatics'],
    features: 'Bardic Inspiration: You can inspire others through stirring words or music. Use a bonus action to grant one creature within 60 feet a d6 inspiration die.\n\nSpellcasting: You can cast bard spells using Charisma as your spellcasting ability.',
    equipment: 'Rapier\nLute (musical instrument)\nLeather armor\nDagger\nEntertainer\'s pack',
  },
  Cleric: {
    abilityScores: { strength: 14, dexterity: 10, constitution: 13, intelligence: 8, wisdom: 16, charisma: 12 },
    skills: ['Insight', 'Medicine', 'Persuasion', 'Religion'],
    features: 'Divine Domain: Choose a divine domain related to your deity.\n\nSpellcasting: You can cast cleric spells using Wisdom as your spellcasting ability.\n\nChannel Divinity: You can channel divine energy to fuel magical effects.',
    equipment: 'Mace\nScale mail\nLight crossbow and 20 bolts\nShield\nHoly symbol\nPriest\'s pack',
  },
  Druid: {
    abilityScores: { strength: 8, dexterity: 12, constitution: 14, intelligence: 10, wisdom: 16, charisma: 10 },
    skills: ['Animal Handling', 'Nature', 'Perception', 'Survival'],
    features: 'Druidic: You know Druidic, the secret language of druids.\n\nSpellcasting: You can cast druid spells using Wisdom as your spellcasting ability.\n\nWild Shape: You can use your action to magically assume the shape of a beast.',
    equipment: 'Wooden shield\nScimitar\nLeather armor\nExplorer\'s pack\nDruidic focus',
  },
  Fighter: {
    abilityScores: { strength: 16, dexterity: 14, constitution: 15, intelligence: 10, wisdom: 12, charisma: 8 },
    skills: ['Athletics', 'Acrobatics', 'Intimidation', 'Perception'],
    features: 'Fighting Style: You adopt a particular style of fighting as your specialty (e.g., Archery, Defense, Dueling).\n\nSecond Wind: You can use a bonus action to regain hit points equal to 1d10 + your fighter level.',
    equipment: 'Chain mail\nLongsword\nShield\nLight crossbow and 20 bolts\nDungeoneer\'s pack',
  },
  Monk: {
    abilityScores: { strength: 10, dexterity: 16, constitution: 14, intelligence: 8, wisdom: 15, charisma: 10 },
    skills: ['Acrobatics', 'Athletics', 'Insight', 'Stealth'],
    features: 'Unarmored Defense: While not wearing armor or wielding a shield, your AC equals 10 + DEX modifier + WIS modifier.\n\nMartial Arts: You can use DEX instead of STR for attack and damage rolls with unarmed strikes and monk weapons.',
    equipment: 'Shortsword\n10 darts\nExplorer\'s pack',
  },
  Paladin: {
    abilityScores: { strength: 16, dexterity: 10, constitution: 14, intelligence: 8, wisdom: 10, charisma: 15 },
    skills: ['Athletics', 'Intimidation', 'Persuasion', 'Religion'],
    features: 'Divine Sense: You can detect the presence of celestials, fiends, and undead within 60 feet.\n\nLay on Hands: You have a pool of healing power that can restore hit points.\n\nSpellcasting: You can cast paladin spells using Charisma.',
    equipment: 'Longsword\nShield\nChain mail\n5 javelins\nHoly symbol\nPriest\'s pack',
  },
  Ranger: {
    abilityScores: { strength: 10, dexterity: 16, constitution: 14, intelligence: 8, wisdom: 15, charisma: 10 },
    skills: ['Animal Handling', 'Athletics', 'Perception', 'Survival'],
    features: 'Favored Enemy: You have significant experience studying and tracking specific types of enemies.\n\nNatural Explorer: You are skilled at navigating and surviving in certain types of terrain.\n\nSpellcasting: You can cast ranger spells using Wisdom.',
    equipment: 'Longbow\nQuiver with 20 arrows\nLeather armor\nTwo shortswords\nExplorer\'s pack',
  },
  Rogue: {
    abilityScores: { strength: 8, dexterity: 16, constitution: 14, intelligence: 12, wisdom: 10, charisma: 13 },
    skills: ['Acrobatics', 'Deception', 'Sleight of Hand', 'Stealth'],
    features: 'Sneak Attack: Once per turn, you can deal extra damage to one creature you hit if you have advantage on the attack roll.\n\nThieves\' Cant: You know thieves\' cant, a secret mix of dialect, jargon, and code.',
    equipment: 'Rapier\nShortbow and quiver with 20 arrows\nBurglar\'s pack\nLeather armor\nTwo daggers\nThieves\' tools',
  },
  Sorcerer: {
    abilityScores: { strength: 8, dexterity: 14, constitution: 15, intelligence: 10, wisdom: 10, charisma: 16 },
    skills: ['Arcana', 'Deception', 'Intimidation', 'Persuasion'],
    features: 'Sorcerous Origin: Choose the source of your innate magical power (e.g., Draconic Bloodline, Wild Magic).\n\nSpellcasting: You can cast sorcerer spells using Charisma as your spellcasting ability.\n\nFont of Magic: You can tap into deep wellsprings of magic to create spell slots.',
    equipment: 'Light crossbow and 20 bolts\nComponent pouch\nDungeoneer\'s pack\nTwo daggers',
  },
  Warlock: {
    abilityScores: { strength: 8, dexterity: 14, constitution: 14, intelligence: 10, wisdom: 12, charisma: 16 },
    skills: ['Arcana', 'Deception', 'Intimidation', 'Investigation'],
    features: 'Otherworldly Patron: You have made a pact with an otherworldly being (e.g., The Fiend, The Great Old One).\n\nPact Magic: You can cast warlock spells using Charisma. Your spell slots recharge on a short rest.\n\nEldritch Invocations: You learn magical invocations that grant special abilities.',
    equipment: 'Light crossbow and 20 bolts\nComponent pouch\nScholar\'s pack\nLeather armor\nTwo daggers',
  },
  Wizard: {
    abilityScores: { strength: 8, dexterity: 14, constitution: 14, intelligence: 16, wisdom: 12, charisma: 10 },
    skills: ['Arcana', 'History', 'Insight', 'Investigation'],
    features: 'Spellcasting: You can cast wizard spells using Intelligence as your spellcasting ability.\n\nArcane Recovery: Once per day when you finish a short rest, you can recover some expended spell slots.\n\nSpellbook: You have a spellbook containing your known spells.',
    equipment: 'Quarterstaff\nComponent pouch\nScholar\'s pack\nSpellbook',
  },
};

const RACE_RECOMMENDATIONS: Record<string, RaceRecommendations> = {
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

const SPELLCASTING_CLASSES = ['Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger', 'Sorcerer', 'Warlock', 'Wizard'];

const CLASS_SAVING_THROWS: Record<string, string[]> = {
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

const BACKGROUND_RECOMMENDATIONS: Record<string, BackgroundRecommendations> = {
  Acolyte: {
    skills: ['Insight', 'Religion'],
    equipment: 'Holy symbol\nPrayer book or prayer wheel\n5 sticks of incense\nVestments\nCommon clothes\nBelt pouch containing 15 gp',
    feature: 'Shelter of the Faithful: You can spend 1 hour praying or meditating to regain up to 2d4 + your Wisdom modifier hit points, provided you have no more than half your hit points at the start. You must have access to a shrine, temple, or other sacred site for this feature to work.',
  },
  Charlatan: {
    skills: ['Deception', 'Sleight of Hand'],
    equipment: 'Fine clothes\nDisguise kit\nFool\'s cap\nPlaying card set\nSignet of an imaginary duke\nCoat of arms\nManacles\nDeck of cards\nSignet of a false identity\nParchment with a map of a fake city\nSilver ring with a false gemstone\nSmall knife\nVial of ink\nInk pen\nSheaf of blank paper\nSmall wooden chest\nMirror\nWax block and hot poker\nCommon clothes\nBelt pouch containing 15 gp',
    feature: 'False Identity: You have created a second identity that includes documentation, established acquaintances, and disguises that allow you to assume that persona. You can change your appearance and bearing to match this identity, including your height, build, and mannerisms.',
  },
  Criminal: {
    skills: ['Deception', 'Stealth'],
    equipment: 'Crowbar\nDark lantern\nFine clothes\nBelt pouch containing 15 gp',
    feature: 'Criminal Contact: You have a reliable and trustworthy contact who operates in the city where you started your adventure. You know how to get messages to and from this contact, even over long distances, in a way that is safe from eavesdroppers. Your contact can be a criminal, a member of a thieves\' guild, a mercenary, or someone else with a similar background. You have also worked with such people in the past, and they have a good sense of who you are and what you are capable of. This connection provides you with information or assistance as long as you remain trustworthy. You can ask for information or help, but if you ask for assistance, you owe a favor, and your contact expects you to pay it back. You owe a favor if you have been helped three or more times and haven\'t repaid any of those favors.',
  },
  Entertainer: {
    skills: ['Acrobatics', 'Performance'],
    equipment: 'Costume\nEntertainer\'s pack\nBelt pouch containing 15 gp',
    feature: 'By Popular Demand: You can always find a place to perform, usually in an inn or tavern. At such a place, you can perform for free, as long as you are entertaining the crowd. The commoners and other regular patrons recognize you and often tip you for your performances. You can attract a small crowd to watch you perform if you are in a city, town, or village.',
  },
  'Folk Hero': {
    skills: ['Animal Handling', 'Survival'],
    equipment: 'Shovel\nIron pot\nCommon clothes\nBelt pouch containing 10 gp',
    feature: 'Rustic Hospitality: Since you come from the ranks of the common folk, you fit in among them with ease. You can find a place to hide, rest, or recuperate among other commoners, unless you have shown yourself to be a danger to them. They will shield you from the law or help you flee from pursuers. They trust you to behave in a manner befitting a hero of the people.',
  },
  'Guild Artisan': {
    skills: ['Insight', 'Persuasion'],
    equipment: 'Artisan\'s tools\nGuild letter of introduction\nCommon clothes\nBelt pouch containing 15 gp',
    feature: 'Guild Membership: As an established and respected member of a guild, you can rely on certain benefits your fellow guild members provide, and you can also secure goods or services as a favor in return for helping them. Your guild will provide you with lodging and food if necessary, and pay for your funeral if needed. When you perform a service for a member of your guild or the guild itself, you can ask for a favor as a reward. You can also call upon members of your guild for advice, and they will offer it free of charge, though they might charge for services that would normally require a fee.',
  },
  Hermit: {
    skills: ['Medicine', 'Religion'],
    equipment: 'Scroll case\nWinter blanket\nCommon clothes\nBelt pouch containing 5 gp',
    feature: 'Discovery: The quiet seclusion of your hermitage gave you access to a unique and powerful discovery. The exact nature of this revelation depends on the nature of your seclusion. It might be a great truth about the cosmos, the deities, the natural world, or a powerful magic item that you found in your travels. The discovery could be a physical object, or it could be an abstract concept that you have come to understand. Whatever the discovery, it is a part of you and fuels your adventures.',
  },
  Noble: {
    skills: ['History', 'Persuasion'],
    equipment: 'Signet ring\nScroll of pedigree\nLantern\nSet of fine clothes\nBelt pouch containing 25 gp',
    feature: 'Position of Privilege: Thanks to your noble birth, people are inclined to think the best of you. You are welcome in high society, and people assume you have a right to be wherever you are. The common folk make way for you and look to you to lead them. You can find a place to stay in noble courts, and people are inclined to help you. You can secure an audience with a lord or lady of the land if you need to.',
  },
  Outlander: {
    skills: ['Athletics', 'Survival'],
    equipment: 'Staff\nHunting trap\nTrophy from an animal you killed\nCommon clothes\nBelt pouch containing 10 gp',
    feature: 'Wanderer: You have an excellent memory for maps and geography, and you can always recall the general layout of terrain, settlements, and other features around you. In addition, you can find food and fresh water for yourself and up to five other people each day, provided that the land offers berries, small game, water, and so forth. This doesn\'t provide a meal, but prevents starvation.',
  },
  Sage: {
    skills: ['Arcana', 'History'],
    equipment: 'Bottle of ink\nQuill\nSmall knife\nLetter from a dead colleague posing a question you have not yet been able to answer\nSet of common clothes\nBelt pouch containing 10 gp',
    feature: 'Researcher: You have spent a great deal of time studying, experimenting, and researching. You can focus on a specific field of study or be a generalist, but either way, you are a master of a particular subject. If you are a generalist, choose three skills from the Arcana, History, Investigation, Medicine, and Religion skill list. If you are a specialist, choose one of those skills and gain expertise with it.',
  },
  Sailor: {
    skills: ['Athletics', 'Perception'],
    equipment: 'Belaying pin\n50 feet of silk rope\nLucky charm\nCommon clothes\nBelt pouch containing 10 gp',
    feature: 'Ship\'s Passage: When you need to travel by ship, you can secure free passage on a sailing ship or a similar vessel. You might sail as a passenger, as crew, or in any other capacity you have the skill and experience to fill. You might also be able to secure free passage on a small fishing boat or trading ship. This passage can be within a port you have visited or on a ship that will be traveling to one.',
  },
  Soldier: {
    skills: ['Athletics', 'Intimidation'],
    equipment: 'Insignia of rank\nCommon clothes\nBelt pouch containing 10 gp',
    feature: 'Military Rank: You have a military rank from your service, which might grant you access to resources or influence people. If you are of a high enough rank, you might be able to secure an audience with a local military leader. You could also have ties to military supply officers who can secure you gear or influence other soldiers. If you have lost your rank, you can secure it again by enlisting in the military and serving a term equal to your rank. You can also secure rank by joining a military organization, such as the city watch or a standing army, and rising through the ranks.',
  },
};

export default function App() {
  const [character, setCharacter] = useState<Character>({
    name: '',
    race: '',
    class: '',
    level: 1,
    background: '',
    alignment: '',
    abilityScores: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    skills: {},
    savingThrows: {},
    hp: {
      current: 10,
      max: 10,
    },
    ac: 10,
    speed: 30,
    features: '',
    equipment: '',
    cantrips: ['', '', '', ''],
    spellSlots: Array(9).fill(null).map(() => ({ total: 0, expended: 0 })),
    spellsByLevel: Array(9).fill(null).map(() => Array(10).fill(null).map(() => ({ name: '', prepared: false }))),
  });

  const [showAutoFillPrompt, setShowAutoFillPrompt] = useState(false);
  const [pendingClass, setPendingClass] = useState('');
  const [showRaceSkillChoice, setShowRaceSkillChoice] = useState(false);
  const [pendingRace, setPendingRace] = useState('');
  const [selectedRaceSkills, setSelectedRaceSkills] = useState<string[]>([]);
  const [requiredSkillChoices, setRequiredSkillChoices] = useState(0);
  const [showBackgroundSkillChoice, setShowBackgroundSkillChoice] = useState(false);
  const [pendingBackground, setPendingBackground] = useState('');
  const [backgroundConflictingSkills, setBackgroundConflictingSkills] = useState<string[]>([]);
  const [backgroundNonConflictingSkills, setBackgroundNonConflictingSkills] = useState<string[]>([]);
  const [selectedBackgroundReplacementSkills, setSelectedBackgroundReplacementSkills] = useState<string[]>([]);

  const proficiencyBonus = Math.ceil(character.level / 4) + 1;

  const getModifier = (score: number) => Math.floor((score - 10) / 2);

  const updateAbilityScore = (ability: keyof Character['abilityScores'], value: number) => {
    setCharacter({
      ...character,
      abilityScores: {
        ...character.abilityScores,
        [ability]: value,
      },
    });
  };

  const toggleSkillProficiency = (skillName: string) => {
    setCharacter({
      ...character,
      skills: {
        ...character.skills,
        [skillName]: !character.skills[skillName],
      },
    });
  };

  const handleClassChange = (newClass: string) => {
    if (newClass && CLASS_RECOMMENDATIONS[newClass]) {
      setPendingClass(newClass);
      setShowAutoFillPrompt(true);
    } else {
      setCharacter({ ...character, class: newClass });
    }
  };

  const handleRaceChange = (newRace: string) => {
    if (newRace && RACE_RECOMMENDATIONS[newRace]) {
      const raceRec = RACE_RECOMMENDATIONS[newRace];
      setPendingRace(newRace);
      
      if (raceRec.skillChoices && raceRec.skillChoices > 0) {
        // Race has skill choices - show selection modal
        setRequiredSkillChoices(raceRec.skillChoices);
        setSelectedRaceSkills([]);
        setShowRaceSkillChoice(true);
      } else {
        // Race has fixed skills or no skills - apply directly
        applyRaceRecommendations(newRace, raceRec.skills);
      }
    } else {
      setCharacter({ ...character, race: newRace });
    }
  };

  const applyRaceRecommendations = (race: string, skills: string[]) => {
    const raceRec = RACE_RECOMMENDATIONS[race];
    if (raceRec) {
      const newSkills = { ...character.skills };
      skills.forEach(skill => {
        newSkills[skill] = true;
      });

      // Combine racial features with existing class features
      let combinedFeatures = '';
      if (raceRec.features) {
        combinedFeatures += `=== RACIAL TRAITS ===\n${raceRec.features}`;
      }
      if (character.features) {
        combinedFeatures += `\n\n${character.features}`;
      }

      setCharacter({
        ...character,
        race: race,
        skills: newSkills,
        features: combinedFeatures || character.features,
      });
    }
  };

  const applyClassRecommendations = () => {
    const recommendations = CLASS_RECOMMENDATIONS[pendingClass];
    if (recommendations) {
      const newSkills: Record<string, boolean> = { ...character.skills };
      recommendations.skills.forEach(skill => {
        newSkills[skill] = true;
      });

      // Combine class features with existing racial features
      let combinedFeatures = character.features;
      if (recommendations.features) {
        if (combinedFeatures && !combinedFeatures.includes('=== CLASS FEATURES ===')) {
          combinedFeatures += `\n\n=== CLASS FEATURES ===\n${recommendations.features}`;
        } else if (!combinedFeatures) {
          combinedFeatures = `=== CLASS FEATURES ===\n${recommendations.features}`;
        }
      }

      // Set saving throw proficiencies
      const newSavingThrows: Record<string, boolean> = {};
      const classSavingThrows = CLASS_SAVING_THROWS[pendingClass] || [];
      classSavingThrows.forEach(save => {
        newSavingThrows[save] = true;
      });

      setCharacter({
        ...character,
        class: pendingClass,
        abilityScores: recommendations.abilityScores,
        skills: newSkills,
        savingThrows: newSavingThrows,
        features: combinedFeatures,
        equipment: recommendations.equipment,
      });
    }
    setShowAutoFillPrompt(false);
    setPendingClass('');
  };

  const declineAutoFill = () => {
    setCharacter({ ...character, class: pendingClass });
    setShowAutoFillPrompt(false);
    setPendingClass('');
  };

  const toggleRaceSkillSelection = (skillName: string) => {
    setSelectedRaceSkills(prev => {
      if (prev.includes(skillName)) {
        return prev.filter(s => s !== skillName);
      } else if (prev.length < requiredSkillChoices) {
        return [...prev, skillName];
      }
      return prev;
    });
  };

  const confirmRaceSkillChoices = () => {
    applyRaceRecommendations(pendingRace, selectedRaceSkills);
    setShowRaceSkillChoice(false);
    setPendingRace('');
    setSelectedRaceSkills([]);
  };

  const handleBackgroundChange = (newBackground: string) => {
    if (newBackground && BACKGROUND_RECOMMENDATIONS[newBackground]) {
      const backgroundRec = BACKGROUND_RECOMMENDATIONS[newBackground];
      setPendingBackground(newBackground);
      
      // Check for conflicting skills
      const conflictingSkills: string[] = [];
      const nonConflictingSkills: string[] = [];
      backgroundRec.skills.forEach(skill => {
        if (character.skills[skill]) {
          conflictingSkills.push(skill);
        } else {
          nonConflictingSkills.push(skill);
        }
      });

      if (conflictingSkills.length > 0) {
        // Background has conflicting skills - show selection modal
        setBackgroundConflictingSkills(conflictingSkills);
        setBackgroundNonConflictingSkills(nonConflictingSkills);
        setSelectedBackgroundReplacementSkills([]);
        setShowBackgroundSkillChoice(true);
      } else {
        // Background has no conflicting skills - apply directly
        applyBackgroundRecommendations(newBackground, backgroundRec.skills);
      }
    } else {
      setCharacter({ ...character, background: newBackground });
    }
  };

  const applyBackgroundRecommendations = (background: string, skills: string[]) => {
    const backgroundRec = BACKGROUND_RECOMMENDATIONS[background];
    if (backgroundRec) {
      const newSkills = { ...character.skills };
      skills.forEach(skill => {
        newSkills[skill] = true;
      });

      // Combine background features with existing class and racial features
      let combinedFeatures = character.features;
      if (backgroundRec.feature) {
        if (combinedFeatures && !combinedFeatures.includes('=== BACKGROUND FEATURE ===')) {
          combinedFeatures += `\n\n=== BACKGROUND FEATURE ===\n${backgroundRec.feature}`;
        } else if (!combinedFeatures) {
          combinedFeatures = `=== BACKGROUND FEATURE ===\n${backgroundRec.feature}`;
        }
      }

      setCharacter({
        ...character,
        background: background,
        skills: newSkills,
        features: combinedFeatures,
        equipment: backgroundRec.equipment,
      });
    }
  };

  const toggleBackgroundSkillSelection = (skillName: string) => {
    setSelectedBackgroundReplacementSkills(prev => {
      if (prev.includes(skillName)) {
        return prev.filter(s => s !== skillName);
      } else if (prev.length < backgroundConflictingSkills.length) {
        return [...prev, skillName];
      }
      return prev;
    });
  };

  const confirmBackgroundSkillChoices = () => {
    const backgroundRec = BACKGROUND_RECOMMENDATIONS[pendingBackground];
    if (backgroundRec) {
      const newSkills = { ...character.skills };
      backgroundNonConflictingSkills.forEach(skill => {
        newSkills[skill] = true;
      });
      selectedBackgroundReplacementSkills.forEach(skill => {
        newSkills[skill] = true;
      });

      // Combine background features with existing class and racial features
      let combinedFeatures = character.features;
      if (backgroundRec.feature) {
        if (combinedFeatures && !combinedFeatures.includes('=== BACKGROUND FEATURE ===')) {
          combinedFeatures += `\n\n=== BACKGROUND FEATURE ===\n${backgroundRec.feature}`;
        } else if (!combinedFeatures) {
          combinedFeatures = `=== BACKGROUND FEATURE ===\n${backgroundRec.feature}`;
        }
      }

      setCharacter({
        ...character,
        background: pendingBackground,
        skills: newSkills,
        features: combinedFeatures,
        equipment: backgroundRec.equipment,
      });
    }
    setShowBackgroundSkillChoice(false);
    setPendingBackground('');
    setSelectedBackgroundReplacementSkills([]);
  };

  // Spell management functions
  const updateCantrip = (index: number, value: string) => {
    const newCantrips = [...character.cantrips];
    newCantrips[index] = value;
    setCharacter({ ...character, cantrips: newCantrips });
  };

  const updateSpell = (level: number, index: number, name: string) => {
    const newSpellsByLevel = [...character.spellsByLevel];
    newSpellsByLevel[level] = [...newSpellsByLevel[level]];
    newSpellsByLevel[level][index] = { ...newSpellsByLevel[level][index], name };
    setCharacter({ ...character, spellsByLevel: newSpellsByLevel });
  };

  const togglePrepared = (level: number, index: number) => {
    const newSpellsByLevel = [...character.spellsByLevel];
    newSpellsByLevel[level] = [...newSpellsByLevel[level]];
    newSpellsByLevel[level][index] = { 
      ...newSpellsByLevel[level][index], 
      prepared: !newSpellsByLevel[level][index].prepared 
    };
    setCharacter({ ...character, spellsByLevel: newSpellsByLevel });
  };

  const updateSlots = (level: number, field: 'total' | 'expended', value: number) => {
    const newSpellSlots = [...character.spellSlots];
    newSpellSlots[level] = { ...newSpellSlots[level], [field]: value };
    setCharacter({ ...character, spellSlots: newSpellSlots });
  };

  const initiative = getModifier(character.abilityScores.dexterity);
  const initiativeString = initiative >= 0 ? `+${initiative}` : `${initiative}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-stone-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Auto-fill prompt modal */}
        {showAutoFillPrompt && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card border-2 border-amber-700 rounded-lg shadow-2xl p-6 max-w-md w-full">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-amber-600" />
                <h3 className="text-xl text-amber-900">Auto-fill Stats?</h3>
              </div>
              <p className="text-sm mb-6">
                Would you like to auto-fill your ability scores and skills with recommended stats for a {pendingClass}?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={applyClassRecommendations}
                  className="flex-1 px-4 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800 transition-colors"
                >
                  Yes, auto-fill
                </button>
                <button
                  onClick={declineAutoFill}
                  className="flex-1 px-4 py-2 bg-muted text-foreground rounded-md hover:bg-accent transition-colors"
                >
                  No, I'll do it myself
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Race skill choice modal */}
        {showRaceSkillChoice && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card border-2 border-amber-700 rounded-lg shadow-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-amber-600" />
                <h3 className="text-xl text-amber-900">Choose Skills</h3>
              </div>
              <p className="text-sm mb-4">
                As a {pendingRace}, choose {requiredSkillChoices} skill{requiredSkillChoices > 1 ? 's' : ''} to gain proficiency in:
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Selected: {selectedRaceSkills.length} / {requiredSkillChoices}
              </p>
              <div className="space-y-2 mb-6">
                {SKILLS.map(skill => (
                  <div
                    key={skill.name}
                    className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${
                      selectedRaceSkills.includes(skill.name)
                        ? 'bg-amber-100 border border-amber-700'
                        : 'bg-accent/30 hover:bg-accent/50'
                    }`}
                    onClick={() => toggleRaceSkillSelection(skill.name)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedRaceSkills.includes(skill.name)}
                      onChange={() => {}}
                      className="w-4 h-4 rounded border-border accent-amber-700 cursor-pointer"
                    />
                    <span className="text-sm">{skill.name}</span>
                    <span className="text-xs text-muted-foreground">({skill.ability})</span>
                  </div>
                ))}
              </div>
              <button
                onClick={confirmRaceSkillChoices}
                disabled={selectedRaceSkills.length !== requiredSkillChoices}
                className="w-full px-4 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Selection
              </button>
            </div>
          </div>
        )}

        {/* Background skill choice modal */}
        {showBackgroundSkillChoice && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card border-2 border-amber-700 rounded-lg shadow-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-amber-600" />
                <h3 className="text-xl text-amber-900">Choose Replacement Skills</h3>
              </div>
              <p className="text-sm mb-4">
                Your {pendingBackground} background grants proficiency in {backgroundConflictingSkills.join(' and ')}, but you already have {backgroundConflictingSkills.length > 1 ? 'those' : 'that'}. Choose {backgroundConflictingSkills.length} different skill{backgroundConflictingSkills.length > 1 ? 's' : ''}:
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Selected: {selectedBackgroundReplacementSkills.length} / {backgroundConflictingSkills.length}
              </p>
              <div className="space-y-2 mb-6">
                {SKILLS.filter(skill => !character.skills[skill.name]).map(skill => (
                  <div
                    key={skill.name}
                    className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${
                      selectedBackgroundReplacementSkills.includes(skill.name)
                        ? 'bg-amber-100 border border-amber-700'
                        : 'bg-accent/30 hover:bg-accent/50'
                    }`}
                    onClick={() => toggleBackgroundSkillSelection(skill.name)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedBackgroundReplacementSkills.includes(skill.name)}
                      onChange={() => {}}
                      className="w-4 h-4 rounded border-border accent-amber-700 cursor-pointer"
                    />
                    <span className="text-sm">{skill.name}</span>
                    <span className="text-xs text-muted-foreground">({skill.ability})</span>
                  </div>
                ))}
              </div>
              <button
                onClick={confirmBackgroundSkillChoices}
                disabled={selectedBackgroundReplacementSkills.length !== backgroundConflictingSkills.length}
                className="w-full px-4 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Selection
              </button>
            </div>
          </div>
        )}

        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Scroll className="w-8 h-8 text-amber-700" />
            <h1 className="text-4xl text-amber-900">D&D Character Sheet</h1>
            <Swords className="w-8 h-8 text-amber-700" />
          </div>
          <p className="text-muted-foreground">Create your adventurer</p>
        </div>

        <div className="bg-card border-2 border-amber-700 rounded-lg shadow-xl p-6 md:p-8">
          {/* Basic Information */}
          <div className="mb-6">
            <h2 className="text-amber-900 mb-4 border-b-2 border-amber-700 pb-2">Character Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-1">Character Name</label>
                <input
                  type="text"
                  value={character.name}
                  onChange={(e) => setCharacter({ ...character, name: e.target.value })}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-md"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Race</label>
                <select
                  value={character.race}
                  onChange={(e) => handleRaceChange(e.target.value)}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-md"
                >
                  {RACES.map(race => (
                    <option key={race.value} value={race.value}>{race.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Class</label>
                <select
                  value={character.class}
                  onChange={(e) => handleClassChange(e.target.value)}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-md"
                >
                  {CLASSES.map(cls => (
                    <option key={cls.value} value={cls.value}>{cls.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Level</label>
                <input
                  type="number"
                  value={character.level}
                  onChange={(e) => setCharacter({ ...character, level: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-md"
                  min="1"
                  max="20"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Background</label>
                <select
                  value={character.background}
                  onChange={(e) => handleBackgroundChange(e.target.value)}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-md"
                >
                  {BACKGROUNDS.map(bg => (
                    <option key={bg.value} value={bg.value}>{bg.label}</option>
                  ))}
                </select>
                {character.background && BACKGROUNDS.find(bg => bg.value === character.background)?.description && (
                  <p className="text-xs text-muted-foreground mt-1 italic">
                    {BACKGROUNDS.find(bg => bg.value === character.background)?.description}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm mb-1">Alignment</label>
                <select
                  value={character.alignment}
                  onChange={(e) => setCharacter({ ...character, alignment: e.target.value })}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-md"
                >
                  {ALIGNMENTS.map(alignment => (
                    <option key={alignment.value} value={alignment.value}>{alignment.label}</option>
                  ))}
                </select>
                {character.alignment && ALIGNMENTS.find(align => align.value === character.alignment)?.description && (
                  <p className="text-xs text-muted-foreground mt-1 italic">
                    {ALIGNMENTS.find(align => align.value === character.alignment)?.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Top Row: Ability Scores, Skills, Features & Traits */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Left Column - Ability Scores */}
            <div>
              <h2 className="text-amber-900 mb-4 border-b-2 border-amber-700 pb-2">Ability Scores</h2>
              <div className="grid grid-cols-2 gap-3">
                <AbilityScore
                  name="STR"
                  score={character.abilityScores.strength}
                  onChange={(value) => updateAbilityScore('strength', value)}
                />
                <AbilityScore
                  name="DEX"
                  score={character.abilityScores.dexterity}
                  onChange={(value) => updateAbilityScore('dexterity', value)}
                />
                <AbilityScore
                  name="CON"
                  score={character.abilityScores.constitution}
                  onChange={(value) => updateAbilityScore('constitution', value)}
                />
                <AbilityScore
                  name="INT"
                  score={character.abilityScores.intelligence}
                  onChange={(value) => updateAbilityScore('intelligence', value)}
                />
                <AbilityScore
                  name="WIS"
                  score={character.abilityScores.wisdom}
                  onChange={(value) => updateAbilityScore('wisdom', value)}
                />
                <AbilityScore
                  name="CHA"
                  score={character.abilityScores.charisma}
                  onChange={(value) => updateAbilityScore('charisma', value)}
                />
              </div>
            </div>

            {/* Middle Column - Saving Throws & Skills */}
            <div>
              {/* Saving Throws */}
              <h2 className="text-amber-900 mb-4 border-b-2 border-amber-700 pb-2">Saving Throws</h2>
              <div className="space-y-1 mb-6">
                <SavingThrow
                  name="Strength"
                  proficient={character.savingThrows['Strength'] || false}
                  modifier={getModifier(character.abilityScores.strength)}
                  proficiencyBonus={proficiencyBonus}
                />
                <SavingThrow
                  name="Dexterity"
                  proficient={character.savingThrows['Dexterity'] || false}
                  modifier={getModifier(character.abilityScores.dexterity)}
                  proficiencyBonus={proficiencyBonus}
                />
                <SavingThrow
                  name="Constitution"
                  proficient={character.savingThrows['Constitution'] || false}
                  modifier={getModifier(character.abilityScores.constitution)}
                  proficiencyBonus={proficiencyBonus}
                />
                <SavingThrow
                  name="Intelligence"
                  proficient={character.savingThrows['Intelligence'] || false}
                  modifier={getModifier(character.abilityScores.intelligence)}
                  proficiencyBonus={proficiencyBonus}
                />
                <SavingThrow
                  name="Wisdom"
                  proficient={character.savingThrows['Wisdom'] || false}
                  modifier={getModifier(character.abilityScores.wisdom)}
                  proficiencyBonus={proficiencyBonus}
                />
                <SavingThrow
                  name="Charisma"
                  proficient={character.savingThrows['Charisma'] || false}
                  modifier={getModifier(character.abilityScores.charisma)}
                  proficiencyBonus={proficiencyBonus}
                />
              </div>
              
              {/* Skills */}
              <h2 className="text-amber-900 mb-4 border-b-2 border-amber-700 pb-2">Skills</h2>
              <div className="space-y-1 max-h-[200px] overflow-y-auto pr-2">
                {SKILLS.map((skill) => (
                  <SkillItem
                    key={skill.name}
                    name={skill.name}
                    ability={skill.ability}
                    proficient={character.skills[skill.name] || false}
                    onToggle={() => toggleSkillProficiency(skill.name)}
                    modifier={getModifier(character.abilityScores[skill.abilityKey as keyof Character['abilityScores']])}
                    proficiencyBonus={proficiencyBonus}
                  />
                ))}
              </div>
            </div>

            {/* Right Column - Features & Traits */}
            <div>
              <h2 className="text-amber-900 mb-4 border-b-2 border-amber-700 pb-2">Features & Traits</h2>
              <textarea
                value={character.features}
                onChange={(e) => setCharacter({ ...character, features: e.target.value })}
                className="w-full h-[380px] px-3 py-2 bg-input-background border border-border rounded-md resize-none"
                placeholder="Enter racial traits, class features, feats, etc."
              />
            </div>
          </div>

          {/* Middle Row: Combat Stats, Equipment, Character Portrait */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Left Column - Combat Stats */}
            <div>
              <h2 className="text-amber-900 mb-4 border-b-2 border-amber-700 pb-2">Combat Stats</h2>
              <div className="grid grid-cols-3 gap-2">
                <StatBox
                  label="AC"
                  value={character.ac}
                  onChange={(value) => setCharacter({ ...character, ac: parseInt(value) || 10 })}
                />
                <StatBox
                  label="Initiative"
                  value={initiativeString}
                  readOnly
                />
                <StatBox
                  label="Speed"
                  value={character.speed}
                  onChange={(value) => setCharacter({ ...character, speed: parseInt(value) || 30 })}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <StatBox
                  label="Current HP"
                  value={character.hp.current}
                  onChange={(value) => setCharacter({ ...character, hp: { ...character.hp, current: parseInt(value) || 0 } })}
                />
                <StatBox
                  label="Max HP"
                  value={character.hp.max}
                  onChange={(value) => setCharacter({ ...character, hp: { ...character.hp, max: parseInt(value) || 0 } })}
                />
              </div>
              <div className="mt-2">
                <StatBox
                  label="Proficiency Bonus"
                  value={`+${proficiencyBonus}`}
                  readOnly
                />
              </div>
            </div>

            {/* Middle Column - Equipment */}
            <div>
              <h2 className="text-amber-900 mb-4 border-b-2 border-amber-700 pb-2">Equipment</h2>
              <textarea
                value={character.equipment}
                onChange={(e) => setCharacter({ ...character, equipment: e.target.value })}
                className="w-full h-[200px] px-3 py-2 bg-input-background border border-border rounded-md resize-none"
                placeholder="List your weapons, armor, and other items"
              />
            </div>

            {/* Right Column - Character Portrait */}
            <div>
              <h2 className="text-amber-900 mb-4 border-b-2 border-amber-700 pb-2">Character Portrait</h2>
              <div className="flex flex-col items-center gap-3">
                <div className="w-full aspect-[3/4] bg-gradient-to-br from-amber-100 to-stone-200 border-2 border-amber-700 rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Scroll className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Portrait will appear here</p>
                  </div>
                </div>
                <button
                  className="w-full px-4 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800 transition-colors flex items-center justify-center gap-2"
                  onClick={() => {
                    // Placeholder for AI portrait generation
                    alert('AI portrait generation coming soon!');
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                  Generate Portrait
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Row: Spell List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3">
              <h2 className="text-amber-900 mb-4 border-b-2 border-amber-700 pb-2">Spell List</h2>
              <SpellList
                cantrips={character.cantrips}
                spellSlots={character.spellSlots}
                spellsByLevel={character.spellsByLevel}
                onUpdateCantrip={updateCantrip}
                onUpdateSpell={updateSpell}
                onTogglePrepared={togglePrepared}
                onUpdateSlots={updateSlots}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>May your rolls be high and your adventures legendary!</p>
        </div>
      </div>
    </div>
  );
}