export function NotebookBox({
  title,
  values,
  onChange,
}: {
  title: string;
  values: string[];
  onChange: (index: number, text: string) => void;
}) {
  let displayValues = [...values];

  // Trim trailing empty values
  while (
    displayValues.length > 0 &&
    displayValues[displayValues.length - 1].trim() === ""
  ) {
    displayValues.pop();
  }

  // Ensure at least 4 inputs
  while (displayValues.length < 4) {
    displayValues.push("");
  }

  // Auto-add a new empty input if all visible ones are filled
  const allFilled = displayValues.every((v) => v.trim() !== "");
  if (allFilled) {
    displayValues.push("");
  }

  return (
    <div className="relative w-full h-full bg-white border border-amber-700 rounded-md p-3 flex flex-col min-h-0">
      <h3 className="text-black font-semibold text-base mb-2">
        {title}
      </h3>

      {/* scrolls inside, never outside */}
      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-2 pr-1">
        {displayValues.map((val, i) => (
          <input
            key={i}
            type="text"
            value={val}
            onChange={(e) => onChange(i, e.target.value)}
            className="
              w-full
              border border-gray-400
              rounded
              px-2 py-1
              text-sm
              text-black
              bg-white
              focus:outline-none
              focus:ring-2
              focus:ring-amber-600
            "
          />
        ))}
      </div>
    </div>
  );
}