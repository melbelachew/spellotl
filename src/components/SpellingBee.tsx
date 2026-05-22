import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Word } from '../types';
import { pickAvoiding, speak, speakAndSpell, stopSpeaking } from '../utils';
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

type BeeState = 'playing' | 'results';

export const SpellingBee: React.FC<Props> = ({ words, onBack, streak, onCorrect, onReset, recentWords, onWordsUsed }) => {
  const totalQ = Math.min(10, words.length);
  const [round, setRound] = useState(0);
  const [qWords, setQWords] = useState<Word[]>(() => pickAvoiding(words, totalQ, recentWords));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [input, setInput] = useState('');
  const [inputState, setInputState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [feedback, setFeedback] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [checked, setChecked] = useState(false);
  const [screen, setScreen] = useState<BeeState>('playing');
  const [speaking, setSpeaking] = useState<'hear' | 'spell' | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      stopSpeaking();
    };
  }, []);

  const playAudio = useCallback(async (which: 'hear' | 'spell', word: string) => {
    if (speaking) return;
    setSpeaking(which);
    try {
      if (which === 'hear') await speak(word);
      else await speakAndSpell(word);
    } finally {
      if (isMounted.current) setSpeaking(null);
    }
  }, [speaking]);

  useEffect(() => {
    onReset(totalQ);
    onWordsUsed(qWords.map(w => w.w));
  }, [round]); // eslint-disable-line

  useEffect(() => {
    if (screen !== 'playing') return;
    const word = qWords[index]?.w || '';
    const timer = setTimeout(() => {
      if (word) playAudio('hear', word);
      inputRef.current?.focus();
    }, 300);
    return () => clearTimeout(timer);
  }, [index, screen]); // eslint-disable-line

  const checkAnswer = useCallback(() => {
    if (checked) return;
    const val = input.trim().toLowerCase();
    if (!val) {
      setFeedback('✍️ Please type a word first');
      setInputState('idle');
      inputRef.current?.focus();
      return;
    }
    stopSpeaking();
    const correct = qWords[index].w.toLowerCase();
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
    stopSpeaking();
    setIndex(i => {
      const nextIdx = i + 1;
      if (nextIdx >= totalQ) {
        setScreen('results');
        return i; // don't increment past the end
      }
      setInput('');
      setInputState('idle');
      setFeedback('');
      setShowHint(false);
      setChecked(false);
      return nextIdx;
    });
  };

  const playAgain = useCallback(() => {
    setQWords(pickAvoiding(words, totalQ, recentWords));
    setIndex(0);
    setScore(0);
    setInput('');
    setInputState('idle');
    setFeedback('');
    setShowHint(false);
    setChecked(false);
    setScreen('playing');
    setRound(r => r + 1);
  }, [words, totalQ, recentWords]);

  if (screen === 'results') {
    return <Results score={score} total={totalQ} streak={streak} mode="bee" onPlayAgain={playAgain} onMenu={onBack} />;
  }

  const item = qWords[index];
  if (!item) {
    // Defensive: state somehow drifted past the deck; bail to results.
    return <Results score={score} total={totalQ} streak={streak} mode="bee" onPlayAgain={playAgain} onMenu={onBack} />;
  }

  return (
    <div className="game-area" aria-live="polite">
      <GameHeader title="Spelling Bee" icon="🐝" score={score} total={totalQ} onBack={onBack} />
      <ProgressBar current={index} total={totalQ} />
      <div className="word-display">
        <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>Word {Math.min(index + 1, totalQ)} of {totalQ}</div>
        <div className="bee-controls">
          <button
            className={`tts-btn${speaking === 'hear' ? ' tts-playing' : ''}`}
            onClick={() => playAudio('hear', item.w)}
            disabled={speaking !== null}
            aria-label={speaking === 'hear' ? 'Playing audio' : 'Hear the word spoken aloud'}
            aria-live="polite"
          >
            {speaking === 'hear' ? <><span className="tts-icon">🔊</span> Playing…</> : <>🔊 Hear it</>}
          </button>
          <button
            className={`tts-btn${speaking === 'spell' ? ' tts-playing' : ''}`}
            onClick={() => playAudio('spell', item.w)}
            disabled={speaking !== null}
            aria-label={speaking === 'spell' ? 'Playing audio' : 'Hear the word spoken and spelled out'}
            aria-live="polite"
          >
            {speaking === 'spell' ? <><span className="tts-icon">✏️</span> Playing…</> : <>✏️ Spell it</>}
          </button>
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
