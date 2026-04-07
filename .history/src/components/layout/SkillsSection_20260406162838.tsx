interface SkillsSectionProps {
  skills: Record<string, boolean>;
  onToggleSkill: (skillName: string) => void;
}

const AVAILABLE_SKILLS = [
  "Acrobatics",
  "Animal Handling",
  "Arcana",
  "Athletics",
  "Deception",
  "History",
];

export function SkillsSection({ skills, onToggleSkill }: SkillsSectionProps) {
  return (
    <div className="mb-6">

      {/* Header matches Ability Scores */}
      <h2 className="text-amber-900 mb-4 border-b-2 border-amber-700 pb-2">
        Skills
      </h2>

      {/* White outer box */}
      <div className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg">

        {/* Gray inner box */}
        <div className="bg-gray-100 border border-gray-300 rounded-md p-3">

          {/* Column of checkboxes */}
          <div className="flex flex-col gap-2">
            {AVAILABLE_SKILLS.map(skill => (
              <label key={skill} className="flex items-center gap-2 text-black text-sm">
                <input
                  type="checkbox"
                  checked={skills[skill] || false}
                  onChange={() => onToggleSkill(skill)}
                  className="w-4 h-4 rounded border-gray-400 accent-amber-700 cursor-pointer"
                />
                {skill}
              </label>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}