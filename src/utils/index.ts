import { Word } from '../types';

export function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function pick(words: Word[], n: number): Word[] {
  return shuffle(words).slice(0, n);
}

/**
 * Pick n words from the list, preferring words not in `avoid`. Falls back to
 * the full list if there aren't enough fresh words (so games never under-fill).
 * Comparison is case-insensitive on the `w` field.
 */
export function pickAvoiding(words: Word[], n: number, avoid: string[]): Word[] {
  if (n >= words.length) return shuffle(words).slice(0, n);
  const avoidSet = new Set(avoid.map(w => w.toLowerCase()));
  const fresh = words.filter(x => !avoidSet.has(x.w.toLowerCase()));
  if (fresh.length >= n) return shuffle(fresh).slice(0, n);
  // Not enough fresh words — take all fresh, then top up from the avoid list.
  const stale = words.filter(x => avoidSet.has(x.w.toLowerCase()));
  return [...shuffle(fresh), ...shuffle(stale)].slice(0, n);
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

// Estimate how long an utterance should take, so we can set a sane hard
// timeout if onend never fires. Real speech is ~12 chars/sec at rate=1.0;
// scale inversely with rate, then pad generously.
function estimateDurationMs(text: string, rate: number): number {
  const charsPerSecAt1x = 12;
  const seconds = text.length / (charsPerSecAt1x * rate);
  return Math.max(2000, seconds * 1000 + 1500);
}

/**
 * Reset the speech synth queue. Calling cancel() alone can leave Chrome
 * in a state where the *next* utterance silently fails. The trick is to
 * cancel, then immediately resume — flushes the pipeline cleanly.
 */
function resetSpeechQueue(): void {
  if (!window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();
  } catch {}
}

// Tracks the in-flight speech promise so external stopSpeaking() calls
// can resolve it immediately. cancel() doesn't reliably fire onend or
// onerror, so without this the caller's `finally` block would hang
// until the safety-net timeout.
let activeFinish: (() => void) | null = null;

async function sayUtterance(text: string, rate = 0.70): Promise<void> {
  await waitForVoices();
  return new Promise<void>(resolve => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      if (activeFinish === finish) activeFinish = null;
      resolve();
    };
    activeFinish = finish;

    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;
    u.pitch = 1.0;
    const voice = getBestVoice();
    if (voice) u.voice = voice;
    u.onend = finish;
    u.onerror = finish;

    // Hard timeout — if the browser drops onend on the floor, we still
    // resolve so the UI doesn't get stuck on "Playing…" forever.
    const timer = setTimeout(() => {
      resetSpeechQueue();
      finish();
    }, estimateDurationMs(text, rate));

    window.speechSynthesis.speak(u);
  });
}

export async function speak(word: string): Promise<void> {
  if (!window.speechSynthesis) return;
  resetSpeechQueue();
  await sayUtterance(word, 0.85);
}

export function stopSpeaking(): void {
  resetSpeechQueue();
  // Immediately resolve any pending speech promise so callers don't hang.
  const f = activeFinish;
  activeFinish = null;
  if (f) f();
}

export async function speakAndSpell(word: string): Promise<void> {
  if (!window.speechSynthesis) return;
  resetSpeechQueue();
  await waitForVoices();
  const voice = getBestVoice();
  const rate = 0.70;

  const makeUtterance = (text: string) => {
    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;
    u.pitch = 1.0;
    if (voice) u.voice = voice;
    return u;
  };

  // Speak each letter as a separate utterance. If we join them into one
  // string (e.g. "a. l. l. e. v. i. a. t. e."), the engine recognizes
  // common letter runs as abbreviations — "v.i.a." becomes "via",
  // "a.m." becomes "ay-em", etc. Isolating each letter eliminates that.
  const letters = word.toUpperCase().split('').filter(c => /[A-Z]/.test(c));

  const wordU = makeUtterance(word);
  const letterUtterances = letters.map(letter => makeUtterance(letter));
  const repeatU = makeUtterance(word);

  // Estimate total: full word + ~0.5s per letter + full word again.
  const totalMs =
    estimateDurationMs(word, rate) +
    letters.length * 600 +
    estimateDurationMs(word, rate);

  return new Promise<void>(resolve => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      if (activeFinish === finish) activeFinish = null;
      resolve();
    };
    activeFinish = finish;
    repeatU.onend = finish;
    repeatU.onerror = finish;

    const timer = setTimeout(() => {
      resetSpeechQueue();
      finish();
    }, totalMs);

    window.speechSynthesis.speak(wordU);
    letterUtterances.forEach(u => window.speechSynthesis.speak(u));
    window.speechSynthesis.speak(repeatU);
  });
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
