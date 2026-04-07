import { SKILLS } from '../../logic/skills';

interface RaceSkillModalProps {
  show: boolean;
  pendingRace: string;
  requiredChoices: number;
  selectedSkills: string[];
  getSkillSource: (skillName: string) => string | null;
  onToggleSkill: (skillName: string) => void;
  onConfirm: () => void;
}

export function RaceSkillModal({
  show,
  pendingRace,
  requiredChoices,
  selectedSkills,
  getSkillSource,
  onToggleSkill,
  onConfirm,
}: RaceSkillModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border-2 border-amber-700 rounded-lg shadow-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">✨</span>
          </div>
          <h3 className="text-xl text-amber-900">Choose Skills</h3>
        </div>
        <p className="text-sm mb-4">
          As a {pendingRace}, choose {requiredChoices} skill{requiredChoices > 1 ? 's' : ''} to gain proficiency in:
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          Selected: {selectedSkills.length} / {requiredChoices}
        </p>
        <div className="space-y-2 mb-6">
          {SKILLS.map(skill => {
            const skillSource = getSkillSource(skill.name);
            const isDisabled = !!skillSource;

            return (
              <div
                key={skill.name}
                className={`flex items-center gap-3 p-2 rounded-md transition-colors ${
                  isDisabled
                    ? 'bg-gray-200 cursor-not-allowed opacity-60'
                    : selectedSkills.includes(skill.name)
                    ? 'bg-amber-100 border border-amber-700 cursor-pointer'
                    : 'bg-accent/30 hover:bg-accent/50 cursor-pointer'
                }`}
                onClick={() => !isDisabled && onToggleSkill(skill.name)}
              >
                <input
                  type="checkbox"
                  checked={selectedSkills.includes(skill.name)}
                  onChange={() => {}}
                  disabled={isDisabled}
                  className="w-4 h-4 rounded border-border accent-amber-700 cursor-pointer disabled:opacity-50"
                />
                <div className="flex flex-col flex-1">
                  <span className="text-sm">{skill.name}</span>
                  <span className="text-xs text-muted-foreground">({skill.ability})</span>
                  {skillSource && (
                    <span className="text-xs text-gray-600 mt-1">Granted by {skillSource}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <button
          onClick={onConfirm}
          disabled={selectedSkills.length !== requiredChoices}
          className="w-full px-4 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm Selection
        </button>
      </div>
    </div>
  );
}