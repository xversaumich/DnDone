interface StatBoxProps {
  label: string;
  value: number | string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}

export function StatBox({ label, value, onChange, readOnly = false }: StatBoxProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-muted-foreground uppercase">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        readOnly={readOnly}
        className="w-full px-2.5 py-1 bg-input-background border border-border rounded-md text-center disabled:opacity-50"
        disabled={readOnly}
      />
    </div>
  );
}