import { AbilityScore } from '../character/AbilityScore';
import { Character } from '../../models/Character';

interface AbilityScoresSectionProps {
  character: Character;
  onUpdateAbilityScore: (ability: keyof Character['abilityScores'], value: number) => void;
}

export function AbilityScoresSection({ character, onUpdateAbilityScore }: AbilityScoresSectionProps) {
  return (
    <div className="mb-6">

      {/* Orange label OUTSIDE the box */}
      <h2 className="text-amber-900 mb-4 border-b-2 border-amber-700 pb-2">
        Ability Scores
      </h2>

      {/* Gray box containing the 2×3 grid */}
      <div className="bg-gray-100 border border-gray-400 rounded-lg p-4">

        <div className="grid grid-cols-3 gap-4">
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
    </div>
  );
}