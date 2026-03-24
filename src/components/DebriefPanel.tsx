import React, {useState} from 'react';

interface DebriefPanelProps {
  slot1: 'a' | 'b';
  slot2: 'a' | 'b';
}

interface InterviewerNotes {
  name: string;
  role: string;
  principles: string;
  color: string;
  notes: string;
  hasBias: boolean;
}

const interviewerData: Record<string, InterviewerNotes> = {
  slot1_a: {
    name: 'Elena',
    role: 'Engineering Manager',
    principles: 'Ownership + Bias for Action',
    color: 'var(--signal-ember)',
    hasBias: true,
    notes: `Ownership:
- Sam identified the fulfillment pipeline problem proactively — wasn't assigned to fix it, recognized it was breaking at scale (500 → 15K orders/day)
- Spent 2 weeks analyzing failure modes before proposing anything — didn't jump to a solution
- Proposed 3-service event-driven architecture to replace the monolith
- Made the call to roll out warehouse-by-warehouse (phased approach = risk management)
- Admitted the monitoring gap unprompted — shows self-awareness

Bias for Action:
- Moved quickly once analysis was done — 6-week rollout across 3 warehouses
- Chose idempotent design to make retries safe, which enabled faster iteration
- System handled Black Friday at 4x volume without manual intervention — built for speed
- The phased rollout was a reversible decision — could pull back warehouse by warehouse

Overall: Strong on both principles. Really confident communicator — would fit right in with our team culture.

Recommendation: Hire. Clear evidence of ownership and decisive action.`,
  },
  slot1_b: {
    name: 'Kai',
    role: 'Staff Engineer',
    principles: 'Ownership + Bias for Action',
    color: 'var(--signal-ember)',
    hasBias: false,
    notes: `Ownership:
- Identified fulfillment pipeline scaling issue independently (500 → 15K orders/day, 3 errors/day)
- Deep technical analysis of root cause: monolith doing inventory reservation, payment capture, and warehouse routing in single transaction
- Timeout on batch writes → messages marked as processed → inventory drift
- Proposed event-driven architecture with 3 independent services, each with own state
- Designed idempotent operations so retries are safe at any failure point

Bias for Action:
- Rolled out warehouse-by-warehouse over 6 weeks (reversible increments)
- Results: errors 3/day → <1/week (85% reduction), latency 45s → <3s
- Handled Black Friday at 4x volume, no manual intervention
- ? didn't ask about what happened when the team disagreed on the approach
- ? would have liked to hear about a decision he made quickly that was wrong

Overall: Technically impressive. Ownership is clear — took the initiative and drove end to end.

Recommendation: Hire. Strong technical ownership and fast execution with smart de-risking.`,
  },
  slot2_a: {
    name: 'Marcus',
    role: 'Product Manager',
    principles: 'Collaboration',
    color: 'var(--signal-teal)',
    hasBias: true,
    notes: `Collaboration:
- Worked with warehouse ops teams to define the rollout sequence — they determined which warehouse went first based on operational readiness
- Coordinated with PM to align the migration timeline with a product launch freeze
- Set up a shared dashboard so warehouse managers could monitor the migration in real time
- Described doing the technical design alone and bringing it to the team as a proposal rather than co-designing — presented it as "here's what I think we should do" and asked for feedback
- When probed on team input: said the team agreed with the event-driven approach but one engineer wanted to use a different message broker; Sam made the final call
- Mentored 2 junior engineers during the migration — gave them ownership of the monitoring and alerting layer

A bit quiet — not sure they'd be strong in our fast-paced meetings.

? The design approach was more "present and get buy-in" than "co-create" — is that a concern for Platform Reliability?

Recommendation: Mixed. Good evidence of working WITH others, but the core technical decisions were largely solo. For a team that requires heavy cross-team coordination, I'd want stronger evidence of collaborative design.`,
  },
  slot2_b: {
    name: 'Aisha',
    role: 'Senior Engineer (Platform team)',
    principles: 'Collaboration',
    color: 'var(--signal-teal)',
    hasBias: false,
    notes: `Collaboration:
- Code review practices: described a structured review process where each PR had at least 2 reviewers, and he would pair with junior engineers on complex PRs
- Mentored 2 junior engineers — both promoted within a year. Gave them increasing ownership: started with testing, then monitoring, then feature work
- Pair-programmed with a junior engineer during the most critical phase of the migration (warehouse cutover)
- Used "I designed" for the architecture, but when probed, described getting input from the team on the conflict resolution approach — one engineer suggested vector clocks, which Sam adopted
- Set up weekly architecture reviews during the migration where the full team could raise concerns
- Collaborated with warehouse ops on rollout sequencing and created runbooks together

? Sam's default framing is "I" even when the work was collaborative — is this a communication habit or a genuine solo-operator tendency?
? Would like to see evidence of Sam adapting his approach based on team feedback, not just accepting a specific suggestion

Recommendation: Positive with a flag. The mentoring and code review evidence is strong. The architecture design was more solo than collaborative, but Sam did incorporate team input when offered. The "I" framing may undersell the collaboration that actually happened — consistent with recruiter notes.`,
  },
};

const barRaiserAssessment = `Overall positive signal across most principles. Dive Deep is clearly strong — deep technical understanding with self-awareness about the monitoring gap. Ownership is demonstrated through the fulfillment redesign initiative — Sam identified the problem, proposed the solution, and drove execution end to end.

My concern is Collaboration. The evidence is mixed. Sam showed mentoring and working with ops, but the core technical design appears to have been largely solo. For a senior role on Platform Reliability where cross-team coordination is critical, I'd want stronger evidence of collaborative design.

I lean hire, but I want the panel to discuss the Collaboration signal carefully. If the panel believes the "I" framing is a communication habit rather than a genuine working style — and the recruiter notes support this — that changes the calculus. But we need to discuss it, not assume.`;

export default function DebriefPanel({slot1, slot2}: DebriefPanelProps) {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    you: true,
    slot1: true,
    slot2: true,
    barRaiser: true,
  });

  const slot1Data = interviewerData[`slot1_${slot1}`];
  const slot2Data = interviewerData[`slot2_${slot2}`];

  const toggleCard = (key: string) => {
    setExpandedCards((prev) => ({...prev, [key]: !prev[key]}));
  };

  const renderNoteCard = (
    key: string,
    data: InterviewerNotes,
  ) => {
    const isExpanded = expandedCards[key] !== false;
    return (
      <div
        className="signal-card"
        style={{
          padding: 0,
          marginBottom: '1rem',
          overflow: 'hidden',
        }}
      >
        <button
          onClick={() => toggleCard(key)}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            padding: '1rem 1.25rem',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            textAlign: 'left',
            fontFamily: 'var(--ifm-font-family-base)',
            color: 'var(--ifm-font-color-base)',
          }}
        >
          <div>
            <strong style={{fontFamily: 'var(--ifm-heading-font-family)', fontSize: '0.95rem'}}>
              {data.name}
            </strong>
            <span style={{fontSize: '0.85rem', color: 'var(--signal-slate)', marginLeft: '0.5rem'}}>
              {data.role} — {data.principles}
            </span>
            {data.hasBias && (
              <span
                style={{
                  display: 'inline-block',
                  marginLeft: '0.5rem',
                  fontFamily: 'var(--ifm-heading-font-family)',
                  fontWeight: 700,
                  fontSize: '0.6rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  padding: '0.1rem 0.35rem',
                  borderRadius: 'var(--signal-radius-sm)',
                  background: 'rgba(236, 77, 37, 0.1)',
                  color: 'var(--signal-ember)',
                  verticalAlign: 'middle',
                }}
              >
                Contains bias
              </span>
            )}
          </div>
          <span style={{fontSize: '0.8rem', color: 'var(--signal-slate)', flexShrink: 0, marginLeft: '0.5rem'}}>
            {isExpanded ? 'Collapse' : 'Expand'}
          </span>
        </button>
        {isExpanded && (
          <div
            style={{
              padding: '0 1.25rem 1.25rem',
              borderTop: '1px solid var(--signal-silver)',
            }}
          >
            <div
              style={{
                marginTop: '1rem',
                padding: '1rem',
                borderRadius: 'var(--signal-radius-sm)',
                background: 'rgba(147, 149, 153, 0.04)',
                fontFamily: 'var(--ifm-font-family-monospace, monospace)',
                fontSize: '0.82rem',
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
                color: 'var(--ifm-font-color-base)',
              }}
            >
              {data.notes}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <h3
        style={{
          fontFamily: 'var(--ifm-heading-font-family)',
          fontSize: '1.1rem',
          margin: '0 0 0.5rem',
        }}
      >
        Interviewer Notes
      </h3>
      <p style={{fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem', color: 'var(--signal-slate)'}}>
        Review all interviewer notes carefully. Look for behavioral evidence, data points, and any
        statements that reflect bias rather than evidence.
      </p>

      {/* Your notes placeholder */}
      <div
        className="signal-card"
        style={{
          padding: '1rem 1.25rem',
          marginBottom: '1rem',
          borderLeft: '4px solid var(--signal-teal)',
        }}
      >
        <strong style={{fontFamily: 'var(--ifm-heading-font-family)', fontSize: '0.95rem'}}>
          You
        </strong>
        <span style={{fontSize: '0.85rem', color: 'var(--signal-slate)', marginLeft: '0.5rem'}}>
          — Dive Deep
        </span>
        <p style={{fontSize: '0.85rem', margin: '0.5rem 0 0', lineHeight: 1.6}}>
          Your notes from the interview above. Refer back to what you wrote in the note-taking
          exercise.
        </p>
      </div>

      {renderNoteCard('slot1', slot1Data)}
      {renderNoteCard('slot2', slot2Data)}

      {/* Bar Raiser */}
      <div
        className="signal-card"
        style={{
          padding: 0,
          marginBottom: '1rem',
          overflow: 'hidden',
        }}
      >
        <button
          onClick={() => toggleCard('barRaiser')}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            padding: '1rem 1.25rem',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            textAlign: 'left',
            fontFamily: 'var(--ifm-font-family-base)',
            color: 'var(--ifm-font-color-base)',
          }}
        >
          <div>
            <strong style={{fontFamily: 'var(--ifm-heading-font-family)', fontSize: '0.95rem'}}>
              Jordan
            </strong>
            <span style={{fontSize: '0.85rem', color: 'var(--signal-slate)', marginLeft: '0.5rem'}}>
              Bar Raiser — Overall Assessment
            </span>
          </div>
          <span style={{fontSize: '0.8rem', color: 'var(--signal-slate)', flexShrink: 0, marginLeft: '0.5rem'}}>
            {expandedCards.barRaiser !== false ? 'Collapse' : 'Expand'}
          </span>
        </button>
        {expandedCards.barRaiser !== false && (
          <div
            style={{
              padding: '0 1.25rem 1.25rem',
              borderTop: '1px solid var(--signal-silver)',
            }}
          >
            <div
              style={{
                marginTop: '1rem',
                padding: '1rem',
                borderRadius: 'var(--signal-radius-sm)',
                background: 'rgba(43, 207, 206, 0.04)',
                borderLeft: '4px solid var(--signal-teal)',
                fontSize: '0.85rem',
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
                color: 'var(--ifm-font-color-base)',
              }}
            >
              {barRaiserAssessment}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
