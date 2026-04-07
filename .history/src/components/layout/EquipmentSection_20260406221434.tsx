import { Character } from '../../models/Character';

interface EquipmentSectionProps {
  character: Character;
  onCharacterChange: (updates: Partial<Character>) => void;
}

export function EquipmentSection({ character, onCharacterChange }: EquipmentSectionProps) {
  return (
    <div className="mb-6 h-full flex flex-col min-h-0">
      <h2 className="text-amber-900 mb-4 border-b-2 border-amber-700 pb-2">
        Equipment
      </h2>

      <textarea
        value={character.equipment}
        onChange={(e) => onCharacterChange({ equipment: e.target.value })}
        className="w-full px-3 py-2 bg-input-background border border-border rounded-md resize-none overflow-y-auto flex-1 max-h-[250px]"
        placeholder="List your character's equipment here..."
      />
    </div>
  );
}