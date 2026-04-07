import { getModifier } from "../../logic/ability";

interface SkillsSectionProps {
  character: Character;
  skills: Record<string, boolean>;
  onToggleSkill: (skillName: string) => void;
}

const SKILL_DATA = [
  { name: "Acrobatics", ability: "DEX" },
  { name: "Animal Handling", ability: "WIS" },
  { name: "Arcana", ability: "INT" },
  { name: "Athletics", ability: "STR" },
  { name: "Deception", ability: "CHA" },
  { name: "History", ability: "INT" },
];

export function SkillsSection({ character, skills, onToggleSkill }: SkillsSectionProps) {
  return (
    <div className="mb-6">

      {/* Header */}
      <h2 className="text-amber-900 mb-4 border-b-2 border-amber-700 pb-2">
        Skills
      </h2>

      {/* ⭐ One big gray box — same height + style as Ability Scores */}
      <div
        className="bg-gray-100 border border-gray-300 rounded-md aspect-square p-3"
        style={{
          transform: "scale(0.94)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >

        {/* Column of skill rows */}
        <div className="flex flex-col gap-2">
          {SKILL_DATA.map(({ name, ability }) => {
            const abilityKey = ability.toLowerCase() as keyof Character["abilityScores"];
            const mod = getModifier(character.abilityScores[abilityKey]);
            const modString = mod >= 0 ? `+${mod}` : `${mod}`;

            return (
              <div
                key={name}
                className="flex items-center justify-between text-black text-sm"
              >
                {/* Checkbox + skill name */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={skills[name] || false}
                    onChange={() => onToggleSkill(name)}
                    className="w-4 h-4 rounded border-gray-400 accent-amber-700 cursor-pointer"
                  />
                  {name}
                </label>

                {/* Ability + modifier */}
                <span className="text-xs font-semibold text-gray-700">
                  ({ability}) {modString}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}