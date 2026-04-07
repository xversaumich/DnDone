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
    <div className="lg:col-span-2">
      <div className="grid grid-cols-2 gap-4">

        {/* CANTRIPS NOTEBOOK */}
        <div className="w-full aspect-square max-w-[250px] bg-white border border-amber-700 rounded-md p-3 flex flex-col">
          <h3 className="text-black font-semibold mb-2 text-base">
            Cantrips
          </h3>

          <textarea
            className="flex-1 w-full bg-[repeating-linear-gradient(white,white_22px,black_23px)] 
                       bg-origin-content bg-clip-padding resize-none outline-none 
                       text-sm leading-[22px] px-3 py-2 rounded-md border border-transparent
                       overflow-auto"
            value={character.cantrips.join('\n')}
            onChange={(e) => {
              const lines = e.target.value.split('\n');
              lines.forEach((line, i) => onUpdateCantrip(i, line));
            }}
          />
        </div>

        {/* SPELLS NOTEBOOK */}
        <div className="w-full aspect-square max-w-[250px] bg-white border border-amber-700 rounded-md p-3 flex flex-col">
          <h3 className="text-black font-semibold mb-2 text-base">
            Spells
          </h3>

          <textarea
            className="flex-1 w-full bg-[repeating-linear-gradient(white,white_22px,black_23px)] 
                       bg-origin-content bg-clip-padding resize-none outline-none 
                       text-sm leading-[22px] px-3 py-2 rounded-md border border-transparent
                       overflow-auto"
            value={character.spellsByLevel
              .flatMap((level) => level.map((s) => s.name))
              .join('\n')}
            onChange={(e) => {
              const lines = e.target.value.split('\n');
              let index = 0;
              character.spellsByLevel.forEach((level, levelIndex) => {
                level.forEach((_, spellIndex) => {
                  onUpdateSpell(levelIndex, spellIndex, lines[index] || '');
                  index++;
                });
              });
            }}
          />
        </div>

      </div>
    </div>
  );
}