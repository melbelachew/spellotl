import React, { useState, useCallback } from 'react';
import './styles/global.css';
import { GradeKey, GameMode, Word } from './types';
import { useWords } from './hooks/useWords';
import { useStreak } from './hooks/useStreak';
import { GradeTabs } from './components/GradeTabs';
import { CustomPanel } from './components/CustomPanel';
import { MainMenu } from './components/MainMenu';
import { SpellingBee } from './components/SpellingBee';
import { WhichWord } from './components/WhichWord';
import { FlashCards } from './components/FlashCards';
import { MatchUp } from './components/MatchUp';

type Screen = 'menu' | GameMode;

export default function App() {
  const { grade, setGrade, getWords, customWords, updateCustomWords, clearCustom, wordCount } = useWords();
  const { streak, increment, reset } = useStreak();
  const [screen, setScreen] = useState<Screen>('menu');
  const [showCustomPanel, setShowCustomPanel] = useState(false);
  const [editingList, setEditingList] = useState(false);

  const handleGradeChange = useCallback((g: GradeKey) => {
    setGrade(g);
    setScreen('menu');
    if (g === 'custom') {
      setShowCustomPanel(customWords.length === 0);
    } else {
      setShowCustomPanel(false);
    }
    setEditingList(false);
  }, [setGrade, customWords.length]);

  const handleLoadList = useCallback((words: Word[]) => {
    updateCustomWords(words);
    setShowCustomPanel(false);
    setEditingList(false);
    setScreen('menu');
  }, [updateCustomWords]);

  const handleClearList = useCallback(() => {
    clearCustom();
    setShowCustomPanel(true);
    setScreen('menu');
  }, [clearCustom]);

  const handleEditList = useCallback(() => {
    setEditingList(true);
    setShowCustomPanel(true);
  }, []);

  const handleStartGame = useCallback((mode: GameMode) => {
    reset(Math.min(10, getWords().length));
    setScreen(mode);
  }, [reset, getWords]);

  const handleBack = useCallback(() => {
    setScreen('menu');
    if (grade === 'custom' && customWords.length === 0) {
      setShowCustomPanel(true);
    }
  }, [grade, customWords.length]);

  const words = getWords();
  const isCustom = grade === 'custom';
  const hasCustomList = customWords.length > 0;
  const showPanel = isCustom && (showCustomPanel || (hasCustomList && editingList));

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <div className="app" role="main">
        <div className="top-bar">
          <h1 className="logo">Spell<span>Star</span> ⭐</h1>
        </div>

        {screen === 'menu' && (
          <>
            <GradeTabs current={grade} onChange={handleGradeChange} />

            {showPanel && (
              <CustomPanel
                onLoad={handleLoadList}
                onClear={handleClearList}
                initialValue={editingList ? customWords.map(w => `${w.w}: ${w.d}`).join('\n') : ''}
              />
            )}

            <MainMenu
              wordCount={wordCount}
              isCustom={isCustom}
              hasCustomList={hasCustomList && !showPanel}
              onStart={handleStartGame}
              onEditList={handleEditList}
            />
          </>
        )}

        {screen === 'bee' && (
          <SpellingBee
            words={words}
            onBack={handleBack}
            streak={streak}
            onCorrect={increment}
            onReset={reset}
          />
        )}

        {screen === 'quiz' && (
          <WhichWord
            words={words}
            onBack={handleBack}
            streak={streak}
            onCorrect={increment}
            onReset={reset}
          />
        )}

        {screen === 'flash' && (
          <FlashCards
            words={words}
            onBack={handleBack}
            onReset={reset}
          />
        )}

        {screen === 'match' && (
          <MatchUp
            words={words}
            onBack={handleBack}
            streak={streak}
            onCorrect={increment}
            onReset={reset}
          />
        )}
      </div>
    </>
  );
}
