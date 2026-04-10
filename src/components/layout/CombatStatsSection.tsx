import { StatBox } from '../character/StatBox';
import { DeathSavesBox } from '../character/DeathSavesBox';
import { Character } from '../../models/Character';

interface CombatStatsSectionProps {
  character: Character;
  proficiencyBonus: number;
  initiative: string;
  onCharacterChange: (updates: Partial<Character>) => void;
}

export function CombatStatsSection({
  character,
  proficiencyBonus,
  initiative,
  onCharacterChange
}: CombatStatsSectionProps) {
  return (
    <div className="mb-6">
      <h2 className="text-amber-900 mb-4 border-b-2 border-amber-700 pb-2">
        Combat Stats
      </h2>

      {/* ⭐ Row 1: AC / Initiative / Speed */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <StatBox
          label="Armor Class"
          value={character.ac}
          onChange={(v) => onCharacterChange({ ac: Number(v) })}
        />

        <StatBox
          label="Initiative"
          value={initiative}
          readOnly
        />

        <StatBox
          label="Speed"
          value={character.speed}
          onChange={(v) => onCharacterChange({ speed: Number(v) })}
        />
      </div>

      {/* ⭐ Row 2: Current HP / Max HP */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <StatBox
          label="Current HP"
          value={character.hp.current}
          onChange={(v) =>
            onCharacterChange({
              hp: { ...character.hp, current: Number(v) }
            })
          }
        />

        <StatBox
          label="Max HP"
          value={character.hp.max}
          onChange={(v) =>
            onCharacterChange({
              hp: { ...character.hp, max: Number(v) }
            })
          }
        />
      </div>

      {/* ⭐ Row 3: Death Saves */}
      <DeathSavesBox
        successes={character.deathSaves.successes}
        failures={character.deathSaves.failures}
        onSuccessesChange={(successes) => onCharacterChange({ deathSaves: { ...character.deathSaves, successes } })}
        onFailuresChange={(failures) => onCharacterChange({ deathSaves: { ...character.deathSaves, failures } })}
      />
    </div>
  );
}