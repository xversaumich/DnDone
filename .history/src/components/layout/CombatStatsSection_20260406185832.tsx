import { StatBox } from '../character/StatBox';
import { Character } from '../../models/Character';

interface CombatStatsSectionProps {
  character: Character;
  proficiencyBonus: number;
  initiative: string;
}

export function CombatStatsSection({ character, proficiencyBonus, initiative }: CombatStatsSectionProps) {
  return (
    <div className="mb-6">
      <h2 className="text-amber-900 mb-4 border-b-2 border-amber-700 pb-2">
        Combat Stats
      </h2>

      {/* Row 1: AC / Initiative / Speed */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <StatBox label="Armor Class" value={character.ac.toString()} />
        <StatBox label="Initiative" value={initiative} />
        <StatBox label="Speed" value={`${character.speed} ft.`} />
      </div>

      {/* Row 2: Current HP / Max HP */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <StatBox label="Current HP" value={character.hp.current.toString()} />
        <StatBox label="Max HP" value={character.hp.max.toString()} />
      </div>

      {/* Row 3: Death Saves */}
      <div className="grid grid-cols-2 gap-4">
        <StatBox
          label="Death Saves (Successes)"
          value={character.deathSaveSuccesses?.toString() ?? "0"}
        />
        <StatBox
          label="Death Saves (Failures)"
          value={character.deathSaveFailures?.toString() ?? "0"}
        />
      </div>
    </div>
  );
}