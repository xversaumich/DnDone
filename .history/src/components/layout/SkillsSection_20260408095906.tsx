import { getModifier } from "../../logic/ability"
import { Character } from "../../models/Character"
import { SKILLS } from "../../logic/skills"   // use shared skills list

interface SkillsSectionProps {
  character: Character
  skills: Record<string, boolean>
  onToggleSkill: (skillName: string) => void
  proficiencyBonus: number
}

export function SkillsSection({
  character,
  skills,
  onToggleSkill,
  proficiencyBonus
}: SkillsSectionProps) {
  return (
    <div className="mb-6 self-start w-full">

      {/* section title */}
      <h2 className="text-amber-900 mb-4 border-b-2 border-amber-700 pb-2 w-full">
        Skills
      </h2>

      {/* fixed height box that scrolls */}
      <div className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 
                      h-[250px] overflow-y-auto">

        <div className="flex flex-col gap-3">

          {/* loop through all skills from shared file */}
          {SKILLS.map(({ name, ability, abilityKey }) => {

            // get the raw ability score
            const rawScore = character.abilityScores?.[abilityKey]

            // make sure the score is safe
            const safeScore = Number.isFinite(rawScore) ? rawScore : 10

            // base ability modifier
            const baseMod = getModifier(safeScore)

            // safe proficiency bonus
            const safeProficiency = Number.isFinite(proficiencyBonus)
              ? proficiencyBonus
              : 0

            // add proficiency if the skill is checked
            const totalMod = skills[name]
              ? baseMod + safeProficiency
              : baseMod

            // format the modifier
            const modString = totalMod >= 0 ? `+${totalMod}` : `${totalMod}`

            return (
              <div
                key={name}
                className="flex items-center justify-between text-black text-sm"
              >
                {/* checkbox and skill name */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={skills[name] || false}
                    onChange={() => onToggleSkill(name)}
                    className="w-4 h-4 rounded border-gray-400 accent-amber-700 cursor-pointer"
                  />
                  {name} <span className="text-gray-500 text-xs">({ability})</span>
                </label>

                {/* skill modifier */}
                <span className="text-xs font-semibold text-gray-700">
                  {modString}
                </span>
              </div>
            )
          })}

        </div>

      </div>
    </div>
  )
}