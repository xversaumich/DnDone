import { Scroll, Sparkles } from 'lucide-react';

interface CharacterPortraitSectionProps {
  onGeneratePortrait: () => void;
}

export function CharacterPortraitSection({ onGeneratePortrait }: CharacterPortraitSectionProps) {
  return (
    <div>
      <h2 className="text-amber-900 mb-4 border-b-2 border-amber-700 pb-2">Character Portrait</h2>
      <div className="flex flex-col items-center gap-3">
        <div className="w-full aspect-[3/4] bg-gradient-to-br from-amber-100 to-stone-200 border-2 border-amber-700 rounded-lg flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Scroll className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Portrait will appear here</p>
          </div>
        </div>
        <button
          className="w-full px-4 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800 transition-colors flex items-center justify-center gap-2"
          onClick={onGeneratePortrait}
        >
          <Sparkles className="w-4 h-4" />
          Generate Portrait
        </button>
      </div>
    </div>
  );
}
