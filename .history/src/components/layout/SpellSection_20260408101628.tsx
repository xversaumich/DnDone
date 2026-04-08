import { useState } from "react"
import { Character } from "../../models/Character"
import { NotebookBox } from "./notebookBox"

interface SpellSectionProps {
  character: Character
  onUpdateCantrip: (index: number, value: string) => void
  onUpdateSpell: (level: number, index: number, name: string) => void
}

export function SpellSection({
  character,
  onUpdateCantrip,
  onUpdateSpell,
}: SpellSectionProps) {

  // controls if the dropdown is open
  const [open, setOpen] = useState(false)

  // flatten spells
  const flatSpells = character.spellsByLevel.flatMap((level) =>
    level.map((s) => s.name)
  )

  // remove empty spells at the end
  const trimmedSpells = [...flatSpells]
  while (
    trimmedSpells.length > 0 &&
    trimmedSpells[trimmedSpells.length - 1].trim() === ""
  ) {
    trimmedSpells.pop()
  }

  return (
    <div className="mb-6">

      {/* this button will be moved next to the label in the parent */}
      <button
        onClick={() => setOpen(!open)}
        className="text-amber-900 text-xl ml-2"
      >
        ≡
      </button>

      {/* only show the box when open */}
      {open && (
        <div className="bg-gray-100 border border-gray-300 rounded-md p-4 h-[245px] mt-2">

          <div className="grid grid-cols-2 gap-3 h-full">

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
                let index = 0
                character.spellsByLevel.forEach((level, levelIndex) => {
                  level.forEach((_, spellIndex) => {
                    if (index === flatIndex) {
                      onUpdateSpell(levelIndex, spellIndex, text)
                    }
                    index++
                  })
                })
              }}
            />

          </div>
        </div>
      )}

    </div>
  )
}