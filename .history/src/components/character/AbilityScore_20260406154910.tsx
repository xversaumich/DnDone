import { getModifier } from "../../logic/ability";

interface AbilityScoreProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export function AbilityScore({ label, value, onChange }: AbilityScoreProps) {
  const modifier = Number.isFinite(value) ? getModifier(value) : 0;

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
        className="bg-gray-100 border border-gray-300 rounded-md aspect-square flex items-center justify-center my-1"
        style={{ width: "70%" }}
      >

        {/* Number input WITH ARROWS but visually formatted as +X */}
        <input
          type="number"
          value={modifier}
          onChange={(e) => {
            const newMod = Number(e.target.value);
            const newScore = newMod * 2 + 10;
            onChange(newScore);
          }}
          className="text-center border border-gray-400 rounded text-black leading-none"
          style={{
            width: "100%",
            height: "100%",
            fontSize: "22px",
            fontWeight: 600,
            appearance: "textfield",
          }}
        />

        {/* Overlay the + sign visually */}
        <div
          className="pointer-events-none absolute text-black"
          style={{
            fontSize: "22px",
            fontWeight: 600,
          }}
        >
          {modifier >= 0 ? `+${modifier}` : modifier}
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