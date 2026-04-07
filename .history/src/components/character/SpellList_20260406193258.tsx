import { useState } from 'react';

interface SpellSlot {
  total: number;
  expended: number;
}

interface Spell {
  name: string;
  prepared: boolean;
}

interface SpellListProps {
  cantrips: string[];
  spellSlots: SpellSlot[];
  spellsByLevel: Spell[][];
  onUpdateCantrip: (index: number, value: string) => void;
  onUpdateSpell: (level: number, index: number, name: string) => void;
  onTogglePrepared: (level: number, index: number) => void;
  onUpdateSlots: (level: number, field: 'total' | 'expended', value: number) => void;
  onlyCantrips?: boolean;
}


export function SpellList({
  cantrips,
  spellSlots,
  spellsByLevel,
  onUpdateCantrip,
  onUpdateSpell,
  onTogglePrepared,
  onUpdateSlots,
}: SpellListProps) {
  return (
    <div className="space-y-4">
      {/* Cantrips */}
      <div>
        <h3 className="text-sm font-medium text-amber-900 mb-2 border-b border-amber-700 pb-1">Cantrips</h3>
        <div className="space-y-1">
          {cantrips.map((cantrip, index) => (
            <input
              key={index}
              type="text"
              value={cantrip}
              onChange={(e) => onUpdateCantrip(index, e.target.value)}
              className="w-full px-2 py-1 text-sm bg-input-background border border-border rounded"
              placeholder={`Cantrip ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Spell Levels 1-9 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
          <div key={level} className="border border-amber-700 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-amber-900">Level {level}</h3>
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Total:</span>
                  <input
                    type="number"
                    value={spellSlots[level - 1]?.total || 0}
                    onChange={(e) => onUpdateSlots(level - 1, 'total', parseInt(e.target.value) || 0)}
                    className="w-12 px-1 py-0.5 text-center bg-input-background border border-border rounded"
                    min="0"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Used:</span>
                  <input
                    type="number"
                    value={spellSlots[level - 1]?.expended || 0}
                    onChange={(e) => onUpdateSlots(level - 1, 'expended', parseInt(e.target.value) || 0)}
                    className="w-12 px-1 py-0.5 text-center bg-input-background border border-border rounded"
                    min="0"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-1">
              {spellsByLevel[level - 1]?.map((spell, index) => (
                <div key={index} className="flex items-center gap-1">
                  <input
                    type="radio"
                    checked={spell.prepared}
                    onChange={() => onTogglePrepared(level - 1, index)}
                    className="w-3 h-3 accent-amber-700 cursor-pointer flex-shrink-0"
                    title={spell.prepared ? "Prepared" : "Known"}
                  />
                  <input
                    type="text"
                    value={spell.name}
                    onChange={(e) => onUpdateSpell(level - 1, index, e.target.value)}
                    className="flex-1 px-2 py-0.5 text-xs bg-input-background border border-border rounded"
                    placeholder={`Spell ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
