import { useState } from "react"
import { Character } from "../../models/Character"
import { getMaxSpellLevel } from "../../logic/ability"
import { NotebookBox } from "./notebookBox"

interface SpellSectionProps {
  character: Character
  onUpdateCantrip: (index: number, value: string) => void
  onUpdateSpell: (level: number, index: number, name: string) => void
  onTogglePrepared: (level: number, index: number) => void
  onUpdateSlots: (level: number, field: 'total' | 'expended', value: number) => void
}

export function SpellSection({
  character,
  onUpdateCantrip,
  onUpdateSpell,
  onTogglePrepared,
  onUpdateSlots,
}: SpellSectionProps) {

  // controls dropdown open state
  const [open, setOpen] = useState(false)

  const maxSpellLevel = getMaxSpellLevel(character.level)

  return (
    <div className="-mt-1 mb-6">

      {/* label + icon with full underline */}
      <div className="flex items-center justify-between border-b-2 border-amber-700 pb-1 mb-2">
        <h2 className="text-amber-900">Spellcasting</h2>

        <button
          onClick={() => setOpen(!open)}
          className="text-amber-900 text-xl"
        >
          ≡
        </button>
      </div>

      {/* fixed space that never changes height */}
      <div className="h-[245px]">

        {/* only show content when open */}
        {open && (
          <div className="bg-gray-100 border border-gray-300 rounded-md p-4 h-full overflow-y-auto">

            <div className="space-y-4">

              {/* Cantrips */}
              <div>
                <NotebookBox
                  title="Cantrips"
                  values={character.cantrips}
                  onChange={(index, text) => onUpdateCantrip(index, text)}
                />
              </div>

              {/* Spell Levels 1-9 */}
              {Array.from({ length: 9 }, (_, i) => i + 1).map((level) => {
                const isAvailable = level <= maxSpellLevel
                const spells = character.spellsByLevel[level - 1] || []
                const slots = character.spellSlots[level - 1] || { total: 0, expended: 0 }

                return (
                  <div key={level} className={isAvailable ? "" : "opacity-50"}>
                    <div className="bg-white border border-amber-700 rounded-md p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-black font-semibold text-base">
                          {level}{level === 1 ? 'st' : level === 2 ? 'nd' : level === 3 ? 'rd' : 'th'} Level Spells
                        </h3>
                        {isAvailable && (
                          <div className="flex items-center gap-2 text-sm">
                            <span>Slots:</span>
                            <input
                              type="number"
                              min="0"
                              max="20"
                              value={slots.total}
                              onChange={(e) => onUpdateSlots(level - 1, 'total', parseInt(e.target.value) || 0)}
                              className="w-12 border border-gray-400 rounded px-1 py-0.5 text-xs"
                            />
                            <span>/</span>
                            <input
                              type="number"
                              min="0"
                              max={slots.total}
                              value={slots.expended}
                              onChange={(e) => onUpdateSlots(level - 1, 'expended', parseInt(e.target.value) || 0)}
                              className="w-12 border border-gray-400 rounded px-1 py-0.5 text-xs"
                            />
                          </div>
                        )}
                      </div>

                      {isAvailable ? (
                        <div className="space-y-2">
                          {spells.map((spell, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={spell.prepared}
                                onChange={() => onTogglePrepared(level - 1, index)}
                                className="w-4 h-4 rounded border-gray-400 accent-amber-700"
                              />
                              <input
                                type="text"
                                value={spell.name}
                                onChange={(e) => onUpdateSpell(level - 1, index, e.target.value)}
                                placeholder={`Spell ${index + 1}`}
                                className="flex-1 border border-gray-400 rounded px-2 py-1 text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm italic">
                          Unlocks at character level {level === 1 ? 1 : (level - 1) * 2 + 1}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}

            </div>
          </div>
        )}

      </div>
    </div>
  )
}