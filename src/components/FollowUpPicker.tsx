import React, {useState} from 'react';

interface FollowUpOption {
  label: string;
  explanation: string;
  isCorrect: boolean;
}

interface FollowUpPickerProps {
  followUps: FollowUpOption[];
  scenarioId: string;
}

export default function FollowUpPicker({followUps, scenarioId}: FollowUpPickerProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const correctIndex = followUps.findIndex((f) => f.isCorrect);
  const selectedOption = selected !== null ? followUps[selected] : null;

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
  };

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
            background: 'var(--signal-teal)',
            color: 'white',
            marginBottom: '0.5rem',
          }}
        >
          Pick Your Follow-Up
        </span>
        <p
          style={{
            fontFamily: 'var(--ifm-heading-font-family)',
            fontWeight: 600,
            fontSize: '0.95rem',
            margin: '0.25rem 0 0',
          }}
        >
          Based on what you heard, which follow-up would generate the most new signal?
        </p>
      </div>

      {followUps.map((fu, i) => {
        let borderColor = 'var(--signal-silver)';
        let bg = 'transparent';

        if (submitted) {
          if (fu.isCorrect) {
            borderColor = 'var(--signal-teal)';
            bg = 'rgba(43, 207, 206, 0.06)';
          } else if (i === selected && !fu.isCorrect) {
            borderColor = 'var(--signal-ember)';
            bg = 'rgba(236, 77, 37, 0.06)';
          }
        } else if (i === selected) {
          borderColor = 'var(--signal-teal)';
          bg = 'rgba(43, 207, 206, 0.04)';
        }

        return (
          <button
            key={i}
            onClick={() => !submitted && setSelected(i)}
            disabled={submitted}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'left',
              padding: '0.6rem 1rem',
              marginBottom: '0.4rem',
              borderRadius: 'var(--signal-radius-sm)',
              border: `2px solid ${borderColor}`,
              background: bg,
              fontSize: '0.85rem',
              lineHeight: 1.5,
              cursor: submitted ? 'default' : 'pointer',
              fontFamily: 'var(--ifm-font-family-base)',
              color: 'var(--ifm-font-color-base)',
              transition: 'border-color 0.15s ease, background 0.15s ease',
            }}
          >
            <strong style={{fontFamily: 'var(--ifm-heading-font-family)', fontSize: '0.8rem'}}>
              Option {String.fromCharCode(65 + i)}:
            </strong>{' '}
            "{fu.label}"
            {submitted && (
              <div
                style={{
                  marginTop: '0.5rem',
                  fontSize: '0.8rem',
                  color: fu.isCorrect ? 'var(--signal-teal)' : 'var(--signal-slate)',
                  lineHeight: 1.5,
                }}
              >
                {fu.explanation}
              </div>
            )}
          </button>
        );
      })}

      {!submitted && (
        <button
          className="signal-btn signal-btn-primary"
          onClick={handleSubmit}
          disabled={selected === null}
          style={{marginTop: '0.5rem', opacity: selected === null ? 0.5 : 1}}
        >
          Submit Choice
        </button>
      )}

      {submitted && (
        <div
          style={{
            marginTop: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--signal-radius-sm)',
            background: selectedOption?.isCorrect
              ? 'rgba(43, 207, 206, 0.08)'
              : 'rgba(236, 77, 37, 0.08)',
            borderLeft: `4px solid ${selectedOption?.isCorrect ? 'var(--signal-teal)' : 'var(--signal-ember)'}`,
            fontSize: '0.85rem',
            lineHeight: 1.6,
          }}
        >
          {selectedOption?.isCorrect ? (
            <strong style={{color: 'var(--signal-teal)'}}>Correct!</strong>
          ) : (
            <>
              <strong style={{color: 'var(--signal-ember)'}}>Not quite.</strong> The best follow-up
              was <strong>Option {String.fromCharCode(65 + correctIndex)}</strong>.
            </>
          )}
        </div>
      )}
    </div>
  );
}
