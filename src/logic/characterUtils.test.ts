import { describe, expect, it } from 'vitest';
import {
  getSkillSource,
  getSkillSourceExcludingClass,
  rebuildSkills,
  removeFeatureSection,
} from './characterUtils';

describe('character utility logic', () => {
  it('removes only the targeted feature section', () => {
    const features = [
      '=== RACIAL TRAITS ===',
      'Darkvision',
      '=== CLASS FEATURES ===',
      'Rage',
      '=== BACKGROUND FEATURE ===',
      'Military Rank',
    ].join('\n');

    const result = removeFeatureSection(features, 'CLASS FEATURES');

    expect(result).toContain('=== RACIAL TRAITS ===');
    expect(result).toContain('=== BACKGROUND FEATURE ===');
    expect(result).not.toContain('=== CLASS FEATURES ===');
    expect(result).not.toContain('Rage');
  });

  it('rebuilds skills and de-duplicates by object keys', () => {
    const result = rebuildSkills(
      'Elf',
      ['Perception'],
      ['Stealth', 'Perception'],
      ['Insight']
    );

    expect(result).toEqual({
      Perception: true,
      Stealth: true,
      Insight: true,
    });
  });

  it('returns the first matching source with race precedence', () => {
    const source = getSkillSource(
      'Perception',
      ['Perception'],
      ['Perception'],
      [],
      { race: 'Elf', class: 'Ranger', background: 'Outlander' }
    );

    expect(source).toBe('Elf race');
  });

  it('returns null when no skill source exists', () => {
    const source = getSkillSource(
      'Arcana',
      ['Perception'],
      ['Stealth'],
      ['Insight'],
      { race: 'Elf', class: 'Ranger', background: 'Outlander' }
    );

    expect(source).toBeNull();
  });

  it('excludes class and prefers background over race', () => {
    const source = getSkillSourceExcludingClass(
      'Perception',
      ['Perception'],
      ['Perception'],
      { race: 'Elf', background: 'Outlander' }
    );

    expect(source).toBe('Outlander background');
  });
});
