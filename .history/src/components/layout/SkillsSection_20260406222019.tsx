import { getModifier } from "../../logic/ability";
import { Character } from "../../models/Character";

interface SkillsSectionProps {
  character: Character;
  skills: Record<string, boolean>;
  onToggleSkill: (skillName: string) => void;
  proficiencyBonus: number;
}

const SKILL_DATA = [
  { name: "Acrobatics", ability: "DEX" },
  { name: "Animal Handling", ability: "WIS" },
  { name: "Arcana", ability: "INT" },
  { name: "Athletics", ability: "STR" },
  { name: "Deception", ability: "CHA" },
  { name: "History", ability: "INT" },
  // ⭐ Add more skills later — the box will scroll, not grow
];

export function SkillsSection({
  character,
  skills,
  onToggleSkill,
  proficiencyBonus
}: SkillsSectionProps) {
  return (
    <div className="mb-6 self-start w-full">

      <h2 className="text-amber-900 mb-4 border-b-2 border-amber-700 pb-2 w-full">
        Skills
      </h2>

      {/* ⭐ Fixed height + scrollable */}
      <div className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 
                      h-[250px] overflow-y-auto">

        <div className="flex flex-col gap-3">
          {SKILL_DATA.map(({ name, ability }) => {
            const abilityKey = ability.toLowerCase() as keyof Character["abilityScores"];

            const rawScore = character.abilityScores?.[abilityKey];
            const safeScore = Number.isFinite(rawScore) ? rawScore : 10;

            const baseMod = getModifier(safeScore);
            const safeProficiency = Number.isFinite(proficiencyBonus) ? proficiencyBonus : 0;

            const totalMod = skills[name]
              ? baseMod + safeProficiency
              : baseMod;

            const modString = totalMod >= 0 ? `+${totalMod}` : `${totalMod}`;

            return (
              <div
                key={name}
                className="flex items-center justify-between text-black text-sm"
              >
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={skills[name] || false}
                    onChange={() => onToggleSkill(name)}
                    className="w-4 h-4 rounded border-gray-400 accent-amber-700 cursor-pointer"
                  />
                  {name} <span className="text-gray-500 text-xs">({ability})</span>
                </label>

                <span className="text-xs font-semibold text-gray-700">
                  {modString}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}