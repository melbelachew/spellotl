import React, { useState, useEffect, useCallback } from 'react';
import { Word } from '../types';
import { pickAvoiding, shuffle } from '../utils';
import { GameHeader } from './GameHeader';
import { ProgressBar } from './ProgressBar';
import { Results } from './Results';

interface Props {
  words: Word[];
  onBack: () => void;
  streak: number;
  onCorrect: () => void;
  onReset: (total: number) => void;
  recentWords: string[];
  onWordsUsed: (words: string[]) => void;
}

export const WhichWord: React.FC<Props> = ({ words, onBack, streak, onCorrect, onReset, recentWords, onWordsUsed }) => {
  const totalQ = Math.min(10, words.length);
  const [round, setRound] = useState(0);

  // Build a round: pick words + precompute choices for each question.
  const buildRound = useCallback((avoid: string[]) => {
    const picked = pickAvoiding(words, Math.min(totalQ + 5, words.length), avoid);
    const cs = picked.slice(0, totalQ).map(correct => {
      const pool = words.filter(x => x.w !== correct.w);
      const others = shuffle(pool).slice(0, Math.min(3, pool.length));
      return shuffle([correct, ...others]);
    });
    return { picked, choices: cs };
  }, [words, totalQ]);

  // Both qWords and choices must come from the SAME buildRound call so
  // each question's choice list contains the correct answer. Build once
  // here and seed both pieces of state.
  const [initialRound] = useState(() => buildRound(recentWords));
  const [qWords, setQWords] = useState<Word[]>(initialRound.picked);
  const [choices, setChoices] = useState<Word[][]>(initialRound.choices);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [screen, setScreen] = useState<'playing' | 'results'>('playing');

  useEffect(() => {
    onReset(totalQ);
    onWordsUsed(qWords.slice(0, totalQ).map(w => w.w));
  }, [round]); // eslint-disable-line

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

  const playAgain = useCallback(() => {
    const fresh = buildRound(recentWords);
    setQWords(fresh.picked);
    setChoices(fresh.choices);
    setIndex(0);
    setScore(0);
    setChosen(null);
    setScreen('playing');
    setRound(r => r + 1);
  }, [buildRound, recentWords]);

  if (screen === 'results') {
    return <Results score={score} total={totalQ} streak={streak} mode="quiz" onPlayAgain={playAgain} onMenu={onBack} />;
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
