import React, {useState} from 'react';

interface Dimension {
  key: string;
  label: string;
  description: string;
  levels: string[];
}

const dimensions: Dimension[] = [
  {
    key: 'specificity',
    label: 'Specificity',
    description: 'How concrete and detailed is the answer?',
    levels: [
      'Vague, generic statements with no concrete details',
      'Some specific details but mostly general',
      'Good mix of specifics — names, timelines, context',
      'Highly specific — real numbers, real situations, clear context',
    ],
  },
  {
    key: 'ownership',
    label: 'Ownership',
    description: 'Does the candidate clearly own their contribution?',
    levels: [
      'All "we" language — impossible to identify individual contribution',
      'Mostly "we" with occasional "I" but role still unclear',
      'Clear "I" language for most actions, some "we" for team context',
      'Strong "I" ownership throughout — clear what they personally drove',
    ],
  },
  {
    key: 'data',
    label: 'Data & Metrics',
    description: 'Are results backed by measurable outcomes?',
    levels: [
      'No metrics — "it went well" or "people were happy"',
      'One vague metric or qualitative-only results',
      'Multiple relevant metrics with some business context',
      'Strong quantified outcomes with clear business impact and "so what?"',
    ],
  },
  {
    key: 'depth',
    label: 'Depth of Reasoning',
    description: 'Does the candidate explain WHY, not just WHAT?',
    levels: [
      'Only describes what happened — no reasoning or trade-offs',
      'Mentions reasoning once but mostly surface-level',
      'Explains key decisions with clear reasoning',
      'Deep reasoning — trade-offs considered, alternatives weighed, judgment demonstrated',
    ],
  },
];

const overallLabels = [
  {min: 0, max: 4, label: 'Weak Signal', color: 'var(--signal-ember)'},
  {min: 5, max: 8, label: 'Some Signal', color: 'var(--signal-slate)'},
  {min: 9, max: 12, label: 'Good Signal', color: 'var(--signal-teal)'},
  {min: 13, max: 16, label: 'Strong Signal', color: 'var(--signal-teal-dark)'},
];

export default function SignalStrengthMeter() {
  const [scores, setScores] = useState<Record<string, number>>({});

  const handleScore = (key: string, level: number) => {
    setScores((prev) => ({...prev, [key]: level}));
  };

  const totalScore = Object.values(scores).reduce((sum, v) => sum + v, 0);
  const allScored = Object.keys(scores).length === dimensions.length;
  const overall = overallLabels.find((o) => totalScore >= o.min && totalScore <= o.max);

  const handleReset = () => setScores({});

  return (
    <div style={{margin: '1.5rem 0'}}>
      {dimensions.map((dim) => (
        <div
          key={dim.key}
          className="signal-card"
          style={{marginBottom: '1rem', padding: '1rem'}}
        >
          <div style={{marginBottom: '0.5rem'}}>
            <strong style={{fontFamily: 'var(--ifm-heading-font-family)'}}>{dim.label}</strong>
            <span
              style={{
                marginLeft: '0.75rem',
                fontSize: '0.85rem',
                color: 'var(--signal-slate)',
              }}
            >
              {dim.description}
            </span>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.35rem'}}>
            {dim.levels.map((level, i) => {
              const value = i + 1;
              const isSelected = scores[dim.key] === value;
              return (
                <button
                  key={i}
                  onClick={() => handleScore(dim.key, value)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.5rem 0.75rem',
                    border: `2px solid ${isSelected ? 'var(--signal-teal)' : 'var(--signal-silver)'}`,
                    borderRadius: 'var(--signal-radius-sm)',
                    background: isSelected ? 'rgba(43, 207, 206, 0.08)' : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'var(--ifm-font-family-base)',
                    fontSize: '0.85rem',
                    color: 'var(--ifm-font-color-base)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      border: `2px solid ${isSelected ? 'var(--signal-teal)' : 'var(--signal-silver)'}`,
                      background: isSelected ? 'var(--signal-teal)' : 'transparent',
                      color: isSelected ? 'white' : 'var(--signal-slate)',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      flexShrink: 0,
                    }}
                  >
                    {value}
                  </span>
                  {level}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Overall score */}
      {allScored && overall && (
        <div
          className="signal-card"
          style={{
            textAlign: 'center',
            padding: '1.5rem',
            borderColor: overall.color,
            borderWidth: '2px',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--ifm-heading-font-family)',
              fontSize: '2rem',
              fontWeight: 700,
              color: overall.color,
            }}
          >
            {totalScore}/16
          </div>
          <div
            style={{
              fontFamily: 'var(--ifm-heading-font-family)',
              fontSize: '1.1rem',
              fontWeight: 600,
              color: overall.color,
              marginBottom: '0.5rem',
            }}
          >
            {overall.label}
          </div>
          <p style={{fontSize: '0.85rem', color: 'var(--signal-slate)', margin: 0}}>
            {totalScore <= 8
              ? 'This answer needs more specifics, ownership, and data to generate useful signal.'
              : totalScore <= 12
                ? 'Solid signal on most dimensions. Look for opportunities to strengthen the weaker areas.'
                : 'Excellent signal across all dimensions. This answer provides strong, calibrated data for evaluation.'}
          </p>
          <button
            className="signal-btn signal-btn-secondary"
            onClick={handleReset}
            style={{marginTop: '1rem'}}
          >
            Reset & Try Another
          </button>
        </div>
      )}
    </div>
  );
}
