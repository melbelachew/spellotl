import React, { useState, useCallback } from 'react';
import './styles/global.css';
import { GradeBackground } from './components/backgrounds';
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
  const { grade, setGrade, getWords, customWords, updateCustomWords, clearCustom, wordCount } = useWords('custom');
  const { streak, increment, reset } = useStreak();
  const [screen, setScreen] = useState<Screen>('menu');
  const [showCustomPanel, setShowCustomPanel] = useState(true);
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
      <GradeBackground grade={grade} />
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
      <div className="app" role="main" style={{ flex: 1 }}>
        <div className="top-bar">
          <h1 className="logo">Spellotl🦎 </h1>
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
      <footer style={{
        position: 'relative',
        zIndex: 1,
        marginTop: 'auto',
        padding: '2rem 1rem 1.5rem',
        borderTop: '1px solid var(--border)',
      }}>
        <p style={{
          maxWidth: '680px',
          margin: '0 auto',
          textAlign: 'center',
          fontSize: '11px',
          color: 'var(--muted)',
          lineHeight: '1.7',
        }}>
          Spellotl is an independent practice tool and is not affiliated with, endorsed by, or sponsored by any official spelling bee organization. Word lists and definitions are provided for practice purposes only. Errors may occur. The creator assumes no liability for inaccuracies or outcomes resulting from use of this application.
          <br /><br />
          For feedback or to report issues, contact <a href="mailto:spellersrstarts@gmail.com" style={{color: 'var(--muted)', textDecoration: 'underline'}}>spellersrstarts@gmail.com</a>
        </p>
      </footer>
      </div>
    </>
  );
}
