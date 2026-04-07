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
    <div
      className="bg-white border border-gray-400 rounded-lg flex flex-col items-center aspect-square relative"
      style={{
        padding: "4px",          // slightly smaller white box
        transform: "scale(0.94)" // subtle shrink without breaking layout
      }}
    >

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
        style={{ height: "75%" }}
      >
        <div
          className="relative bg-gray-100 border border-gray-300 rounded-md aspect-square flex items-center justify-center"
          style={{ width: "80%" }}
        >
          {/* Invisible input for typing + spinner */}
          <input
            type="number"
            value={modifier}
            onChange={(e) => updateFromMod(Number(e.target.value))}
            className="absolute inset-0 w-full h-full text-center"
            style={{
              color: "transparent",     
              background: "transparent",
              fontSize: "22px",
              fontWeight: 600,
              caretColor: "black",     
              paddingRight: "26px",    
            }}
          />

          {/* Visible +X overlay */}
          <span
            className="pointer-events-none absolute inset-0 flex items-center justify-center text-black"
            style={{ fontSize: "22px", fontWeight: 600 }}
          >
            {displayMod}
          </span>
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