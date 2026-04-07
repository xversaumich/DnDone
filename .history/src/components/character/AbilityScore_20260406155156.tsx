import { getModifier } from "../../logic/ability";

interface AbilityScoreProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export function AbilityScore({ label, value, onChange }: AbilityScoreProps) {
  const modifier = Number.isFinite(value) ? getModifier(value) : 0;

  const displayMod = modifier >= 0 ? `+${modifier}` : `${modifier}`;

  return (
    <div className="bg-white border border-gray-400 rounded-lg flex flex-col items-center aspect-square p-1">

      {/* Label tight to top */}
      <span
        className="text-black leading-none mt-0.5"
        style={{ fontSize: "10px", fontWeight: 700 }}
      >
        {label}
      </span>

      {/* Smaller centered gray perfect square */}
      <div
        className="relative bg-gray-100 border border-gray-300 rounded-md aspect-square flex items-center justify-center my-1"
        style={{ width: "70%" }}
      >

        {/* REAL number input (arrows) but text is invisible */}
        <input
          type="number"
          value={modifier}
          onChange={(e) => {
            const newMod = Number(e.target.value);
            const newScore = newMod * 2 + 10;
            onChange(newScore);
          }}
          className="absolute inset-0 w-full h-full text-center border border-gray-400 rounded"
          style={{
            color: "transparent",
            caretColor: "black",
            fontSize: "22px",
            fontWeight: 600,
            background: "transparent",
            paddingRight: "26px",   // ← more space for arrows
          }}
        />

        {/* Visible +X overlay shifted right */}
        <div
          className="pointer-events-none text-black flex items-center absolute inset-y-0"
          style={{
            right: "28%",            // ← moves +X to the right
            fontSize: "22px",
            fontWeight: 600,
          }}
        >
          {displayMod}
        </div>
      </div>

      {/* Bottom number tight to bottom */}
      <span
        className="text-black leading-none mb-0.5"
        style={{ fontSize: "10px", fontWeight: 700 }}
      >
        {value}
      </span>
    </div>
  );
}