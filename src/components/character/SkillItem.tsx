interface SkillItemProps {
  name: string;
  ability: string;
  proficient: boolean;
  onToggle: () => void;
  modifier: number;
  proficiencyBonus: number;
}

export function SkillItem({ name, ability, proficient, onToggle, modifier, proficiencyBonus }: SkillItemProps) {
  const totalModifier = modifier + (proficient ? proficiencyBonus : 0);
  const modifierString = totalModifier >= 0 ? `+${totalModifier}` : `${totalModifier}`;

  return (
    <div className="flex items-center gap-3 p-2 hover:bg-accent/50 rounded-md transition-colors">
      <input
        type="checkbox"
        checked={proficient}
        onChange={onToggle}
        className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
      />
      <div className="flex-1 flex items-center justify-between">
        <div>
          <span className="text-sm">{name}</span>
          <span className="text-xs text-muted-foreground ml-2">({ability})</span>
        </div>
        <span className="text-sm font-medium min-w-[2.5rem] text-right">{modifierString}</span>
      </div>
    </div>
  );
}
