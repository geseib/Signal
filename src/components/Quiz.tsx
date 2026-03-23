import React, {useState} from 'react';
import {useProgressStore} from '../stores/progressStore';

interface QuizProps {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  incorrectExplanation?: string;
  sectionId?: string;
  quizId?: string;
}

export default function Quiz({
  question,
  options,
  correctIndex,
  explanation,
  incorrectExplanation,
  sectionId,
  quizId,
}: QuizProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [attempt, setAttempt] = useState(1);
  const [xpAwarded, setXpAwarded] = useState(0);

  const recordQuizAnswer = useProgressStore((s) => s.recordQuizAnswer);
  const evaluateSectionCompletion = useProgressStore((s) => s.evaluateSectionCompletion);

  const isCorrect = selected === correctIndex;

  const handleSelect = (index: number) => {
    if (submitted) return;
    setSelected(index);
  };

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);

    const correct = selected === correctIndex;

    if (sectionId && quizId) {
      recordQuizAnswer(sectionId, quizId, correct, attempt);
      if (correct) {
        const xp = attempt === 1 ? 10 : attempt === 2 ? 5 : 2;
        setXpAwarded(xp);
        evaluateSectionCompletion(sectionId);
      }
    }
  };

  const handleReset = () => {
    setSelected(null);
    setSubmitted(false);
    setAttempt((a) => a + 1);
    setXpAwarded(0);
  };

  return (
    <div className="quiz-container">
      <p className="quiz-question">{question}</p>
      <div>
        {options.map((option, i) => {
          let className = 'quiz-option';
          if (submitted) {
            if (i === correctIndex) className += ' correct';
            else if (i === selected) className += ' incorrect';
          } else if (i === selected) {
            className += ' selected';
          }
          return (
            <button
              key={i}
              className={className}
              onClick={() => handleSelect(i)}
              disabled={submitted}
            >
              {option}
            </button>
          );
        })}
      </div>
      {!submitted ? (
        <button
          className="signal-btn signal-btn-primary"
          onClick={handleSubmit}
          disabled={selected === null}
          style={{marginTop: '0.75rem'}}
        >
          Check Answer
        </button>
      ) : (
        <>
          <div className={`quiz-explanation ${isCorrect ? 'correct' : 'incorrect'}`}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <span>
                {isCorrect
                  ? explanation || 'Correct!'
                  : incorrectExplanation || explanation || 'Not quite — try reviewing the section above.'}
              </span>
              {isCorrect && xpAwarded > 0 && (
                <span
                  style={{
                    fontFamily: 'var(--ifm-heading-font-family)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    color: 'var(--signal-teal)',
                    marginLeft: '1rem',
                    whiteSpace: 'nowrap',
                  }}
                >
                  +{xpAwarded} XP
                </span>
              )}
            </div>
          </div>
          {!isCorrect && (
            <button
              className="signal-btn signal-btn-secondary"
              onClick={handleReset}
              style={{marginTop: '0.75rem'}}
            >
              Try Again
            </button>
          )}
        </>
      )}
    </div>
  );
}
