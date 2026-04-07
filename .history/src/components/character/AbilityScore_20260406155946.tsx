import { getModifier } from "../../logic/ability";

interface AbilityScoreProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export function AbilityScore({ label, value, onChange }: AbilityScoreProps) {
  const modifier = Number.isFinite(value) ? getModifier(value) : 0;
  const displayMod = modifier >= 0 ? `+${modifier}` : `${modifier}`;

  const updateFromMod = (newMod: number) => {
    const newScore = newMod * 2 + 10;
    onChange(newScore);
  };

  return (
    <div className="bg-white border border-gray-400 rounded-lg flex flex-col items-center aspect-square p-1">

      {/* Label */}
      <span
        className="text-black leading-none mt-0.5"
        style={{ fontSize: "10px", fontWeight: 700 }}
      >
        {label}
      </span>

      {/* Gray box + custom controls */}
      <div className="flex items-center justify-center w-full" style={{ gap: "4px" }}>
        {/* Gray perfect square with +X */}
        <div
          className="bg-gray-100 border border-gray-300 rounded-md aspect-square flex items-center justify-center"
          style={{ width: "70%" }}
        >
          <span
            className="text-black"
            style={{ fontSize: "22px", fontWeight: 600 }}
          >
            {displayMod}
          </span>
        </div>

        {/* Custom + / − buttons */}
        <div className="flex flex-col" style={{ gap: "2px" }}>
          <button
            type="button"
            onClick={() => updateFromMod(modifier + 1)}
            className="border border-gray-400 rounded text-black leading-none"
            style={{ width: "20px", height: "14px", fontSize: "12px", fontWeight: 700 }}
          >
            +
          </button>
          <button
            type="button"
            onClick={() => updateFromMod(modifier - 1)}
            className="border border-gray-400 rounded text-black leading-none"
            style={{ width: "20px", height: "14px", fontSize: "12px", fontWeight: 700 }}
          >
            −
          </button>
        </div>
      </div>

      {/* Bottom number */}
      <span
        className="text-black leading-none mb-0.5"
        style={{ fontSize: "10px", fontWeight: 700 }}
      >
        {value}
      </span>
    </div>
  );
}