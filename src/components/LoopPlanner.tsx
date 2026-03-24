import React, {useState} from 'react';

interface InterviewerOption {
  id: 'a' | 'b';
  name: string;
  role: string;
  description: string;
}

interface LoopPlannerProps {
  onComplete: (selections: {slot1: 'a' | 'b'; slot2: 'a' | 'b'}) => void;
}

const slot1Options: InterviewerOption[] = [
  {
    id: 'a',
    name: 'Elena',
    role: 'Engineering Manager',
    description:
      'Will ask about taking initiative and decision speed from a leadership angle.',
  },
  {
    id: 'b',
    name: 'Kai',
    role: 'Staff Engineer',
    description:
      'Will ask about technical ownership and fast technical decisions.',
  },
];

const slot2Options: InterviewerOption[] = [
  {
    id: 'a',
    name: 'Marcus',
    role: 'Product Manager',
    description:
      'Will ask about cross-functional collaboration from a PM perspective.',
  },
  {
    id: 'b',
    name: 'Aisha',
    role: 'Senior Engineer (Platform team)',
    description:
      'Will ask about engineering collaboration and code review culture.',
  },
];

const cardStyle: React.CSSProperties = {
  padding: '1.25rem',
  borderRadius: 'var(--signal-radius-sm)',
  border: '2px solid var(--signal-silver)',
  marginBottom: '1rem',
  background: 'var(--ifm-background-color)',
};

const selectedCardStyle: React.CSSProperties = {
  ...cardStyle,
  borderColor: 'var(--signal-teal)',
  background: 'rgba(43, 207, 206, 0.04)',
};

const lockedCardStyle: React.CSSProperties = {
  ...cardStyle,
  borderColor: 'var(--signal-teal)',
  background: 'rgba(43, 207, 206, 0.06)',
};

export default function LoopPlanner({onComplete}: LoopPlannerProps) {
  const [slot1, setSlot1] = useState<'a' | 'b' | null>(null);
  const [slot2, setSlot2] = useState<'a' | 'b' | null>(null);

  const canStart = slot1 !== null && slot2 !== null;

  const handleStart = () => {
    if (slot1 !== null && slot2 !== null) {
      onComplete({slot1, slot2});
    }
  };

  return (
    <div>
      {/* Candidate Profile */}
      <div className="signal-card" style={{padding: '1.5rem', marginBottom: '1.5rem'}}>
        <div style={{display: 'flex', gap: '0.5rem', marginBottom: '0.75rem'}}>
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
              background: 'var(--signal-graphite, #2d2f34)',
              color: 'white',
            }}
          >
            Candidate Profile
          </span>
        </div>
        <h3
          style={{
            fontFamily: 'var(--ifm-heading-font-family)',
            fontSize: '1.2rem',
            margin: '0 0 0.5rem',
          }}
        >
          Sam Okafor
        </h3>
        <p style={{fontSize: '0.9rem', margin: '0 0 0.75rem', lineHeight: 1.6}}>
          <strong>Senior Software Engineer</strong> — 8 years experience. Currently at a mid-size
          e-commerce company. Previously at a healthcare startup.
        </p>
        <div style={{fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '0.75rem'}}>
          <strong>Resume highlights:</strong>
          <ul style={{margin: '0.25rem 0 0', paddingLeft: '1.25rem'}}>
            <li>Led a team of 4 to rebuild the order fulfillment pipeline (reduced order errors by 85%)</li>
            <li>Designed a real-time inventory sync system across 3 warehouses</li>
            <li>Mentored 2 junior engineers who were promoted within a year</li>
          </ul>
        </div>
        <div
          style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--signal-radius-sm)',
            background: 'rgba(147, 149, 153, 0.06)',
            fontSize: '0.85rem',
            lineHeight: 1.6,
            marginBottom: '0.75rem',
          }}
        >
          <strong>Recruiter notes:</strong> "Strong communicator, gave clear examples in the phone
          screen. Deep technical knowledge of distributed systems. When asked about a failure, gave a
          thoughtful answer about a production incident. Note: tends to undersell collaboration — the
          recruiter had to probe twice to get team-related examples."
        </div>
        <p style={{fontSize: '0.85rem', margin: 0, color: 'var(--signal-slate)'}}>
          <strong>Role:</strong> Senior Engineer, Platform Reliability &nbsp;|&nbsp;{' '}
          <strong>Evaluating:</strong> Ownership, Dive Deep, Collaboration, Bias for Action
        </p>
      </div>

      {/* Loop Planning */}
      <h3
        style={{
          fontFamily: 'var(--ifm-heading-font-family)',
          fontSize: '1.1rem',
          margin: '1.5rem 0 0.75rem',
        }}
      >
        Assign your interview panel
      </h3>
      <p style={{fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem'}}>
        You have three interviewer slots. Your slot is fixed — you will interview Sam for{' '}
        <strong>Dive Deep</strong>. Choose who fills the other two slots.
      </p>

      {/* Slot 0: You (fixed) */}
      <div style={lockedCardStyle}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.5rem',
          }}
        >
          <div>
            <strong style={{fontFamily: 'var(--ifm-heading-font-family)', fontSize: '0.95rem'}}>
              Slot 1: You
            </strong>
            <span
              style={{
                display: 'inline-block',
                marginLeft: '0.5rem',
                fontFamily: 'var(--ifm-heading-font-family)',
                fontWeight: 700,
                fontSize: '0.65rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                padding: '0.1rem 0.4rem',
                borderRadius: 'var(--signal-radius-sm)',
                background: 'var(--signal-teal)',
                color: 'white',
              }}
            >
              Assigned
            </span>
          </div>
        </div>
        <p style={{fontSize: '0.85rem', margin: 0, color: 'var(--signal-slate)'}}>
          Principle: <strong>Dive Deep</strong> — You will assess the candidate's ability to operate
          at all levels of detail and understand complex systems deeply.
        </p>
      </div>

      {/* Slot 1: Ownership + Bias for Action */}
      <div style={{marginBottom: '1rem'}}>
        <p
          style={{
            fontFamily: 'var(--ifm-heading-font-family)',
            fontWeight: 600,
            fontSize: '0.95rem',
            margin: '0 0 0.5rem',
          }}
        >
          Slot 2: Ownership + Bias for Action
        </p>
        {slot1Options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSlot1(opt.id)}
            style={{
              ...(slot1 === opt.id ? selectedCardStyle : cardStyle),
              display: 'block',
              width: '100%',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'border-color 0.15s ease, background 0.15s ease',
            }}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem'}}>
              <span
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  border: `2px solid ${slot1 === opt.id ? 'var(--signal-teal)' : 'var(--signal-silver)'}`,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {slot1 === opt.id && (
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--signal-teal)',
                    }}
                  />
                )}
              </span>
              <strong style={{fontFamily: 'var(--ifm-heading-font-family)', fontSize: '0.9rem'}}>
                {opt.name}
              </strong>
              <span style={{fontSize: '0.8rem', color: 'var(--signal-slate)'}}>— {opt.role}</span>
            </div>
            <p style={{fontSize: '0.85rem', margin: '0 0 0 1.5rem', lineHeight: 1.5, color: 'var(--ifm-font-color-base)'}}>
              {opt.description}
            </p>
          </button>
        ))}
      </div>

      {/* Slot 2: Collaboration */}
      <div style={{marginBottom: '1.5rem'}}>
        <p
          style={{
            fontFamily: 'var(--ifm-heading-font-family)',
            fontWeight: 600,
            fontSize: '0.95rem',
            margin: '0 0 0.5rem',
          }}
        >
          Slot 3: Collaboration
        </p>
        {slot2Options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSlot2(opt.id)}
            style={{
              ...(slot2 === opt.id ? selectedCardStyle : cardStyle),
              display: 'block',
              width: '100%',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'border-color 0.15s ease, background 0.15s ease',
            }}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem'}}>
              <span
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  border: `2px solid ${slot2 === opt.id ? 'var(--signal-teal)' : 'var(--signal-silver)'}`,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {slot2 === opt.id && (
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--signal-teal)',
                    }}
                  />
                )}
              </span>
              <strong style={{fontFamily: 'var(--ifm-heading-font-family)', fontSize: '0.9rem'}}>
                {opt.name}
              </strong>
              <span style={{fontSize: '0.8rem', color: 'var(--signal-slate)'}}>— {opt.role}</span>
            </div>
            <p style={{fontSize: '0.85rem', margin: '0 0 0 1.5rem', lineHeight: 1.5, color: 'var(--ifm-font-color-base)'}}>
              {opt.description}
            </p>
          </button>
        ))}
      </div>

      {/* Start button */}
      <button
        className="signal-btn signal-btn-primary"
        onClick={handleStart}
        disabled={!canStart}
        style={{
          opacity: canStart ? 1 : 0.5,
          fontSize: '1rem',
          padding: '0.6rem 1.5rem',
        }}
      >
        Start Interview
      </button>
      {!canStart && (
        <p style={{fontSize: '0.8rem', color: 'var(--signal-slate)', margin: '0.5rem 0 0'}}>
          Select an interviewer for both remaining slots to begin.
        </p>
      )}
    </div>
  );
}
