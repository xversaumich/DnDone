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
    <div className="bg-white border border-gray-400 rounded-lg flex flex-col items-center aspect-square p-1 relative">

      {/* Label */}
      <span
        className="text-black leading-none mt-0.5"
        style={{ fontSize: "10px", fontWeight: 700 }}
      >
        {label}
      </span>

      {/* Row: gray box + arrows */}
      <div className="flex items-center justify-center w-full relative" style={{ gap: "4px" }}>

        {/* Gray perfect square */}
        <div
          className="relative bg-gray-100 border border-gray-300 rounded-md aspect-square flex items-center justify-center"
          style={{ width: "70%" }}
        >
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

        {/* ARROWS ONLY input (transparent text) */}
        <input
          type="number"
          value={modifier}
          onChange={(e) => {
            const newMod = Number(e.target.value);
            const newScore = newMod * 2 + 10;
            onChange(newScore);
          }}
          className="border border-gray-400 rounded"
          style={{
            width: "28px",          
            height: "28px",
            color: "transparent",   
            background: "transparent",
            fontSize: "1px",        
            padding: 0,
            margin: 0,
          }}
        />
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