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
        <NotebookBox
          title="Cantrips"
          value={character.cantrips.join('\n')}
          onChange={(text) => {
            const lines = text.split('\n');
            lines.forEach((line, i) => onUpdateCantrip(i, line));
          }}
        />

        {/* SPELLS NOTEBOOK */}
        <NotebookBox
          title="Spells"
          value={character.spellsByLevel
            .flatMap((level) => level.map((s) => s.name))
            .join('\n')}
          onChange={(text) => {
            const lines = text.split('\n');
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
  );
}

function NotebookBox({ title, value, onChange }) {
  return (
    <div className="w-full aspect-square max-w-[250px] bg-white border border-amber-700 rounded-md p-3 flex flex-col">

      <h3 className="text-black font-semibold mb-2 text-base">
        {title}
      </h3>

      {/* Scrollable notebook area */}
      <div className="relative flex-1 overflow-auto px-2 pb-2">

        {/* Notebook lines */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(white,white_22px,black_23px)] pointer-events-none" />

        {/* Auto-growing textarea */}
        <textarea
          className="relative z-10 w-full bg-transparent resize-none outline-none text-sm leading-[22px] px-1"
          style={{
            height: "auto",
            minHeight: "22px",
          }}
          value={value}
          onChange={(e) => {
            e.target.style.height = "auto";     // reset
            e.target.style.height = e.target.scrollHeight + "px"; // grow
            onChange(e.target.value);
          }}
        />
      </div>
    </div>
  );
}