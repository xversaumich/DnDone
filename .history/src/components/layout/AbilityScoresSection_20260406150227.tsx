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
      <span className="text-lg font-bold text-red-900">{label}</span>

      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-16 text-center mt-2 border border-gray-400 rounded"
      />

      <span className="mt-1 text-sm text-gray-700">{modString}</span>
    </div>
  );
}