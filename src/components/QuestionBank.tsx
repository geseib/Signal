import React, {useState} from 'react';

interface QuestionEntry {
  question: string;
  lookFor: string[];
  followUps: string[];
}

interface PrincipleGroup {
  principle: string;
  description: string;
  questions: QuestionEntry[];
}

const QUESTION_BANK: PrincipleGroup[] = [
  {
    principle: 'Ownership',
    description: 'Taking responsibility beyond your immediate scope. Acting without being asked. Thinking long-term.',
    questions: [
      {
        question: 'Tell me about a time you took on something important that wasn\'t part of your job description.',
        lookFor: [
          'Identified the problem independently — wasn\'t assigned or asked',
          'Took action despite it being outside their formal scope',
          'Saw it through to completion, not just flagged it',
          'Considered the long-term impact, not just the immediate fix',
        ],
        followUps: [
          'What made you decide to take this on rather than flagging it for someone else?',
          'How did your primary responsibilities hold up while you were doing this?',
          'What would have happened if you hadn\'t stepped in?',
        ],
      },
      {
        question: 'Describe a time you saw a problem that nobody was addressing. What did you do?',
        lookFor: [
          'Evidence of proactive problem identification',
          'Candidate took action rather than waiting for someone else',
          'Scope of the problem — was it significant or trivial?',
          'Did they build something sustainable or just a quick fix?',
        ],
        followUps: [
          'How did you know this was worth your time vs. other priorities?',
          'Did anyone push back on you spending time on this?',
          'What was the outcome — is the fix still in place today?',
        ],
      },
      {
        question: 'Tell me about a time you made a decision that was unpopular but you believed was right for the long term.',
        lookFor: [
          'Willingness to make hard calls even when uncomfortable',
          'Evidence of long-term thinking over short-term convenience',
          'How they handled disagreement or pushback',
          'Whether the long-term outcome validated their judgment',
        ],
        followUps: [
          'Who disagreed and what were their concerns?',
          'How did you convince stakeholders — or did you just proceed?',
          'Looking back, would you make the same decision?',
        ],
      },
    ],
  },
  {
    principle: 'Collaboration',
    description: 'Working across team boundaries. Building alignment. Influencing without authority. Resolving disagreements.',
    questions: [
      {
        question: 'Tell me about a time you needed to get buy-in from people who didn\'t report to you.',
        lookFor: [
          'Strategy for building alignment (1:1 meetings, understanding constraints, finding common ground)',
          'Evidence of listening to others\' concerns, not just pushing their own agenda',
          'Willingness to adapt their approach based on feedback',
          'Outcome that reflects genuine consensus, not forced compliance',
        ],
        followUps: [
          'What was the biggest objection you heard, and how did you address it?',
          'Was there a point where you had to compromise? What did you give up?',
          'How did you know you had real buy-in vs. people just going along?',
        ],
      },
      {
        question: 'Describe a significant disagreement you had with a colleague. How did you work through it?',
        lookFor: [
          'Engaged with the disagreement directly rather than avoiding or escalating immediately',
          'Tried to understand the other person\'s perspective',
          'Found a resolution that both parties could support',
          'Maintained the relationship — disagreed without damaging trust',
        ],
        followUps: [
          'What was at the core of the disagreement — was it about approach, priorities, or something else?',
          'Did you have to change your position at all?',
          'What\'s your working relationship like with that person now?',
        ],
      },
      {
        question: 'Tell me about a time you helped someone else succeed — a teammate, a direct report, or someone from another team.',
        lookFor: [
          'Invested meaningful time in someone else\'s growth',
          'Tailored their approach to what the other person needed',
          'Outcome was the other person\'s success, not just the candidate\'s',
          'Shows a pattern of lifting others, not just individual achievement',
        ],
        followUps: [
          'How did you identify what they needed?',
          'What was the most challenging part of helping them?',
          'What happened with that person after — did they continue to grow?',
        ],
      },
    ],
  },
  {
    principle: 'Customer Focus',
    description: 'Starting with the customer and working backwards. Prioritizing user impact over internal convenience.',
    questions: [
      {
        question: 'Tell me about a time you changed your approach because of something you learned from a customer or end user.',
        lookFor: [
          'Actively sought user feedback or observed user behavior',
          'The insight actually changed what they built or how they built it',
          'Prioritized user needs over what was easier to implement',
          'Measured the impact on the user experience',
        ],
        followUps: [
          'How did you discover this user insight — was it proactive research or reactive feedback?',
          'What was the cost of changing your approach — did it delay the project?',
          'How did you measure whether the change actually helped users?',
        ],
      },
      {
        question: 'Describe a decision where you chose the user\'s interest over internal convenience or technical elegance.',
        lookFor: [
          'Clear tradeoff between what\'s easy internally and what\'s best for users',
          'Candidate chose the user-centric path and can articulate why',
          'Evidence they understood the internal cost and made the tradeoff consciously',
          'Result shows user impact, not just that they shipped something',
        ],
        followUps: [
          'What was the internal pushback — did anyone disagree with prioritizing the user here?',
          'How did you quantify the user impact vs. the internal cost?',
          'Would you make the same tradeoff again?',
        ],
      },
      {
        question: 'Tell me about a time you identified an unmet customer need that wasn\'t on anyone\'s roadmap.',
        lookFor: [
          'Proactive identification — didn\'t wait for a feature request',
          'Understanding of why existing solutions weren\'t sufficient',
          'Took action to address it (even if small)',
          'Connected the user need to business impact',
        ],
        followUps: [
          'How did you discover this need — what were the signals?',
          'How did you prioritize this against existing roadmap items?',
          'What was the user response once you addressed it?',
        ],
      },
    ],
  },
  {
    principle: 'Bias for Action',
    description: 'Moving forward with imperfect information. Distinguishing reversible from irreversible decisions. Calculated speed.',
    questions: [
      {
        question: 'Tell me about a time you had to make a significant decision without complete information.',
        lookFor: [
          'Recognized the decision couldn\'t wait for perfect data',
          'Assessed what information they DID have and what was missing',
          'Made a conscious, reasoned choice (not reckless)',
          'Had a plan for course-correcting if they were wrong',
        ],
        followUps: [
          'What information did you wish you had? Why couldn\'t you wait for it?',
          'How did you assess the risk of being wrong?',
          'Did you need to course-correct? What happened?',
        ],
      },
      {
        question: 'Describe a time you chose speed over perfection. How did it turn out?',
        lookFor: [
          'Conscious tradeoff — not just sloppy, but intentionally chose speed for a reason',
          'Understood what they were trading away (polish, completeness, testing)',
          'Had a plan to address the gaps later',
          'Result justified the speed — or they learned from the tradeoff',
        ],
        followUps: [
          'What specifically did you cut or defer to move faster?',
          'Did you communicate the tradeoff to stakeholders?',
          'What was the cost of moving fast — any tech debt or downstream issues?',
        ],
      },
      {
        question: 'Tell me about a time you unblocked your team when progress had stalled.',
        lookFor: [
          'Identified the blocker clearly',
          'Took initiative to remove it rather than waiting',
          'Actions were appropriate to the situation (didn\'t overreact or underreact)',
          'Team was able to move forward as a result',
        ],
        followUps: [
          'Why was the team stuck — was it a technical, political, or resource blocker?',
          'Did you need to go around any processes or norms to unblock things?',
          'How did the team respond to your intervention?',
        ],
      },
    ],
  },
  {
    principle: 'Dive Deep',
    description: 'Operating at all levels of detail. Understanding the WHY behind decisions. Auditing when things don\'t add up.',
    questions: [
      {
        question: 'Tell me about the most complex system you\'ve designed or significantly improved. Walk me through the technical decisions.',
        lookFor: [
          'Can explain not just WHAT they built but WHY they made specific choices',
          'Understands tradeoffs — what they gained and what they gave up',
          'Goes multiple levels deep when probed (not just surface-level architecture)',
          'Can critique their own work — what they\'d do differently',
        ],
        followUps: [
          'What alternatives did you consider and why did you reject them?',
          'What\'s the part of this design you\'re least satisfied with?',
          'If traffic doubled tomorrow, what would break first?',
        ],
      },
      {
        question: 'Tell me about a time something didn\'t add up — metrics, a report, a system behavior — and you dug in to find out why.',
        lookFor: [
          'Noticed an anomaly others missed or ignored',
          'Investigated systematically, not just guessed',
          'Went deep enough to find the root cause',
          'The investigation led to meaningful action',
        ],
        followUps: [
          'What initially tipped you off that something was wrong?',
          'How did you structure your investigation?',
          'What would have happened if you hadn\'t caught this?',
        ],
      },
      {
        question: 'Describe a time you had to quickly learn a new domain or technology to deliver a result.',
        lookFor: [
          'Structured approach to learning (not just reading docs)',
          'Identified what they needed to know vs. what could wait',
          'Applied the new knowledge to produce a real outcome',
          'Speed of learning relative to the complexity',
        ],
        followUps: [
          'What was your learning strategy — how did you ramp up?',
          'What was the hardest part to understand?',
          'How did you know when you knew enough to start building?',
        ],
      },
    ],
  },
  {
    principle: 'Earn Trust',
    description: 'Communicating openly. Admitting mistakes. Sharing bad news early. Being self-critical.',
    questions: [
      {
        question: 'Tell me about a time you had to deliver bad news to a stakeholder or your team.',
        lookFor: [
          'Delivered the news proactively, not when forced to',
          'Was honest and direct — didn\'t sugarcoat or hide behind vague language',
          'Took responsibility where appropriate rather than blaming others',
          'Had a plan or proposed next steps alongside the bad news',
        ],
        followUps: [
          'When did you decide to share the news — what was the trigger?',
          'How did the stakeholder react, and how did you handle their response?',
          'What did you learn about communicating difficult information?',
        ],
      },
      {
        question: 'Describe a mistake you made that had real consequences. What happened and what did you learn?',
        lookFor: [
          'Takes genuine ownership of the mistake — not "the team failed"',
          'Demonstrates self-awareness about what they should have done differently',
          'Shows learning — changed their behavior or process as a result',
          'Comfortable being vulnerable without being self-flagellating',
        ],
        followUps: [
          'At what point did you realize it was a mistake?',
          'What specifically did you change afterwards?',
          'How did you rebuild trust with the people affected?',
        ],
      },
      {
        question: 'Tell me about a time you received difficult feedback. How did you respond?',
        lookFor: [
          'Listened without getting defensive',
          'Sought to understand the feedback, not just dismiss it',
          'Took concrete action based on the feedback',
          'Can point to how it changed their approach or behavior',
        ],
        followUps: [
          'What was your initial reaction — was it hard to hear?',
          'What specifically did you do differently after receiving this feedback?',
          'Did you follow up with the person who gave the feedback?',
        ],
      },
    ],
  },
  {
    principle: 'Learning Velocity',
    description: 'Growing quickly in unfamiliar territory. Curiosity and adaptability. Turning new knowledge into results.',
    questions: [
      {
        question: 'Tell me about a time you had to work in an area completely outside your expertise. How did you approach it?',
        lookFor: [
          'Structured approach to learning — not just thrashing',
          'Sought out the right people and resources efficiently',
          'Produced a meaningful result despite being new to the area',
          'Reflects curiosity and comfort with ambiguity',
        ],
        followUps: [
          'What was the most uncomfortable part of being a beginner?',
          'How did you decide who to ask for help vs. what to figure out yourself?',
          'How long did it take before you felt productive?',
        ],
      },
      {
        question: 'Describe how you stay current in your field. Give me a specific example where something you learned recently changed how you work.',
        lookFor: [
          'Active, intentional learning — not just passive consumption',
          'Can connect learning to practical application',
          'Shows intellectual curiosity beyond what\'s required for the job',
          'Learning is ongoing, not just during transitions',
        ],
        followUps: [
          'What\'s the most surprising thing you\'ve learned recently?',
          'How do you decide what to invest time in learning vs. what to skip?',
          'Have you ever had to unlearn something — a practice that turned out to be wrong?',
        ],
      },
    ],
  },
  {
    principle: 'Judgment',
    description: 'Making sound decisions under uncertainty. Balancing competing priorities. Knowing when to commit and when to change course.',
    questions: [
      {
        question: 'Tell me about a time you had to choose between two good options with significant tradeoffs either way.',
        lookFor: [
          'Clearly articulates both options and their tradeoffs',
          'Used a structured approach to decide (not just gut feel)',
          'Considered second-order effects and long-term consequences',
          'Can explain why they chose what they chose — even if the outcome was uncertain',
        ],
        followUps: [
          'What criteria did you use to evaluate the options?',
          'Who else was involved in the decision?',
          'Was there a point where you considered changing course?',
        ],
      },
      {
        question: 'Describe a time you changed your mind about something significant based on new information.',
        lookFor: [
          'Willing to update their thinking when evidence changes',
          'Doesn\'t treat changing course as failure — treats it as good judgment',
          'Can articulate what specifically changed their mind',
          'Communicated the change to stakeholders effectively',
        ],
        followUps: [
          'What was the new information, and where did it come from?',
          'How did you communicate the change to people who were invested in the original plan?',
          'What was the cost of changing direction — and was it worth it?',
        ],
      },
    ],
  },
];

export default function QuestionBank() {
  const [activePrinciple, setActivePrinciple] = useState<string | null>(null);

  const activeGroup = QUESTION_BANK.find((g) => g.principle === activePrinciple);

  return (
    <div style={{margin: '1.5rem 0'}}>
      {/* Principle filter buttons */}
      <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem'}}>
        {QUESTION_BANK.map((group) => {
          const isActive = activePrinciple === group.principle;
          return (
            <button
              key={group.principle}
              onClick={() => setActivePrinciple(isActive ? null : group.principle)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--signal-radius-sm)',
                border: `2px solid ${isActive ? 'var(--signal-teal)' : 'var(--signal-silver)'}`,
                background: isActive ? 'var(--signal-teal)' : 'transparent',
                cursor: 'pointer',
                fontFamily: 'var(--ifm-heading-font-family)',
                fontWeight: 600,
                fontSize: '0.82rem',
                color: isActive ? 'white' : 'var(--ifm-font-color-base)',
                transition: 'all 0.15s ease',
              }}
            >
              {group.principle}
            </button>
          );
        })}
      </div>

      {/* No selection */}
      {!activeGroup && (
        <div
          style={{
            textAlign: 'center',
            padding: '2rem 1rem',
            color: 'var(--signal-slate)',
            border: '1px dashed var(--signal-silver)',
            borderRadius: 'var(--signal-radius-sm)',
          }}
        >
          <p style={{fontSize: '0.9rem', margin: 0}}>Select a principle above to see interview questions, what to look for, and follow-up ideas.</p>
        </div>
      )}

      {/* Active principle */}
      {activeGroup && (
        <div>
          {/* Principle header */}
          <div
            style={{
              padding: '0.75rem 1rem',
              marginBottom: '1rem',
              borderRadius: 'var(--signal-radius-sm)',
              background: 'rgba(43, 207, 206, 0.06)',
              borderLeft: '4px solid var(--signal-teal)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--ifm-heading-font-family)',
                fontWeight: 700,
                fontSize: '1.1rem',
                color: 'var(--signal-teal)',
                marginBottom: '0.25rem',
              }}
            >
              {activeGroup.principle}
            </div>
            <p style={{fontSize: '0.85rem', margin: 0, lineHeight: 1.5, color: 'var(--signal-slate)'}}>
              {activeGroup.description}
            </p>
          </div>

          {/* Questions */}
          {activeGroup.questions.map((q, qi) => (
            <div
              key={qi}
              className="signal-card"
              style={{marginBottom: '1rem', padding: '1.25rem'}}
            >
              {/* Question */}
              <div
                style={{
                  fontFamily: 'var(--ifm-heading-font-family)',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  lineHeight: 1.5,
                  marginBottom: '1rem',
                  paddingBottom: '0.75rem',
                  borderBottom: '1px solid var(--signal-silver)',
                }}
              >
                "{q.question}"
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                {/* Look for */}
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--ifm-heading-font-family)',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: 'var(--signal-teal)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    What to look for
                  </div>
                  <ul style={{margin: 0, paddingLeft: '1.1rem', fontSize: '0.82rem', lineHeight: 1.6}}>
                    {q.lookFor.map((item, i) => (
                      <li key={i} style={{marginBottom: '0.3rem'}}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Follow-ups */}
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--ifm-heading-font-family)',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: 'var(--signal-slate)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Follow-up ideas
                  </div>
                  <ul style={{margin: 0, paddingLeft: '1.1rem', fontSize: '0.82rem', lineHeight: 1.6}}>
                    {q.followUps.map((item, i) => (
                      <li key={i} style={{marginBottom: '0.3rem'}}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
