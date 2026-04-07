import { AbilityScore } from '../character/AbilityScore';
import { Character } from '../../models/Character';

interface AbilityScoresSectionProps {
  character: Character;
  onUpdateAbilityScore: (ability: keyof Character['abilityScores'], value: number) => void;
}

export function AbilityScoresSection({ character, onUpdateAbilityScore }: AbilityScoresSectionProps) {
  return (
    <div className="mb-6">
      <h2 className="text-amber-900 mb-4 border-b-2 border-amber-700 pb-2">Ability Scores</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <AbilityScore
          label="Strength"
          value={character.abilityScores.strength}
          onChange={(value) => onUpdateAbilityScore('strength', value)}
        />
        <AbilityScore
          label="Dexterity"
          value={character.abilityScores.dexterity}
          onChange={(value) => onUpdateAbilityScore('dexterity', value)}
        />
        <AbilityScore
          label="Constitution"
          value={character.abilityScores.constitution}
          onChange={(value) => onUpdateAbilityScore('constitution', value)}
        />
        <AbilityScore
          label="Intelligence"
          value={character.abilityScores.intelligence}
          onChange={(value) => onUpdateAbilityScore('intelligence', value)}
        />
        <AbilityScore
          label="Wisdom"
          value={character.abilityScores.wisdom}
          onChange={(value) => onUpdateAbilityScore('wisdom', value)}
        />
        <AbilityScore
          label="Charisma"
          value={character.abilityScores.charisma}
          onChange={(value) => onUpdateAbilityScore('charisma', value)}
        />
      </div>
    </div>
  );
}