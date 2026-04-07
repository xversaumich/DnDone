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

      {/* ⭐ Single gray box, same look AND height as Ability Scores */}
      <div
        className="bg-gray-100 border border-gray-300 rounded-md p-3"
        style={{
          height: "200px",        // ← matches Ability Scores box height
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >

        {/* Column of checkboxes */}
        <div className="flex flex-col gap-2">
          {AVAILABLE_SKILLS.map(skill => (
            <label
              key={skill}
              className="flex items-center gap-2 text-black text-sm"
            >
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
  );
}