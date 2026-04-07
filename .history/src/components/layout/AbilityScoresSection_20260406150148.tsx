import { AbilityScore } from '../character/AbilityScore';
import { Character } from '../../models/Character';

interface AbilityScoreProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export function AbilityScoresSection({ character, onUpdateAbilityScore }: AbilityScoresSectionProps) {
  return (
    <div className="bg-gray-100 border border-gray-400 rounded-lg p-4 mb-6">
      <h2 className="text-red-900 mb-4 border-b-2 border-red-800 pb-2">Ability Scores</h2>

      {/* 2 rows × 3 columns */}
      <div className="grid grid-cols-3 gap-4">

        {/* Row 1 */}
        <AbilityScore
          label="STR"
          value={character.abilityScores.strength}
          onChange={(value) => onUpdateAbilityScore('strength', value)}
        />
        <AbilityScore
          label="DEX"
          value={character.abilityScores.dexterity}
          onChange={(value) => onUpdateAbilityScore('dexterity', value)}
        />
        <AbilityScore
          label="CON"
          value={character.abilityScores.constitution}
          onChange={(value) => onUpdateAbilityScore('constitution', value)}
        />

        {/* Row 2 */}
        <AbilityScore
          label="INT"
          value={character.abilityScores.intelligence}
          onChange={(value) => onUpdateAbilityScore('intelligence', value)}
        />
        <AbilityScore
          label="WIS"
          value={character.abilityScores.wisdom}
          onChange={(value) => onUpdateAbilityScore('wisdom', value)}
        />
        <AbilityScore
          label="CHA"
          value={character.abilityScores.charisma}
          onChange={(value) => onUpdateAbilityScore('charisma', value)}
        />

      </div>
    </div>
  );
}