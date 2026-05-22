import React, { useState, useRef } from 'react';
import { Word } from '../types';
import { handleListPaste, parseWordList, fetchDefinition } from '../utils';

interface Props {
  onLoad: (words: Word[]) => void;
  onClear: () => void;
  initialValue?: string;
}

export const CustomPanel: React.FC<Props> = ({ onLoad, onClear, initialValue = '' }) => {
  const [text, setText] = useState(initialValue);
  const [status, setStatus] = useState('');
  const taRef = useRef<HTMLTextAreaElement>(null);

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const plain = handleListPaste(e);
    const ta = taRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const newVal = text.slice(0, start) + plain + text.slice(end);
    setText(newVal);
  };

  const handleLoad = async () => {
    if (!text.trim()) { setStatus('⚠️ Nothing to load'); return; }
    const parsed = parseWordList(text);
    if (parsed.length < 2) { setStatus('⚠️ Need at least 2 words'); return; }

    const needsDef = parsed.filter(x => !x.d);
    if (needsDef.length > 0) {
      setStatus(`🔍 Looking up ${needsDef.length} definitions...`);
      for (const item of needsDef) {
        const def = await fetchDefinition(item.w);
        item.d = def || '(no definition found)';
      }
    }

    onLoad(parsed);
    const fetched = needsDef.filter(x => x.d !== '(no definition found)').length;
    let msg = `✅ ${parsed.length} words loaded`;
    if (fetched > 0) msg += `, ${fetched} definitions fetched`;
    setStatus(msg + '!');
  };

  const handleClear = () => {
    setText('');
    setStatus('');
    onClear();
  };

  return (
    <div className="custom-panel">
      <h2><span aria-hidden="true">📋 </span>Paste your word list</h2>
      <p id="custom-input-hint">Load a list to unlock the games below. One word per line — optionally add a definition after a colon: <em>catalyst: something that speeds up change</em></p>
      <label htmlFor="custom-input" className="sr-only">Word list</label>
      <textarea
        id="custom-input"
        ref={taRef}
        rows={6}
        value={text}
        onChange={e => setText(e.target.value)}
        onPaste={handlePaste}
        placeholder="catalyst: something that speeds up change"
        aria-describedby="custom-input-hint"
      />
      <div className="actions">
        <button className="btn btn-primary" onClick={handleLoad} style={{ padding: '8px 18px', fontSize: '13px' }}>
          Load List
        </button>
        <button className="btn btn-neutral" onClick={handleClear} style={{ padding: '8px 18px', fontSize: '13px' }}>
          Clear
        </button>
        <span className="custom-status" aria-live="polite">{status}</span>
      </div>
    </div>
  );
};
