import { Character } from "../../models/Character";

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
    <div className="grid grid-cols-2 gap-4">

      {/* CANTRIPS */}
      <NotebookBox
        title="Cantrips"
        value={character.cantrips.join("\n")}
        onChange={(text) => {
          const lines = text.split("\n");
          lines.forEach((line, i) => onUpdateCantrip(i, line));
        }}
      />

      {/* SPELLS */}
      <NotebookBox
        title="Spells"
        value={character.spellsByLevel
          .flatMap((level) => level.map((s) => s.name))
          .join("\n")}
        onChange={(text) => {
          const lines = text.split("\n");
          let index = 0;
          character.spellsByLevel.forEach((level, levelIndex) => {
            level.forEach((_, spellIndex) => {
              onUpdateSpell(levelIndex, spellIndex, lines[index] || "");
              index++;
            });
          });
        }}
      />

    </div>
  );
}

function NotebookBox({
  title,
  value,
  onChange,
}: {
  title: string;
  value: string;
  onChange: (text: string) => void;
}) {
  return (
    <div className="w-full aspect-square max-w-[260px] bg-white border border-amber-700 rounded-md p-3 flex flex-col">

      <h3 className="text-black font-semibold mb-2 text-base">
        {title}
      </h3>

      {/* Scrollable notebook paper */}
      <div
        className="
          flex-1 w-full overflow-auto
          bg-[repeating-linear-gradient(white,white_22px,black_23px)]
          bg-origin-content bg-clip-padding
          rounded-md
        "
      >
        <textarea
          className="
            w-full h-full
            resize-none outline-none
            text-sm leading-[22px]
            px-3 py-2
            bg-transparent
          "
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}