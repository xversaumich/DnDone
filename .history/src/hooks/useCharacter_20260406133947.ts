import { useState } from 'react';
import { Character } from '../models/Character';
import { initialCharacter } from '../data/initialCharacter';

export function useCharacter() {
  const [character, setCharacter] = useState<Character>(initialCharacter);

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

  return {
    character,
    setCharacter,
    updateAbilityScore,
    toggleSkillProficiency,
    updateCantrip,
    updateSpell,
    togglePrepared,
    updateSlots,
  };
}