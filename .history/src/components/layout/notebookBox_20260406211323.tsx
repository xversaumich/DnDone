export function NotebookBox({
  title,
  values,
  onChange,
}: {
  title: string;
  values: string[];
  onChange: (index: number, text: string) => void;
}) {
  return (
    <div className="w-full max-w-[260px] bg-white border border-amber-700 rounded-md p-3 flex flex-col gap-2">
      
      {/* Title */}
      <h3 className="text-black font-semibold text-base">
        {title}
      </h3>

      {/* Individual input fields */}
      <div className="flex flex-col gap-2">
        {values.map((val, i) => (
          <input
            key={i}
            type="text"
            value={val}
            onChange={(e) => onChange(i, e.target.value)}
            className="
              w-full
              border
              border-gray-400
              rounded
              px-2
              py-1
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