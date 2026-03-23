import React, {useState, useCallback} from 'react';

interface CoachingFeedback {
  dimension: string;
  score: 'weak' | 'developing' | 'strong';
  question: string;
}

interface AnalysisResult {
  feedback: CoachingFeedback[];
  overallSignal: 'weak' | 'developing' | 'strong';
  summary: string;
}

interface WritingExerciseProps {
  question: string;
  context?: string;
  sectionId?: string;
}

const STORAGE_KEY = 'signal-writing-exercises';

function loadDrafts(): Record<string, {text: string; revision: number}> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveDraft(key: string, text: string, revision: number) {
  if (typeof window === 'undefined') return;
  const drafts = loadDrafts();
  drafts[key] = {text, revision};
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

function analyzeAnswer(text: string): AnalysisResult {
  const feedback: CoachingFeedback[] = [];
  const lower = text.toLowerCase();
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  // --- Specificity ---
  const hasNumbers = /\d+/.test(text);
  const hasTimeRefs = /\b(week|month|day|year|quarter|sprint|Q[1-4]|january|february|march|april|may|june|july|august|september|october|november|december)\b/i.test(text);
  const hasNames = /\b(team|company|product|project|client|customer|manager|director|VP|CEO|CTO)\b/i.test(text);
  const specificitySignals = [hasNumbers, hasTimeRefs, hasNames, wordCount > 80].filter(Boolean).length;

  if (specificitySignals <= 1) {
    feedback.push({
      dimension: 'Specificity',
      score: 'weak',
      question: 'Can you add concrete details? What was the team size, timeline, or specific product? Replace general phrases like "a project" with real context — the interviewer needs to picture the scene.',
    });
  } else if (specificitySignals <= 2) {
    feedback.push({
      dimension: 'Specificity',
      score: 'developing',
      question: 'Good start on details. Can you add a timeline or name the specific system/product involved? For example, instead of "we had a problem," try "our payment processing pipeline was failing 12% of transactions in Q3."',
    });
  } else {
    feedback.push({
      dimension: 'Specificity',
      score: 'strong',
      question: 'Nice level of detail. Does your context set up the stakes clearly — would the interviewer understand why this situation mattered?',
    });
  }

  // --- Ownership ---
  const iCount = (text.match(/\bI\b/g) || []).length;
  const weCount = (text.match(/\bwe\b/gi) || []).length;
  const myCount = (text.match(/\b(my|myself)\b/gi) || []).length;
  const ownershipRatio = iCount + myCount > 0 ? (iCount + myCount) / (iCount + myCount + weCount) : 0;

  if (iCount === 0 && myCount === 0) {
    feedback.push({
      dimension: 'Ownership',
      score: 'weak',
      question: "You haven't used \"I\" language yet. The interviewer needs to know YOUR specific contribution. What did YOU personally decide, build, or drive? Try rewriting with \"I\" as the subject of key actions.",
    });
  } else if (ownershipRatio < 0.4) {
    feedback.push({
      dimension: 'Ownership',
      score: 'developing',
      question: 'You use "we" more than "I." That makes it hard for the interviewer to assess YOUR role. Which specific decisions or actions were yours alone? Try: "I proposed..." or "I was responsible for..."',
    });
  } else {
    feedback.push({
      dimension: 'Ownership',
      score: 'strong',
      question: 'Clear ownership. Does your answer also show how you influenced others or drove alignment? The best answers show individual leadership within a team.',
    });
  }

  // --- Data & Metrics ---
  const percentPattern = /\d+\s*%/;
  const dollarPattern = /\$[\d,.]+[KMB]?/i;
  const metricWords = /\b(reduced|increased|improved|saved|grew|dropped|rose|cut|doubled|tripled|halved)\b/i;
  const hasPercent = percentPattern.test(text);
  const hasDollar = dollarPattern.test(text);
  const hasMetricVerb = metricWords.test(lower);
  const dataSignals = [hasPercent, hasDollar, hasMetricVerb, hasNumbers].filter(Boolean).length;

  if (dataSignals <= 1) {
    feedback.push({
      dimension: 'Data & Metrics',
      score: 'weak',
      question: 'Your result needs numbers. Can you quantify the impact? Think: "How much?" "How many?" "By what percentage?" Even approximate numbers ("reduced by ~30%") are far better than "it went well."',
    });
  } else if (dataSignals <= 2) {
    feedback.push({
      dimension: 'Data & Metrics',
      score: 'developing',
      question: 'You have some data — can you connect it to business impact? For example, instead of just "improved by 20%," try "improved by 20%, which saved the team 10 hours per week and let us hit our launch date."',
    });
  } else {
    feedback.push({
      dimension: 'Data & Metrics',
      score: 'strong',
      question: 'Strong use of data. Apply the "so what?" test — does each metric clearly connect to why it mattered for the business or team?',
    });
  }

  // --- Depth of Reasoning ---
  const reasoningWords = /\b(because|decided|chose|trade-?off|alternative|considered|weighed|instead of|rather than|reasoning|approach|strategy|risk|option)\b/i;
  const reflectionWords = /\b(learned|realized|in hindsight|looking back|next time|would have|mistake|growth|improved my)\b/i;
  const hasReasoning = reasoningWords.test(text);
  const hasReflection = reflectionWords.test(text);
  const depthSignals = [hasReasoning, hasReflection, wordCount > 120].filter(Boolean).length;

  if (depthSignals === 0) {
    feedback.push({
      dimension: 'Depth of Reasoning',
      score: 'weak',
      question: 'You describe WHAT happened but not WHY you made those choices. Can you explain your reasoning? What alternatives did you consider? Why did you pick this approach over others?',
    });
  } else if (depthSignals <= 1) {
    feedback.push({
      dimension: 'Depth of Reasoning',
      score: 'developing',
      question: 'Some reasoning is emerging. Can you go deeper on a key decision? What trade-offs did you weigh? Did you learn anything you would do differently next time?',
    });
  } else {
    feedback.push({
      dimension: 'Depth of Reasoning',
      score: 'strong',
      question: 'Good depth. Does your answer also show self-awareness — what would you do differently if you faced this situation again?',
    });
  }

  // Overall assessment
  const scores = feedback.map((f) => (f.score === 'strong' ? 2 : f.score === 'developing' ? 1 : 0));
  const total = scores.reduce((a, b) => a + b, 0);
  const overallSignal: 'weak' | 'developing' | 'strong' = total >= 6 ? 'strong' : total >= 3 ? 'developing' : 'weak';

  const summaries = {
    weak: "Your answer has the seed of a good story but needs more structure and detail. Focus on the coaching questions below — each one targets a specific gap. Revise and resubmit to see your signal improve.",
    developing: "You're building solid signal in some areas. The coaching questions below highlight where you can strengthen your answer. A focused revision on 1-2 dimensions will make a big difference.",
    strong: "Strong signal across most dimensions. Review the coaching questions below for final polish — even great answers can improve with sharper metrics or deeper reflection.",
  };

  return {feedback, overallSignal, summary: summaries[overallSignal]};
}

const scoreColors: Record<string, string> = {
  weak: 'var(--signal-ember)',
  developing: 'var(--signal-slate)',
  strong: 'var(--signal-teal)',
};

const scoreLabels: Record<string, string> = {
  weak: 'Weak Signal',
  developing: 'Developing',
  strong: 'Strong Signal',
};

export default function WritingExercise({question, context, sectionId}: WritingExerciseProps) {
  const storageKey = sectionId ? `${sectionId}-writing` : question.slice(0, 40);
  const saved = typeof window !== 'undefined' ? loadDrafts()[storageKey] : undefined;

  const [text, setText] = useState(saved?.text || '');
  const [revision, setRevision] = useState(saved?.revision || 0);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isRevising, setIsRevising] = useState(false);

  const wordCount = text.split(/\s+/).filter(Boolean).length;

  const handleSubmit = useCallback(() => {
    if (wordCount < 15) return;
    const result = analyzeAnswer(text);
    setAnalysis(result);
    const newRevision = revision + 1;
    setRevision(newRevision);
    saveDraft(storageKey, text, newRevision);
    setIsRevising(false);
  }, [text, wordCount, revision, storageKey]);

  const handleRevise = () => {
    setIsRevising(true);
    setAnalysis(null);
  };

  return (
    <div className="signal-card" style={{margin: '1.5rem 0', padding: '1.5rem'}}>
      <div style={{marginBottom: '1rem'}}>
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
            marginBottom: '0.75rem',
          }}
        >
          Writing Exercise
        </span>

        <p
          style={{
            fontFamily: 'var(--ifm-heading-font-family)',
            fontWeight: 600,
            fontSize: '1.1rem',
            margin: '0.5rem 0',
          }}
        >
          {question}
        </p>

        {context && (
          <p style={{fontSize: '0.85rem', color: 'var(--signal-slate)', margin: '0.25rem 0 0'}}>
            {context}
          </p>
        )}
      </div>

      {/* Writing area */}
      {(!analysis || isRevising) && (
        <>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your answer here using a real example from your experience. Think about the STAR elements: set the scene (Situation), describe your responsibility (Task), walk through your key actions and reasoning (Action), and share the measurable outcome (Result)."
            rows={8}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid var(--signal-silver)',
              borderRadius: 'var(--signal-radius-sm)',
              fontFamily: 'var(--ifm-font-family-base)',
              fontSize: '0.9rem',
              lineHeight: '1.6',
              resize: 'vertical',
              background: 'var(--ifm-background-color)',
              color: 'var(--ifm-font-color-base)',
              transition: 'border-color 0.15s ease',
            }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '0.5rem',
            }}
          >
            <span style={{fontSize: '0.8rem', color: 'var(--signal-slate)'}}>
              {wordCount} words{revision > 0 ? ` · Revision ${revision + 1}` : ''}
            </span>
            <button
              className="signal-btn signal-btn-primary"
              onClick={handleSubmit}
              disabled={wordCount < 15}
              style={{opacity: wordCount < 15 ? 0.5 : 1}}
            >
              {revision > 0 ? 'Resubmit for Coaching' : 'Get Coaching Feedback'}
            </button>
          </div>
          {wordCount < 15 && wordCount > 0 && (
            <p style={{fontSize: '0.8rem', color: 'var(--signal-ember)', margin: '0.5rem 0 0'}}>
              Write at least 15 words to get feedback.
            </p>
          )}
        </>
      )}

      {/* Analysis results */}
      {analysis && !isRevising && (
        <div style={{marginTop: '0.5rem'}}>
          {/* Overall signal banner */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              borderRadius: 'var(--signal-radius-sm)',
              background:
                analysis.overallSignal === 'strong'
                  ? 'rgba(43, 207, 206, 0.08)'
                  : analysis.overallSignal === 'developing'
                    ? 'rgba(147, 149, 153, 0.08)'
                    : 'rgba(236, 77, 37, 0.08)',
              borderLeft: `4px solid ${scoreColors[analysis.overallSignal]}`,
              marginBottom: '1rem',
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: 'var(--ifm-heading-font-family)',
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: scoreColors[analysis.overallSignal],
                }}
              >
                {scoreLabels[analysis.overallSignal]}
              </div>
              <p style={{fontSize: '0.85rem', margin: '0.25rem 0 0', lineHeight: 1.5}}>
                {analysis.summary}
              </p>
            </div>
          </div>

          {/* Per-dimension coaching */}
          <h4
            style={{
              fontFamily: 'var(--ifm-heading-font-family)',
              fontSize: '0.95rem',
              marginBottom: '0.75rem',
            }}
          >
            Coaching Questions
          </h4>

          {analysis.feedback.map((fb, i) => (
            <div
              key={i}
              style={{
                padding: '0.75rem 1rem',
                marginBottom: '0.5rem',
                borderRadius: 'var(--signal-radius-sm)',
                border: `1px solid ${scoreColors[fb.score]}`,
                background:
                  fb.score === 'strong'
                    ? 'rgba(43, 207, 206, 0.04)'
                    : fb.score === 'developing'
                      ? 'rgba(147, 149, 153, 0.04)'
                      : 'rgba(236, 77, 37, 0.04)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.35rem',
                }}
              >
                <strong style={{fontFamily: 'var(--ifm-heading-font-family)', fontSize: '0.9rem'}}>
                  {fb.dimension}
                </strong>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: scoreColors[fb.score],
                  }}
                >
                  {scoreLabels[fb.score]}
                </span>
              </div>
              <p style={{fontSize: '0.85rem', margin: 0, lineHeight: 1.5, color: 'var(--ifm-font-color-base)'}}>
                {fb.question}
              </p>
            </div>
          ))}

          {/* Your submitted answer */}
          <div style={{marginTop: '1rem'}}>
            <h4
              style={{
                fontFamily: 'var(--ifm-heading-font-family)',
                fontSize: '0.95rem',
                marginBottom: '0.5rem',
              }}
            >
              Your Answer (Revision {revision})
            </h4>
            <div
              style={{
                padding: '0.75rem',
                borderRadius: 'var(--signal-radius-sm)',
                background: 'rgba(147, 149, 153, 0.06)',
                fontSize: '0.85rem',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
              }}
            >
              {text}
            </div>
          </div>

          {/* Revise button */}
          <div style={{marginTop: '1rem', display: 'flex', gap: '0.75rem'}}>
            <button className="signal-btn signal-btn-primary" onClick={handleRevise}>
              Revise My Answer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
