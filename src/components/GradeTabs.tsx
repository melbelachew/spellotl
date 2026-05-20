import React from 'react';
import { GradeKey } from '../types';

const GRADES: { key: GradeKey; label: string }[] = [
  { key: 'custom', label: '✏️ My List' },
  { key: '5th', label: '5th Grade' },
  { key: '6th', label: '6th Grade' },
  { key: '7th', label: '7th Grade' },
  { key: '8th', label: '8th Grade' },
  { key: '9th', label: '9th Grade' },
  { key: '10th', label: '10th Grade' },
  { key: '11th', label: '11th Grade' },
  { key: '12th', label: '12th Grade' },
  { key: 'finals', label: 'Finals' },
  { key: 'all', label: 'All Words' },
];

interface Props {
  current: GradeKey;
  onChange: (grade: GradeKey) => void;
}

export const GradeTabs: React.FC<Props> = ({ current, onChange }) => (
  <div className="grade-tabs" role="tablist" aria-label="Grade selection">
    {GRADES.map(({ key, label }) => (
      <button
        key={key}
        className={`grade-tab${current === key ? ' active' : ''}`}
        onClick={() => onChange(key)}
        role="tab"
        aria-selected={current === key}
      >
        {label}
      </button>
    ))}
  </div>
);
