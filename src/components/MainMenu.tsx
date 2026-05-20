import React from 'react';
import { GameMode } from '../types';

interface Props {
  wordCount: number;
  isCustom: boolean;
  hasCustomList: boolean;
  onStart: (mode: GameMode) => void;
  onEditList: () => void;
}

const MODES: { mode: GameMode; icon: string; title: string; desc: string; cls: string }[] = [
  { mode: 'bee', icon: '🐝', title: 'Spelling Bee', desc: 'Type the word you hear', cls: 'bee' },
  { mode: 'quiz', icon: '🎯', title: 'Which Word?', desc: 'Match the definition to a word', cls: 'quiz' },
  { mode: 'flash', icon: '⚡', title: 'Flash Cards', desc: 'Study & flip to check', cls: 'flash' },
  { mode: 'match', icon: '🃏', title: 'Match Up', desc: 'Match word to definition', cls: 'match' },
];

export const MainMenu: React.FC<Props> = ({ wordCount, isCustom, hasCustomList, onStart, onEditList }) => {
  const showGames = !isCustom || hasCustomList;

  return (
    <div id="main-content">
      {showGames && (
        <>
          <div className="menu-grid" id="menu-grid">
            {MODES.map(({ mode, icon, title, desc, cls }) => (
              <button
                key={mode}
                className={`mode-card ${cls}`}
                onClick={() => onStart(mode)}
                type="button"
                aria-label={`Start ${title}`}
              >
                <span className="icon">{icon}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </button>
            ))}
          </div>
          <div className="word-count">
            <span>{wordCount} words available</span>
            {isCustom && hasCustomList && (
              <button className="edit-list-btn" onClick={onEditList}>✏️ Edit List</button>
            )}
          </div>
        </>
      )}
    </div>
  );
};
