/**
 * Calculates the modifier for an ability score
 * @param score - The ability score (typically 3-20)
 * @returns The modifier applied to rolls and checks
 */
export const getModifier = (score: number): number => {
  return Math.floor((score - 10) / 2);
};

/**
 * Calculates proficiency bonus based on character level
 * @param level - The character's level (1-20)
 * @returns The proficiency bonus
 */
export const getProficiencyBonus = (level: number): number => {
  return Math.ceil(level / 4) + 1;
};

/**
 * Formats a modifier as a string with + or - sign
 * @param modifier - The modifier value
 * @returns Formatted string (e.g., "+3" or "-2")
 */
export const formatModifier = (modifier: number): string => {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
};

/**
 * Gets the maximum spell level available based on character level
 * @param level - The character's level (1-20)
 * @returns The highest spell level available (0-9, where 0 means cantrips only)
 */
export const getMaxSpellLevel = (level: number): number => {
  if (level < 1) return 0;
  if (level < 3) return 1; // 1st level spells at level 1
  if (level < 5) return 2; // 2nd level spells at level 3
  if (level < 7) return 3; // 3rd level spells at level 5
  if (level < 9) return 4; // 4th level spells at level 7
  if (level < 11) return 5; // 5th level spells at level 9
  if (level < 13) return 6; // 6th level spells at level 11
  if (level < 15) return 7; // 7th level spells at level 13
  if (level < 17) return 8; // 8th level spells at level 15
  return 9; // 9th level spells at level 17+
};
