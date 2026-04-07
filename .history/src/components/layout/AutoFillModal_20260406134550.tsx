interface AutoFillModalProps {
  show: boolean;
  pendingClass: string;
  onApply: () => void;
  onDecline: () => void;
}

export function AutoFillModal({ show, pendingClass, onApply, onDecline }: AutoFillModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border-2 border-amber-700 rounded-lg shadow-2xl p-6 max-w-md w-full">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">✨</span>
          </div>
          <h3 className="text-xl text-amber-900">Auto-fill Stats?</h3>
        </div>
        <p className="text-sm mb-6">
          Would you like to auto-fill your ability scores and skills with recommended stats for a {pendingClass}?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onApply}
            className="flex-1 px-4 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800 transition-colors"
          >
            Yes, auto-fill
          </button>
          <button
            onClick={onDecline}
            className="flex-1 px-4 py-2 bg-muted text-foreground rounded-md hover:bg-accent transition-colors"
          >
            No, I'll do it myself
          </button>
        </div>
      </div>
    </div>
  );
}