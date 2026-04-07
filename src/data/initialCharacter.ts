import { Character } from '../models/Character';

export const initialCharacter: Character = {
  name: '',
  race: '',
  class: '',
  level: 1,
  background: '',
  alignment: '',
  abilityScores: {
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
  },
  skills: {},
  savingThrows: {},
  hp: {
    current: 10,
    max: 10,
  },
  ac: 10,
  speed: 30,
  features: '',
  equipment: '',
  cantrips: ['', '', '', ''],
  spellSlots: Array(9).fill(null).map(() => ({ total: 0, expended: 0 })),
  spellsByLevel: Array(9).fill(null).map(() => Array(10).fill(null).map(() => ({ name: '', prepared: false }))),
};