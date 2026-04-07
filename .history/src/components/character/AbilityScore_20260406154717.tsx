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

      {/* Label tight to top — thicker */}
      <span
        className="text-black leading-none mt-0.5"
        style={{ fontSize: "10px", fontWeight: 700 }}
      >
        {label}
      </span>

      {/* Smaller centered gray perfect square */}
      <div
        className="bg-gray-100 border border-gray-300 rounded-md aspect-square flex items-center justify-center my-1"
        style={{ width: "70%" }}
      >

        {/* BIG modifier text that fills the gray box */}
        <input
          type="text"
          value={displayMod}
          onChange={(e) => {
            const raw = e.target.value.replace("+", "");
            const newMod = Number(raw);

            if (!isNaN(newMod)) {
              const newScore = newMod * 2 + 10;
              onChange(newScore);
            }
          }}
          className="text-center border border-gray-400 rounded text-black leading-none"
          style={{
            width: "100%",
            height: "100%",
            fontSize: "22px",
            fontWeight: 600,
          }}
        />
      </div>

      {/* Bottom number tight to bottom — thicker */}
      <span
        className="text-black leading-none mb-0.5"
        style={{ fontSize: "10px", fontWeight: 700 }}
      >
        {value}
      </span>
    </div>
  );
}