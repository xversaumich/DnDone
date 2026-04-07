import { Character } from '../../models/Character';

interface SpellSectionProps {
  character: Character;
  onUpdateCantrip: (index: number, value: string) => void;
  onUpdateSpell: (level: number, index: number, name: string) => void;
}

export function SpellSection({
  character,
  onUpdateCantrip,
  onUpdateSpell,
}: SpellSectionProps) {
  return (
    <div className="lg:col-span-2"> {/* ⭐ Forces this section to stay under Combat + Equipment */}
      
      <div className="grid grid-cols-2 gap-4"> {/* ⭐ Two small side-by-side squares */}

        {/* CANTRIPS NOTEBOOK BOX */}
        <div className="w-full aspect-square max-w-[250px] bg-white border border-amber-700 rounded-md p-3 
                        bg-[repeating-linear-gradient(white,white_18px,#e5e7eb_19px)] overflow-auto">
          <h3 className="text-black font-semibold mb-1 text-sm">Cantrips</h3>

          <div className="space-y-1">
            {character.cantrips.map((c, i) => (
              <input
                key={i}
                type="text"
                value={c || ""}
                onChange={(e) => onUpdateCantrip(i, e.target.value)}
                className="w-full px-2 py-0.5 bg-transparent border border-border rounded-md text-left text-sm"
              />
            ))}
          </div>
        </div>

        {/* SPELLS NOTEBOOK BOX */}
        <div className="w-full aspect-square max-w-[250px] bg-white border border-amber-700 rounded-md p-3 
                        bg-[repeating-linear-gradient(white,white_18px,#e5e7eb_19px)] overflow-auto">
          <h3 className="text-black font-semibold mb-1 text-sm">Spells</h3>

          <div className="space-y-1">
            {character.spellsByLevel.flatMap((level, levelIndex) =>
              level.map((spell, spellIndex) => (
                <input
                  key={`${levelIndex}-${spellIndex}`}
                  type="text"
                  value={spell.name || ""}
                  onChange={(e) =>
                    onUpdateSpell(levelIndex, spellIndex, e.target.value)
                  }
                  className="w-full px-2 py-0.5 bg-transparent border border-border rounded-md text-left text-sm"
                />
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}