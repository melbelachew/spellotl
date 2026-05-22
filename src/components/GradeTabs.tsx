import React from 'react';
import { GradeKey } from '../types';

const GRADES: { key: GradeKey; label: string; iconLabel?: string }[] = [
  { key: 'custom', label: 'My List', iconLabel: '✏️' },
  { key: 'K', label: 'Kindergarten' },
  { key: '1st', label: '1st Grade' },
  { key: '2nd', label: '2nd Grade' },
  { key: '3rd', label: '3rd Grade' },
  { key: '4th', label: '4th Grade' },
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
  <nav className="grade-tabs" aria-label="Grade selection">
    {GRADES.map(({ key, label, iconLabel }) => (
      <button
        key={key}
        className={`grade-tab${current === key ? ' active' : ''}`}
        onClick={() => onChange(key)}
        type="button"
        aria-pressed={current === key}
      >
        {iconLabel && <span aria-hidden="true">{iconLabel} </span>}
        {label}
      </button>
    ))}
  </nav>
);
