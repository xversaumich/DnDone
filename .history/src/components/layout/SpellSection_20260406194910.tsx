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

          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div>
            <CharacterPortraitSection
              onGeneratePortrait={() => alert('AI portrait generation coming soon!')}
            />
          </div>

          <h2 className="text-amber-900 mb-4 border-b-2 border-amber-700 pb-2 lg:col-span-2">
            Spellcasting
          </h2>

          <div className="lg:col-span-2">
            <SpellSection
              character={character}
              onUpdateCantrip={updateCantrip}
              onUpdateSpell={updateSpell}
            />
          </div>

        </div>
      </div>
    </div>
  </div>
);