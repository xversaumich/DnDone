export function NotebookBox({
  title,
  value,
  onChange,
}: {
  title: string;
  value: string;
  onChange: (text: string) => void;
}) {
  return (
    <div className="relative w-full aspect-square max-w-[260px] bg-white border border-amber-700 rounded-md p-3 flex flex-col min-h-0">

      {/* Title */}
      <h3 className="text-black font-semibold mb-2 text-base z-10 relative bg-white">
        {title}
      </h3>

      {/* Scrollable notebook area */}
      <div
        className="
          relative
          flex-1
          min-h-0
          overflow-y-auto
          rounded-md
          bg-[repeating-linear-gradient(white,white_22px,black_23px)]
        "
      >
        {/* Label blocker */}
        <div className="absolute top-0 left-0 right-0 h-6 bg-white z-10 pointer-events-none"></div>

        <textarea
          className="
            w-full
            min-h-full
            bg-transparent
            resize-none
            outline-none
            px-3 pt-2 pb-2
            text-sm
            leading-[22px]
            block
          "
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}