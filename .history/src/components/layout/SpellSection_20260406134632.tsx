import { SpellList } from '../character/SpellList';
import { Character } from '../../models/Character';

interface SpellSectionProps {
  character: Character;
  onUpdateCantrip: (index: number, value: string) => void;
  onUpdateSpell: (level: number, index: number, name: string) => void;
  onTogglePrepared: (level: number, index: number) => void;
  onUpdateSlots: (level: number, field: 'total' | 'expended', value: number) => void;
}

export function SpellSection({
  character,
  onUpdateCantrip,
  onUpdateSpell,
  onTogglePrepared,
  onUpdateSlots,
}: SpellSectionProps) {
  return (
    <div className="mb-6">
      <h2 className="text-amber-900 mb-4 border-b-2 border-amber-700 pb-2">Spellcasting</h2>
      <SpellList
        cantrips={character.cantrips}
        spellSlots={character.spellSlots}
        spellsByLevel={character.spellsByLevel}
        onUpdateCantrip={onUpdateCantrip}
        onUpdateSpell={onUpdateSpell}
        onTogglePrepared={onTogglePrepared}
        onUpdateSlots={onUpdateSlots}
      />
    </div>
  );
}