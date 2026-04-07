import { getModifier } from "../../logic/ability";

interface AbilityScoreProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export function AbilityScore({ label, value, onChange }: AbilityScoreProps) {
  const modifier = Number.isFinite(value) ? getModifier(value) : 0;
  const modString = modifier >= 0 ? `+${modifier}` : `${modifier}`;

  return (
    <div className="bg-white border border-gray-400 rounded-lg p-3 flex flex-col items-center">

      {/* Gray inner box */}
      <div className="bg-gray-100 border border-gray-300 rounded-md w-full flex flex-col items-center py-2">

        {/* Label (colored) */}
        <span className="text-amber-900 font-bold text-lg">{label}</span>

        {/* Modifier input */}
        <input
          type="number"
          value={modifier}
          onChange={(e) => {
            const newMod = Number(e.target.value);
            const newScore = newMod * 2 + 10;
            onChange(newScore);
          }}
          className="w-16 text-center mt-2 border border-gray-400 rounded text-black"
        />
      </div>

      {/* Score number under the gray box */}
      <span className="mt-2 text-black text-lg">{value}</span>
    </div>
  );
}