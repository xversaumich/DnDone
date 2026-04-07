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

      {/* Label (slightly bigger) */}
      <span
        className="text-black leading-none mt-0.5"
        style={{ fontSize: "12px", fontWeight: 700 }}
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

        {/* Small button box, centered inside itself, fully in the white box */}
        <div
          className="absolute flex items-center justify-center"
          style={{
            right: "-6px",          // sits fully in the white box
            top: "50%",
            transform: "translateY(-50%)",
            width: "22px",          // container stays same size
            height: "32px",
          }}
        >
          <div className="flex flex-col items-center justify-center" style={{ gap: "2px" }}>
            <button
              type="button"
              onClick={() => updateFromMod(modifier + 1)}
              className="border border-gray-400 rounded text-black leading-none"
              style={{
                width: "12px",       // smaller button
                height: "10px",      // smaller button
                fontSize: "8px",     // smaller text
                fontWeight: 700,
                padding: 0,
                lineHeight: "8px",
              }}
            >
              +
            </button>
            <button
              type="button"
              onClick={() => updateFromMod(modifier - 1)}
              className="border border-gray-400 rounded text-black leading-none"
              style={{
                width: "12px",       // smaller button
                height: "10px",      // smaller button
                fontSize: "8px",     // smaller text
                fontWeight: 700,
                padding: 0,
                lineHeight: "8px",
              }}
            >
              −
            </button>
          </div>
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