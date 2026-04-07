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
    <div className="mb-6 space-y-6">

      {/* CANTRIPS NOTEBOOK BOX */}
      <div className="bg-white border border-amber-700 rounded-md p-4 
                      bg-[repeating-linear-gradient(white,white_22px,#e5e7eb_23px)]">
        <h3 className="text-black font-semibold mb-2">Cantrips</h3>

        <div className="space-y-2">
          {character.cantrips.map((c, i) => (
            <input
              key={i}
              type="text"
              value={c || ""}
              onChange={(e) => onUpdateCantrip(i, e.target.value)}
              className="w-full px-2.5 py-1 bg-transparent border border-border rounded-md text-left"
            />
          ))}
        </div>
      </div>

      {/* SPELLS NOTEBOOK BOX */}
      <div className="bg-white border border-amber-700 rounded-md p-4 
                      bg-[repeating-linear-gradient(white,white_22px,#e5e7eb_23px)]">
        <h3 className="text-black font-semibold mb-2">Spells</h3>

        <div className="space-y-2">
          {character.spellsByLevel.flatMap((level, levelIndex) =>
            level.map((spell, spellIndex) => (
              <input
                key={`${levelIndex}-${spellIndex}`}
                type="text"
                value={spell.name || ""}
                onChange={(e) =>
                  onUpdateSpell(levelIndex, spellIndex, e.target.value)
                }
                className="w-full px-2.5 py-1 bg-transparent border border-border rounded-md text-left"
              />
            ))
          )}
        </div>
      </div>

    </div> 
  );
}