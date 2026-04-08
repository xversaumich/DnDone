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

  // flatten all spells into one list
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

      {/* hamburger button to open and close */}
      <button
        onClick={() => setOpen(!open)}
        className="text-amber-900 text-xl mb-2"
      >
        ≡
      </button>

      {/* dropdown area */}
      <div
        className={`
          bg-gray-100 border border-gray-300 rounded-md
          transition-all duration-300 overflow-hidden
          ${open ? "p-4 h-[245px]" : "h-0 p-0 border-0"}
        `}
      >
        {/* only show content when open */}
        {open && (
          <div className="grid grid-cols-2 gap-3 h-full">

            {/* cantrips box */}
            <NotebookBox
              title="Cantrips"
              values={character.cantrips}
              onChange={(index, text) => onUpdateCantrip(index, text)}
            />

            {/* spells box */}
            <NotebookBox
              title="Spells"
              values={trimmedSpells}
              onChange={(flatIndex, text) => {
                // find the correct spell level and index
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
        )}
      </div>
    </div>
  )
}