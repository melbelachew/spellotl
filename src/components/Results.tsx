import React from 'react';
import { GameMode } from '../types';
import { getMedal } from '../utils';

interface Props {
  score: number;
  total: number;
  streak: number;
  mode: GameMode;
  onPlayAgain: () => void;
  onMenu: () => void;
}

export const Results: React.FC<Props> = ({ score, total, streak, mode, onPlayAgain, onMenu }) => {
  const pct = Math.round((score / total) * 100);
  const { medal, msg } = getMedal(pct);

  return (
    <div className="game-area">
      <div className="game-header">
        <button className="back-btn" onClick={onMenu} aria-label="Back to menu">← Menu</button>
        <span style={{ fontFamily: 'var(--font-head)', fontSize: '1.1rem' }}>Results</span>
        <span />
      </div>
      <div className="results">
        <div className="results-medal">{medal}</div>
        <div className="results-score">{score} / {total}</div>
        <div className="results-msg">{msg}</div>
        <div className="stat-row">
          <div className="stat">
            <div className="stat-n" style={{ color: 'var(--accent3)' }}>{pct}%</div>
            <div className="stat-l">accuracy</div>
          </div>
          <div className="stat">
            <div className="stat-n" style={{ color: 'var(--accent)' }}>{streak}</div>
            <div className="stat-l">streak</div>
          </div>
        </div>
        <div className="results-actions">
          <button className="btn btn-primary" onClick={onPlayAgain}>Play Again</button>
          <button className="btn btn-warn" onClick={onMenu}>Change Mode</button>
        </div>
      </div>
    </div>
  );
};
