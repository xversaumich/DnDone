import type { Character } from '../models/Character';

const formatAbilityScores = (character: Character) => {
  const { strength, dexterity, constitution, intelligence, wisdom, charisma } = character.abilityScores;

  return `Ability scores: Strength ${strength}, Dexterity ${dexterity}, Constitution ${constitution}, Intelligence ${intelligence}, Wisdom ${wisdom}, Charisma ${charisma}`;
};

const formatProficientSkills = (skills: Record<string, boolean>) => {
  const proficientSkills = Object.entries(skills)
    .filter(([, isProficient]) => isProficient)
    .map(([skillName]) => skillName);

  if (proficientSkills.length === 0) {
    return '';
  }

  return `Proficient skills: ${proficientSkills.join(', ')}`;
};

const formatEquipment = (equipment: string) => {
  if (!equipment.trim()) return '';

  const cleanedEquipment = equipment
    .split('\n')
    .map(item => item.trim())
    .filter(Boolean)
    .join(', ');

  return cleanedEquipment ? `Equipment: ${cleanedEquipment}` : '';
};

export function buildPortraitPrompt(character: Character): string {
  const parts: string[] = [];

  const raceClassText = [character.race, character.class].filter(Boolean).join(' ');
  const titleText = raceClassText || 'fantasy adventurer';

  parts.push(`Create a high-quality fantasy character portrait of a ${titleText}, suitable for a Dungeons & Dragons style setting.`);

  const detailBits: string[] = [];

  if (character.level) {
    detailBits.push(`They are Level ${character.level}`);
  }

  if (character.background) {
    detailBits.push(`with ${character.background} background`);
  }

  if (character.alignment) {
    detailBits.push(`${detailBits.length > 0 ? 'and ' : 'with '}${character.alignment} alignment`);
  }

  if (detailBits.length > 0) {
    parts.push(`${detailBits.join(' ')}.`);
  }

  parts.push(formatAbilityScores(character));

  const skillsText = formatProficientSkills(character.skills);
  if (skillsText) {
    parts.push(skillsText);
  }

  const equipmentText = formatEquipment(character.equipment);
  if (equipmentText) {
    parts.push(equipmentText);
  }

  parts.push('Detailed fantasy art style, professional illustration.');

  return parts.join('\n');
}