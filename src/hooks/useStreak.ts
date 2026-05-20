import { useState, useCallback } from 'react';

export function useStreak() {
  const [streak, setStreak] = useState(0);
  const [total, setTotal] = useState(0);

  const increment = useCallback(() => setStreak(s => s + 1), []);
  const reset = useCallback((newTotal: number) => {
    setStreak(0);
    setTotal(newTotal);
  }, []);

  return { streak, total, increment, reset };
}
