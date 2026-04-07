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
    <div className="w-full aspect-square max-w-[260px] bg-white border border-amber-700 rounded-md p-3 flex flex-col">

      <h3 className="text-black font-semibold mb-2 text-base">
        {title}
      </h3>

      {/* FIXED HEIGHT WRITING AREA */}
      <div
        className="
          w-full
          h-[calc(100%-2.5rem)]   /* header height removed */
          overflow-y-auto
          bg-[repeating-linear-gradient(white,white_22px,#e5e7eb_23px)]
          rounded-md
        "
      >
        <textarea
          className="
            w-full
            h-full
            bg-transparent
            resize-none
            outline-none
            px-3 py-2
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