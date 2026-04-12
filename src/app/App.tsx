import { type ChangeEventHandler, useRef, useState } from 'react';

import { getModifier, getProficiencyBonus } from '../logic/ability';
import { CLASS_RECOMMENDATIONS, CLASS_SAVING_THROWS, type ClassRecommendations } from '../logic/class';
import { RACE_RECOMMENDATIONS } from '../logic/race';
import { BACKGROUND_RECOMMENDATIONS } from '../logic/backgrounds';
import { removeFeatureSection, rebuildSkills, getSkillSource, getSkillSourceExcludingClass } from '../logic/characterUtils';

import titleImage from '../assets/title.png';
import { buildPortraitPrompt } from '../services/imageService';
import { useCharacter } from '../hooks/useCharacter';
import { initialCharacter } from '../data/initialCharacter';
import type { Character } from '../models/Character';

import { AutoFillModal } from '../components/layout/AutoFillModal';
import { ClassSkillModal } from '../components/layout/ClassSkillModal';
import { RaceSkillModal } from '../components/layout/RaceSkillModal';
import { BackgroundSkillModal } from '../components/layout/BackgroundSkillModal';
import { CharacterInfoSection } from '../components/layout/CharacterInfoSection';
import { AbilityScoresSection } from '../components/layout/AbilityScoresSection';
import { SkillsSection } from '../components/layout/SkillsSection';
import { CombatStatsSection } from '../components/layout/CombatStatsSection';
import { EquipmentSection } from '../components/layout/EquipmentSection';
import { FeaturesSection } from '../components/layout/FeaturesSection';
import { SpellSection } from '../components/layout/SpellSection';
import { CharacterPortraitSection } from '../components/layout/CharacterPortraitSection';
import { Toaster, toast } from 'sonner';

interface CharacterSavePayload {
  version: 1;
  savedAt: string;
  character: Character;
  appliedRaceSkills: string[];
  appliedClassSkills: string[];
  appliedBackgroundSkills: string[];
}

const normalizeStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
};

const normalizeBooleanArray = (value: unknown, targetLength: number): boolean[] => {
  if (!Array.isArray(value)) return Array(targetLength).fill(false);
  const normalized = value.slice(0, targetLength).map(item => Boolean(item));
  while (normalized.length < targetLength) normalized.push(false);
  return normalized;
};

const padArray = <T,>(value: T[], targetLength: number, fallback: () => T): T[] => {
  const padded = [...value];
  while (padded.length < targetLength) padded.push(fallback());
  return padded;
};

const normalizeCharacter = (value: unknown): Character | null => {
  if (!value || typeof value !== 'object') return null;
  const input = value as Partial<Character>;

  return {
    ...initialCharacter,
    ...input,
    abilityScores: {
      ...initialCharacter.abilityScores,
      ...(input.abilityScores ?? {}),
    },
    skills: {
      ...initialCharacter.skills,
      ...(input.skills ?? {}),
    },
    savingThrows: {
      ...initialCharacter.savingThrows,
      ...(input.savingThrows ?? {}),
    },
    hp: {
      ...initialCharacter.hp,
      ...(input.hp ?? {}),
    },
    deathSaves: {
      successes: normalizeBooleanArray(input.deathSaves?.successes, 3),
      failures: normalizeBooleanArray(input.deathSaves?.failures, 3),
    },
    cantrips: Array.isArray(input.cantrips)
      ? padArray(
          input.cantrips.slice(0, 4).map(value => (typeof value === 'string' ? value : '')),
          4,
          () => ''
        )
      : initialCharacter.cantrips,
    spellSlots: Array.isArray(input.spellSlots)
      ? padArray(
          input.spellSlots.slice(0, 9).map(slot => ({
            total: typeof slot?.total === 'number' ? slot.total : 0,
            expended: typeof slot?.expended === 'number' ? slot.expended : 0,
          })),
          9,
          () => ({ total: 0, expended: 0 })
        )
      : initialCharacter.spellSlots,
    spellsByLevel: Array.isArray(input.spellsByLevel)
      ? padArray(
          input.spellsByLevel.slice(0, 9).map(level =>
            Array.isArray(level)
              ? padArray(
                  level.slice(0, 10).map(spell => ({
                    name: typeof spell?.name === 'string' ? spell.name : '',
                    prepared: Boolean(spell?.prepared),
                  })),
                  10,
                  () => ({ name: '', prepared: false })
                )
              : Array(10).fill(null).map(() => ({ name: '', prepared: false }))
          ),
          9,
          () => Array(10).fill(null).map(() => ({ name: '', prepared: false }))
        )
      : initialCharacter.spellsByLevel,
  };
};

export default function App() {
  const {
    character,
    setCharacter,
    updateAbilityScore,
    toggleSkillProficiency,
    updateCantrip,
    updateSpell,
    togglePrepared,
    updateSlots,
  } = useCharacter();

  const [showAutoFillPrompt, setShowAutoFillPrompt] = useState(false);
  const [pendingClass, setPendingClass] = useState('');
  const [showClassSkillChoice, setShowClassSkillChoice] = useState(false);
  const [pendingClassSkillOptions, setPendingClassSkillOptions] = useState<string[]>([]);
  const [requiredClassSkillChoices, setRequiredClassSkillChoices] = useState(0);
  const [selectedClassSkills, setSelectedClassSkills] = useState<string[]>([]);
  const [showRaceSkillChoice, setShowRaceSkillChoice] = useState(false);
  const [pendingRace, setPendingRace] = useState('');
  const [selectedRaceSkills, setSelectedRaceSkills] = useState<string[]>([]);
  const [appliedRaceSkills, setAppliedRaceSkills] = useState<string[]>([]);
  const [requiredSkillChoices, setRequiredSkillChoices] = useState(0);
  const [showBackgroundSkillChoice, setShowBackgroundSkillChoice] = useState(false);
  const [pendingBackground, setPendingBackground] = useState('');
  const [appliedClassSkills, setAppliedClassSkills] = useState<string[]>([]);
  const [appliedBackgroundSkills, setAppliedBackgroundSkills] = useState<string[]>([]);
  const [backgroundConflictingSkills, setBackgroundConflictingSkills] = useState<string[]>([]);
  const [backgroundNonConflictingSkills, setBackgroundNonConflictingSkills] = useState<string[]>([]);
  const [selectedBackgroundReplacementSkills, setSelectedBackgroundReplacementSkills] = useState<string[]>([]);
  const [portraitPrompt, setPortraitPrompt] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const proficiencyBonus = getProficiencyBonus(character.level);

  const savePayload: CharacterSavePayload = {
    version: 1,
    savedAt: new Date().toISOString(),
    character,
    appliedRaceSkills,
    appliedClassSkills,
    appliedBackgroundSkills,
  };

  const applyLoadedPayload = (payload: unknown) => {
    if (!payload || typeof payload !== 'object') {
      throw new Error('Invalid save file.');
    }

    const raw = payload as Partial<CharacterSavePayload> & { character?: unknown };
    const rawCharacter = raw.character ?? raw;
    const normalizedCharacter = normalizeCharacter(rawCharacter);

    if (!normalizedCharacter) {
      throw new Error('Save data does not contain a valid character.');
    }

    setCharacter(normalizedCharacter);
    setAppliedRaceSkills(normalizeStringArray(raw.appliedRaceSkills));
    setAppliedClassSkills(normalizeStringArray(raw.appliedClassSkills));
    setAppliedBackgroundSkills(normalizeStringArray(raw.appliedBackgroundSkills));
  };


  const handleClassChange = (newClass: string) => {
    if (newClass && CLASS_RECOMMENDATIONS[newClass]) {
      setPendingClass(newClass);
      setShowAutoFillPrompt(true);
    } else {
      setCharacter({ ...character, class: newClass });
    }
  };

  const handleRaceChange = (newRace: string) => {
    if (newRace && RACE_RECOMMENDATIONS[newRace]) {
      const raceRec = RACE_RECOMMENDATIONS[newRace];
      setPendingRace(newRace);

      if (raceRec.skillChoices && raceRec.skillChoices > 0) {
        setRequiredSkillChoices(raceRec.skillChoices);
        setSelectedRaceSkills([]);
        setShowRaceSkillChoice(true);
      } else {
        applyRaceRecommendations(newRace, raceRec.skills);
      }
    } else {
      setCharacter({ ...character, race: newRace });
    }
  };

  const applyRaceRecommendations = (race: string, skills: string[]) => {
    const raceRec = RACE_RECOMMENDATIONS[race];
    if (raceRec) {
      const newSkills = rebuildSkills(race, skills, appliedClassSkills, appliedBackgroundSkills);

      let combinedFeatures = removeFeatureSection(character.features, 'RACIAL TRAITS');
      if (raceRec.features) {
        combinedFeatures = `=== RACIAL TRAITS ===\n${raceRec.features}` + (combinedFeatures ? `\n\n${combinedFeatures}` : '');
      }

      setAppliedRaceSkills(skills);
      setCharacter({
        ...character,
        race: race,
        skills: newSkills,
        features: combinedFeatures || character.features,
      });
    }
  };

  const applyClassRecommendations = () => {
    const recommendations = CLASS_RECOMMENDATIONS[pendingClass];
    if (recommendations) {
      if (recommendations.skillChoices && recommendations.skillChoices > 0 && recommendations.skillOptions) {
        setPendingClassSkillOptions(recommendations.skillOptions);
        setRequiredClassSkillChoices(recommendations.skillChoices);
        setSelectedClassSkills([]);
        setShowClassSkillChoice(true);
      } else {
        applyClassFinal(recommendations, []);
      }
    }
    setShowAutoFillPrompt(false);
  };

  const applyClassFinal = (recommendations: ClassRecommendations, classSkills: string[]) => {
    const newSkills = rebuildSkills(character.race, appliedRaceSkills, classSkills, appliedBackgroundSkills);

    let combinedFeatures = removeFeatureSection(character.features, 'CLASS FEATURES');
    if (recommendations.features) {
      combinedFeatures = `=== CLASS FEATURES ===\n${recommendations.features}` + (combinedFeatures ? `\n\n${combinedFeatures}` : '');
    }

    const newSavingThrows: Record<string, boolean> = {};
    const classSavingThrows = CLASS_SAVING_THROWS[pendingClass] || [];
    classSavingThrows.forEach(save => {
      newSavingThrows[save] = true;
    });

    setAppliedClassSkills(classSkills);
    setCharacter({
      ...character,
      class: pendingClass,
      abilityScores: recommendations.abilityScores,
      skills: newSkills,
      savingThrows: newSavingThrows,
      features: combinedFeatures,
      equipment: recommendations.equipment,
    });
    setPendingClass('');
  };

  const confirmClassSkillChoices = () => {
    const recommendations = CLASS_RECOMMENDATIONS[pendingClass];
    if (recommendations) {
      applyClassFinal(recommendations, selectedClassSkills);
    }
    setShowClassSkillChoice(false);
    setSelectedClassSkills([]);
  };

  const toggleClassSkillSelection = (skillName: string) => {
    if (
      getSkillSourceExcludingClass(
        skillName,
        appliedRaceSkills,
        appliedBackgroundSkills,
        character
      )
    ) {
      return;
    }

    setSelectedClassSkills(prev => {
      if (prev.includes(skillName)) {
        return prev.filter(s => s !== skillName);
      } else if (prev.length < requiredClassSkillChoices) {
        return [...prev, skillName];
      }
      return prev;
    });
  };

  const declineAutoFill = () => {
    setCharacter({ ...character, class: pendingClass });
    setShowAutoFillPrompt(false);
    setPendingClass('');
  };

  const toggleRaceSkillSelection = (skillName: string) => {
    if (
      getSkillSource(
        skillName,
        appliedRaceSkills,
        appliedClassSkills,
        appliedBackgroundSkills,
        character
      )
    ) {
      return;
    }

    setSelectedRaceSkills(prev => {
      if (prev.includes(skillName)) {
        return prev.filter(s => s !== skillName);
      } else if (prev.length < requiredSkillChoices) {
        return [...prev, skillName];
      }
      return prev;
    });
  };

  const confirmRaceSkillChoices = () => {
    applyRaceRecommendations(pendingRace, selectedRaceSkills);
    setShowRaceSkillChoice(false);
    setPendingRace('');
    setSelectedRaceSkills([]);
  };

  const handleBackgroundChange = (newBackground: string) => {
    if (newBackground && BACKGROUND_RECOMMENDATIONS[newBackground]) {
      const backgroundRec = BACKGROUND_RECOMMENDATIONS[newBackground];
      setPendingBackground(newBackground);

      const conflictingSkills: string[] = [];
      const nonConflictingSkills: string[] = [];
      backgroundRec.skills.forEach(skill => {
        if (character.skills[skill]) {
          conflictingSkills.push(skill);
        } else {
          nonConflictingSkills.push(skill);
        }
      });

      if (conflictingSkills.length > 0) {
        setBackgroundConflictingSkills(conflictingSkills);
        setBackgroundNonConflictingSkills(nonConflictingSkills);
        setSelectedBackgroundReplacementSkills([]);
        setShowBackgroundSkillChoice(true);
      } else {
        applyBackgroundRecommendations(newBackground, backgroundRec.skills);
      }
    } else {
      setCharacter({ ...character, background: newBackground });
    }
  };

  const applyBackgroundRecommendations = (background: string, skills: string[]) => {
    const backgroundRec = BACKGROUND_RECOMMENDATIONS[background];
    if (backgroundRec) {
      const newSkills = rebuildSkills(character.race, appliedRaceSkills, appliedClassSkills, skills);

      let combinedFeatures = removeFeatureSection(character.features, 'BACKGROUND FEATURE');
      if (backgroundRec.feature) {
        combinedFeatures = `=== BACKGROUND FEATURE ===\n${backgroundRec.feature}` + (combinedFeatures ? `\n\n${combinedFeatures}` : '');
      }

      setAppliedBackgroundSkills(skills);
      setCharacter({
        ...character,
        background: background,
        skills: newSkills,
        features: combinedFeatures,
        equipment: backgroundRec.equipment,
      });
    }
  };

  const toggleBackgroundSkillSelection = (skillName: string) => {
    setSelectedBackgroundReplacementSkills(prev => {
      if (prev.includes(skillName)) {
        return prev.filter(s => s !== skillName);
      } else if (prev.length < backgroundConflictingSkills.length) {
        return [...prev, skillName];
      }
      return prev;
    });
  };

  const confirmBackgroundSkillChoices = () => {
    const backgroundRec = BACKGROUND_RECOMMENDATIONS[pendingBackground];
    if (backgroundRec) {
      const allBackgroundSkills = [...backgroundNonConflictingSkills, ...selectedBackgroundReplacementSkills];

      const newSkills = rebuildSkills(character.race, appliedRaceSkills, appliedClassSkills, allBackgroundSkills);

      let combinedFeatures = removeFeatureSection(character.features, 'BACKGROUND FEATURE');
      if (backgroundRec.feature) {
        combinedFeatures = `=== BACKGROUND FEATURE ===\n${backgroundRec.feature}` + (combinedFeatures ? `\n\n${combinedFeatures}` : '');
      }

      setAppliedBackgroundSkills(allBackgroundSkills);
      setCharacter({
        ...character,
        background: pendingBackground,
        skills: newSkills,
        features: combinedFeatures,
        equipment: backgroundRec.equipment,
      });
    }
    setShowBackgroundSkillChoice(false);
    setPendingBackground('');
    setSelectedBackgroundReplacementSkills([]);
  };

  const initiative = getModifier(character.abilityScores.dexterity);
  const initiativeString = initiative >= 0 ? `+${initiative}` : `${initiative}`;

  const handleGeneratePortrait = () => {
    const generatedPrompt = buildPortraitPrompt(character);
    setPortraitPrompt(generatedPrompt);
    
    navigator.clipboard.writeText(generatedPrompt)
      .then(() => toast.success('Prompt copied to clipboard!'))
      .catch(() => toast.info('Prompt generated! Copy it from the text box below.'));
  };

  const handleSaveCharacter = () => {
    try {
      const exportBlob = new Blob([JSON.stringify(savePayload, null, 2)], {
        type: 'application/json',
      });

      const safeName = (character.name || 'character')
        .trim()
        .replace(/[^a-z0-9]+/gi, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase();
      const filename = `${safeName || 'character'}-${new Date().toISOString().slice(0, 10)}.json`;

      const url = URL.createObjectURL(exportBlob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);

      toast.success('Character exported as JSON.');
    } catch {
      toast.error('Could not save character.');
    }
  };

  const handleLoadCharacter = () => {
    fileInputRef.current?.click();
  };

  const handleLoadFromFile: ChangeEventHandler<HTMLInputElement> = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const fileContent = await file.text();
      applyLoadedPayload(JSON.parse(fileContent));
      toast.success(`Loaded character from ${file.name}.`);
    } catch {
      toast.error('Could not load this file. Please choose a valid JSON save.');
    } finally {
      event.target.value = '';
    }
  };

  return (
    <>
    <Toaster richColors position="top-center" />
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-stone-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        <AutoFillModal
          show={showAutoFillPrompt}
          pendingClass={pendingClass}
          onApply={applyClassRecommendations}
          onDecline={declineAutoFill}
        />

        <ClassSkillModal
          show={showClassSkillChoice}
          pendingClass={pendingClass}
          skillOptions={pendingClassSkillOptions}
          requiredChoices={requiredClassSkillChoices}
          selectedSkills={selectedClassSkills}
          getSkillSourceExcludingClass={(skill) =>
            getSkillSourceExcludingClass(
              skill,
              appliedRaceSkills,
              appliedBackgroundSkills,
              character
            )
          }
          onToggleSkill={toggleClassSkillSelection}
          onConfirm={confirmClassSkillChoices}
        />

        <RaceSkillModal
          show={showRaceSkillChoice}
          pendingRace={pendingRace}
          requiredChoices={requiredSkillChoices}
          selectedSkills={selectedRaceSkills}
          getSkillSource={(skill) =>
            getSkillSource(
              skill,
              appliedRaceSkills,
              appliedClassSkills,
              appliedBackgroundSkills,
              character
            )
          }
          onToggleSkill={toggleRaceSkillSelection}
          onConfirm={confirmRaceSkillChoices}
        />

        <BackgroundSkillModal
          show={showBackgroundSkillChoice}
          pendingBackground={pendingBackground}
          conflictingSkills={backgroundConflictingSkills}
          selectedSkills={selectedBackgroundReplacementSkills}
          characterSkills={character.skills}
          onToggleSkill={toggleBackgroundSkillSelection}
          onConfirm={confirmBackgroundSkillChoices}
        />

        <div className="mb-4 text-left">
          <img
            src={titleImage}
            alt="D&D Character Sheet"
            className="h-30 w-auto object-contain"
          />
        </div>

        <div className="bg-card border-2 border-amber-700 rounded-lg shadow-xl p-6 md:p-8">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={handleLoadFromFile}
          />

          <CharacterInfoSection
            character={character}
            onCharacterChange={setCharacter}
            onClassChange={handleClassChange}
            onRaceChange={handleRaceChange}
            onBackgroundChange={handleBackgroundChange}
            onSaveCharacter={handleSaveCharacter}
            onLoadCharacter={handleLoadCharacter}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <AbilityScoresSection
              character={character}
              onUpdateAbilityScore={updateAbilityScore}
            />

            <SkillsSection
              character={character}
              skills={character.skills}
              onToggleSkill={toggleSkillProficiency}
              proficiencyBonus={proficiencyBonus}
            />

            <FeaturesSection
              character={character}
              onCharacterChange={setCharacter}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

            {/* Left: Combat + Equipment + Spellcasting stack */}
            <div className="lg:col-span-2 flex flex-col gap-4 min-h-0 -mb-">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CombatStatsSection
                  character={character}
                  proficiencyBonus={proficiencyBonus}
                  initiative={initiativeString}
                  onCharacterChange={(updates) =>
                    setCharacter((prev) => ({
                      ...prev,
                      ...updates,
                      hp: updates.hp ? { ...prev.hp, ...updates.hp } : prev.hp
                    }))
                  }
                />

                <EquipmentSection
                  character={character}
                  onCharacterChange={setCharacter}
                />
              </div>

              <SpellSection
                character={character}
                onUpdateCantrip={updateCantrip}
                onUpdateSpell={updateSpell}
                onTogglePrepared={togglePrepared}
                onUpdateSlots={updateSlots}
              />
            </div>

            {/* Right: Portrait only */}
            <div>
              <CharacterPortraitSection
                onGeneratePortrait={handleGeneratePortrait}
                portraitPrompt={portraitPrompt}
                onPortraitPromptChange={setPortraitPrompt}
              />
            </div>

          </div>
        </div>
      </div>
    </div>
    </>
  );
}