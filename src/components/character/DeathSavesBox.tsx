interface DeathSavesBoxProps {
  successes: boolean[];
  failures: boolean[];
  onSuccessesChange: (successes: boolean[]) => void;
  onFailuresChange: (failures: boolean[]) => void;
}

export function DeathSavesBox({
  successes,
  failures,
  onSuccessesChange,
  onFailuresChange
}: DeathSavesBoxProps) {
  const handleSuccessToggle = (index: number) => {
    const newSuccesses = [...successes];
    newSuccesses[index] = !newSuccesses[index];
    onSuccessesChange(newSuccesses);
  };

  const handleFailureToggle = (index: number) => {
    const newFailures = [...failures];
    newFailures[index] = !newFailures[index];
    onFailuresChange(newFailures);
  };

  return (
    <div className="bg-input-background border border-border rounded-md p-3">
      <div className="flex items-center justify-between">
        {/* Successes */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-black uppercase">Death Saves (Successes)</label>
          <div className="flex gap-1">
            {[0, 1, 2].map((index) => (
              <label key={index} className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={successes[index] || false}
                  onChange={() => handleSuccessToggle(index)}
                  className="w-4 h-4 text-amber-700 focus:ring-amber-600 accent-amber-700"
                />
                <span className="text-sm text-black">{index + 1}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Failures */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-black uppercase">Death Saves (Failures)</label>
          <div className="flex gap-1">
            {[0, 1, 2].map((index) => (
              <label key={index} className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={failures[index] || false}
                  onChange={() => handleFailureToggle(index)}
                  className="w-4 h-4 text-amber-700 focus:ring-amber-600 accent-amber-700"
                />
                <span className="text-sm text-black">{index + 1}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}