import { Word } from '../types';

export function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function pick(words: Word[], n: number): Word[] {
  return shuffle(words).slice(0, n);
}

function getBestVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
  if (!voices.length) return null;
  const priority = [
    (v: SpeechSynthesisVoice) => /premium|enhanced|neural/i.test(v.name) && v.lang === 'en-US',
    (v: SpeechSynthesisVoice) => /google/i.test(v.name) && v.lang === 'en-US',
    (v: SpeechSynthesisVoice) => v.lang === 'en-US',
    (v: SpeechSynthesisVoice) => v.lang.startsWith('en'),
  ];
  for (const test of priority) {
    const match = voices.find(test);
    if (match) return match;
  }
  return voices[0];
}

function waitForVoices(): Promise<void> {
  return new Promise(resolve => {
    if (window.speechSynthesis.getVoices().length > 0) { resolve(); return; }
    window.speechSynthesis.onvoiceschanged = () => resolve();
    // Fallback — some browsers never fire onvoiceschanged
    setTimeout(resolve, 1000);
  });
}

async function sayUtterance(text: string, rate = 0.70): Promise<void> {
  await waitForVoices();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = rate;
  u.pitch = 1.0;
  const voice = getBestVoice();
  if (voice) u.voice = voice;
  window.speechSynthesis.speak(u);
}

export async function speak(word: string): Promise<void> {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  await sayUtterance(word, 0.85);
}

export async function speakAndSpell(word: string): Promise<void> {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  await waitForVoices();
  // Say the word
  const wordU = new SpeechSynthesisUtterance(word);
  wordU.rate = 0.70;
  wordU.pitch = 1.0;
  const voice = getBestVoice();
  if (voice) wordU.voice = voice;
  // Spell it out after a pause
  const spelled = word.split('').join('. ') + '.';
  const spellU = new SpeechSynthesisUtterance(spelled);
  spellU.rate = 0.70;
  spellU.pitch = 1.0;
  if (voice) spellU.voice = voice;
  // Say it again after spelling
  const repeatU = new SpeechSynthesisUtterance(word);
  repeatU.rate = 0.70;
  repeatU.pitch = 1.0;
  if (voice) repeatU.voice = voice;
  window.speechSynthesis.speak(wordU);
  window.speechSynthesis.speak(spellU);
  window.speechSynthesis.speak(repeatU);
}

export function getMedal(pct: number): { medal: string; msg: string } {
  if (pct >= 90) return { medal: '🏆', msg: "Outstanding! You're a spelling champion!" };
  if (pct >= 70) return { medal: '🥇', msg: 'Great job! Almost perfect!' };
  if (pct >= 50) return { medal: '🥈', msg: 'Good effort! Keep it up!' };
  return { medal: '🥉', msg: 'Keep practicing!' };
}

export async function fetchDefinition(word: string): Promise<string | null> {
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.toLowerCase())}`);
    if (res.ok) {
      const data = await res.json();
      const def = data[0]?.meanings?.[0]?.definitions?.[0]?.definition;
      if (def) return def;
    }
  } catch {}
  try {
    const url = `https://corsproxy.io/?${encodeURIComponent(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.toLowerCase())}`)}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const def = data[0]?.meanings?.[0]?.definitions?.[0]?.definition;
      if (def) return def;
    }
  } catch {}
  return null;
}

export function handleListPaste(e: React.ClipboardEvent<HTMLTextAreaElement>): string {
  e.preventDefault();
  const cd = e.clipboardData;
  let text = '';
  const html = cd.getData('text/html');
  if (html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    div.querySelectorAll('p, br, div, li').forEach(el => {
      el.insertAdjacentText('beforebegin', '\n');
    });
    text = div.textContent || div.innerText || '';
  }
  if (!text.trim()) text = cd.getData('text/plain');
  return text.replace(/\r\n|\r/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

export function parseWordList(raw: string): Word[] {
  let lines = raw.split(/\r\n|\r|\n/).map(l => l.trim()).filter(l => l.length > 0);
  return lines.map(line => {
    const idx = line.indexOf(':');
    if (idx > 0) {
      return { w: line.slice(0, idx).trim(), d: line.slice(idx + 1).trim() };
    }
    return { w: line.trim(), d: '' };
  }).filter(x => x.w.length > 0);
}

export const STORAGE_KEY = 'spellotl_custom';

export function saveCustomList(words: Word[]): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(words)); } catch {}
}

export function loadCustomList(): Word[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return [];
}

export function clearCustomList(): void {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}
