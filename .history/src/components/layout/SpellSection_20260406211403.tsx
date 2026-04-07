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

      {/* CANTRIPS */}
      <NotebookBox
        title="Cantrips"
        values={character.cantrips}
        onChange={(index, text) => onUpdateCantrip(index, text)}
      />

      {/* SPELLS */}
      <NotebookBox
        title="Spells"
        values={character.spellsByLevel.flatMap((level) =>
          level.map((s) => s.name)
        )}
        onChange={(flatIndex, text) => {
          let index = 0;
          character.spellsByLevel.forEach((level, levelIndex) => {
            level.forEach((_, spellIndex) => {
              if (index === flatIndex) {
                onUpdateSpell(levelIndex, spellIndex, text);
              }
              index++;
            });
          });
        }}
      />

    </div>
  );
}