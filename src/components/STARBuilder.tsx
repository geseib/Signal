import React, {useState, useEffect} from 'react';

interface STARStory {
  situation: string;
  task: string;
  action: string;
  result: string;
  principle?: string;
}

const STORAGE_KEY = 'signal-star-stories';

function loadStories(): STARStory[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStories(stories: STARStory[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
}

const placeholders: Record<string, string> = {
  situation:
    'Set the scene in 2-3 sentences. Include your role, the company/team context, timeline, and why it mattered. Example: "I was a senior engineer on the payments team at a fintech startup. We were 3 weeks from launching our first enterprise client, and our pipeline was failing 12% of transactions."',
  task:
    'What was YOUR specific responsibility? Use "I" language. Example: "I was responsible for diagnosing the root cause and designing a fix before the launch deadline."',
  action:
    'What did you DO? Walk through your key steps, decisions, and reasoning. This should be the longest section. Example: "I started by adding structured logging to isolate the failure pattern..."',
  result:
    'What happened? Include numbers, business impact, and learnings. Example: "Transaction failures dropped from 12% to 0.03%, and we launched on schedule. The enterprise client processed $2.4M in the first month."',
};

const tips: Record<string, string> = {
  situation: 'Keep it to 2-3 sentences. Focus on stakes and context.',
  task: 'Use "I" not "we." What were YOU accountable for?',
  action: 'Include the "why behind the what." Explain your reasoning.',
  result: 'Quantify the outcome. Apply the "so what?" test.',
};

export default function STARBuilder() {
  const [stories, setStories] = useState<STARStory[]>([]);
  const [current, setCurrent] = useState<STARStory>({
    situation: '',
    task: '',
    action: '',
    result: '',
    principle: '',
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [activeField, setActiveField] = useState<string | null>(null);

  useEffect(() => {
    setStories(loadStories());
  }, []);

  const handleChange = (field: keyof STARStory, value: string) => {
    setCurrent((prev) => ({...prev, [field]: value}));
  };

  const handleSave = () => {
    if (!current.situation && !current.task && !current.action && !current.result) return;
    const updated =
      editingIndex !== null
        ? stories.map((s, i) => (i === editingIndex ? current : s))
        : [...stories, current];
    setStories(updated);
    saveStories(updated);
    setCurrent({situation: '', task: '', action: '', result: '', principle: ''});
    setEditingIndex(null);
  };

  const handleEdit = (index: number) => {
    setCurrent(stories[index]);
    setEditingIndex(index);
  };

  const handleDelete = (index: number) => {
    const updated = stories.filter((_, i) => i !== index);
    setStories(updated);
    saveStories(updated);
    if (editingIndex === index) {
      setCurrent({situation: '', task: '', action: '', result: '', principle: ''});
      setEditingIndex(null);
    }
  };

  const fields: {key: keyof STARStory; label: string; color: string}[] = [
    {key: 'situation', label: 'Situation', color: 'var(--signal-teal)'},
    {key: 'task', label: 'Task', color: 'var(--signal-ember)'},
    {key: 'action', label: 'Action', color: 'var(--signal-teal-dark)'},
    {key: 'result', label: 'Result', color: 'var(--signal-slate)'},
  ];

  const completedFields = fields.filter((f) => current[f.key]?.trim()).length;
  const progress = (completedFields / 4) * 100;

  return (
    <div style={{margin: '1.5rem 0'}}>
      {/* Progress bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1rem',
        }}
      >
        <div
          style={{
            flex: 1,
            height: '8px',
            background: 'var(--signal-silver)',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background:
                progress === 100
                  ? 'linear-gradient(90deg, var(--signal-teal), var(--signal-ember))'
                  : 'var(--signal-teal)',
              borderRadius: '4px',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
        <span style={{fontSize: '0.85rem', color: 'var(--signal-slate)', fontWeight: 600}}>
          {completedFields}/4
        </span>
      </div>

      {/* Form fields */}
      {fields.map(({key, label, color}) => (
        <div key={key} style={{marginBottom: '1rem'}}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.35rem',
            }}
          >
            <label
              style={{
                fontFamily: 'var(--ifm-heading-font-family)',
                fontWeight: 700,
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color,
              }}
            >
              {label}
            </label>
            {activeField === key && tips[key] && (
              <span
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--signal-slate)',
                  fontStyle: 'italic',
                }}
              >
                {tips[key]}
              </span>
            )}
          </div>
          <textarea
            value={current[key] || ''}
            onChange={(e) => handleChange(key, e.target.value)}
            onFocus={() => setActiveField(key)}
            onBlur={() => setActiveField(null)}
            placeholder={placeholders[key]}
            rows={key === 'action' ? 5 : 3}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `2px solid ${current[key]?.trim() ? color : 'var(--signal-silver)'}`,
              borderRadius: 'var(--signal-radius-sm)',
              fontFamily: 'var(--ifm-font-family-base)',
              fontSize: '0.9rem',
              lineHeight: '1.5',
              resize: 'vertical',
              background: 'var(--ifm-background-color)',
              color: 'var(--ifm-font-color-base)',
              transition: 'border-color 0.15s ease',
            }}
          />
        </div>
      ))}

      {/* Optional principle tag */}
      <div style={{marginBottom: '1rem'}}>
        <label
          style={{
            fontFamily: 'var(--ifm-heading-font-family)',
            fontWeight: 600,
            fontSize: '0.8rem',
            color: 'var(--signal-slate)',
            marginBottom: '0.35rem',
            display: 'block',
          }}
        >
          Leadership Principle (optional)
        </label>
        <input
          type="text"
          value={current.principle || ''}
          onChange={(e) => handleChange('principle', e.target.value)}
          placeholder="e.g., Ownership, Bias for Action, Dive Deep"
          style={{
            width: '100%',
            padding: '0.6rem 0.75rem',
            border: '2px solid var(--signal-silver)',
            borderRadius: 'var(--signal-radius-sm)',
            fontFamily: 'var(--ifm-font-family-base)',
            fontSize: '0.9rem',
            background: 'var(--ifm-background-color)',
            color: 'var(--ifm-font-color-base)',
          }}
        />
      </div>

      {/* Save button */}
      <button className="signal-btn signal-btn-primary" onClick={handleSave}>
        {editingIndex !== null ? 'Update Story' : 'Save Story'}
      </button>

      {/* Saved stories */}
      {stories.length > 0 && (
        <div style={{marginTop: '2rem'}}>
          <h4>Saved Stories ({stories.length})</h4>
          {stories.map((story, i) => (
            <div
              key={i}
              className="signal-card"
              style={{marginBottom: '1rem', padding: '1rem'}}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div style={{flex: 1}}>
                  {story.principle && (
                    <span className="workshop-badge" style={{marginBottom: '0.5rem'}}>
                      {story.principle}
                    </span>
                  )}
                  <p style={{margin: '0.5rem 0 0', fontSize: '0.9rem'}}>
                    <strong>S:</strong> {story.situation.slice(0, 120)}
                    {story.situation.length > 120 ? '...' : ''}
                  </p>
                </div>
                <div style={{display: 'flex', gap: '0.5rem', marginLeft: '1rem'}}>
                  <button
                    className="signal-btn signal-btn-secondary"
                    style={{padding: '0.3rem 0.75rem', fontSize: '0.8rem'}}
                    onClick={() => handleEdit(i)}
                  >
                    Edit
                  </button>
                  <button
                    className="signal-btn"
                    style={{
                      padding: '0.3rem 0.75rem',
                      fontSize: '0.8rem',
                      color: 'var(--signal-ember)',
                      border: '2px solid var(--signal-ember)',
                      background: 'transparent',
                    }}
                    onClick={() => handleDelete(i)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
