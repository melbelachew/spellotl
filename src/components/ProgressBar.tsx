import React from 'react';

interface Props {
  current: number;
  total: number;
}

export const ProgressBar: React.FC<Props> = ({ current, total }) => (
  <div
    className="progress"
    role="progressbar"
    aria-valuenow={current}
    aria-valuemin={0}
    aria-valuemax={total}
    aria-label="Progress"
  >
    <div className="progress-bar" style={{ width: `${total > 0 ? (current / total) * 100 : 0}%` }} />
  </div>
);
