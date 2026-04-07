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
    <div className="mb-4 -mt-3">
      {/* moves the whole section upward */}

      <h2 className="text-amber-900 mb-3 border-b-2 border-amber-700 pb-1">
        Spellcasting
      </h2>

      {/* gray container like other sections */}
      <div className="bg-gray-100 border border-gray-300 rounded-md p-4">

        {/* two boxes closer together */}
        <div className="grid grid-cols-2 gap-3">

          {/* cantrips box */}
          <div className="bg-white border border-amber-700 rounded-md p-3 
                          bg-[repeating-linear-gradient(white,white_22px,#e5e7eb_23px)]">
            <h3 className="text-black font-semibold mb-2">Cantrips</h3>

            <div className="space-y-2">
              {character.cantrips.map((c, i) => (
                <input
                  key={i}
                  type="text"
                  value={c || ""}
                  onChange={(e) => onUpdateCantrip(i, e.target.value)}
                  className="w-full px-2 py-1 bg-transparent border border-border rounded-md"
                />
              ))}
            </div>
          </div>

          {/* spells box */}
          <div className="bg-white border border-amber-700 rounded-md p-3 
                          bg-[repeating-linear-gradient(white,white_22px,#e5e7eb_23px)]">
            <h3 className="text-black font-semibold mb-2">Spells</h3>

            <div className="space-y-2">
              {character.spellsByLevel.flatMap((level, levelIndex) =>
                level.spells.map((spell, spellIndex) => (
                  <input
                    key={`${levelIndex}-${spellIndex}`}
                    type="text"
                    value={spell.name || ""}
                    onChange={(e) =>
                      onUpdateSpell(levelIndex, spellIndex, e.target.value)
                    }
                    className="w-full px-2 py-1 bg-transparent border border-border rounded-md"
                  />
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}