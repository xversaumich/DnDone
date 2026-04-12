import { getModifier } from "../../logic/ability";

interface AbilityScoreProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export function AbilityScore({ label, value, onChange }: AbilityScoreProps) {
  const modifier = Number.isFinite(value) ? getModifier(value) : 0;
  const displayMod = modifier >= 0 ? `+${modifier}` : `${modifier}`;

  const updateScore = (newScore: number) => {
    if (!Number.isFinite(newScore)) {
      return;
    }

    onChange(Math.trunc(newScore));
  };

  return (
    <div
      className="bg-white border border-gray-400 rounded-lg flex flex-col items-center aspect-square relative"
      style={{
        padding: "4px",
        transform: "scale(0.94)"
      }}
    >

      {/* Label */}
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
          style={{ width: "75%" }}
        >
          {/* Read-only modifier display derived from the ability score */}
          <span
            className="pointer-events-none absolute inset-0 flex items-center justify-center text-black"
            style={{ fontSize: "22px", fontWeight: 600 }}
          >
            {displayMod}
          </span>
        </div>
      </div>

      {/* Bottom ability score control */}
      <input
        type="number"
        value={value}
        onChange={(e) => updateScore(Number(e.target.value))}
        step={1}
        className="text-black leading-none mb-0.5 text-center bg-transparent"
        style={{ fontSize: "10px", fontWeight: 700, width: "50px" }}
      />
    </div>
  );
}