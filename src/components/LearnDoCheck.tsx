import React from 'react';
import type {ReactNode} from 'react';

interface LearnDoCheckProps {
  children: ReactNode;
}

interface SectionProps {
  children: ReactNode;
}

function Learn({children}: SectionProps) {
  return (
    <div className="ldc-section ldc-learn">
      <span className="ldc-label">Learn</span>
      <div>{children}</div>
    </div>
  );
}

function Do({children}: SectionProps) {
  return (
    <div className="ldc-section ldc-do">
      <span className="ldc-label">Do</span>
      <div>{children}</div>
    </div>
  );
}

function Check({children}: SectionProps) {
  return (
    <div className="ldc-section ldc-check">
      <span className="ldc-label">Check</span>
      <div>{children}</div>
    </div>
  );
}

export default function LearnDoCheck({children}: LearnDoCheckProps) {
  return <div className="learn-do-check">{children}</div>;
}

LearnDoCheck.Learn = Learn;
LearnDoCheck.Do = Do;
LearnDoCheck.Check = Check;
