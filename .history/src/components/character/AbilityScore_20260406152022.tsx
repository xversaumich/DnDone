import { getModifier } from "../../logic/ability";

interface AbilityScoreProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export function AbilityScore({ label, value, onChange }: AbilityScoreProps) {
  const modifier = Number.isFinite(value) ? getModifier(value) : 0;

  return (
    <div className="bg-white border border-gray-400 rounded-lg flex flex-col items-center aspect-square p-1">

      {/* Label tight to top */}
      <span className="text-black text-[10px] font-semibold leading-none mt-0.5">
        {label}
      </span>

      {/* Gray inner perfect square */}
      <div className="bg-gray-100 border border-gray-300 rounded-md w-full aspect-square flex flex-col items-center justify-center mt-0.5 mb-0.5">

        {/* Modifier input */}
        <input
          type="number"
          value={modifier}
          onChange={(e) => {
            const newMod = Number(e.target.value);
            const newScore = newMod * 2 + 10;
            onChange(newScore);
          }}
          className="w-10 text-center border border-gray-400 rounded text-black text-[10px] leading-none"
        />
      </div>

      {/* Score number tight to bottom */}
      <span className="text-black text-[10px] leading-none mb-0.5">
        {value}
      </span>
    </div>
  );
}