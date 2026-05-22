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
    <h2 className="game-title">
      <span aria-hidden="true">{icon} </span>{title}
    </h2>
    <span
      className="score-badge"
      aria-live="polite"
      aria-atomic="true"
      aria-label={`${scoreLabel}: ${score} of ${total}`}
    >
      {scoreLabel}: {score} / {total}
    </span>
  </div>
);
