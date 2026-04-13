import { describe, expect, it } from 'vitest';
import {
  formatModifier,
  getMaxSpellLevel,
  getModifier,
  getProficiencyBonus,
} from './ability';

describe('ability logic', () => {
  it('calculates ability modifier correctly for odd and even scores', () => {
    expect(getModifier(10)).toBe(0);
    expect(getModifier(12)).toBe(1);
    expect(getModifier(9)).toBe(-1);
  });

  it('formats modifiers with the correct sign', () => {
    expect(formatModifier(3)).toBe('+3');
    expect(formatModifier(0)).toBe('+0');
    expect(formatModifier(-2)).toBe('-2');
  });

  it('calculates proficiency bonus by level tier', () => {
    expect(getProficiencyBonus(1)).toBe(2);
    expect(getProficiencyBonus(5)).toBe(3);
    expect(getProficiencyBonus(9)).toBe(4);
    expect(getProficiencyBonus(17)).toBe(6);
  });

  it('returns max spell level at key progression breakpoints', () => {
    expect(getMaxSpellLevel(0)).toBe(0);
    expect(getMaxSpellLevel(1)).toBe(1);
    expect(getMaxSpellLevel(3)).toBe(2);
    expect(getMaxSpellLevel(5)).toBe(3);
    expect(getMaxSpellLevel(17)).toBe(9);
  });
});
