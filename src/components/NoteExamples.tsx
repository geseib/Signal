import React, {useState} from 'react';

interface NoteExample {
  label: string;
  style: 'good' | 'bad' | 'transcript';
  content: string;
  explanation: string;
}

interface NoteExamplesProps {
  examples: NoteExample[];
}

const styleConfig = {
  good: {
    color: 'var(--signal-teal)',
    bg: 'rgba(43, 207, 206, 0.06)',
    border: 'var(--signal-teal)',
    icon: '✓',
  },
  bad: {
    color: 'var(--signal-ember)',
    bg: 'rgba(236, 77, 37, 0.06)',
    border: 'var(--signal-ember)',
    icon: '✗',
  },
  transcript: {
    color: 'var(--signal-slate)',
    bg: 'rgba(147, 149, 153, 0.06)',
    border: 'var(--signal-slate)',
    icon: '≡',
  },
};

export default function NoteExamples({examples}: NoteExamplesProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = examples[activeIndex];
  const config = styleConfig[active.style];

  return (
    <div className="signal-card" style={{margin: '1rem 0', padding: '1.25rem'}}>
      <div style={{marginBottom: '0.75rem'}}>
        <span
          style={{
            display: 'inline-block',
            fontFamily: 'var(--ifm-heading-font-family)',
            fontWeight: 700,
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            padding: '0.15rem 0.5rem',
            borderRadius: 'var(--signal-radius-sm)',
            background: 'var(--signal-slate)',
            color: 'white',
          }}
        >
          Compare Note-Taking Styles
        </span>
      </div>

      {/* Tab buttons */}
      <div style={{display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap'}}>
        {examples.map((ex, i) => {
          const cfg = styleConfig[ex.style];
          const isActive = i === activeIndex;
          return (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--signal-radius-sm)',
                border: `2px solid ${isActive ? cfg.color : 'var(--signal-silver)'}`,
                background: isActive ? cfg.bg : 'transparent',
                fontFamily: 'var(--ifm-heading-font-family)',
                fontWeight: 600,
                fontSize: '0.8rem',
                color: isActive ? cfg.color : 'var(--signal-slate)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {cfg.icon} {ex.label}
            </button>
          );
        })}
      </div>

      {/* Active example */}
      <div
        style={{
          padding: '1rem',
          borderRadius: 'var(--signal-radius-sm)',
          background: config.bg,
          borderLeft: `4px solid ${config.border}`,
          marginBottom: '0.75rem',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--ifm-font-family-monospace, monospace)',
            fontSize: '0.82rem',
            lineHeight: 1.7,
            whiteSpace: 'pre-wrap',
            color: 'var(--ifm-font-color-base)',
          }}
        >
          {active.content}
        </div>
      </div>

      {/* Explanation */}
      <div
        style={{
          fontSize: '0.85rem',
          lineHeight: 1.6,
          color: config.color,
          fontWeight: 500,
        }}
      >
        {active.explanation}
      </div>
    </div>
  );
}
