interface SkillItemProps {
  name: string;
  ability: string;
  proficient: boolean;
  onToggle: () => void;
  modifier: number;
  proficiencyBonus: number;
}

export function SkillItem({
  name,
  ability,
  proficient,
  onToggle,
  modifier,
  proficiencyBonus
}: SkillItemProps) {
  const totalModifier = modifier + (proficient ? proficiencyBonus : 0);
  const modifierString = totalModifier >= 0 ? `+${totalModifier}` : `${totalModifier}`;

  return (
    <div className="bg-white border border-gray-400 rounded-lg p-2 flex flex-col">

      {/* Top row: name + ability + checkbox */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-black">{name}</span>
          <span className="text-xs text-gray-500">({ability})</span>
        </div>

        <input
          type="checkbox"
          checked={proficient}
          onChange={onToggle}
          className="w-4 h-4 rounded border-gray-400 accent-amber-700 cursor-pointer"
        />
      </div>

      {/* Gray inner box with modifier (matches Ability Score inner box) */}
      <div className="bg-gray-100 border border-gray-300 rounded-md flex items-center justify-center py-1">
        <span className="text-black text-lg font-bold">{modifierString}</span>
      </div>
    </div>
  );
}