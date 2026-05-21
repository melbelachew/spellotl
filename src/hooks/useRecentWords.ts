import { useState, useCallback, useRef } from 'react';

/**
 * Tracks words used in recent game sessions so the next game can prefer
 * fresh words. The buffer is bounded — once it fills up, oldest words drop
 * out so the player isn't permanently locked away from any word.
 */
const MAX_RECENT = 30;

export function useRecentWords() {
  const [recent, setRecent] = useState<string[]>([]);
  // Mirror in a ref so callbacks always see the latest value without
  // re-creating themselves on every render.
  const recentRef = useRef<string[]>([]);
  recentRef.current = recent;

  const markUsed = useCallback((words: string[]) => {
    if (!words.length) return;
    setRecent(prev => {
      const merged = [...prev, ...words.map(w => w.toLowerCase())];
      // Trim from the front (oldest first) if we exceed cap
      return merged.length > MAX_RECENT ? merged.slice(merged.length - MAX_RECENT) : merged;
    });
  }, []);

  const clear = useCallback(() => {
    setRecent([]);
  }, []);

  return { recent, markUsed, clear };
}
