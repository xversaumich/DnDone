export function useCharacter() {
  const [character, setCharacter] = useState<Character>(initialCharacter);

  // NEW: merge-friendly setter
  const updateCharacter = (updates: Partial<Character>) => {
    setCharacter(prev => ({ ...prev, ...updates }));
  };

  const updateAbilityScore = (ability: keyof Character['abilityScores'], value: number) => {
    updateCharacter({
      abilityScores: {
        ...character.abilityScores,
        [ability]: value,
      },
    });
  };

  const toggleSkillProficiency = (skillName: string) => {
    updateCharacter({
      skills: {
        ...character.skills,
        [skillName]: !character.skills[skillName],
      },
    });
  };

  const updateCantrip = (index: number, value: string) => {
    const newCantrips = [...character.cantrips];
    newCantrips[index] = value;
    updateCharacter({ cantrips: newCantrips });
  };

  const updateSpell = (level: number, index: number, name: string) => {
    const newSpellsByLevel = [...character.spellsByLevel];
    newSpellsByLevel[level] = [...newSpellsByLevel[level]];
    newSpellsByLevel[level][index] = { ...newSpellsByLevel[level][index], name };
    updateCharacter({ spellsByLevel: newSpellsByLevel });
  };

  const togglePrepared = (level: number, index: number) => {
    const newSpellsByLevel = [...character.spellsByLevel];
    newSpellsByLevel[level] = [...newSpellsByLevel[level]];
    newSpellsByLevel[level][index] = {
      ...newSpellsByLevel[level][index],
      prepared: !newSpellsByLevel[level][index].prepared,
    };
    updateCharacter({ spellsByLevel: newSpellsByLevel });
  };

  const updateSlots = (level: number, field: 'total' | 'expended', value: number) => {
    const newSpellSlots = [...character.spellSlots];
    newSpellSlots[level] = { ...newSpellSlots[level], [field]: value };
    updateCharacter({ spellSlots: newSpellSlots });
  };

  return {
    character,
    setCharacter: updateCharacter,   // IMPORTANT: expose the merge setter
    updateAbilityScore,
    toggleSkillProficiency,
    updateCantrip,
    updateSpell,
    togglePrepared,
    updateSlots,
  };
}