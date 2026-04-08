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

  // controls dropdown open/closed
  const [open, setOpen] = useState(false)

  // flatten spells
  const flatSpells = character.spellsByLevel.flatMap((level) =>
    level.map((s) => s.name)
  )

  // trim trailing empty spells
  const trimmedSpells = [...flatSpells]
  while (
    trimmedSpells.length > 0 &&
    trimmedSpells[trimmedSpells.length - 1].trim() === ""
  ) {
    trimmedSpells.pop()
  }

  return (
    <div className="-mt-1 mb-6">

      {/* Spellcasting label stays exactly the same */}
      <h2
        className="text-amber-900 mb-2 border-b-2 border-amber-700 pb-1 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        Spellcasting
      </h2>

      {/* Dropdown container */}
      <div
        className={`
          bg-gray-100 border border-gray-300 rounded-md p-4 
          transition-all duration-300 overflow-hidden
          ${open ? "h-[245px]" : "h-0 p-0 border-0"}
        `}
      >
        {open && (
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