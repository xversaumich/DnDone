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
    <div className="mb-6 space-y-6">

      {/* CANTRIPS NOTEBOOK BOX */}
      <div className="bg-white border border-amber-700 rounded-md p-4 
                      bg-[repeating-linear-gradient(white,white_22px,#e5e7eb_23px)]">
        <h3 className="text-black font-semibold mb-2">Cantrips</h3>

        <SpellList
          cantrips={character.cantrips}
          spellSlots={character.spellSlots}
          spellsByLevel={character.spellsByLevel}
          onUpdateCantrip={onUpdateCantrip}
          onUpdateSpell={onUpdateSpell}
          onTogglePrepared={onTogglePrepared}
          onUpdateSlots={onUpdateSlots}
          onlyCantrips
        />
      </div>

      {/* Spells notebook box */}
      <div className="bg-white border border-amber-700 rounded-md p-4 
                      bg-[repeating-linear-gradient(white,white_22px,#e5e7eb_23px)]">
        <h3 className="text-black font-semibold mb-2">Spells</h3>

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

    </div>
  );
}