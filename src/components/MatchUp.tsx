import React, { useState, useCallback, useRef } from 'react';
import { Word, MatchTile } from '../types';
import { shuffle } from '../utils';
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

type TileState = 'idle' | 'selected' | 'matched' | 'wrong';

export const MatchUp: React.FC<Props> = ({ words, onBack, streak, onCorrect, onReset }) => {
  const pairCount = Math.min(6, words.length);
  const [pool] = useState<Word[]>(() => shuffle(words).slice(0, pairCount));
  const [tiles] = useState<MatchTile[]>(() => {
    const t: MatchTile[] = [];
    pool.forEach((w, i) => {
      t.push({ id: `w${i}`, text: w.w, pair: i, type: 'word' });
      t.push({ id: `d${i}`, text: w.d, pair: i, type: 'def' });
    });
    return shuffle(t);
  });

  const [tileStates, setTileStates] = useState<Record<string, TileState>>(
    () => Object.fromEntries(tiles.map(t => [t.id, 'idle']))
  );
  const [selected, setSelected] = useState<MatchTile | null>(null);
  const [score, setScore] = useState(0);
  const [matched, setMatched] = useState(0);
  const animating = useRef(false);

  const total = pairCount;

  React.useEffect(() => { onReset(total); }, []); // eslint-disable-line

  const setTileState = useCallback((id: string, state: TileState) => {
    setTileStates(prev => ({ ...prev, [id]: state }));
  }, []);

  const select = useCallback((tile: MatchTile) => {
    if (animating.current) return;
    if (tileStates[tile.id] === 'matched') return;

    // Deselect
    if (selected?.id === tile.id) {
      setTileState(tile.id, 'idle');
      setSelected(null);
      return;
    }

    // Same type — shake the second tile
    if (selected && selected.type === tile.type) {
      setTileState(tile.id, 'wrong');
      setTimeout(() => setTileState(tile.id, 'idle'), 400);
      return;
    }

    if (!selected) {
      setTileState(tile.id, 'selected');
      setSelected(tile);
      return;
    }

    // Correct pair
    if (selected.pair === tile.pair) {
      setTileStates(prev => ({ ...prev, [selected.id]: 'matched', [tile.id]: 'matched' }));
      setSelected(null);
      setScore(s => s + 1);
      setMatched(m => m + 1);
      onCorrect();
    } else {
      // Wrong pair
      animating.current = true;
      setTileStates(prev => ({ ...prev, [selected.id]: 'wrong', [tile.id]: 'wrong' }));
      setSelected(null);
      setTimeout(() => {
        setTileStates(prev => ({ ...prev, [selected.id]: 'idle', [tile.id]: 'idle' }));
        animating.current = false;
      }, 600);
    }
  }, [selected, tileStates, setTileState, onCorrect]);

  if (matched === total) {
    return <Results score={score} total={total} streak={streak} mode="match" onPlayAgain={() => window.location.reload()} onMenu={onBack} />;
  }

  const getTileStyle = (tile: MatchTile): React.CSSProperties => {
    const state = tileStates[tile.id];
    if (state === 'matched') return { borderColor: 'var(--accent3)', background: '#e8f7f0', color: 'var(--accent3)', cursor: 'default' };
    if (state === 'selected') return { borderColor: 'var(--accent2)', background: '#e8e0ff', color: 'var(--accent2)' };
    if (state === 'wrong') return { borderColor: 'var(--accent4)', background: '#fde8ed' };
    if (tile.type === 'def') return { borderColor: 'var(--accent)', background: '#fff7e6' };
    return { borderColor: 'var(--border)', background: 'var(--bg)' };
  };

  const getTileClass = (tile: MatchTile): string => {
    const state = tileStates[tile.id];
    let cls = 'match-tile';
    if (tile.type === 'def') cls += ' def-tile';
    if (state === 'matched') cls += ' matched';
    if (state === 'wrong') cls += ' shake';
    return cls;
  };

  return (
    <div className="game-area" aria-live="polite">
      <GameHeader title="Match Up" icon="🃏" score={matched} total={total} scoreLabel="Matched" onBack={onBack} />
      <ProgressBar current={matched} total={total} />
      <p className="match-instruction">Match each word to its definition</p>
      <div className="match-grid">
        {tiles.map(tile => (
          <div
            key={tile.id}
            className={getTileClass(tile)}
            style={getTileStyle(tile)}
            onClick={() => select(tile)}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') select(tile); }}
            tabIndex={tileStates[tile.id] === 'matched' ? -1 : 0}
            role="button"
            aria-label={`${tile.type === 'word' ? 'Word' : 'Definition'}: ${tile.text}`}
            aria-pressed={tileStates[tile.id] === 'selected'}
          >
            {tile.text}
          </div>
        ))}
      </div>
    </div>
  );
};
