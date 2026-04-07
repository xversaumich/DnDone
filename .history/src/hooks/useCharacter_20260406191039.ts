import { useState } from 'react';
import { Character } from '../models/Character';
import { initialCharacter } from '../data/initialCharacter';

export function useCharacter() {
  const [character, setCharacterState] = useState<Character>(initialCharacter);

  // UPDATED: merge-friendly setter that supports function updaters
  const setCharacter = (
    updates: Partial<Character> | ((prev: Character) => Character)
  ) => {
    if (typeof updates === "function") {
      setCharacterState(prev => updates(prev));
    } else {
      setCharacterState(prev => ({ ...prev, ...updates }));
    }
  };

  const updateAbilityScore = (ability: keyof Character['abilityScores'], value: number) => {
    setCharacter({
      abilityScores: {
        ...character.abilityScores,
        [ability]: value,
      },
    });
  };

  const toggleSkillProficiency = (skillName: string) => {
    setCharacter({
      skills: {
        ...character.skills,
        [skillName]: !character.skills[skillName],
      },
    });
  };

  const updateCantrip = (index: number, value: string) => {
    const newCantrips = [...character.cantrips];
    newCantrips[index] = value;
    setCharacter({ cantrips: newCantrips });
  };

  const updateSpell = (level: number, index: number, name: string) => {
    const newSpellsByLevel = [...character.spellsByLevel];
    newSpellsByLevel[level] = [...newSpellsByLevel[level]];
    newSpellsByLevel[level][index] = { ...newSpellsByLevel[level][index], name };
    setCharacter({ spellsByLevel: newSpellsByLevel });
  };

  const togglePrepared = (level: number, index: number) => {
    const newSpellsByLevel = [...character.spellsByLevel];
    newSpellsByLevel[level] = [...newSpellsByLevel[level]];
    newSpellsByLevel[level][index] = {
      ...newSpellsByLevel[level][index],
      prepared: !newSpellsByLevel[level][index].prepared,
    };
    setCharacter({ spellsByLevel: newSpellsByLevel });
  };

  const updateSlots = (level: number, field: 'total' | 'expended', value: number) => {
    const newSpellSlots = [...character.spellSlots];
    newSpellSlots[level] = { ...newSpellSlots[level], [field]: value };
    setCharacter({ spellSlots: newSpellSlots });
  };

  return {
    character,
    setCharacter, // now supports both object + function updates
    updateAbilityScore,
    toggleSkillProficiency,
    updateCantrip,
    updateSpell,
    togglePrepared,
    updateSlots,
  };
}