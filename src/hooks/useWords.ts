import { useState, useCallback } from 'react';
import wordsData from '../data/words.json';
import { Word, GradeKey } from '../types';
import { loadCustomList, saveCustomList, clearCustomList as clearStorage } from '../utils';

const WORDS: Record<string, Word[]> = wordsData as Record<string, Word[]>;

WORDS.all = [
  ...WORDS['K'], ...WORDS['1st'], ...WORDS['2nd'], ...WORDS['3rd'], ...WORDS['4th'],
  ...WORDS['5th'], ...WORDS['6th'], ...WORDS['7th'], ...WORDS['8th'],
  ...WORDS['9th'], ...WORDS['10th'], ...WORDS['11th'], ...WORDS['12th'],
  ...WORDS['finals']
];

export function useWords(initialGrade: GradeKey = '5th') {
  const [grade, setGradeState] = useState<GradeKey>(initialGrade);
  const [customWords, setCustomWords] = useState<Word[]>(loadCustomList);

  const getWords = useCallback((): Word[] => {
    if (grade === 'custom') return customWords;
    return WORDS[grade] || [];
  }, [grade, customWords]);

  const setGrade = useCallback((g: GradeKey) => {
    setGradeState(g);
  }, []);

  const updateCustomWords = useCallback((words: Word[]) => {
    setCustomWords(words);
    saveCustomList(words);
  }, []);

  const clearCustom = useCallback(() => {
    setCustomWords([]);
    clearStorage();
  }, []);

  const wordCount = grade === 'custom' ? customWords.length : (WORDS[grade]?.length ?? 0);

  return { grade, setGrade, getWords, customWords, updateCustomWords, clearCustom, wordCount };
}
