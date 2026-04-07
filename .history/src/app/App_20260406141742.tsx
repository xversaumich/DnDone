import { useState } from 'react';
import { Scroll, Swords } from 'lucide-react';

import { CharacterInfoSection } from './components/layout/CharacterInfoSection';
import { AbilityScoresSection } from './components/layout/AbilityScoresSection';
import { SkillsSection } from './components/layout/SkillsSection';
import { FeaturesSection } from './components/layout/FeaturesSection';
import { CombatStatsSection } from './components/layout/CombatStatsSection';
import { EquipmentSection } from './components/layout/EquipmentSection';
import { CharacterPortraitSection } from './components/layout/CharacterPortraitSection';
import { SpellSection } from './components/layout/SpellSection';
import { SavingThrow } from './components/layout/SavingThrow';

import AutoFillModal from './components/modals/AutoFillModal';
import ClassSkillModal from './components/modals/ClassSkillModal';
import RaceSkillModal from './components/modals/RaceSkillModal';
import BackgroundSkillModal from './components/modals/BackgroundSkillModal';

import {
  removeFeatureSection,
  rebuildSkills,
  getSkillSource,
  getSkillSourceExcludingClass
} from './logic/characterUtils';

import { CLASS_RECOMMENDATIONS } from './logic/class';
import { BACKGROUND_RECOMMENDATIONS } from './logic/backgrounds';
import { RACE_RECOMMENDATIONS } from './logic/race';

import { useCharacter } from './hooks/useCharacter';
import { getModifier } from './logic/modifiers';

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

  // -----------------------------
  // STATE FOR CLASS / RACE / BACKGROUND LOGIC
  // -----------------------------

  const [pendingClass, setPendingClass] = useState('');
  const [pendingRace, setPendingRace] = useState('');
  const [pendingBackground, setPendingBackground] = useState('');

  const [showAutoFillPrompt, setShowAutoFillPrompt] = useState(false);
  const [showClassSkillChoice, setShowClassSkillChoice] = useState(false);
  const [showRaceSkillChoice, setShowRaceSkillChoice] = useState(false);
  const [showBackgroundSkillChoice, setShowBackgroundSkillChoice] = useState(false);

  const [selectedClassSkills, setSelectedClassSkills] = useState<string[]>([]);
  const [selectedRaceSkills, setSelectedRaceSkills] = useState<string[]>([]);
  const [selectedBackgroundReplacementSkills, setSelectedBackgroundReplacementSkills] = useState<string[]>([]);

  const [appliedRaceSkills, setAppliedRaceSkills] = useState<string[]>([]);
  const [appliedClassSkills, setAppliedClassSkills] = useState<string[]>([]);
  const [appliedBackgroundSkills, setAppliedBackgroundSkills] = useState<string[]>([]);

  const [backgroundConflictingSkills, setBackgroundConflictingSkills] = useState<string[]>([]);
  const [backgroundNonConflictingSkills, setBackgroundNonConflictingSkills] = useState<string[]>([]);

  // -----------------------------
  // CLASS CHANGE LOGIC
  // -----------------------------

  const handleClassChange = (newClass: string) => {
    if (!newClass) return;

    const recommendations = CLASS_RECOMMENDATIONS[newClass];
    if (!recommendations) {
      setCharacter({ class: newClass });
      return;
    }

    setPendingClass(newClass);

    if (recommendations.skills.length === 0) {
      setCharacter({ class: newClass });
      return;
    }

    setShowAutoFillPrompt(true);
  };

  const applyClassRecommendations = () => {
    const rec = CLASS_RECOMMENDATIONS[pendingClass];
    if (!rec) return;

    if (rec.skillOptions) {
      setSelectedClassSkills([]);
      setShowClassSkillChoice(true);
    } else {
      applyClassFinal(rec, []);
    }

    setShowAutoFillPrompt(false);
  };

  const applyClassFinal = (rec: any, chosenSkills: string[]) => {
    const finalSkills = [...rec.skills, ...chosenSkills];

    const newSkills = rebuildSkills(
      character.race,
      appliedRaceSkills,
      finalSkills,
      appliedBackgroundSkills
    );

    let combinedFeatures = removeFeatureSection(character.features, 'CLASS FEATURES');
    if (rec.feature) {
      combinedFeatures =
        `=== CLASS FEATURES ===\n${rec.feature}` +
        (combinedFeatures ? `\n\n${combinedFeatures}` : '');
    }

    setAppliedClassSkills(finalSkills);
    setCharacter({
      ...character,
      class: pendingClass,
      skills: newSkills,
      features: combinedFeatures,
    });

    setPendingClass('');
  };

  const confirmClassSkillChoices = () => {
    const rec = CLASS_RECOMMENDATIONS[pendingClass];
    if (rec) {
      applyClassFinal(rec, selectedClassSkills);
    }
    setShowClassSkillChoice(false);
    setSelectedClassSkills([]);
  };

  const toggleClassSkillSelection = (skillName: string) => {
    const source = getSkillSourceExcludingClass(
      skillName,
      appliedRaceSkills,
      appliedBackgroundSkills,
      character
    );
    if (source) return;

    setSelectedClassSkills(prev =>
      prev.includes(skillName)
        ? prev.filter(s => s !== skillName)
        : [...prev, skillName]
    );
  };

  const declineAutoFill = () => {
    setCharacter({ class: pendingClass });
    setShowAutoFillPrompt(false);
    setPendingClass('');
  };

  // -----------------------------
  // RACE CHANGE LOGIC
  // -----------------------------

  const handleRaceChange = (newRace: string) => {
    const rec = RACE_RECOMMENDATIONS[newRace];
    if (!rec) {
      setCharacter({ race: newRace });
      return;
    }

    setPendingRace(newRace);

    if (rec.skillOptions && rec.skillOptions.length > 0) {
      setSelectedRaceSkills([]);
      setShowRaceSkillChoice(true);
    } else {
      applyRaceRecommendations(newRace, rec.skills);
    }
  };

  const applyRaceRecommendations = (race: string, skills: string[]) => {
    const newSkills = rebuildSkills(
      race,
      skills,
      appliedClassSkills,
      appliedBackgroundSkills
    );

    let combinedFeatures = removeFeatureSection(character.features, 'RACIAL TRAITS');
    const rec = RACE_RECOMMENDATIONS[race];
    if (rec?.feature) {
      combinedFeatures =
        `=== RACIAL TRAITS ===\n${rec.feature}` +
        (combinedFeatures ? `\n\n${combinedFeatures}` : '');
    }

    setAppliedRaceSkills(skills);
    setCharacter({
      ...character,
      race,
      skills: newSkills,
      features: combinedFeatures,
    });
  };

  const toggleRaceSkillSelection = (skillName: string) => {
    const source = getSkillSource(
      skillName,
      appliedRaceSkills,
      appliedClassSkills,
      appliedBackgroundSkills,
      character
    );
    if (source) return;

    setSelectedRaceSkills(prev =>
      prev.includes(skillName)
        ? prev.filter(s => s !== skillName)
        : [...prev, skillName]
    );
  };

  const confirmRaceSkillChoices = () => {
    const rec = RACE_RECOMMENDATIONS[pendingRace];
    if (rec) {
      applyRaceRecommendations(pendingRace, selectedRaceSkills);
    }
    setShowRaceSkillChoice(false);
    setPendingRace('');
    setSelectedRaceSkills([]);
  };

  // -----------------------------
  // BACKGROUND CHANGE LOGIC
  // -----------------------------

  const handleBackgroundChange = (newBackground: string) => {
    const rec = BACKGROUND_RECOMMENDATIONS[newBackground];
    if (!rec) {
      setCharacter({ background: newBackground });
      return;
    }

    setPendingBackground(newBackground);

    const conflicting: string[] = [];
    const nonConflicting: string[] = [];

    rec.skills.forEach(skill => {
      if (character.skills[skill]) conflicting.push(skill);
      else nonConflicting.push(skill);
    });

    if (conflicting.length > 0) {
      setBackgroundConflictingSkills(conflicting);
      setBackgroundNonConflictingSkills(nonConflicting);
      setSelectedBackgroundReplacementSkills([]);
      setShowBackgroundSkillChoice(true);
    } else {
      applyBackgroundRecommendations(newBackground, rec.skills);
    }
  };

  const applyBackgroundRecommendations = (background: string, skills: string[]) => {
    const rec = BACKGROUND_RECOMMENDATIONS[background];
    if (!rec) return;

    const newSkills = rebuildSkills(
      character.race,
      appliedRaceSkills,
      appliedClassSkills,
      skills
    );

    let combinedFeatures = removeFeatureSection(character.features, 'BACKGROUND FEATURE');
    if (rec.feature) {
      combinedFeatures =
        `=== BACKGROUND FEATURE ===\n${rec.feature}` +
        (combinedFeatures ? `\n\n${combinedFeatures}` : '');
    }

    setAppliedBackgroundSkills(skills);
    setCharacter({
      ...character,
      background,
      skills: newSkills,
      features: combinedFeatures,
      equipment: rec.equipment,
    });
  };

  const toggleBackgroundSkillSelection = (skillName: string) => {
    setSelectedBackgroundReplacementSkills(prev =>
      prev.includes(skillName)
        ? prev.filter(s => s !== skillName)
        : [...prev, skillName]
    );
  };

  const confirmBackgroundSkillChoices = () => {
    const rec = BACKGROUND_RECOMMENDATIONS[pendingBackground];
    if (rec) {
      const allSkills = [
        ...backgroundNonConflictingSkills,
        ...selectedBackgroundReplacementSkills,
      ];

      const newSkills = rebuildSkills(
        character.race,
        appliedRaceSkills,
        appliedClassSkills,
        allSkills
      );

      let combinedFeatures = removeFeatureSection(character.features, 'BACKGROUND FEATURE');
      if (rec.feature) {
        combinedFeatures =
          `=== BACKGROUND FEATURE ===\n${rec.feature}` +
          (combinedFeatures ? `\n\n${combinedFeatures}` : '');
      }

      setAppliedBackgroundSkills(allSkills);
      setCharacter({
        ...character,
        background: pendingBackground,
        skills: newSkills,
        features: combinedFeatures,
        equipment: rec.equipment,
      });
    }

    setShowBackgroundSkillChoice(false);
    setPendingBackground('');
    setSelectedBackgroundReplacementSkills([]);
  };

  // -----------------------------
  // DERIVED STATS
  // -----------------------------

  const proficiencyBonus = Math.ceil(character.level / 4) + 1;
  const initiative = getModifier(character.abilityScores.dexterity);
  const initiativeString = initiative >= 0 ? `+${initiative}` : `${initiative}`;

  // -----------------------------
  // RENDER
  // -----------------------------

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
          skillOptions={CLASS_RECOMMENDATIONS[pendingClass]?.skillOptions || []}
          requiredChoices={CLASS_RECOMMENDATIONS[pendingClass]?.requiredChoices || 0}
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
          requiredChoices={RACE_RECOMMENDATIONS[pendingRace]?.requiredChoices || 0}
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

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Scroll className="w-8 h-8 text-amber-700" />
            <h1 className="text-4xl text-amber-900">D&D Character Sheet</h1>
            <Swords className="w-8 h-8 text-amber-700" />
          </div>
          <p className="text-muted-foreground">Create your adventurer</p>
        </div>

        {/* Main Card */}
        <div className="bg-card border-2 border-amber-700 rounded-lg shadow-xl p-6 md:p-8">

          <CharacterInfoSection
            character={character}
            onCharacterChange={setCharacter}
            onClassChange={handleClassChange}
            onRaceChange={handleRaceChange}
            onBackgroundChange={handleBackgroundChange}
          />

          {/* Top Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

            <AbilityScoresSection
              character={character}
              onUpdateAbilityScore={updateAbilityScore}
            />

            <div>
              <h2 className="text-amber-900 mb-4 border-b-2 border-amber-700 pb-2">
                Saving Throws
              </h2>

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
                getSkillSource={(skill) =>
                  getSkillSource(
                    skill,
                    appliedRaceSkills,
                    appliedClassSkills,
                    appliedBackgroundSkills,
                    character
                  )
                }
                onToggleSkill={toggleSkillProficiency}
              />
            </div>

            <FeaturesSection
              character={character}
              onCharacterChange={setCharacter}
            />
          </div>

          {/* Middle Row */}
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
    </div>
  );
}