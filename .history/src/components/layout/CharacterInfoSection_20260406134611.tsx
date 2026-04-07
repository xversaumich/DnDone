import { RACES } from '../../logic/race';
import { CLASSES } from '../../logic/class';
import { BACKGROUNDS, ALIGNMENTS } from '../../logic/backgrounds';
import { Character } from '../../models/Character';

interface CharacterInfoSectionProps {
  character: Character;
  onCharacterChange: (updates: Partial<Character>) => void;
  onClassChange: (newClass: string) => void;
  onRaceChange: (newRace: string) => void;
  onBackgroundChange: (newBackground: string) => void;
}

export function CharacterInfoSection({
  character,
  onCharacterChange,
  onClassChange,
  onRaceChange,
  onBackgroundChange,
}: CharacterInfoSectionProps) {
  return (
    <div className="mb-6">
      <h2 className="text-amber-900 mb-4 border-b-2 border-amber-700 pb-2">Character Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm mb-1">Character Name</label>
          <input
            type="text"
            value={character.name}
            onChange={(e) => onCharacterChange({ name: e.target.value })}
            className="w-full px-3 py-2 bg-input-background border border-border rounded-md"
            placeholder="Enter name"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Race</label>
          <select
            value={character.race}
            onChange={(e) => onRaceChange(e.target.value)}
            className="w-full px-3 py-2 bg-input-background border border-border rounded-md"
          >
            {RACES.map(race => (
              <option key={race.value} value={race.value}>{race.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Class</label>
          <select
            value={character.class}
            onChange={(e) => onClassChange(e.target.value)}
            className="w-full px-3 py-2 bg-input-background border border-border rounded-md"
          >
            {CLASSES.map(cls => (
              <option key={cls.value} value={cls.value}>{cls.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Level</label>
          <input
            type="number"
            value={character.level}
            onChange={(e) => onCharacterChange({ level: parseInt(e.target.value) || 1 })}
            className="w-full px-3 py-2 bg-input-background border border-border rounded-md"
            min="1"
            max="20"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Background</label>
          <select
            value={character.background}
            onChange={(e) => onBackgroundChange(e.target.value)}
            className="w-full px-3 py-2 bg-input-background border border-border rounded-md"
          >
            {BACKGROUNDS.map(bg => (
              <option key={bg.value} value={bg.value}>{bg.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Alignment</label>
          <select
            value={character.alignment}
            onChange={(e) => onCharacterChange({ alignment: e.target.value })}
            className="w-full px-3 py-2 bg-input-background border border-border rounded-md"
          >
            {ALIGNMENTS.map(alignment => (
              <option key={alignment.value} value={alignment.value}>{alignment.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}