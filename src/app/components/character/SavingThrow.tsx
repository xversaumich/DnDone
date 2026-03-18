interface SavingThrowProps {
  name: string;
  proficient: boolean;
  modifier: number;
  proficiencyBonus: number;
}

export function SavingThrow({ name, proficient, modifier, proficiencyBonus }: SavingThrowProps) {
  const totalModifier = modifier + (proficient ? proficiencyBonus : 0);
  const modifierString = totalModifier >= 0 ? `+${totalModifier}` : `${totalModifier}`;

  return (
    <div className="flex items-center gap-2 p-2 bg-accent/30 rounded-md">
      <div className={`w-3 h-3 rounded-full border-2 ${proficient ? 'bg-amber-700 border-amber-700' : 'border-border'}`} />
      <div className="flex-1 flex items-center justify-between">
        <span className="text-sm">{name}</span>
        <span className="text-sm font-medium min-w-[2.5rem] text-right">{modifierString}</span>
      </div>
    </div>
  );
}
