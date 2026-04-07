interface StatBoxProps {
  label: string;
  value: number | string | null | undefined;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}

export function StatBox({ label, value, onChange, readOnly = false }: StatBoxProps) {
  // Convert 0, null, undefined into an empty string for display
  const displayValue =
    value === 0 || value === null || value === undefined ? "" : value;

  const isSpeed = label.toLowerCase() === "speed";

  return (
    <div className="flex flex-col gap-0.5">
      <label className="text-xs text-black uppercase">{label}</label>

      {isSpeed ? (
        // Special layout for SPEED with "ft" on the right
        <div className="relative w-full">
          <input
            type="text"
            value={displayValue}
            onChange={(e) => onChange?.(e.target.value)}
            readOnly={readOnly}
            className="w-full pr-8 pl-2.5 py-1 bg-input-background border border-border rounded-md text-left disabled:opacity-50"
            disabled={readOnly}
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-black">
            ft
          </span>
        </div>
      ) : (
        <input
          type="text"
          value={displayValue}
          onChange={(e) => onChange?.(e.target.value)}
          readOnly={readOnly}
          className="w-full px-2.5 py-1 bg-input-background border border-border rounded-md text-center disabled:opacity-50"
          disabled={readOnly}
        />
      )}
    </div>
  );
}