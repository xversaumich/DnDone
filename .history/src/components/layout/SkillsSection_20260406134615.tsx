import { SkillItem } from '../character/SkillItem';
import { SKILLS } from '../../logic/skills';
import { getModifier } from '../../logic/ability';
import { Character } from '../../models/Character';

interface SkillsSectionProps {
  character: Character;
  proficiencyBonus: number;
  getSkillSource: (skillName: string) => string | null;
  onToggleSkill: (skillName: string) => void;
}

export function SkillsSection({
  character,
  proficiencyBonus,
  getSkillSource,
  onToggleSkill,
}: SkillsSectionProps) {
  return (
    <div className="mb-6">
      <h2 className="text-amber-900 mb-4 border-b-2 border-amber-700 pb-2">Skills</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SKILLS.map(skill => (
          <SkillItem
            key={skill.name}
            skill={skill}
            modifier={getModifier(character.abilityScores[skill.ability.toLowerCase() as keyof Character['abilityScores']])}
            proficiencyBonus={proficiencyBonus}
            isProficient={character.skills[skill.name] || false}
            source={getSkillSource(skill.name)}
            onToggle={() => onToggleSkill(skill.name)}
          />
        ))}
      </div>
    </div>
  );
}