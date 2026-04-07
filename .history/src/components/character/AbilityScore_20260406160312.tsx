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
    <div className="bg-white border border-gray-400 rounded-lg flex flex-col items-center aspect-square p-1 relative">

      {/* Label */}
      <span
        className="text-black leading-none mt-0.5"
        style={{ fontSize: "10px", fontWeight: 700 }}
      >
        {label}
      </span>

      {/* Centered gray box */}
      <div
        className="relative flex items-center justify-center w-full"
        style={{ height: "70%" }}
      >
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

        {/* + / − buttons positioned ONLY in the white box */}
        <div
          className="absolute flex flex-col"
          style={{
            right: "-4px",   
            top: "50%",
            transform: "translateY(-50%)",
            gap: "3px",
          }}
        >
          <button
            type="button"
            onClick={() => updateFromMod(modifier + 1)}
            className="border border-gray-400 rounded text-black leading-none"
            style={{
              width: "16px",
              height: "14px",
              fontSize: "10px",
              fontWeight: 700,
              padding: 0,
              lineHeight: "10px",
            }}
          >
            +
          </button>
          <button
            type="button"
            onClick={() => updateFromMod(modifier - 1)}
            className="border border-gray-400 rounded text-black leading-none"
            style={{
              width: "16px",
              height: "14px",
              fontSize: "10px",
              fontWeight: 700,
              padding: 0,
              lineHeight: "10px",
            }}
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