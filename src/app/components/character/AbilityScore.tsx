interface AbilityScoreProps {
  name: string;
  score: number;
  onChange: (score: number) => void;
}

export function AbilityScore({ name, score, onChange }: AbilityScoreProps) {
  const modifier = Math.floor((score - 10) / 2);
  const modifierString = modifier >= 0 ? `+${modifier}` : `${modifier}`;

  return (
    <div className="flex flex-col items-center gap-2 p-4 bg-card border border-border rounded-lg">
      <label className="text-sm text-muted-foreground uppercase">{name}</label>
      <input
        type="number"
        value={score}
        onChange={(e) => onChange(parseInt(e.target.value) || 10)}
        className="w-16 h-16 text-center text-2xl bg-input-background border border-border rounded-md"
        min="1"
        max="30"
      />
      <div className="text-xl">{modifierString}</div>
    </div>
  );
}
