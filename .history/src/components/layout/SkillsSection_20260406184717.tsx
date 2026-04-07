import { getModifier } from "../../logic/ability";
import { Character } from "../../models/Character";
import { SkillItem } from "./SkillItem"; // ← make sure this path is correct

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
];

export function SkillsSection({
  character,
  skills,
  onToggleSkill,
  proficiencyBonus
}: SkillsSectionProps) {
  return (
    <div className="mb-6 self-start w-full">

      {/* Header */}
      <h2 className="text-amber-900 mb-4 border-b-2 border-amber-700 pb-2 w-full">
        Skills
      </h2>

      {/* Full-width wrapper */}
      <div className="w-full bg-gray-100 border border-gray-300 rounded-md p-3">

        <div className="grid grid-cols-1 gap-3">
          {SKILL_DATA.map(({ name, ability }) => {
            const abilityKey = ability.toLowerCase() as keyof Character["abilityScores"];
            const baseMod = getModifier(character.abilityScores[abilityKey]);

            return (
              <SkillItem
                key={name}
                name={name}
                ability={ability}
                proficient={skills[name] || false}
                onToggle={() => onToggleSkill(name)}
                modifier={baseMod}
                proficiencyBonus={proficiencyBonus}
              />
            );
          })}
        </div>

      </div>
    </div>
  );
}