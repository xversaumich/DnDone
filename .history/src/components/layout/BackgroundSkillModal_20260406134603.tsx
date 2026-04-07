import { SKILLS } from '../../logic/skills';

interface BackgroundSkillModalProps {
  show: boolean;
  pendingBackground: string;
  conflictingSkills: string[];
  selectedSkills: string[];
  characterSkills: Record<string, boolean>;
  onToggleSkill: (skillName: string) => void;
  onConfirm: () => void;
}

export function BackgroundSkillModal({
  show,
  pendingBackground,
  conflictingSkills,
  selectedSkills,
  characterSkills,
  onToggleSkill,
  onConfirm,
}: BackgroundSkillModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border-2 border-amber-700 rounded-lg shadow-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">✨</span>
          </div>
          <h3 className="text-xl text-amber-900">Choose Replacement Skills</h3>
        </div>
        <p className="text-sm mb-4">
          Your {pendingBackground} background grants proficiency in {conflictingSkills.join(' and ')}, but you already have {conflictingSkills.length > 1 ? 'those' : 'that'}. Choose {conflictingSkills.length} different skill{conflictingSkills.length > 1 ? 's' : ''}:
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          Selected: {selectedSkills.length} / {conflictingSkills.length}
        </p>
        <div className="space-y-2 mb-6">
          {SKILLS.filter(skill => !characterSkills[skill.name]).map(skill => (
            <div
              key={skill.name}
              className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${
                selectedSkills.includes(skill.name)
                  ? 'bg-amber-100 border border-amber-700'
                  : 'bg-accent/30 hover:bg-accent/50'
              }`}
              onClick={() => onToggleSkill(skill.name)}
            >
              <input
                type="checkbox"
                checked={selectedSkills.includes(skill.name)}
                onChange={() => {}}
                className="w-4 h-4 rounded border-border accent-amber-700 cursor-pointer"
              />
              <span className="text-sm">{skill.name}</span>
              <span className="text-xs text-muted-foreground">({skill.ability})</span>
            </div>
          ))}
        </div>
        <button
          onClick={onConfirm}
          disabled={selectedSkills.length !== conflictingSkills.length}
          className="w-full px-4 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm Selection
        </button>
      </div>
    </div>
  );
}