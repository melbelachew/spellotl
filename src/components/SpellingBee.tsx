import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Word } from '../types';
import { pick, speak } from '../utils';
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

type BeeState = 'playing' | 'results';

export const SpellingBee: React.FC<Props> = ({ words, onBack, streak, onCorrect, onReset }) => {
  const totalQ = Math.min(10, words.length);
  const [qWords] = useState<Word[]>(() => pick(words, totalQ));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [input, setInput] = useState('');
  const [inputState, setInputState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [feedback, setFeedback] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [checked, setChecked] = useState(false);
  const [screen, setScreen] = useState<BeeState>('playing');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onReset(totalQ);
  }, []); // eslint-disable-line

  useEffect(() => {
    if (screen !== 'playing') return;
    const timer = setTimeout(() => {
      speak(qWords[index]?.w || '');
      inputRef.current?.focus();
    }, 300);
    return () => clearTimeout(timer);
  }, [index, screen]); // eslint-disable-line

  const checkAnswer = useCallback(() => {
    if (checked) return;
    const correct = qWords[index].w.toLowerCase();
    const val = input.trim().toLowerCase();
    const isCorrect = val === correct || correct.split('/').map(s => s.trim()).includes(val);
    setInputState(isCorrect ? 'correct' : 'wrong');
    setChecked(true);
    if (isCorrect) {
      setScore(s => s + 1);
      onCorrect();
      setFeedback(`✅ Correct! "${qWords[index].w}"`);
    } else {
      setFeedback(`❌ The correct spelling is: ${qWords[index].w}`);
    }
  }, [checked, input, index, qWords, onCorrect]);

  const next = () => {
    if (index + 1 >= totalQ) {
      setScreen('results');
    } else {
      setIndex(i => i + 1);
      setInput('');
      setInputState('idle');
      setFeedback('');
      setShowHint(false);
      setChecked(false);
    }
  };

  if (screen === 'results') {
    return <Results score={score} total={totalQ} streak={streak} mode="bee" onPlayAgain={() => window.location.reload()} onMenu={onBack} />;
  }

  const item = qWords[index];

  return (
    <div className="game-area" aria-live="polite">
      <GameHeader title="Spelling Bee" icon="🐝" score={score} total={totalQ} onBack={onBack} />
      <ProgressBar current={index} total={totalQ} />
      <div className="word-display">
        <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>Word {index + 1} of {totalQ}</div>
        <div className="bee-controls">
          <button className="tts-btn" onClick={() => speak(item.w)} aria-label="Hear the word spoken aloud">🔊 Hear it</button>
          {!showHint && (
            <button className="tts-btn" onClick={() => setShowHint(true)} aria-label="Show hint">💡 Hint</button>
          )}
        </div>
        {showHint && <div className="hint-text">{item.d}</div>}
        <div className="spell-input-wrap">
          <input
            ref={inputRef}
            className={`spell-input${inputState !== 'idle' ? ` ${inputState}` : ''}`}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') checkAnswer(); }}
            placeholder="Type the word..."
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            disabled={checked}
            aria-label="Type your spelling"
          />
          <button className="btn btn-primary" onClick={checkAnswer} disabled={checked}>Check</button>
        </div>
        {feedback && (
          <div className={`feedback ${inputState}`} role="alert">{feedback}</div>
        )}
        {checked && (
          <div className="next-btn-row">
            <button className="btn btn-success" onClick={next}>
              {index + 1 >= totalQ ? 'See Results' : 'Next Word →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
