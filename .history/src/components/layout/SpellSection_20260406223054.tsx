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
    <div className="-mt-8 mb-6">
      {/* moved entire section up, including label */}

      <h2 className="text-amber-900 mb-3 border-b-2 border-amber-700 pb-1">
        Spellcasting
      </h2>

      <div className="bg-gray-100 border border-gray-300 rounded-md p-4 max-h-[300px]">
        {/* gray box can now be taller */}

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