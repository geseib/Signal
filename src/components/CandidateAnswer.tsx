import React, {useState, useRef} from 'react';

interface CandidateAnswerProps {
  candidateName: string;
  transcript: string;
  audioFile?: string;
}

export default function CandidateAnswer({candidateName, transcript, audioFile}: CandidateAnswerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(!audioFile);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const hasAudio = Boolean(audioFile);

  const handlePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleBack10 = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
    }
  };

  return (
    <div
      style={{
        margin: '1rem 0',
        padding: '1rem',
        borderRadius: 'var(--signal-radius-sm)',
        background: 'rgba(147, 149, 153, 0.04)',
        border: '1px solid var(--signal-silver)',
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem'}}>
        <strong style={{fontFamily: 'var(--ifm-heading-font-family)', fontSize: '0.9rem'}}>
          {candidateName}'s Answer
        </strong>
      </div>

      {hasAudio && (
        <div style={{display: 'flex', gap: '0.5rem', marginBottom: '0.75rem'}}>
          <audio
            ref={audioRef}
            src={`/audio/${audioFile}`}
            onEnded={() => setIsPlaying(false)}
            preload="metadata"
          />
          <button
            className="signal-btn signal-btn-secondary"
            onClick={handlePlay}
            style={{fontSize: '0.8rem', padding: '0.4rem 0.75rem'}}
          >
            {isPlaying ? '⏸ Pause' : '▶ Play Answer'}
          </button>
          <button
            className="signal-btn signal-btn-secondary"
            onClick={handleBack10}
            style={{fontSize: '0.8rem', padding: '0.4rem 0.75rem'}}
            title="Skip back 10 seconds — just like asking a candidate to repeat something"
          >
            ↺ Back 10s
          </button>
          <button
            className="signal-btn signal-btn-secondary"
            onClick={() => setShowTranscript(!showTranscript)}
            style={{fontSize: '0.8rem', padding: '0.4rem 0.75rem'}}
          >
            {showTranscript ? 'Hide Transcript' : 'Show Transcript'}
          </button>
        </div>
      )}

      {showTranscript && (
        <div
          style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--signal-radius-sm)',
            background: 'rgba(147, 149, 153, 0.06)',
            fontSize: '0.85rem',
            lineHeight: 1.7,
            whiteSpace: 'pre-wrap',
          }}
        >
          {transcript}
        </div>
      )}
    </div>
  );
}
