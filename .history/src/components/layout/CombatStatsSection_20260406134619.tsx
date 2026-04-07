import { StatBox } from '../character/StatBox';
import { SavingThrow } from '../character/SavingThrow';
import { getModifier, getProficiencyBonus } from '../../logic/ability';
import { CLASS_SAVING_THROWS } from '../../logic/class';
import { Character } from '../../models/Character';

interface CombatStatsSectionProps {
  character: Character;
  proficiencyBonus: number;
  initiative: string;
}

export function CombatStatsSection({ character, proficiencyBonus, initiative }: CombatStatsSectionProps) {
  const classSavingThrows = CLASS_SAVING_THROWS[character.class] || [];

  return (
    <div className="mb-6">
      <h2 className="text-amber-900 mb-4 border-b-2 border-amber-700 pb-2">Combat Stats</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox label="Hit Points" value={`${character.hp.current} / ${character.hp.max}`} />
        <StatBox label="Armor Class" value={character.ac.toString()} />
        <StatBox label="Initiative" value={initiative} />
        <StatBox label="Speed" value={`${character.speed} ft.`} />
      </div>

      <div className="mt-4">
        <h3 className="text-amber-900 mb-2">Saving Throws</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {(['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'] as const).map(ability => (
            <SavingThrow
              key={ability}
              ability={ability}
              modifier={getModifier(character.abilityScores[ability])}
              proficiencyBonus={proficiencyBonus}
              isProficient={character.savingThrows[ability] || false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}