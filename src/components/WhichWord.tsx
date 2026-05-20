import React, { useState, useEffect, useCallback } from 'react';
import { Word } from '../types';
import { pick, shuffle } from '../utils';
import { GameHeader } from './GameHeader';
import { ProgressBar } from './ProgressBar';
import { Results } from './Results';

interface Props {
  words: Word[];
  onBack: () => void;
  streak: number;
  onCorrect: () => void;
  onReset: (total: number) => void;
}

export const WhichWord: React.FC<Props> = ({ words, onBack, streak, onCorrect, onReset }) => {
  const totalQ = Math.min(10, words.length);
  const [qWords] = useState<Word[]>(() => pick(words, Math.min(totalQ + 5, words.length)));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [screen, setScreen] = useState<'playing' | 'results'>('playing');

  useEffect(() => { onReset(totalQ); }, []); // eslint-disable-line

  const buildChoices = useCallback((idx: number): Word[] => {
    const correct = qWords[idx];
    const pool = words.filter(x => x.w !== correct.w);
    const others = shuffle(pool).slice(0, Math.min(3, pool.length));
    return shuffle([correct, ...others]);
  }, [qWords, words]);

  const [choices] = useState<Word[][]>(() =>
    qWords.slice(0, totalQ).map((_, i) => buildChoices(i))
  );

  const check = (w: string) => {
    if (chosen) return;
    setChosen(w);
    if (w === qWords[index].w) {
      setScore(s => s + 1);
      onCorrect();
    }
  };

  const next = () => {
    if (index + 1 >= totalQ) { setScreen('results'); return; }
    setIndex(i => i + 1);
    setChosen(null);
  };

  if (screen === 'results') {
    return <Results score={score} total={totalQ} streak={streak} mode="quiz" onPlayAgain={() => window.location.reload()} onMenu={onBack} />;
  }

  const item = qWords[index];
  const currentChoices = choices[index];
  const isCorrect = chosen === item.w;

  return (
    <div className="game-area" aria-live="polite">
      <GameHeader title="Which Word?" icon="🎯" score={score} total={totalQ} onBack={onBack} />
      <ProgressBar current={index} total={totalQ} />
      <div style={{ textAlign: 'center', padding: '1rem 0 0.5rem' }}>
        <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '6px' }}>Word {index + 1} of {totalQ}</div>
        <div className="quiz-prompt">{item.d}</div>
        <div className="quiz-instruction">Which word matches this definition?</div>
      </div>
      <div className="choices">
        {currentChoices.map(c => {
          let cls = 'choice-btn';
          if (chosen) {
            if (c.w === item.w) cls += ' correct';
            else if (c.w === chosen) cls += ' wrong';
          }
          return (
            <button
              key={c.w}
              className={cls}
              onClick={() => check(c.w)}
              disabled={!!chosen}
              aria-label={`Choose ${c.w}`}
            >
              {c.w}
            </button>
          );
        })}
      </div>
      {chosen && (
        <>
          <div className={`feedback ${isCorrect ? 'correct' : 'wrong'}`} role="alert">
            {isCorrect ? '✅ Correct!' : `❌ The answer was: ${item.w}`}
          </div>
          <div className="next-btn-row">
            <button className="btn btn-success" onClick={next}>
              {index + 1 >= totalQ ? 'See Results' : 'Next →'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};
