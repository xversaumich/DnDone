export function removeFeatureSection(features: string, sectionTitle: string): string {
  if (!features) return '';
  const regex = new RegExp(`=== ${sectionTitle} ===[\\s\\S]*?(?=== [A-Z ]+ ===|$)`, 'g');
  return features.replace(regex, '').trim();
}

// Rebuilds the character's skill object based on race/class/background skills
export function rebuildSkills(
  race: string,
  raceSkills: string[],
  classSkills: string[],
  backgroundSkills: string[]
): Record<string, boolean> {
  const newSkills: Record<string, boolean> = {};

  // Add race skills
  raceSkills.forEach(skill => {
    newSkills[skill] = true;
  });

  // Add class skills
  classSkills.forEach(skill => {
    newSkills[skill] = true;
  });

  // Add background skills
  backgroundSkills.forEach(skill => {
    newSkills[skill] = true;
  });

  return newSkills;
}

// Determines where a skill came from (race, class, background)
export function getSkillSource(
  skillName: string,
  appliedRaceSkills: string[],
  appliedClassSkills: string[],
  appliedBackgroundSkills: string[],
  character: { race: string; class: string; background: string }
): string | null {
  if (appliedRaceSkills.includes(skillName)) return `${character.race} race`;
  if (appliedClassSkills.includes(skillName)) return `${character.class} class`;
  if (appliedBackgroundSkills.includes(skillName)) return `${character.background} background`;
  return null;
}

// Same as above but ignores class skills (used during class replacement)
export function getSkillSourceExcludingClass(
  skillName: string,
  appliedRaceSkills: string[],
  appliedBackgroundSkills: string[],
  character: { race: string; background: string }
): string | null {
  if (appliedBackgroundSkills.includes(skillName)) {
    return `${character.background} background`;
  }
  if (appliedRaceSkills.includes(skillName)) {
    return `${character.race} race`;
  }
  return null;
}