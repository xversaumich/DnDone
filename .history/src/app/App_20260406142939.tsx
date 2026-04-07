import { useState } from 'react';
import { Scroll, Swords } from 'lucide-react';

// Import logic from dedicated modules
import { getModifier, getProficiencyBonus } from '../logic/ability';
import { CLASSES, CLASS_RECOMMENDATIONS, CLASS_SAVING_THROWS, type ClassRecommendations } from '../logic/class';
import { RACES, RACE_RECOMMENDATIONS } from '../logic/race';
import { BACKGROUNDS, BACKGROUND_RECOMMENDATIONS } from '../logic/backgrounds';
import { removeFeatureSection, rebuildSkills, getSkillSource, getSkillSourceExcludingClass } from '../logic/characterUtils';

// Import types and data
import { Character } from '../models/Character';
import { useCharacter } from '../hooks/useCharacter';

// Import layout components
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
import { SavingThrow } from '../components/character/SavingThrow';

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

  const proficiencyBonus = getProficiencyBonus(character.level);

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
    if (getSkillSourceExcludingClass(
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
    // Don't allow selecting skills that are already granted
    if (getSkillSource(
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

  const initiative = getModifier(character.abilityScores.dexterity);
  const initiativeString = initiative >= 0 ? `+${initiative}` : `${initiative}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-stone-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Modals */}
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

        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Scroll className="w-8 h-8 text-amber-700" />
            <h1 className="text-4xl text-amber-900">D&D Character Sheet</h1>
            <Swords className="w-8 h-8 text-amber-700" />
          </div>
          <p className="text-muted-foreground">Create your adventurer</p>
        </div>

        <div className="bg-card border-2 border-amber-700 rounded-lg shadow-xl p-6 md:p-8">
          <CharacterInfoSection
            character={character}
            onCharacterChange={setCharacter}
            onClassChange={handleClassChange}
            onRaceChange={handleRaceChange}
            onBackgroundChange={handleBackgroundChange}
          />

          {/* Top Row: Ability Scores, Skills, Features & Traits */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <AbilityScoresSection
            character={character}
            onUpdateAbilityScore={updateAbilityScore}
          />

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
              
              <SkillsSection
                character={character}
                proficiencyBonus={proficiencyBonus}
                getSkillSource={getSkillSource}
                onToggleSkill={toggleSkillProficiency}
              />
            </div>

            <FeaturesSection
              character={character}
              onCharacterChange={setCharacter}
            />
          </div>

          {/* Middle Row: Combat Stats, Equipment, Character Portrait */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <CombatStatsSection
              character={character}
              proficiencyBonus={proficiencyBonus}
              initiative={initiativeString}
            />

            <EquipmentSection
              character={character}
              onCharacterChange={setCharacter}
            />
<CharacterPortraitSection
              onGeneratePortrait={() => alert('AI portrait generation coming soon!')}
            />
            </div>
          </div>

          <SpellSection
            character={character}
            onUpdateCantrip={updateCantrip}
            onUpdateSpell={updateSpell}
            onTogglePrepared={togglePrepared}
            onUpdateSlots={updateSlots}
          />
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>May your rolls be high and your adventures legendary!</p>
        </div>
      </div>
  );
}