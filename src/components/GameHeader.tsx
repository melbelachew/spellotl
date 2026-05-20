import React from 'react';

interface Props {
  title: string;
  icon: string;
  score: number;
  total: number;
  scoreLabel?: string;
  onBack: () => void;
}

export const GameHeader: React.FC<Props> = ({ title, icon, score, total, scoreLabel = 'Score', onBack }) => (
  <div className="game-header">
    <button className="back-btn" onClick={onBack} aria-label="Back to menu">← Menu</button>
    <span style={{ fontFamily: 'var(--font-head)', fontSize: '1.1rem' }}>{icon} {title}</span>
    <span className="score-badge">{scoreLabel}: {score} / {total}</span>
  </div>
);
