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

        {/* CANTRIPS NOTEBOOK BOX */}
        <div className="w-full aspect-square max-w-[250px] bg-white border border-amber-700 rounded-md p-3 relative">

          <h3 className="text-black font-semibold mb-3 text-base">
            Cantrips
          </h3>

          {/* Scrollable writing area */}
          <div className="absolute inset-x-0 bottom-0 top-10 overflow-auto px-2 pb-2">

            {/* Notebook lines */}
            <div className="absolute inset-0 px-2 pb-2 pointer-events-none 
                            bg-[repeating-linear-gradient(white,white_22px,black_23px)] rounded-md" />

            <textarea
              className="relative z-10 w-full h-full bg-transparent resize-none outline-none 
                         text-sm leading-[22px] px-2 overflow-hidden"
              value={character.cantrips.join('\n')}
              onChange={(e) => {
                const lines = e.target.value.split('\n');
                lines.forEach((line, i) => onUpdateCantrip(i, line));
              }}
            />
          </div>
        </div>

        {/* SPELLS NOTEBOOK BOX */}
        <div className="w-full aspect-square max-w-[250px] bg-white border border-amber-700 rounded-md p-3 relative">

          <h3 className="text-black font-semibold mb-3 text-base">
            Spells
          </h3>

          {/* Scrollable writing area */}
          <div className="absolute inset-x-0 bottom-0 top-10 overflow-auto px-2 pb-2">

            {/* Notebook lines */}
            <div className="absolute inset-0 px-2 pb-2 pointer-events-none 
                            bg-[repeating-linear-gradient(white,white_22px,black_23px)] rounded-md" />

            <textarea
              className="relative z-10 w-full h-full bg-transparent resize-none outline-none 
                         text-sm leading-[22px] px-2 overflow-hidden"
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
    </div>
  );
}