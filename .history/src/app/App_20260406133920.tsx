import { useState } from 'react';
import { AbilityScore } from '../components/character/AbilityScore';
import { SkillItem } from '../components/character/SkillItem';
import { StatBox } from '../components/character/StatBox';
import { SavingThrow } from '../components/character/SavingThrow';
import { SpellList } from '../components/character/SpellList';
import { Scroll, Swords, Sparkles } from 'lucide-react';

// Import logic from dedicated modules
import { getModifier, getProficiencyBonus } from '../logic/ability';
import { SKILLS } from '../logic/skills';
import { CLASSES, CLASS_RECOMMENDATIONS, CLASS_SAVING_THROWS, type ClassRecommendations } from '../logic/class';
import { RACES, RACE_RECOMMENDATIONS } from '../logic/race';
import { BACKGROUNDS, ALIGNMENTS, BACKGROUND_RECOMMENDATIONS } from '../logic/backgrounds';

// Import types and data
import { Character } from '../models/Character';
import { initialCharacter } from '../data/initialCharacter';
import { useCharacter } from '../hooks/useCharacter';

export default function App() {
  const [character, setCharacter] = useState<Character>(initialCharacter);

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

  const proficiencyBonus = getProficiencyBonus(character.level);

  // Helper function to remove a specific feature section
  const removeFeatureSection = (features: string, sectionName: string): string => {
    const regex = new RegExp(`=== ${sectionName} ===\n[^=]*(?===.*===|$)`, 'g');
    return features.replace(regex, '').trim();
  };

  // Helper function to rebuild skills from current race, class, and background selections
  const rebuildSkills = (
    race: string,
    raceSkillsToApply: string[],
    classSkillsToApply: string[],
    backgroundSkillsToApply: string[]
  ): Record<string, boolean> => {
    const newSkills: Record<string, boolean> = {};
    
    // Apply race skills
    raceSkillsToApply.forEach(skill => {
      newSkills[skill] = true;
    });
    
    // Apply class skills
    classSkillsToApply.forEach(skill => {
      newSkills[skill] = true;
    });
    
    // Apply background skills
    backgroundSkillsToApply.forEach(skill => {
      newSkills[skill] = true;
    });
    
    return newSkills;
  };

  // Helper function to determine if a skill is already granted and by what source
  const getSkillSource = (skillName: string): string | null => {
    if (appliedClassSkills.includes(skillName)) {
      return `${character.class} class`;
    }
    if (appliedBackgroundSkills.includes(skillName)) {
      return `${character.background} background`;
    }
    if (appliedRaceSkills.includes(skillName)) {
      return `${character.race} race`;
    }
    return null;
  };

  // Helper function to check only race and background sources (used when selecting class skills to ignore old class skills being replaced)
  const getSkillSourceExcludingClass = (skillName: string): string | null => {
    if (appliedBackgroundSkills.includes(skillName)) {
      return `${character.background} background`;
    }
    if (appliedRaceSkills.includes(skillName)) {
      return `${character.race} race`;
    }
    return null;
  };

  const updateAbilityScore = (ability: keyof Character['abilityScores'], value: number) => {
    setCharacter({
      ...character,
      abilityScores: {
        ...character.abilityScores,
        [ability]: value,
      },
    });
  };

  const toggleSkillProficiency = (skillName: string) => {
    setCharacter({
      ...character,
      skills: {
        ...character.skills,
        [skillName]: !character.skills[skillName],
      },
    });
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
        // Race has skill choices - show selection modal
        setRequiredSkillChoices(raceRec.skillChoices);
        setSelectedRaceSkills([]);
        setShowRaceSkillChoice(true);
      } else {
        // Race has fixed skills or no skills - apply directly
        applyRaceRecommendations(newRace, raceRec.skills);
      }
    } else {
      setCharacter({ ...character, race: newRace });
    }
  };

  const applyRaceRecommendations = (race: string, skills: string[]) => {
    const raceRec = RACE_RECOMMENDATIONS[race];
    if (raceRec) {
      // Rebuild skills: remove old race skills, add new race skills, keep class/background skills
      const newSkills = rebuildSkills(race, skills, appliedClassSkills, appliedBackgroundSkills);

      // Remove old racial traits and combine new ones with remaining features (class/background)
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
      // Check if class has skill choices
      if (recommendations.skillChoices && recommendations.skillChoices > 0 && recommendations.skillOptions) {
        // Show skill choice modal
        setPendingClassSkillOptions(recommendations.skillOptions);
        setRequiredClassSkillChoices(recommendations.skillChoices);
        setSelectedClassSkills([]);
        setShowClassSkillChoice(true);
      } else {
        // No skill choices - apply directly
        applyClassFinal(recommendations, []);
      }
    }
    setShowAutoFillPrompt(false);
  };

  const applyClassFinal = (recommendations: ClassRecommendations, classSkills: string[]) => {
    // Rebuild skills: keep race/background skills, add new class skills
    const newSkills = rebuildSkills(character.race, appliedRaceSkills, classSkills, appliedBackgroundSkills);

    // Remove old class features and combine new ones with remaining features (racial/background)
    let combinedFeatures = removeFeatureSection(character.features, 'CLASS FEATURES');
    if (recommendations.features) {
      combinedFeatures = `=== CLASS FEATURES ===\n${recommendations.features}` + (combinedFeatures ? `\n\n${combinedFeatures}` : '');
    }

    // Set saving throw proficiencies
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
    // Don't allow selecting skills that are already granted by race or background
    // (old class skills don't matter since they're being replaced anyway)
    if (getSkillSourceExcludingClass(skillName)) {
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
    // Don't allow selecting skills that are already granted
    if (getSkillSource(skillName)) {
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
      
      // Check for conflicting skills
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
        // Background has conflicting skills - show selection modal
        setBackgroundConflictingSkills(conflictingSkills);
        setBackgroundNonConflictingSkills(nonConflictingSkills);
        setSelectedBackgroundReplacementSkills([]);
        setShowBackgroundSkillChoice(true);
      } else {
        // Background has no conflicting skills - apply directly
        applyBackgroundRecommendations(newBackground, backgroundRec.skills);
      }
    } else {
      setCharacter({ ...character, background: newBackground });
    }
  };

  const applyBackgroundRecommendations = (background: string, skills: string[]) => {
    const backgroundRec = BACKGROUND_RECOMMENDATIONS[background];
    if (backgroundRec) {
      // Rebuild skills: keep race/class skills, add new background skills
      const newSkills = rebuildSkills(character.race, appliedRaceSkills, appliedClassSkills, skills);

      // Remove old background feature and combine new one with remaining features (class/racial)
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
      // Combine all background skills: non-conflicting + replacement skills
      const allBackgroundSkills = [...backgroundNonConflictingSkills, ...selectedBackgroundReplacementSkills];
      
      // Rebuild skills: keep race/class skills, add new background skills
      const newSkills = rebuildSkills(character.race, appliedRaceSkills, appliedClassSkills, allBackgroundSkills);

      // Remove old background feature and combine new one with remaining features (class/racial)
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

  // Spell management functions
  const updateCantrip = (index: number, value: string) => {
    const newCantrips = [...character.cantrips];
    newCantrips[index] = value;
    setCharacter({ ...character, cantrips: newCantrips });
  };

  const updateSpell = (level: number, index: number, name: string) => {
    const newSpellsByLevel = [...character.spellsByLevel];
    newSpellsByLevel[level] = [...newSpellsByLevel[level]];
    newSpellsByLevel[level][index] = { ...newSpellsByLevel[level][index], name };
    setCharacter({ ...character, spellsByLevel: newSpellsByLevel });
  };

  const togglePrepared = (level: number, index: number) => {
    const newSpellsByLevel = [...character.spellsByLevel];
    newSpellsByLevel[level] = [...newSpellsByLevel[level]];
    newSpellsByLevel[level][index] = { 
      ...newSpellsByLevel[level][index], 
      prepared: !newSpellsByLevel[level][index].prepared 
    };
    setCharacter({ ...character, spellsByLevel: newSpellsByLevel });
  };

  const updateSlots = (level: number, field: 'total' | 'expended', value: number) => {
    const newSpellSlots = [...character.spellSlots];
    newSpellSlots[level] = { ...newSpellSlots[level], [field]: value };
    setCharacter({ ...character, spellSlots: newSpellSlots });
  };

  const initiative = getModifier(character.abilityScores.dexterity);
  const initiativeString = initiative >= 0 ? `+${initiative}` : `${initiative}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-stone-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Auto-fill prompt modal */}
        {showAutoFillPrompt && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card border-2 border-amber-700 rounded-lg shadow-2xl p-6 max-w-md w-full">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-amber-600" />
                <h3 className="text-xl text-amber-900">Auto-fill Stats?</h3>
              </div>
              <p className="text-sm mb-6">
                Would you like to auto-fill your ability scores and skills with recommended stats for a {pendingClass}?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={applyClassRecommendations}
                  className="flex-1 px-4 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800 transition-colors"
                >
                  Yes, auto-fill
                </button>
                <button
                  onClick={declineAutoFill}
                  className="flex-1 px-4 py-2 bg-muted text-foreground rounded-md hover:bg-accent transition-colors"
                >
                  No, I'll do it myself
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Race skill choice modal */}
        {showClassSkillChoice && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card border-2 border-amber-700 rounded-lg shadow-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-amber-600" />
                <h3 className="text-xl text-amber-900">Choose Class Skills</h3>
              </div>
              <p className="text-sm mb-4">
                As a {pendingClass}, choose {requiredClassSkillChoices} skill{requiredClassSkillChoices > 1 ? 's' : ''} to gain proficiency in:
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Selected: {selectedClassSkills.length} / {requiredClassSkillChoices}
              </p>
              <div className="space-y-2 mb-6">
                {SKILLS.filter(skill => pendingClassSkillOptions.includes(skill.name)).map(skill => {
                  const skillSource = getSkillSourceExcludingClass(skill.name);
                  const isDisabled = !!skillSource;
                  
                  return (
                    <div
                      key={skill.name}
                      className={`flex items-center gap-3 p-2 rounded-md transition-colors ${
                        isDisabled
                          ? 'bg-gray-200 cursor-not-allowed opacity-60'
                          : selectedClassSkills.includes(skill.name)
                          ? 'bg-amber-100 border border-amber-700 cursor-pointer'
                          : 'bg-accent/30 hover:bg-accent/50 cursor-pointer'
                      }`}
                      onClick={() => !isDisabled && toggleClassSkillSelection(skill.name)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedClassSkills.includes(skill.name)}
                        onChange={() => {}}
                        disabled={isDisabled}
                        className="w-4 h-4 rounded border-border accent-amber-700 cursor-pointer disabled:opacity-50"
                      />
                      <div className="flex flex-col flex-1">
                        <span className="text-sm">{skill.name}</span>
                        <span className="text-xs text-muted-foreground">({skill.ability})</span>
                        {skillSource && (
                          <span className="text-xs text-gray-600 mt-1">Granted by {skillSource}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={confirmClassSkillChoices}
                disabled={selectedClassSkills.length !== requiredClassSkillChoices}
                className="w-full px-4 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Selection
              </button>
            </div>
          </div>
        )}

        {showRaceSkillChoice && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card border-2 border-amber-700 rounded-lg shadow-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-amber-600" />
                <h3 className="text-xl text-amber-900">Choose Skills</h3>
              </div>
              <p className="text-sm mb-4">
                As a {pendingRace}, choose {requiredSkillChoices} skill{requiredSkillChoices > 1 ? 's' : ''} to gain proficiency in:
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Selected: {selectedRaceSkills.length} / {requiredSkillChoices}
              </p>
              <div className="space-y-2 mb-6">
                {SKILLS.map(skill => {
                  const skillSource = getSkillSource(skill.name);
                  const isDisabled = !!skillSource;
                  
                  return (
                    <div
                      key={skill.name}
                      className={`flex items-center gap-3 p-2 rounded-md transition-colors ${
                        isDisabled
                          ? 'bg-gray-200 cursor-not-allowed opacity-60'
                          : selectedRaceSkills.includes(skill.name)
                          ? 'bg-amber-100 border border-amber-700 cursor-pointer'
                          : 'bg-accent/30 hover:bg-accent/50 cursor-pointer'
                      }`}
                      onClick={() => !isDisabled && toggleRaceSkillSelection(skill.name)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedRaceSkills.includes(skill.name)}
                        onChange={() => {}}
                        disabled={isDisabled}
                        className="w-4 h-4 rounded border-border accent-amber-700 cursor-pointer disabled:opacity-50"
                      />
                      <div className="flex flex-col flex-1">
                        <span className="text-sm">{skill.name}</span>
                        <span className="text-xs text-muted-foreground">({skill.ability})</span>
                        {skillSource && (
                          <span className="text-xs text-gray-600 mt-1">Granted by {skillSource}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={confirmRaceSkillChoices}
                disabled={selectedRaceSkills.length !== requiredSkillChoices}
                className="w-full px-4 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Selection
              </button>
            </div>
          </div>
        )}

        {/* Background skill choice modal */}
        {showBackgroundSkillChoice && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card border-2 border-amber-700 rounded-lg shadow-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-amber-600" />
                <h3 className="text-xl text-amber-900">Choose Replacement Skills</h3>
              </div>
              <p className="text-sm mb-4">
                Your {pendingBackground} background grants proficiency in {backgroundConflictingSkills.join(' and ')}, but you already have {backgroundConflictingSkills.length > 1 ? 'those' : 'that'}. Choose {backgroundConflictingSkills.length} different skill{backgroundConflictingSkills.length > 1 ? 's' : ''}:
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Selected: {selectedBackgroundReplacementSkills.length} / {backgroundConflictingSkills.length}
              </p>
              <div className="space-y-2 mb-6">
                {SKILLS.filter(skill => !character.skills[skill.name]).map(skill => (
                  <div
                    key={skill.name}
                    className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${
                      selectedBackgroundReplacementSkills.includes(skill.name)
                        ? 'bg-amber-100 border border-amber-700'
                        : 'bg-accent/30 hover:bg-accent/50'
                    }`}
                    onClick={() => toggleBackgroundSkillSelection(skill.name)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedBackgroundReplacementSkills.includes(skill.name)}
                      onChange={() => {}}
                      className="w-4 h-4 rounded border-border accent-amber-700 cursor-pointer"
                    />
                    <span className="text-sm">{skill.name}</span>
                    <span className="text-xs text-muted-foreground">({skill.ability})</span>
                  </div>
                ))}
              </div>
              <button
                onClick={confirmBackgroundSkillChoices}
                disabled={selectedBackgroundReplacementSkills.length !== backgroundConflictingSkills.length}
                className="w-full px-4 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Selection
              </button>
            </div>
          </div>
        )}

        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Scroll className="w-8 h-8 text-amber-700" />
            <h1 className="text-4xl text-amber-900">D&D Character Sheet</h1>
            <Swords className="w-8 h-8 text-amber-700" />
          </div>
          <p className="text-muted-foreground">Create your adventurer</p>
        </div>

        <div className="bg-card border-2 border-amber-700 rounded-lg shadow-xl p-6 md:p-8">
          {/* Basic Information */}
          <div className="mb-6">
            <h2 className="text-amber-900 mb-4 border-b-2 border-amber-700 pb-2">Character Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-1">Character Name</label>
                <input
                  type="text"
                  value={character.name}
                  onChange={(e) => setCharacter({ ...character, name: e.target.value })}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-md"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Race</label>
                <select
                  value={character.race}
                  onChange={(e) => handleRaceChange(e.target.value)}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-md"
                >
                  {RACES.map(race => (
                    <option key={race.value} value={race.value}>{race.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Class</label>
                <select
                  value={character.class}
                  onChange={(e) => handleClassChange(e.target.value)}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-md"
                >
                  {CLASSES.map(cls => (
                    <option key={cls.value} value={cls.value}>{cls.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Level</label>
                <input
                  type="number"
                  value={character.level}
                  onChange={(e) => setCharacter({ ...character, level: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-md"
                  min="1"
                  max="20"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Background</label>
                <select
                  value={character.background}
                  onChange={(e) => handleBackgroundChange(e.target.value)}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-md"
                >
                  {BACKGROUNDS.map(bg => (
                    <option key={bg.value} value={bg.value}>{bg.label}</option>
                  ))}
                </select>
                {character.background && BACKGROUNDS.find(bg => bg.value === character.background)?.description && (
                  <p className="text-xs text-muted-foreground mt-1 italic">
                    {BACKGROUNDS.find(bg => bg.value === character.background)?.description}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm mb-1">Alignment</label>
                <select
                  value={character.alignment}
                  onChange={(e) => setCharacter({ ...character, alignment: e.target.value })}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-md"
                >
                  {ALIGNMENTS.map(alignment => (
                    <option key={alignment.value} value={alignment.value}>{alignment.label}</option>
                  ))}
                </select>
                {character.alignment && ALIGNMENTS.find(align => align.value === character.alignment)?.description && (
                  <p className="text-xs text-muted-foreground mt-1 italic">
                    {ALIGNMENTS.find(align => align.value === character.alignment)?.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Top Row: Ability Scores, Skills, Features & Traits */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Left Column - Ability Scores */}
            <div>
              <h2 className="text-amber-900 mb-4 border-b-2 border-amber-700 pb-2">Ability Scores</h2>
              <div className="grid grid-cols-2 gap-3">
                <AbilityScore
                  name="STR"
                  score={character.abilityScores.strength}
                  onChange={(value) => updateAbilityScore('strength', value)}
                />
                <AbilityScore
                  name="DEX"
                  score={character.abilityScores.dexterity}
                  onChange={(value) => updateAbilityScore('dexterity', value)}
                />
                <AbilityScore
                  name="CON"
                  score={character.abilityScores.constitution}
                  onChange={(value) => updateAbilityScore('constitution', value)}
                />
                <AbilityScore
                  name="INT"
                  score={character.abilityScores.intelligence}
                  onChange={(value) => updateAbilityScore('intelligence', value)}
                />
                <AbilityScore
                  name="WIS"
                  score={character.abilityScores.wisdom}
                  onChange={(value) => updateAbilityScore('wisdom', value)}
                />
                <AbilityScore
                  name="CHA"
                  score={character.abilityScores.charisma}
                  onChange={(value) => updateAbilityScore('charisma', value)}
                />
              </div>
            </div>

            {/* Middle Column - Saving Throws & Skills */}
            <div>
              {/* Saving Throws */}
              <h2 className="text-amber-900 mb-4 border-b-2 border-amber-700 pb-2">Saving Throws</h2>
              <div className="space-y-1 mb-6">
                <SavingThrow
                  name="Strength"
                  proficient={character.savingThrows['Strength'] || false}
                  modifier={getModifier(character.abilityScores.strength)}
                  proficiencyBonus={proficiencyBonus}
                />
                <SavingThrow
                  name="Dexterity"
                  proficient={character.savingThrows['Dexterity'] || false}
                  modifier={getModifier(character.abilityScores.dexterity)}
                  proficiencyBonus={proficiencyBonus}
                />
                <SavingThrow
                  name="Constitution"
                  proficient={character.savingThrows['Constitution'] || false}
                  modifier={getModifier(character.abilityScores.constitution)}
                  proficiencyBonus={proficiencyBonus}
                />
                <SavingThrow
                  name="Intelligence"
                  proficient={character.savingThrows['Intelligence'] || false}
                  modifier={getModifier(character.abilityScores.intelligence)}
                  proficiencyBonus={proficiencyBonus}
                />
                <SavingThrow
                  name="Wisdom"
                  proficient={character.savingThrows['Wisdom'] || false}
                  modifier={getModifier(character.abilityScores.wisdom)}
                  proficiencyBonus={proficiencyBonus}
                />
                <SavingThrow
                  name="Charisma"
                  proficient={character.savingThrows['Charisma'] || false}
                  modifier={getModifier(character.abilityScores.charisma)}
                  proficiencyBonus={proficiencyBonus}
                />
              </div>
              
              {/* Skills */}
              <h2 className="text-amber-900 mb-4 border-b-2 border-amber-700 pb-2">Skills</h2>
              <div className="space-y-1 max-h-[200px] overflow-y-auto pr-2">
                {SKILLS.map((skill) => (
                  <SkillItem
                    key={skill.name}
                    name={skill.name}
                    ability={skill.ability}
                    proficient={character.skills[skill.name] || false}
                    onToggle={() => toggleSkillProficiency(skill.name)}
                    modifier={getModifier(character.abilityScores[skill.abilityKey as keyof Character['abilityScores']])}
                    proficiencyBonus={proficiencyBonus}
                  />
                ))}
              </div>
            </div>

            {/* Right Column - Features & Traits */}
            <div>
              <h2 className="text-amber-900 mb-4 border-b-2 border-amber-700 pb-2">Features & Traits</h2>
              <textarea
                value={character.features}
                onChange={(e) => setCharacter({ ...character, features: e.target.value })}
                className="w-full h-[380px] px-3 py-2 bg-input-background border border-border rounded-md resize-none"
                placeholder="Enter racial traits, class features, feats, etc."
              />
            </div>
          </div>

          {/* Middle Row: Combat Stats, Equipment, Character Portrait */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Left Column - Combat Stats */}
            <div>
              <h2 className="text-amber-900 mb-4 border-b-2 border-amber-700 pb-2">Combat Stats</h2>
              <div className="grid grid-cols-3 gap-2">
                <StatBox
                  label="AC"
                  value={character.ac}
                  onChange={(value) => setCharacter({ ...character, ac: parseInt(value) || 10 })}
                />
                <StatBox
                  label="Initiative"
                  value={initiativeString}
                  readOnly
                />
                <StatBox
                  label="Speed"
                  value={character.speed}
                  onChange={(value) => setCharacter({ ...character, speed: parseInt(value) || 30 })}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <StatBox
                  label="Current HP"
                  value={character.hp.current}
                  onChange={(value) => setCharacter({ ...character, hp: { ...character.hp, current: parseInt(value) || 0 } })}
                />
                <StatBox
                  label="Max HP"
                  value={character.hp.max}
                  onChange={(value) => setCharacter({ ...character, hp: { ...character.hp, max: parseInt(value) || 0 } })}
                />
              </div>
              <div className="mt-2">
                <StatBox
                  label="Proficiency Bonus"
                  value={`+${proficiencyBonus}`}
                  readOnly
                />
              </div>
            </div>

            {/* Middle Column - Equipment */}
            <div>
              <h2 className="text-amber-900 mb-4 border-b-2 border-amber-700 pb-2">Equipment</h2>
              <textarea
                value={character.equipment}
                onChange={(e) => setCharacter({ ...character, equipment: e.target.value })}
                className="w-full h-[200px] px-3 py-2 bg-input-background border border-border rounded-md resize-none"
                placeholder="List your weapons, armor, and other items"
              />
            </div>

            {/* Right Column - Character Portrait */}
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
                  onClick={() => {
                    // Placeholder for AI portrait generation
                    alert('AI portrait generation coming soon!');
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                  Generate Portrait
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Row: Spell List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3">
              <h2 className="text-amber-900 mb-4 border-b-2 border-amber-700 pb-2">Spell List</h2>
              <SpellList
                cantrips={character.cantrips}
                spellSlots={character.spellSlots}
                spellsByLevel={character.spellsByLevel}
                onUpdateCantrip={updateCantrip}
                onUpdateSpell={updateSpell}
                onTogglePrepared={togglePrepared}
                onUpdateSlots={updateSlots}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>May your rolls be high and your adventures legendary!</p>
        </div>
      </div>
    </div>
  );
}