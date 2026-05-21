import React, { useState, useEffect } from 'react';
import { Word } from '../types';
import { shuffle, speak, stopSpeaking } from '../utils';
import { GameHeader } from './GameHeader';
import { ProgressBar } from './ProgressBar';

interface Props {
  words: Word[];
  onBack: () => void;
  onReset: (total: number) => void;
}

export const FlashCards: React.FC<Props> = ({ words, onBack, onReset }) => {
  const [deck, setDeck] = useState<Word[]>(() => shuffle(words));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [maxIdx, setMaxIdx] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => { onReset(deck.length); }, []); // eslint-disable-line

  useEffect(() => {
    return () => { stopSpeaking(); };
  }, []);

  const total = deck.length;
  const item = deck[index];

  const flip = () => {
    setFading(true);
    setTimeout(() => { setFlipped(f => !f); setFading(false); }, 150);
  };

  const nav = (dir: number) => {
    if (index + dir < 0) return;
    if (index + dir >= total) { onBack(); return; }
    const next = index + dir;
    setIndex(next);
    if (next > maxIdx) setMaxIdx(next);
    setFlipped(false);
  };

  const reshuffle = () => {
    setDeck(shuffle(words));
    setIndex(0);
    setMaxIdx(0);
    setFlipped(false);
  };

  return (
    <div className="game-area">
      <GameHeader title="Flash Cards" icon="⚡" score={index + 1} total={total} scoreLabel="Card" onBack={onBack} />
      <ProgressBar current={maxIdx + 1} total={total} />
      <div
        className="flash-card"
        onClick={flip}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') flip(); }}
        role="button"
        tabIndex={0}
        aria-label={`Flash card — press Enter or Space to flip. ${flipped ? 'Showing definition' : 'Showing word'}`}
      >
        <div className="flash-inner" style={{ opacity: fading ? 0 : 1 }}>
          {flipped ? item.d : item.w}
        </div>
      </div>
      <div className="flash-hint">
        {flipped ? '📖 Definition — tap card to see spelling' : '✨ Word — tap card to reveal definition'}
      </div>
      <div className="flash-controls">
        <button className="btn btn-warn" onClick={() => nav(-1)} disabled={index === 0} aria-label="Previous card">
          ← Prev
        </button>
        <button className="btn btn-success" onClick={() => nav(1)} aria-label={index === total - 1 ? 'Finish' : 'Next card'}>
          {index === total - 1 ? 'Done ✓' : 'Next →'}
        </button>
        <button className="btn btn-primary" onClick={() => speak(item.w)} aria-label="Hear the word spoken aloud">
          🔊 Hear
        </button>
        <button className="btn btn-neutral" onClick={reshuffle} aria-label="Shuffle flash cards">
          🔀 Shuffle
        </button>
      </div>
    </div>
  );
};
