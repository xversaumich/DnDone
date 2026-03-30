export interface BackgroundOption {
  value: string;
  label: string;
  description: string;
}

export interface AlignmentOption {
  value: string;
  label: string;
  description: string;
}

export interface BackgroundRecommendations {
  skills: string[];
  equipment: string;
  feature: string;
}

export const BACKGROUNDS: BackgroundOption[] = [
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

export const ALIGNMENTS: AlignmentOption[] = [
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

export const BACKGROUND_RECOMMENDATIONS: Record<string, BackgroundRecommendations> = {
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
    feature: 'Criminal Contact: You have a reliable and trustworthy contact who operates in the city where you started your adventure. You know how to get messages to and from this contact, even over long distances, in a way that is safe from eavesdroppers. Your contact can be a criminal, a member of a thieves\' guild, a mercenary, or someone else with a similar background.',
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
    feature: 'Guild Membership: As an established and respected member of a guild, you can rely on certain benefits your fellow guild members provide, and you can also secure goods or services as a favor in return for helping them. Your guild will provide you with lodging and food if necessary, and pay for your funeral if needed.',
  },
  Hermit: {
    skills: ['Medicine', 'Religion'],
    equipment: 'Scroll case\nWinter blanket\nCommon clothes\nBelt pouch containing 5 gp',
    feature: 'Discovery: The quiet seclusion of your hermitage gave you access to a unique and powerful discovery. The exact nature of this revelation depends on the nature of your seclusion. It might be a great truth about the cosmos, the deities, the natural world, or a powerful magic item that you found in your travels.',
  },
  Noble: {
    skills: ['History', 'Persuasion'],
    equipment: 'Signet ring\nScroll of pedigree\nLantern\nSet of fine clothes\nBelt pouch containing 25 gp',
    feature: 'Position of Privilege: Thanks to your noble birth, people are inclined to think the best of you. You are welcome in high society, and people assume you have a right to be wherever you are. The common folk make way for you and look to you to lead them. You can find a place to stay in noble courts, and people are inclined to help you.',
  },
  Outlander: {
    skills: ['Athletics', 'Survival'],
    equipment: 'Staff\nHunting trap\nTrophy from an animal you killed\nCommon clothes\nBelt pouch containing 10 gp',
    feature: 'Wanderer: You have an excellent memory for maps and geography, and you can always recall the general layout of terrain, settlements, and other features around you. In addition, you can find food and fresh water for yourself and up to five other people each day, provided that the land offers berries, small game, water, and so forth.',
  },
  Sage: {
    skills: ['Arcana', 'History'],
    equipment: 'Bottle of ink\nQuill\nSmall knife\nLetter from a dead colleague posing a question you have not yet been able to answer\nSet of common clothes\nBelt pouch containing 10 gp',
    feature: 'Researcher: You have spent a great deal of time studying, experimenting, and researching. You can focus on a specific field of study or be a generalist, but either way, you are a master of a particular subject.',
  },
  Sailor: {
    skills: ['Athletics', 'Perception'],
    equipment: 'Belaying pin\n50 feet of silk rope\nLucky charm\nCommon clothes\nBelt pouch containing 10 gp',
    feature: 'Ship\'s Passage: When you need to travel by ship, you can secure free passage on a sailing ship or a similar vessel. You might sail as a passenger, as crew, or in any other capacity you have the skill and experience to fill. You might also be able to secure free passage on a small fishing boat or trading ship.',
  },
  Soldier: {
    skills: ['Athletics', 'Intimidation'],
    equipment: 'Insignia of rank\nCommon clothes\nBelt pouch containing 10 gp',
    feature: 'Military Rank: You have a military rank from your service, which might grant you access to resources or influence people. If you are of a high enough rank, you might be able to secure an audience with a local military leader.',
  },
};
