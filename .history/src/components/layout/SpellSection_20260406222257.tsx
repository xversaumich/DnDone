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

  // Flatten spells
  const flatSpells = character.spellsByLevel.flatMap((level) =>
    level.map((s) => s.name)
  );

  // Trim trailing empty spells
  const trimmedSpells = [...flatSpells];
  while (
    trimmedSpells.length > 0 &&
    trimmedSpells[trimmedSpells.length - 1].trim() === ""
  ) {
    trimmedSpells.pop();
  }

  return (
    <div className="-mt-3 mb-6">
      {/* gray container like other sections */}
      <div className="bg-gray-100 border border-gray-300 rounded-md p-4">

        {/* two notebook boxes closer together */}
        <div className="grid grid-cols-2 gap-3">

          {/* cantrips */}
          <NotebookBox
            title="Cantrips"
            values={character.cantrips}
            onChange={(index, text) => onUpdateCantrip(index, text)}
          />

          {/* spells */}
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