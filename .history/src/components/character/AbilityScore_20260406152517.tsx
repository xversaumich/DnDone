import { getModifier } from "../../logic/ability";

interface AbilityScoreProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export function AbilityScore({ label, value, onChange }: AbilityScoreProps) {
  const modifier = Number.isFinite(value) ? getModifier(value) : 0;

  // Always show +X format
  const displayMod = modifier >= 0 ? `+${modifier}` : `${modifier}`;

  return (
    <div className="bg-white border border-gray-400 rounded-lg flex flex-col items-center aspect-square p-1">

      {/* Label tight to top */}
      <span className="text-black text-[10px] font-semibold leading-none mt-0.5">
        {label}
      </span>

      {/* Smaller centered gray perfect square */}
      <div className="bg-gray-100 border border-gray-300 rounded-md w-[70%] aspect-square flex flex-col items-center justify-center my-1">

        {/* Larger modifier input that fills the gray box */}
        <input
          type="text"
          value={displayMod}
          onChange={(e) => {
            // Strip + sign for math, but keep it in display
            const raw = e.target.value.replace("+", "");
            const newMod = Number(raw);

            if (!isNaN(newMod)) {
              const newScore = newMod * 2 + 10;
              onChange(newScore);
            }
          }}
          className="w-full h-full text-center border border-gray-400 rounded text-black text-sm font-semibold leading-none"
        />
      </div>

      {/* Score number tight to bottom */}
      <span className="text-black text-[10px] leading-none mb-0.5">
        {value}
      </span>
    </div>
  );
}