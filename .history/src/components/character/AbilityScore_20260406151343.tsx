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
    <div className="bg-white border border-gray-400 rounded-lg p-2 flex flex-col items-center aspect-square">

      {/* Black label ABOVE gray box */}
      <span className="text-black text-sm font-semibold mb-1">{label}</span>

      {/* Gray inner box */}
      <div className="bg-gray-100 border border-gray-300 rounded-md w-full flex flex-col items-center py-1">

        {/* Modifier input */}
        <input
          type="number"
          value={modifier}
          onChange={(e) => {
            const newMod = Number(e.target.value);
            const newScore = newMod * 2 + 10;
            onChange(newScore);
          }}
          className="w-12 text-center border border-gray-400 rounded text-black text-sm"
        />
      </div>

      {/* Score number at bottom */}
      <span className="mt-1 text-black text-sm">{value}</span>
    </div>
  );
}