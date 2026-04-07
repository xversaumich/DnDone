import { getModifier } from "../../logic/ability";
import { Character } from "../../models/Character";

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
    <div className="mb-6 self-start">

      <h2 className="text-amber-900 mb-4 border-b-2 border-amber-700 pb-2">
        Skills
      </h2>

      {/* ⭐ EXACT same size as Ability Scores box */}
      <div
        className="bg-gray-100 border border-gray-300 rounded-md p-3 self-start"
        style={{
          height: "HEIGHT_HERE",       // ← replace with exact pixel height
          width: "HEIGHT_HERE",        // ← keeps it a perfect square
          transform: "scale(0.94)",    // matches Ability Scores scaling
          transformOrigin: "top left",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >

        <div className="flex flex-col gap-3">
          {SKILL_DATA.map(({ name, ability }) => {
            const abilityKey = ability.toLowerCase() as keyof Character["abilityScores"];
            const mod = getModifier(character.abilityScores[abilityKey]);
            const modString = mod >= 0 ? `+${mod}` : `${mod}`;

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
                  {name}
                </label>

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