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
