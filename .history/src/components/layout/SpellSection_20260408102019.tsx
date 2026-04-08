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

  // controls dropdown open state
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
    <div className="-mt-1 mb-6">

      {/* label and icon share the underline */}
      <div className="flex items-center justify-between border-b-2 border-amber-700 pb-1 mb-2">
        <h2 className="text-amber-900">
          Spellcasting
        </h2>

        {/* hamburger icon */}
        <button
          onClick={() => setOpen(!open)}
          className="text-amber-900 text-xl"
        >
          ≡
        </button>
      </div>

      {/* dropdown content */}
      {open && (
        <div className="bg-gray-100 border border-gray-300 rounded-md p-4 h-[245px]">

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