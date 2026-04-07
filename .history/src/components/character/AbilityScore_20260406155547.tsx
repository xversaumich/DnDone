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

      {/* Label */}
      <span
        className="text-black leading-none mt-0.5"
        style={{ fontSize: "10px", fontWeight: 700 }}
      >
        {label}
      </span>

      {/* Gray square */}
      <div
        className="relative bg-gray-100 border border-gray-300 rounded-md aspect-square flex items-center justify-center my-1"
        style={{ width: "70%" }}
      >

        {/* REAL number input */}
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
            color: "transparent",     // hide ghost number
            caretColor: "black",
            fontSize: "22px",
            fontWeight: 600,
            background: "transparent",
            paddingRight: "30px",     // space for arrows
          }}
        />

        {/* +X overlay centered */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center text-black"
          style={{
            fontSize: "22px",
            fontWeight: 600,
          }}
        >
          {displayMod}
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