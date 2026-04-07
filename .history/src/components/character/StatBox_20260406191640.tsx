interface StatBoxProps {
  label: string;
  value: number | string | null | undefined;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}

export function StatBox({ label, value, onChange, readOnly = false }: StatBoxProps) {
  const displayValue =
    value === 0 || value === null || value === undefined ? "" : value;

  return (
    <div className="flex flex-col gap-0.5">
      <label className="text-xs text-black uppercase">{label}</label>
      <input
        type="text"
        value={displayValue}
        onChange={(e) => onChange?.(e.target.value)}
        readOnly={readOnly}
        className="w-full px-2.5 py-1 bg-input-background border border-border rounded-md text-center disabled:opacity-50"
        disabled={readOnly}
      />
    </div>
  );
}