import { useState } from 'react';

interface SpellSlot {
  total: number;
  expended: number;
}

interface Spell {
  name: string;
  prepared: boolean;
  level: number;
}

interface SpellListProps {
  cantrips: string[];
  spellSlots: SpellSlot[];
  spellsByLevel: Spell[][];
  onUpdateCantrip: (index: number, value: string) => void;
  onUpdateSpell: (level: number, index: number, name: string) => void;
  onTogglePrepared: (level: number, index: number) => void;
  onUpdateSlots: (level: number, field: 'total' | 'expended', value: number) => void;
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
  // Flatten spells by level into a single array with level info
  const allSpells = spellsByLevel.flatMap((spells, levelIndex) =>
    spells.map((spell, spellIndex) => ({
      ...spell,
      level: levelIndex + 1,
      originalLevelIndex: levelIndex,
      originalSpellIndex: spellIndex,
    }))
  );

  return (
    <div className="space-y-6">
      {/* Cantrips */}
      <div>
        <h3 className="text-lg font-semibold text-amber-900 mb-3 border-b border-amber-700 pb-2">Cantrips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {cantrips.map((cantrip, index) => (
            <input
              key={index}
              type="text"
              value={cantrip}
              onChange={(e) => onUpdateCantrip(index, e.target.value)}
              className="px-3 py-2 text-sm bg-input-background border border-border rounded-md"
              placeholder={`Cantrip ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Spells */}
      <div>
        <h3 className="text-lg font-semibold text-amber-900 mb-3 border-b border-amber-700 pb-2">Spells</h3>
        <div className="space-y-4">
          {/* Spell Slots */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
              <div key={level} className="border border-amber-700 rounded-lg p-3 bg-amber-50">
                <h4 className="text-sm font-medium text-amber-900 mb-2">Level {level}</h4>
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Total:</span>
                    <input
                      type="number"
                      value={spellSlots[level - 1]?.total || 0}
                      onChange={(e) => onUpdateSlots(level - 1, 'total', parseInt(e.target.value) || 0)}
                      className="w-12 px-1 py-0.5 text-center bg-white border border-border rounded"
                      min="0"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Used:</span>
                    <input
                      type="number"
                      value={spellSlots[level - 1]?.expended || 0}
                      onChange={(e) => onUpdateSlots(level - 1, 'expended', parseInt(e.target.value) || 0)}
                      className="w-12 px-1 py-0.5 text-center bg-white border border-border rounded"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Spell List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {allSpells.map((spell, index) => (
              <div key={index} className="flex items-center gap-2 p-2 border border-border rounded-md bg-white">
                <input
                  type="radio"
                  checked={spell.prepared}
                  onChange={() => onTogglePrepared(spell.originalLevelIndex, spell.originalSpellIndex)}
                  className="w-3 h-3 accent-amber-700 cursor-pointer flex-shrink-0"
                  title={spell.prepared ? "Prepared" : "Known"}
                />
                <span className="text-xs text-amber-700 font-medium bg-amber-100 px-1 py-0.5 rounded">
                  {spell.level}
                </span>
                <input
                  type="text"
                  value={spell.name}
                  onChange={(e) => onUpdateSpell(spell.originalLevelIndex, spell.originalSpellIndex, e.target.value)}
                  className="flex-1 px-2 py-1 text-sm bg-transparent border-none focus:outline-none"
                  placeholder={`Spell ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
