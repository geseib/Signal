import React, {useState, useCallback} from 'react';

interface Story {
  id: number;
  category: string;
  title: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  principles: string[];
  followUpNotes: string;
}

const CATEGORIES = [
  {value: 'project', label: 'Project / Launch', prompt: 'Think about a project you led or significantly contributed to. What was built, launched, or delivered?'},
  {value: 'conflict', label: 'Conflict / Disagreement', prompt: 'Think about a time you navigated a disagreement — with a peer, a manager, or another team. How did you work through it?'},
  {value: 'failure', label: 'Failure / Mistake', prompt: 'Think about something that went wrong — a missed deadline, a production incident, a bad decision. What happened and what did you learn?'},
  {value: 'mentoring', label: 'Mentoring / Leadership', prompt: 'Think about a time you helped someone grow — onboarding a new hire, coaching an underperformer, or teaching a skill.'},
  {value: 'pivot', label: 'Pivot / Adaptation', prompt: 'Think about a time you had to change direction — new requirements, a shifting market, or learning something that invalidated your plan.'},
];

const PRINCIPLES = [
  'Ownership',
  'Collaboration',
  'Customer Focus',
  'Bias for Action',
  'Dive Deep',
  'Learning Velocity',
  'Judgment',
  'Earn Trust',
];

const STORAGE_KEY = 'signal-story-bank';

function loadStories(): Story[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStories(stories: Story[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
}

function exportCSV(stories: Story[]) {
  const headers = ['Category', 'Title', 'Situation', 'Task', 'Action', 'Result', 'Principles', 'Follow-up Notes'];
  const rows = stories.map((s) => [
    s.category,
    s.title,
    s.situation,
    s.task,
    s.action,
    s.result,
    s.principles.join('; '),
    s.followUpNotes,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'story-bank.csv';
  link.click();
  URL.revokeObjectURL(url);
}

type BuilderStep = 'list' | 'category' | 'situation' | 'task' | 'action' | 'result' | 'principles' | 'notes' | 'review';

export default function StoryBankBuilder() {
  const [stories, setStories] = useState<Story[]>(loadStories);
  const [step, setStep] = useState<BuilderStep>('list');
  const [draft, setDraft] = useState<Partial<Story>>({});
  const [editingId, setEditingId] = useState<number | null>(null);

  const selectedCategory = CATEGORIES.find((c) => c.value === draft.category);

  const saveDraft = useCallback(() => {
    const story: Story = {
      id: editingId ?? Date.now(),
      category: draft.category || '',
      title: draft.title || '',
      situation: draft.situation || '',
      task: draft.task || '',
      action: draft.action || '',
      result: draft.result || '',
      principles: draft.principles || [],
      followUpNotes: draft.followUpNotes || '',
    };

    let updated: Story[];
    if (editingId !== null) {
      updated = stories.map((s) => (s.id === editingId ? story : s));
    } else {
      updated = [...stories, story];
    }

    setStories(updated);
    saveStories(updated);
    setDraft({});
    setEditingId(null);
    setStep('list');
  }, [draft, stories, editingId]);

  const startNew = () => {
    setDraft({});
    setEditingId(null);
    setStep('category');
  };

  const startEdit = (story: Story) => {
    setDraft(story);
    setEditingId(story.id);
    setStep('category');
  };

  const deleteStory = (id: number) => {
    const updated = stories.filter((s) => s.id !== id);
    setStories(updated);
    saveStories(updated);
  };

  const togglePrinciple = (p: string) => {
    const current = draft.principles || [];
    const updated = current.includes(p) ? current.filter((x) => x !== p) : [...current, p];
    setDraft({...draft, principles: updated});
  };

  // Coverage check
  const coveredPrinciples = new Set(stories.flatMap((s) => s.principles));
  const uncoveredPrinciples = PRINCIPLES.filter((p) => !coveredPrinciples.has(p));

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.6rem 0.75rem',
    border: '2px solid var(--signal-silver)',
    borderRadius: 'var(--signal-radius-sm)',
    fontFamily: 'var(--ifm-font-family-base)',
    fontSize: '0.9rem',
    lineHeight: '1.5',
    background: 'var(--ifm-background-color)',
    color: 'var(--ifm-font-color-base)',
  };

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    resize: 'vertical' as const,
  };

  const questionStyle: React.CSSProperties = {
    fontFamily: 'var(--ifm-heading-font-family)',
    fontWeight: 600,
    fontSize: '1rem',
    margin: '0 0 0.35rem',
  };

  const hintStyle: React.CSSProperties = {
    fontSize: '0.82rem',
    color: 'var(--signal-slate)',
    margin: '0 0 0.75rem',
    lineHeight: 1.5,
  };

  const stepIndicator = (currentStep: BuilderStep) => {
    const stepOrder: BuilderStep[] = ['category', 'situation', 'task', 'action', 'result', 'principles', 'notes', 'review'];
    const currentIndex = stepOrder.indexOf(currentStep);
    const labels = ['Category', 'Situation', 'Task', 'Action', 'Result', 'Principles', 'Notes', 'Review'];
    return (
      <div style={{display: 'flex', gap: '0.25rem', marginBottom: '1.25rem', flexWrap: 'wrap'}}>
        {labels.map((label, i) => (
          <span
            key={label}
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              fontFamily: 'var(--ifm-heading-font-family)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              padding: '0.15rem 0.5rem',
              borderRadius: 'var(--signal-radius-sm)',
              background: i <= currentIndex ? 'var(--signal-teal)' : 'var(--signal-silver)',
              color: i <= currentIndex ? 'white' : 'var(--signal-slate)',
            }}
          >
            {label}
          </span>
        ))}
      </div>
    );
  };

  // LIST VIEW
  if (step === 'list') {
    return (
      <div className="signal-card" style={{margin: '1.5rem 0', padding: '1.5rem'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
          <div>
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
              Story Bank Builder
            </span>
            <span style={{fontSize: '0.8rem', color: 'var(--signal-slate)', marginLeft: '0.75rem'}}>
              {stories.length} {stories.length === 1 ? 'story' : 'stories'}
            </span>
          </div>
          <div style={{display: 'flex', gap: '0.5rem'}}>
            {stories.length > 0 && (
              <button
                className="signal-btn signal-btn-secondary"
                onClick={() => exportCSV(stories)}
                style={{fontSize: '0.8rem', padding: '0.4rem 0.75rem'}}
              >
                Export CSV
              </button>
            )}
            <button
              className="signal-btn signal-btn-primary"
              onClick={startNew}
              style={{fontSize: '0.8rem', padding: '0.4rem 0.75rem'}}
            >
              + Add Story
            </button>
          </div>
        </div>

        {stories.length === 0 ? (
          <div style={{textAlign: 'center', padding: '2rem 1rem', color: 'var(--signal-slate)'}}>
            <p style={{fontSize: '0.9rem', margin: '0 0 0.5rem'}}>Your story bank is empty.</p>
            <p style={{fontSize: '0.85rem', margin: 0}}>Click <strong>+ Add Story</strong> to start building. We'll walk you through it step by step.</p>
          </div>
        ) : (
          <>
            {stories.map((story) => (
              <div
                key={story.id}
                style={{
                  padding: '0.75rem 1rem',
                  marginBottom: '0.5rem',
                  borderRadius: 'var(--signal-radius-sm)',
                  border: '1px solid var(--signal-silver)',
                  background: 'rgba(147, 149, 153, 0.02)',
                }}
              >
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                  <div style={{flex: 1}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem'}}>
                      <strong style={{fontFamily: 'var(--ifm-heading-font-family)', fontSize: '0.9rem'}}>
                        {story.title || 'Untitled'}
                      </strong>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          padding: '0.1rem 0.4rem',
                          borderRadius: 'var(--signal-radius-sm)',
                          background: 'var(--signal-slate)',
                          color: 'white',
                        }}
                      >
                        {story.category}
                      </span>
                    </div>
                    <div style={{display: 'flex', gap: '0.3rem', flexWrap: 'wrap'}}>
                      {story.principles.map((p) => (
                        <span
                          key={p}
                          style={{
                            fontSize: '0.65rem',
                            fontWeight: 600,
                            padding: '0.1rem 0.35rem',
                            borderRadius: 'var(--signal-radius-sm)',
                            background: 'rgba(43, 207, 206, 0.1)',
                            color: 'var(--signal-teal)',
                          }}
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                    {story.result && (
                      <p style={{fontSize: '0.8rem', color: 'var(--signal-slate)', margin: '0.35rem 0 0', lineHeight: 1.4}}>
                        Result: {story.result.slice(0, 120)}{story.result.length > 120 ? '...' : ''}
                      </p>
                    )}
                  </div>
                  <div style={{display: 'flex', gap: '0.3rem', marginLeft: '0.5rem'}}>
                    <button
                      onClick={() => startEdit(story)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        color: 'var(--signal-teal)',
                        fontWeight: 600,
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteStory(story.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        color: 'var(--signal-ember)',
                        fontWeight: 600,
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Coverage check */}
            <div
              style={{
                marginTop: '1rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--signal-radius-sm)',
                background: uncoveredPrinciples.length === 0 ? 'rgba(43, 207, 206, 0.06)' : 'rgba(236, 77, 37, 0.06)',
                borderLeft: `4px solid ${uncoveredPrinciples.length === 0 ? 'var(--signal-teal)' : 'var(--signal-ember)'}`,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--ifm-heading-font-family)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: uncoveredPrinciples.length === 0 ? 'var(--signal-teal)' : 'var(--signal-ember)',
                  marginBottom: '0.25rem',
                }}
              >
                {uncoveredPrinciples.length === 0 ? 'All principles covered' : 'Gap check'}
              </div>
              <p style={{fontSize: '0.82rem', margin: 0, lineHeight: 1.5}}>
                {uncoveredPrinciples.length === 0
                  ? `Your ${stories.length} stories cover all ${PRINCIPLES.length} principles. Nice work.`
                  : `Not yet covered: ${uncoveredPrinciples.join(', ')}. Add a story that demonstrates ${uncoveredPrinciples.length === 1 ? 'this principle' : 'these principles'}.`}
              </p>
            </div>
          </>
        )}
      </div>
    );
  }

  // GUIDED BUILDER STEPS
  return (
    <div className="signal-card" style={{margin: '1.5rem 0', padding: '1.5rem'}}>
      {stepIndicator(step)}

      {/* CATEGORY */}
      {step === 'category' && (
        <div>
          <p style={questionStyle}>What type of experience is this story from?</p>
          <p style={hintStyle}>Pick the category that best describes the situation. This helps ensure your bank covers different types of experiences.</p>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem'}}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setDraft({...draft, category: cat.value})}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.6rem 1rem',
                  borderRadius: 'var(--signal-radius-sm)',
                  border: `2px solid ${draft.category === cat.value ? 'var(--signal-teal)' : 'var(--signal-silver)'}`,
                  background: draft.category === cat.value ? 'rgba(43, 207, 206, 0.04)' : 'transparent',
                  cursor: 'pointer',
                  fontFamily: 'var(--ifm-font-family-base)',
                  fontSize: '0.85rem',
                  color: 'var(--ifm-font-color-base)',
                }}
              >
                <strong>{cat.label}</strong>
                <span style={{color: 'var(--signal-slate)', marginLeft: '0.5rem'}}> — {cat.prompt}</span>
              </button>
            ))}
          </div>
          <div style={{display: 'flex', gap: '0.5rem'}}>
            <button className="signal-btn signal-btn-secondary" onClick={() => { setDraft({}); setEditingId(null); setStep('list'); }} style={{fontSize: '0.8rem'}}>
              Cancel
            </button>
            <button className="signal-btn signal-btn-primary" onClick={() => setStep('situation')} disabled={!draft.category} style={{fontSize: '0.8rem', opacity: draft.category ? 1 : 0.5}}>
              Next
            </button>
          </div>
        </div>
      )}

      {/* SITUATION */}
      {step === 'situation' && (
        <div>
          <p style={questionStyle}>Give this story a short title</p>
          <p style={hintStyle}>Something you'd recognize at a glance — e.g., "Fulfillment pipeline rebuild" or "Q3 production incident."</p>
          <input
            type="text"
            value={draft.title || ''}
            onChange={(e) => setDraft({...draft, title: e.target.value})}
            placeholder="Story title"
            style={{...inputStyle, marginBottom: '1rem'}}
          />
          <p style={questionStyle}>What was the situation?</p>
          <p style={hintStyle}>{selectedCategory?.prompt} Set the scene: what was happening, what was at stake, and why it mattered.</p>
          <textarea
            value={draft.situation || ''}
            onChange={(e) => setDraft({...draft, situation: e.target.value})}
            placeholder="Describe the situation — context, stakes, why it mattered"
            rows={3}
            style={textareaStyle}
          />
          <div style={{display: 'flex', gap: '0.5rem', marginTop: '0.75rem'}}>
            <button className="signal-btn signal-btn-secondary" onClick={() => setStep('category')} style={{fontSize: '0.8rem'}}>Back</button>
            <button className="signal-btn signal-btn-primary" onClick={() => setStep('task')} disabled={!draft.title || !draft.situation} style={{fontSize: '0.8rem', opacity: draft.title && draft.situation ? 1 : 0.5}}>Next</button>
          </div>
        </div>
      )}

      {/* TASK */}
      {step === 'task' && (
        <div>
          <p style={questionStyle}>What was YOUR specific responsibility or goal?</p>
          <p style={hintStyle}>The Task is about YOUR role — not the team's. What were you specifically responsible for or trying to achieve? Interviewers want to hear "I" not "we" here.</p>
          <textarea
            value={draft.task || ''}
            onChange={(e) => setDraft({...draft, task: e.target.value})}
            placeholder="What was your specific responsibility or goal in this situation?"
            rows={3}
            style={textareaStyle}
          />
          <div style={{display: 'flex', gap: '0.5rem', marginTop: '0.75rem'}}>
            <button className="signal-btn signal-btn-secondary" onClick={() => setStep('situation')} style={{fontSize: '0.8rem'}}>Back</button>
            <button className="signal-btn signal-btn-primary" onClick={() => setStep('action')} disabled={!draft.task} style={{fontSize: '0.8rem', opacity: draft.task ? 1 : 0.5}}>Next</button>
          </div>
        </div>
      )}

      {/* ACTION */}
      {step === 'action' && (
        <div>
          <p style={questionStyle}>What did you actually DO?</p>
          <p style={hintStyle}>This is the heart of the story — 50-60% of your answer time in an interview. Be specific: what decisions did you make? What tradeoffs did you weigh? Who did you work with and how? What was your reasoning?</p>
          <textarea
            value={draft.action || ''}
            onChange={(e) => setDraft({...draft, action: e.target.value})}
            placeholder="Describe your specific actions — decisions, tradeoffs, reasoning, who you worked with"
            rows={5}
            style={textareaStyle}
          />
          <div style={{display: 'flex', gap: '0.5rem', marginTop: '0.75rem'}}>
            <button className="signal-btn signal-btn-secondary" onClick={() => setStep('task')} style={{fontSize: '0.8rem'}}>Back</button>
            <button className="signal-btn signal-btn-primary" onClick={() => setStep('result')} disabled={!draft.action} style={{fontSize: '0.8rem', opacity: draft.action ? 1 : 0.5}}>Next</button>
          </div>
        </div>
      )}

      {/* RESULT */}
      {step === 'result' && (
        <div>
          <p style={questionStyle}>What was the measurable result?</p>
          <p style={hintStyle}>Numbers matter. Think: percentages, dollar amounts, time saved, users impacted, error rates. Even approximations ("reduced by ~30%") are far better than "it went well." If you don't have metrics, what changed that you could observe?</p>
          <textarea
            value={draft.result || ''}
            onChange={(e) => setDraft({...draft, result: e.target.value})}
            placeholder="Quantify the outcome — metrics, impact, what changed"
            rows={3}
            style={textareaStyle}
          />
          <div style={{display: 'flex', gap: '0.5rem', marginTop: '0.75rem'}}>
            <button className="signal-btn signal-btn-secondary" onClick={() => setStep('action')} style={{fontSize: '0.8rem'}}>Back</button>
            <button className="signal-btn signal-btn-primary" onClick={() => setStep('principles')} disabled={!draft.result} style={{fontSize: '0.8rem', opacity: draft.result ? 1 : 0.5}}>Next</button>
          </div>
        </div>
      )}

      {/* PRINCIPLES */}
      {step === 'principles' && (
        <div>
          <p style={questionStyle}>Which principles does this story demonstrate?</p>
          <p style={hintStyle}>Select 2-3 principles. Think about the decisions you described in the Action — which principles were driving those decisions? Most strong stories map to 2-3 principles.</p>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem'}}>
            {PRINCIPLES.map((p) => {
              const selected = (draft.principles || []).includes(p);
              return (
                <button
                  key={p}
                  onClick={() => togglePrinciple(p)}
                  style={{
                    padding: '0.4rem 0.75rem',
                    borderRadius: 'var(--signal-radius-sm)',
                    border: `2px solid ${selected ? 'var(--signal-teal)' : 'var(--signal-silver)'}`,
                    background: selected ? 'rgba(43, 207, 206, 0.08)' : 'transparent',
                    cursor: 'pointer',
                    fontFamily: 'var(--ifm-heading-font-family)',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    color: selected ? 'var(--signal-teal)' : 'var(--signal-slate)',
                  }}
                >
                  {selected ? '✓ ' : ''}{p}
                </button>
              );
            })}
          </div>
          <div style={{display: 'flex', gap: '0.5rem'}}>
            <button className="signal-btn signal-btn-secondary" onClick={() => setStep('result')} style={{fontSize: '0.8rem'}}>Back</button>
            <button className="signal-btn signal-btn-primary" onClick={() => setStep('notes')} disabled={(draft.principles || []).length === 0} style={{fontSize: '0.8rem', opacity: (draft.principles || []).length > 0 ? 1 : 0.5}}>Next</button>
          </div>
        </div>
      )}

      {/* NOTES */}
      {step === 'notes' && (
        <div>
          <p style={questionStyle}>Any notes for yourself?</p>
          <p style={hintStyle}>Optional. Things like: "Need to look up the exact conversion numbers," "Ask Sarah for the post-mortem data," "This story also works for conflict resolution if I frame the disagreement with the CTO." These are prep reminders for future you.</p>
          <textarea
            value={draft.followUpNotes || ''}
            onChange={(e) => setDraft({...draft, followUpNotes: e.target.value})}
            placeholder="Prep notes, data to look up, alternative framings... (optional)"
            rows={3}
            style={textareaStyle}
          />
          <div style={{display: 'flex', gap: '0.5rem', marginTop: '0.75rem'}}>
            <button className="signal-btn signal-btn-secondary" onClick={() => setStep('principles')} style={{fontSize: '0.8rem'}}>Back</button>
            <button className="signal-btn signal-btn-primary" onClick={() => setStep('review')} style={{fontSize: '0.8rem'}}>Review</button>
          </div>
        </div>
      )}

      {/* REVIEW */}
      {step === 'review' && (
        <div>
          <p style={questionStyle}>Review your story</p>
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--signal-radius-sm)',
              background: 'rgba(43, 207, 206, 0.04)',
              border: '1px solid var(--signal-teal)',
              marginBottom: '1rem',
            }}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem'}}>
              <strong style={{fontFamily: 'var(--ifm-heading-font-family)', fontSize: '1rem'}}>
                {draft.title}
              </strong>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  padding: '0.1rem 0.4rem',
                  borderRadius: 'var(--signal-radius-sm)',
                  background: 'var(--signal-slate)',
                  color: 'white',
                }}
              >
                {draft.category}
              </span>
            </div>
            <div style={{fontSize: '0.85rem', lineHeight: 1.6}}>
              <p><strong>Situation:</strong> {draft.situation}</p>
              <p><strong>Task:</strong> {draft.task}</p>
              <p><strong>Action:</strong> {draft.action}</p>
              <p><strong>Result:</strong> {draft.result}</p>
              <p>
                <strong>Principles:</strong>{' '}
                {(draft.principles || []).map((p) => (
                  <span
                    key={p}
                    style={{
                      display: 'inline-block',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      padding: '0.1rem 0.35rem',
                      borderRadius: 'var(--signal-radius-sm)',
                      background: 'rgba(43, 207, 206, 0.1)',
                      color: 'var(--signal-teal)',
                      marginRight: '0.3rem',
                    }}
                  >
                    {p}
                  </span>
                ))}
              </p>
              {draft.followUpNotes && <p><strong>Notes:</strong> {draft.followUpNotes}</p>}
            </div>
          </div>
          <div style={{display: 'flex', gap: '0.5rem'}}>
            <button className="signal-btn signal-btn-secondary" onClick={() => setStep('notes')} style={{fontSize: '0.8rem'}}>Back</button>
            <button className="signal-btn signal-btn-primary" onClick={saveDraft} style={{fontSize: '0.8rem'}}>
              {editingId !== null ? 'Save Changes' : 'Add to Story Bank'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
