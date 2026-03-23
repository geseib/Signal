import React, {useState} from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';

function ProgressContent() {
  // Lazy import to avoid SSR issues with Zustand/localStorage
  const ModuleProgress = require('../components/ModuleProgress').default;
  const {useProgressStore} = require('../stores/progressStore');

  const [showReset, setShowReset] = useState(false);
  const resetProgress = useProgressStore((s: any) => s.resetProgress);

  const handleReset = () => {
    resetProgress();
    setShowReset(false);
  };

  return (
    <div style={{maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem'}}>
      <h1 style={{fontFamily: 'var(--ifm-heading-font-family)'}}>My Progress</h1>
      <p style={{color: 'var(--signal-slate)', marginBottom: '2rem'}}>
        Track your XP, badges, and completion across all Signal workshops.
      </p>

      <ModuleProgress view="full" />

      {/* Reset section */}
      <div
        style={{
          marginTop: '3rem',
          padding: '1.5rem',
          borderRadius: 'var(--signal-radius-md)',
          border: '1px solid var(--signal-silver)',
        }}
      >
        <h4 style={{margin: '0 0 0.5rem', fontFamily: 'var(--ifm-heading-font-family)'}}>
          Reset Progress
        </h4>
        <p style={{fontSize: '0.9rem', color: 'var(--signal-slate)', margin: '0 0 1rem'}}>
          This will permanently erase all your XP, badges, and completion data.
        </p>
        {!showReset ? (
          <button
            className="signal-btn"
            style={{
              color: 'var(--signal-ember)',
              border: '2px solid var(--signal-ember)',
              background: 'transparent',
            }}
            onClick={() => setShowReset(true)}
          >
            Reset All Progress
          </button>
        ) : (
          <div style={{display: 'flex', gap: '0.75rem', alignItems: 'center'}}>
            <span style={{fontSize: '0.9rem', color: 'var(--signal-ember)', fontWeight: 600}}>
              Are you sure?
            </span>
            <button
              className="signal-btn"
              style={{background: 'var(--signal-ember)', color: 'white', border: 'none'}}
              onClick={handleReset}
            >
              Yes, Reset
            </button>
            <button
              className="signal-btn signal-btn-secondary"
              onClick={() => setShowReset(false)}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProgressPage(): React.ReactElement {
  return (
    <Layout
      title="My Progress — Signal"
      description="Track your progress across Signal interview workshops."
    >
      <BrowserOnly fallback={<div style={{padding: '2rem', textAlign: 'center'}}>Loading...</div>}>
        {() => <ProgressContent />}
      </BrowserOnly>
    </Layout>
  );
}
