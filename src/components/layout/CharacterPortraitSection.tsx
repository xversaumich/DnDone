import { Scroll, Sparkles } from 'lucide-react';

interface CharacterPortraitSectionProps {
  onGeneratePortrait: () => void;
  portraitPrompt?: string;
  onPortraitPromptChange: (value: string) => void;
}

export function CharacterPortraitSection({
  onGeneratePortrait,
  portraitPrompt,
  onPortraitPromptChange,
}: CharacterPortraitSectionProps) {
  return (
    <section>
      <h2 className="text-amber-900 mb-4 border-b-2 border-amber-700 pb-2 w-full">Character Portrait</h2>
      

      <div className="border-2 border-[#C96A00] rounded-2xl bg-[#F5EFD8] p-6">
        <div className="rounded-xl border-2 border-[#C96A00] bg-[#F7F2E3] min-h-[160px] flex items-center justify-center mb-6">
          <div className="text-center text-[#8A8A8A]">
            <Scroll className="w-14 h-14 mx-auto mb-4 opacity-50" />
            <p className="text-2xl">Portrait will appear here</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onGeneratePortrait}
          className="w-full bg-[#C96A00] hover:bg-[#B55E00] text-white font-semibold text-xl py-4 rounded-xl transition-colors flex items-center justify-center gap-3 mb-6"
        >
          <Sparkles className="w-5 h-5" />
          Generate Portrait
        </button>

        {portraitPrompt && (
  <div className="mt-2">
    <div className="mb-2 text-base font-semibold text-[#5C4033]">
      Prompt Preview
    </div>

    <textarea
      value={portraitPrompt}
      onChange={(e) => onPortraitPromptChange(e.target.value)}
      className="w-full h-64 rounded-xl border-2 border-[#C96A00] bg-[#F7F2E3] p-4 text-sm text-[#333333] resize-none focus:outline-none"
    />
  </div>
)}
      </div>
    </section>
  );
}