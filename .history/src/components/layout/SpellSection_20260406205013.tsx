import { Character } from "../../models/Character";
import { NotebookBox } from "./notebookBox";

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

      <NotebookBox
        title="Cantrips"
        value={character.cantrips.join("\n")}
        onChange={(text) => {
          const lines = text.split("\n");
          lines.forEach((line, i) => onUpdateCantrip(i, line));
        }}
      />

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