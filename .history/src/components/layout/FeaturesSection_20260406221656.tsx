import { Character } from '../../models/Character';

interface FeaturesSectionProps {
  character: Character;
  onCharacterChange: (updates: Partial<Character>) => void;
}

export function FeaturesSection({ character, onCharacterChange }: FeaturesSectionProps) {
  return (
    <div className="mb-6">
      <h2 className="text-amber-900 mb-4 border-b-2 border-amber-700 pb-2">
        Features & Traits
      </h2>

      <textarea
        value={character.features}
        onChange={(e) => onCharacterChange({ features: e.target.value })}
        className="w-full px-3 py-2 bg-input-background border border-border rounded-md 
                  resize-none overflow-y-auto max-h-[700px]"
        placeholder="Character features, racial traits, class features, etc."
      />
    </div>
  );
}