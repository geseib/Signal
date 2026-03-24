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

interface AIFeedback {
  passed: boolean;
  score: number;
  great: string;
  improvement: string;
}

interface WritingExerciseProps {
  question: string;
  context?: string;
  sectionId?: string;
  rubric?: string;
  placeholder?: string;
}

const ACCESS_CODE_KEY = 'signal-access-code';
const STORAGE_KEY = 'signal-writing-exercises';

function loadAccessCode(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(ACCESS_CODE_KEY) || '';
}

function saveAccessCode(code: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCESS_CODE_KEY, code);
}

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

export default function WritingExercise({question, context, sectionId, rubric, placeholder}: WritingExerciseProps) {
  const storageKey = sectionId ? `${sectionId}-writing` : question.slice(0, 40);
  const saved = typeof window !== 'undefined' ? loadDrafts()[storageKey] : undefined;

  const [text, setText] = useState(saved?.text || '');
  const [revision, setRevision] = useState(saved?.revision || 0);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [aiFeedback, setAiFeedback] = useState<AIFeedback | null>(null);
  const [isRevising, setIsRevising] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [accessCode, setAccessCode] = useState(loadAccessCode);
  const [showCodeInput, setShowCodeInput] = useState(false);

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const hasAI = Boolean(rubric);
  const hasValidCode = accessCode.length > 0;

  const evaluateWithAI = useCallback(async (): Promise<AIFeedback> => {
    const response = await fetch('/api/evaluate', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        answer: text.trim(),
        question,
        rubric,
        accessCode,
      }),
    });

    if (response.status === 401) {
      throw new Error('INVALID_CODE');
    }

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    return response.json();
  }, [text, question, rubric, accessCode]);

  const handleSubmit = useCallback(async () => {
    if (wordCount < 15) return;

    const newRevision = revision + 1;
    setRevision(newRevision);
    saveDraft(storageKey, text, newRevision);
    setAiError(null);

    if (hasAI && hasValidCode) {
      setIsLoading(true);
      try {
        const result = await evaluateWithAI();
        setAiFeedback(result);
        setAnalysis(null);
      } catch (err) {
        if (err instanceof Error && err.message === 'INVALID_CODE') {
          setAiError('Invalid access code. Check your code and try again, or use offline feedback.');
          saveAccessCode('');
          setAccessCode('');
        } else {
          setAiError('AI evaluation unavailable. Using offline feedback instead.');
        }
        // Fall back to heuristic analysis
        const result = analyzeAnswer(text);
        setAnalysis(result);
        setAiFeedback(null);
      } finally {
        setIsLoading(false);
      }
    } else {
      const result = analyzeAnswer(text);
      setAnalysis(result);
      setAiFeedback(null);
    }

    setIsRevising(false);
  }, [text, wordCount, revision, storageKey, hasAI, hasValidCode, evaluateWithAI]);

  const handleRevise = () => {
    setIsRevising(true);
    setAnalysis(null);
    setAiFeedback(null);
    setAiError(null);
  };

  const handleSaveCode = (code: string) => {
    setAccessCode(code);
    saveAccessCode(code);
    setShowCodeInput(false);
  };

  const hasResults = analysis || aiFeedback;

  return (
    <div className="signal-card" style={{margin: '1.5rem 0', padding: '1.5rem'}}>
      <div style={{marginBottom: '1rem'}}>
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
              background: 'var(--signal-teal)',
              color: 'white',
            }}
          >
            Writing Exercise
          </span>
          {hasAI && hasValidCode && (
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
              AI Coach Enabled
            </span>
          )}
        </div>

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

      {/* Access code input for AI mode */}
      {hasAI && !hasValidCode && !showCodeInput && (
        <div
          style={{
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            borderRadius: 'var(--signal-radius-sm)',
            background: 'rgba(43, 207, 206, 0.06)',
            border: '1px solid var(--signal-teal)',
            fontSize: '0.85rem',
          }}
        >
          <p style={{margin: '0 0 0.5rem'}}>
            This exercise supports <strong>AI-powered coaching</strong> via Claude. Enter your access code to enable it, or use the offline feedback below.
          </p>
          <button
            className="signal-btn signal-btn-secondary"
            onClick={() => setShowCodeInput(true)}
            style={{fontSize: '0.8rem', padding: '0.3rem 0.75rem'}}
          >
            Enter Access Code
          </button>
        </div>
      )}

      {showCodeInput && (
        <div
          style={{
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            borderRadius: 'var(--signal-radius-sm)',
            background: 'rgba(43, 207, 206, 0.06)',
            border: '1px solid var(--signal-teal)',
          }}
        >
          <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
            <input
              type="text"
              placeholder="Access code"
              style={{
                flex: 1,
                padding: '0.4rem 0.75rem',
                border: '1px solid var(--signal-silver)',
                borderRadius: 'var(--signal-radius-sm)',
                fontSize: '0.85rem',
                fontFamily: 'var(--ifm-font-family-base)',
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSaveCode((e.target as HTMLInputElement).value.trim());
                }
              }}
            />
            <button
              className="signal-btn signal-btn-primary"
              style={{fontSize: '0.8rem', padding: '0.4rem 0.75rem'}}
              onClick={(e) => {
                const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                handleSaveCode(input?.value?.trim() || '');
              }}
            >
              Save
            </button>
            <button
              className="signal-btn signal-btn-secondary"
              style={{fontSize: '0.8rem', padding: '0.4rem 0.75rem'}}
              onClick={() => setShowCodeInput(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Writing area */}
      {(!hasResults || isRevising) && (
        <>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder || "Write your answer here. Be specific — concrete details, clear reasoning, and measurable outcomes make for the strongest responses."}
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
              disabled={wordCount < 15 || isLoading}
              style={{opacity: wordCount < 15 || isLoading ? 0.5 : 1}}
            >
              {isLoading
                ? 'Evaluating...'
                : revision > 0
                  ? 'Resubmit for Coaching'
                  : 'Get Coaching Feedback'}
            </button>
          </div>
          {wordCount < 15 && wordCount > 0 && (
            <p style={{fontSize: '0.8rem', color: 'var(--signal-ember)', margin: '0.5rem 0 0'}}>
              Write at least 15 words to get feedback.
            </p>
          )}
        </>
      )}

      {/* AI error message */}
      {aiError && (
        <p style={{fontSize: '0.8rem', color: 'var(--signal-ember)', margin: '0.5rem 0'}}>
          {aiError}
        </p>
      )}

      {/* AI Feedback results */}
      {aiFeedback && !isRevising && (
        <div style={{marginTop: '0.5rem'}}>
          {/* Score header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1rem',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--ifm-heading-font-family)',
                fontWeight: 700,
                fontSize: '1rem',
                color: aiFeedback.passed ? 'var(--signal-teal)' : 'var(--signal-ember)',
              }}
            >
              {aiFeedback.passed ? 'Strong Signal' : 'Keep Going'}
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--signal-slate)',
              }}
            >
              Score: {aiFeedback.score}/100
            </span>
          </div>

          {/* What's great */}
          {aiFeedback.great && (
            <div
              style={{
                padding: '0.75rem 1rem',
                marginBottom: '0.5rem',
                borderRadius: 'var(--signal-radius-sm)',
                background: 'rgba(43, 207, 206, 0.06)',
                borderLeft: '4px solid var(--signal-teal)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--ifm-heading-font-family)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--signal-teal)',
                  marginBottom: '0.35rem',
                }}
              >
                What's great
              </div>
              <p style={{fontSize: '0.85rem', margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap'}}>
                {aiFeedback.great}
              </p>
            </div>
          )}

          {/* Improvement ideas */}
          {aiFeedback.improvement && (
            <div
              style={{
                padding: '0.75rem 1rem',
                marginBottom: '0.5rem',
                borderRadius: 'var(--signal-radius-sm)',
                background: 'rgba(147, 149, 153, 0.06)',
                borderLeft: '4px solid var(--signal-slate)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--ifm-heading-font-family)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--signal-slate)',
                  marginBottom: '0.35rem',
                }}
              >
                Improvement ideas
              </div>
              <p style={{fontSize: '0.85rem', margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap'}}>
                {aiFeedback.improvement}
              </p>
            </div>
          )}

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

          <div style={{marginTop: '1rem', display: 'flex', gap: '0.75rem'}}>
            <button className="signal-btn signal-btn-primary" onClick={handleRevise}>
              Revise My Answer
            </button>
          </div>
        </div>
      )}

      {/* Heuristic analysis results (fallback) */}
      {analysis && !isRevising && (
        <div style={{marginTop: '0.5rem'}}>
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
