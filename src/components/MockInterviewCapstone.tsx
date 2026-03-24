import React, {useState} from 'react';
import LoopPlanner from './LoopPlanner';
import DebriefPanel from './DebriefPanel';
import WritingExercise from './WritingExercise';
import FollowUpPicker from './FollowUpPicker';
import CandidateAnswer from './CandidateAnswer';

type Step = 'plan' | 'interview' | 'debrief' | 'reflection';

const SAM_ANSWER = `About two years ago, I redesigned our order fulfillment pipeline. The existing system was a monolith that processed orders sequentially — fine when we had 500 orders a day, but we'd grown to 15,000 and the pipeline was buckling. Orders were getting stuck, inventory counts were drifting, and we were averaging about 3 fulfillment errors per day, which doesn't sound like much until you realize each one meant a customer got the wrong item or nothing at all.

I spent two weeks analyzing the failure modes before proposing anything. The core issue was that the monolith was doing inventory reservation, payment capture, and warehouse routing in a single transaction. If any step failed, the whole order would retry from scratch, which caused duplicate reservations and inventory drift.

I proposed breaking it into an event-driven architecture with three independent services: inventory reservation, payment processing, and warehouse routing. Each service would own its own state and communicate through an event bus. The key design decision was making each step idempotent — so retries would be safe regardless of where the failure occurred.

The tricky part was the inventory sync. We had three warehouses, each with their own inventory database. I designed a conflict resolution system using vector clocks — basically, each warehouse could accept orders independently, and the system would reconcile inventory counts every 30 seconds. If two warehouses both reserved the last unit of something, the conflict resolver would detect it within 30 seconds and cancel the slower order with an automatic customer notification and reorder.

We rolled it out warehouse by warehouse over six weeks. Order errors dropped from about 3 per day to less than 1 per week — an 85% reduction. Processing latency went from 45 seconds average to under 3 seconds. And the system handled Black Friday at 4x normal volume without any manual intervention.

The thing I'd do differently is the monitoring. I built the system before I built comprehensive monitoring, so for the first two weeks we were somewhat flying blind. I've learned since then to build observability in from the start, not bolt it on after.`;

const NOTE_TAKING_RUBRIC = `Evaluate whether the notes capture the key evidence from Sam's answer about the fulfillment pipeline redesign. Be forgiving of abbreviations, misspellings, and shorthand — those are expected in real-time notes. What matters is whether the essential data points and STAR components are present.

KEY DATA POINTS that strong notes should capture:
- Scale: 500 → 15,000 orders/day, 3 fulfillment errors/day
- Root cause: monolith doing inventory reservation + payment capture + warehouse routing in single transaction; retry logic treated timeouts as successes
- Solution: event-driven architecture with 3 independent services, each owning state, communicating via event bus
- Key design decision: idempotent operations for safe retries
- Inventory sync: vector clocks for conflict resolution across 3 warehouses, 30-second reconciliation cycle
- Rollout: warehouse by warehouse over 6 weeks
- Results: errors 3/day → <1/week (85% reduction), latency 45s → <3s, handled Black Friday at 4x volume
- Self-awareness: monitoring gap admission — built system before building monitoring

STAR COMPONENTS:
- Situation: monolith buckling at 15K orders/day, fulfillment errors, inventory drift
- Task: implied — needed to redesign for scale (good notes might flag this as implicit)
- Action: 2-week analysis, proposed event-driven architecture, idempotent design, vector clocks, phased rollout
- Result: 85% error reduction, 45s→3s latency, Black Friday at 4x

Notes should NOT contain evaluative verdicts like 'great answer' or 'clearly strong.' Factual observations and probing flags (? or follow up) are good.

DIVE DEEP SPECIFIC: Strong notes for Dive Deep evaluation should capture the DEPTH of technical understanding — vector clocks, idempotent design, the specific failure mode analysis, the monitoring gap admission. These show the candidate operates at multiple levels of detail.`;

const DEBRIEF_RUBRIC = `A strong debrief recommendation should:

1. ADDRESS ALL FOUR PRINCIPLES individually with specific evidence:
   - Dive Deep: vector clocks, idempotent design, 2-week failure mode analysis, monitoring gap admission, conflict resolution system design — all show deep technical understanding at multiple levels
   - Ownership: identified the problem proactively, proposed the solution, drove 6-week rollout end to end, took responsibility for the monitoring gap
   - Collaboration: evidence is mixed — mentored 2 junior engineers, worked with warehouse ops, but core technical design was largely solo; the "I" framing vs recruiter note about underselling collaboration
   - Bias for Action: phased rollout (reversible decision), 6 weeks for 3 warehouses, system handled Black Friday at 4x without intervention

2. IDENTIFY BIAS in the interviewer notes. Possible bias depends on panel composition:
   - If Elena was selected: "Really confident communicator — would fit right in with our team culture" is similarity/affinity bias (evaluating culture fit rather than evidence)
   - If Marcus was selected: "A bit quiet — not sure they'd be strong in our fast-paced meetings" is first impression bias / introversion bias (evaluating personality rather than behavioral evidence)
   - If both Elena and Marcus were selected, both biases should be identified
   - If Kai and Aisha were selected, the response should note that no significant bias was detected (strong answer)

3. PROVIDE A CLEAR RECOMMENDATION that follows logically from the evidence:
   - Should address the Bar Raiser's concern about Collaboration directly
   - Should weigh the recruiter note about Sam underselling collaboration
   - Should distinguish between communication style ("I" framing) and actual working style
   - Should acknowledge evidence gaps honestly

4. CITE EVIDENCE FROM ALL INTERVIEWERS, not just their own Dive Deep interview — this shows synthesis across the full loop

Bonus: Response considers whether the "I" framing is a communication habit vs genuine solo-operator tendency, referencing the recruiter notes as supporting evidence.`;

export default function MockInterviewCapstone() {
  const [step, setStep] = useState<Step>('plan');
  const [selections, setSelections] = useState<{slot1: 'a' | 'b'; slot2: 'a' | 'b'} | null>(null);

  const handlePlanComplete = (sel: {slot1: 'a' | 'b'; slot2: 'a' | 'b'}) => {
    setSelections(sel);
    setStep('interview');
    // Scroll to top of component
    setTimeout(() => {
      window.scrollTo({top: 0, behavior: 'smooth'});
    }, 100);
  };

  const handleInterviewComplete = () => {
    setStep('debrief');
    setTimeout(() => {
      window.scrollTo({top: 0, behavior: 'smooth'});
    }, 100);
  };

  const handleDebriefComplete = () => {
    setStep('reflection');
    setTimeout(() => {
      window.scrollTo({top: 0, behavior: 'smooth'});
    }, 100);
  };

  // Step indicator
  const steps: {key: Step; label: string}[] = [
    {key: 'plan', label: 'Plan the Loop'},
    {key: 'interview', label: 'Your Interview'},
    {key: 'debrief', label: 'The Debrief'},
    {key: 'reflection', label: 'Reflection'},
  ];

  const stepIndex = steps.findIndex((s) => s.key === step);

  return (
    <div>
      {/* Step Progress Indicator */}
      <div
        style={{
          display: 'flex',
          gap: '0.25rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
        }}
      >
        {steps.map((s, i) => {
          const isActive = i === stepIndex;
          const isCompleted = i < stepIndex;
          return (
            <div
              key={s.key}
              style={{
                flex: 1,
                minWidth: '120px',
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--signal-radius-sm)',
                background: isActive
                  ? 'var(--signal-teal)'
                  : isCompleted
                    ? 'rgba(43, 207, 206, 0.15)'
                    : 'rgba(147, 149, 153, 0.08)',
                color: isActive ? 'white' : isCompleted ? 'var(--signal-teal)' : 'var(--signal-slate)',
                fontFamily: 'var(--ifm-heading-font-family)',
                fontWeight: 600,
                fontSize: '0.75rem',
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                transition: 'all 0.3s ease',
              }}
            >
              {isCompleted ? '\u2713 ' : `${i + 1}. `}
              {s.label}
            </div>
          );
        })}
      </div>

      {/* Step 1: Plan */}
      {step === 'plan' && <LoopPlanner onComplete={handlePlanComplete} />}

      {/* Step 2: Interview */}
      {step === 'interview' && selections && (
        <div>
          <div
            style={{
              padding: '1rem 1.25rem',
              borderRadius: 'var(--signal-radius-sm)',
              background: 'rgba(43, 207, 206, 0.06)',
              borderLeft: '4px solid var(--signal-teal)',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
              lineHeight: 1.6,
            }}
          >
            Your panel is set. The other interviewers are conducting their sessions in parallel.
            Now it is time for your interview with Sam. You are evaluating <strong>Dive Deep</strong>.
          </div>

          <h3
            style={{
              fontFamily: 'var(--ifm-heading-font-family)',
              fontSize: '1.1rem',
              margin: '0 0 0.5rem',
            }}
          >
            Your Question
          </h3>
          <div
            style={{
              padding: '1rem 1.25rem',
              borderRadius: 'var(--signal-radius-sm)',
              background: 'rgba(147, 149, 153, 0.06)',
              border: '1px solid var(--signal-silver)',
              marginBottom: '1.5rem',
              fontSize: '0.95rem',
              fontStyle: 'italic',
              lineHeight: 1.6,
            }}
          >
            "Tell me about the most complex system you've designed or significantly improved. Walk me
            through the technical decisions and tradeoffs."
          </div>

          <h3
            style={{
              fontFamily: 'var(--ifm-heading-font-family)',
              fontSize: '1.1rem',
              margin: '0 0 0.5rem',
            }}
          >
            Sam's Answer
          </h3>
          <CandidateAnswer
            candidateName="Sam"
            audioFile="sam - swe-res.mp3"
            transcript={SAM_ANSWER}
          />

          {/* Note-taking exercise */}
          <WritingExercise
            question="Take notes on Sam's answer as if you were conducting this interview for Dive Deep."
            context="Capture the STAR components and key technical details. Focus on evidence that demonstrates (or doesn't demonstrate) Dive Deep: does the candidate operate at all levels of detail? Do they understand the WHY behind technical decisions? Record data points, specific actions, and measurements. Flag anything you'd follow up on."
            sectionId="301-S6-notes"
            rubric={NOTE_TAKING_RUBRIC}
            placeholder={"S/T: [situation and task]\nA: [specific actions and technical decisions]\nR: [results with metrics]\nDive Deep signal: [what demonstrates depth?]\n? [follow-up questions]"}
          />

          {/* Follow-up picker */}
          <h3
            style={{
              fontFamily: 'var(--ifm-heading-font-family)',
              fontSize: '1.1rem',
              margin: '1.5rem 0 0.5rem',
            }}
          >
            Pick Your Follow-Up
          </h3>
          <p style={{fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '0.5rem'}}>
            Sam's answer has strong technical depth but there are gaps in the STAR framework. Which
            follow-up would generate the most new signal for <strong>Dive Deep</strong>?
          </p>

          <FollowUpPicker
            scenarioId="301-S6-FU1"
            followUps={[
              {
                label:
                  'You mentioned the vector clock approach for inventory sync. What other approaches did you consider, and why did you choose vector clocks over them?',
                explanation:
                  'This is the strongest Dive Deep follow-up. Sam described WHAT he built but not the tradeoff analysis behind the most complex design decision. Asking about alternatives he considered reveals whether the depth is genuine — can he articulate why vector clocks were better than simpler approaches like last-write-wins or distributed locks? This is exactly what Dive Deep evaluates: understanding the WHY, not just the WHAT.',
                isCorrect: true,
              },
              {
                label: 'How did your team feel about the migration?',
                explanation:
                  "This is a Collaboration question, not a Dive Deep question. You're evaluating Dive Deep in your slot — stay focused on technical depth. Another interviewer is covering Collaboration.",
                isCorrect: false,
              },
              {
                label: 'What was the business impact of the 85% error reduction?',
                explanation:
                  "Sam already gave strong Result data (85% error reduction, 45s to 3s latency, handled Black Friday at 4x). The Result component is solid. Your follow-up should target what's missing — the tradeoff analysis behind the technical decisions — not what's already strong.",
                isCorrect: false,
              },
              {
                label:
                  'If you had to do this project again from scratch, what would you change?',
                explanation:
                  "Sam already answered this — he said he'd build monitoring from the start. This question would likely get a repeat of that answer. A stronger follow-up targets a gap you don't already have signal on.",
                isCorrect: false,
              },
            ]}
          />

          <div style={{marginTop: '2rem'}}>
            <button
              className="signal-btn signal-btn-primary"
              onClick={handleInterviewComplete}
              style={{fontSize: '1rem', padding: '0.6rem 1.5rem'}}
            >
              Proceed to the Debrief
            </button>
            <p style={{fontSize: '0.8rem', color: 'var(--signal-slate)', margin: '0.5rem 0 0'}}>
              Make sure you have completed the note-taking exercise and follow-up picker above before
              continuing.
            </p>
          </div>
        </div>
      )}

      {/* Step 3: Debrief */}
      {step === 'debrief' && selections && (
        <div>
          <div
            style={{
              padding: '1rem 1.25rem',
              borderRadius: 'var(--signal-radius-sm)',
              background: 'rgba(43, 207, 206, 0.06)',
              borderLeft: '4px solid var(--signal-teal)',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
              lineHeight: 1.6,
            }}
          >
            Your interview is complete. The other interviewers have finished their sessions too. You
            are now in the debrief room. Everyone's notes are on the table. Read through them
            carefully — you will need to synthesize evidence from all interviewers to write your
            recommendation.
          </div>

          <DebriefPanel slot1={selections.slot1} slot2={selections.slot2} />

          <h3
            style={{
              fontFamily: 'var(--ifm-heading-font-family)',
              fontSize: '1.1rem',
              margin: '2rem 0 0.5rem',
            }}
          >
            Write Your Recommendation
          </h3>
          <p style={{fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '0.5rem'}}>
            You have reviewed all interviewer notes and the Bar Raiser's assessment. Write your
            hire/no-hire recommendation for Sam. Your write-up should cover three parts:
          </p>
          <ol style={{fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1rem'}}>
            <li>
              <strong>Principle-by-principle assessment</strong> — cite evidence from ALL
              interviewers, not just your own Dive Deep interview
            </li>
            <li>
              <strong>Bias identification</strong> — flag any statements in the interviewer notes
              that reflect bias rather than behavioral evidence, and name the bias pattern
            </li>
            <li>
              <strong>Your recommendation</strong> — hire or no-hire, supported by evidence, with
              honest acknowledgment of gaps
            </li>
          </ol>

          <WritingExercise
            question="Write your complete debrief recommendation for Sam Okafor, covering: (1) principle-by-principle assessment citing evidence from all interviewers, (2) bias identification in the interviewer notes, and (3) your hire/no-hire recommendation with reasoning."
            context="You have notes from your Dive Deep interview plus notes from two other interviewers and the Bar Raiser. The four principles are: Ownership, Dive Deep, Collaboration, and Bias for Action. Look carefully at the behavioral evidence in each set of notes, identify any bias patterns, and address the Bar Raiser's concern about Collaboration."
            sectionId="301-S6-debrief"
            rubric={DEBRIEF_RUBRIC}
            placeholder={"Part 1 — Principle-by-principle assessment:\n\nDive Deep: [your assessment with evidence from your interview]\nOwnership: [your assessment with evidence]\nCollaboration: [your assessment with evidence — address the mixed signal]\nBias for Action: [your assessment with evidence]\n\nPart 2 — Bias identification:\n[Flag any biased statements and name the bias pattern]\n\nPart 3 — Recommendation:\n[Hire or no-hire, with supporting evidence and honest gaps]"}
          />

          <div style={{marginTop: '2rem'}}>
            <button
              className="signal-btn signal-btn-primary"
              onClick={handleDebriefComplete}
              style={{fontSize: '1rem', padding: '0.6rem 1.5rem'}}
            >
              Complete the Capstone
            </button>
            <p style={{fontSize: '0.8rem', color: 'var(--signal-slate)', margin: '0.5rem 0 0'}}>
              Make sure you have submitted your debrief recommendation above before continuing.
            </p>
          </div>
        </div>
      )}

      {/* Step 4: Reflection */}
      {step === 'reflection' && (
        <div>
          <div
            style={{
              padding: '1.5rem',
              borderRadius: 'var(--signal-radius-sm)',
              background: 'rgba(43, 207, 206, 0.06)',
              borderLeft: '4px solid var(--signal-teal)',
              marginBottom: '2rem',
              lineHeight: 1.7,
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--ifm-heading-font-family)',
                fontSize: '1.1rem',
                margin: '0 0 0.75rem',
                color: 'var(--signal-teal)',
              }}
            >
              Capstone Complete
            </h3>
            <p style={{fontSize: '0.9rem', margin: '0 0 0.75rem'}}>
              You just planned an interview loop, conducted your interview, reviewed notes from
              multiple interviewers, identified bias, and wrote an evidence-based recommendation.
              That is the full cycle — and you did it with the same rigor expected of the best
              interviewers at top companies.
            </p>
          </div>

          <h3
            style={{
              fontFamily: 'var(--ifm-heading-font-family)',
              fontSize: '1.1rem',
              margin: '0 0 0.75rem',
            }}
          >
            What strong debrief participants do
          </h3>
          <p style={{fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '0.75rem'}}>
            Looking back at this exercise, here is what separates a strong debrief participant from
            an average one:
          </p>
          <ul style={{fontSize: '0.9rem', lineHeight: 1.8, marginBottom: '1.5rem'}}>
            <li>
              <strong>They cite evidence from all interviewers</strong>, not just their own session.
              Your recommendation should have referenced specific behavioral examples from every set
              of notes.
            </li>
            <li>
              <strong>They catch bias</strong> — and name it. Whether it was a comment about "culture
              fit," an observation about the candidate being "quiet," or a credential reference, the
              best participants flag it and redirect the conversation to evidence.
            </li>
            <li>
              <strong>They address mixed signal directly</strong>. The Collaboration evidence for Sam
              was genuinely mixed. Strong participants do not ignore this — they acknowledge the mixed
              signal, weigh the evidence on both sides, and factor in context (like the recruiter
              notes about underselling collaboration).
            </li>
            <li>
              <strong>They distinguish evidence from inference</strong>. "Sam designed the
              architecture solo" is evidence. "Sam can't collaborate" is an inference. Strong
              participants are precise about the difference.
            </li>
            <li>
              <strong>They make a clear recommendation</strong> — and own it. The Bar Raiser leaned
              hire but wanted discussion. Your recommendation should have taken a clear position while
              acknowledging uncertainty honestly.
            </li>
          </ul>

          <h3
            style={{
              fontFamily: 'var(--ifm-heading-font-family)',
              fontSize: '1.1rem',
              margin: '0 0 0.75rem',
            }}
          >
            You have completed the Signal Interview Workshop
          </h3>
          <p style={{fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '0.75rem'}}>
            Across three workshops, you built every skill in the structured interviewer's toolkit:
          </p>
          <ul style={{fontSize: '0.9rem', lineHeight: 1.8, marginBottom: '1.5rem'}}>
            <li>
              <strong>Workshop 101:</strong> The STAR framework, behavioral vs. technical questions,
              and the Bar Raiser philosophy
            </li>
            <li>
              <strong>Workshop 201:</strong> Principles-based evaluation, probing for depth, avoiding
              bias, and running a debrief
            </li>
            <li>
              <strong>Workshop 301:</strong> Loop planning, advanced frameworks, technical interview
              integration, difficult scenarios, story banking, and — just now — the full mock
              interview
            </li>
          </ul>
          <p style={{fontSize: '0.9rem', lineHeight: 1.7}}>
            The best way to sharpen these skills is to use them. The next interview you conduct, plan
            the loop with principles assigned. Take behavioral notes. Identify bias in real time.
            Write your debrief with evidence first. Every interview is practice — and now you know
            exactly what to practice.
          </p>
        </div>
      )}
    </div>
  );
}
