import { useState } from 'react';

import { getModifier, getProficiencyBonus } from '../logic/ability';
import { CLASS_RECOMMENDATIONS, CLASS_SAVING_THROWS, type ClassRecommendations } from '../logic/class';
import { RACE_RECOMMENDATIONS } from '../logic/race';
import { BACKGROUND_RECOMMENDATIONS } from '../logic/backgrounds';
import { removeFeatureSection, rebuildSkills, getSkillSource, getSkillSourceExcludingClass } from '../logic/characterUtils';

import titleImage from '../assets/title.png';
import { useCharacter } from '../hooks/useCharacter';

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

  return (
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

          <CharacterInfoSection
            character={character}
            onCharacterChange={setCharacter}
            onClassChange={handleClassChange}
            onRaceChange={handleRaceChange}
            onBackgroundChange={handleBackgroundChange}
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
            <div className="lg:col-span-2 flex flex-col gap-4 min-h-0 -mb-8">

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

              <h2 className="text-amber-900 -mt-4 mb-2 border-b-2 border-amber-700 pb-1">
                Spellcasting
              </h2>

              <SpellSection
                character={character}
                onUpdateCantrip={updateCantrip}
                onUpdateSpell={updateSpell}
              />
            </div>

            {/* Right: Portrait only */}
            <div>
              <CharacterPortraitSection
                onGeneratePortrait={() => alert('AI portrait generation coming soon!')}
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}