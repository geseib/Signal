import React, {useState} from 'react';

interface QuizProps {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  incorrectExplanation?: string;
}

export default function Quiz({
  question,
  options,
  correctIndex,
  explanation,
  incorrectExplanation,
}: QuizProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = selected === correctIndex;

  const handleSelect = (index: number) => {
    if (submitted) return;
    setSelected(index);
  };

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setSelected(null);
    setSubmitted(false);
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
            {isCorrect
              ? explanation || 'Correct!'
              : incorrectExplanation || explanation || 'Not quite — try reviewing the section above.'}
          </div>
          <button
            className="signal-btn signal-btn-secondary"
            onClick={handleReset}
            style={{marginTop: '0.75rem'}}
          >
            Try Again
          </button>
        </>
      )}
    </div>
  );
}
