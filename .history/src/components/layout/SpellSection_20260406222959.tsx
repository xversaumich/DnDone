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

  const flatSpells = character.spellsByLevel.flatMap((level) =>
    level.map((s) => s.name)
  );

  const trimmedSpells = [...flatSpells];
  while (
    trimmedSpells.length > 0 &&
    trimmedSpells[trimmedSpells.length - 1].trim() === ""
  ) {
    trimmedSpells.pop();
  }

  return (
    <div className="-mt-10 mb-6">
      <div className="bg-gray-100 border border-gray-300 rounded-md p-4 max-h-[300px]">

        <div className="grid grid-cols-2 gap-3 h-full">
          <NotebookBox
            title="Cantrips"
            values={character.cantrips}
            onChange={(index, text) => onUpdateCantrip(index, text)}
          />

          <NotebookBox
            title="Spells"
            values={trimmedSpells}
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

      </div>
    </div>
  );
}