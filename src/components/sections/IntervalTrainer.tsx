import { useCallback } from "react";
import { NOTE_NAMES, type NoteName } from "../../data/notes.ts";
import { INTERVALS } from "../../data/intervals.ts";
import { transpose } from "../../utils/musicTheory.ts";
import { playInterval } from "../../audio/audioEngine.ts";
import { useAudioEngine } from "../../hooks/useAudioEngine.ts";
import { useQuiz, type QuizQuestion } from "../../hooks/useQuiz.ts";

interface IntervalTrainerProps {
  octave: number;
  bpm: number;
  transposition: number;
}

interface IntervalPrompt {
  rootNote: NoteName;
  intervalSemitones: number;
  rootPitch: string;
  targetPitch: string;
}

// Intervals to quiz on (skip unison)
const QUIZ_INTERVALS = INTERVALS.filter((i) => i.semitones >= 1 && i.semitones <= 12);

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function generateQuestions(octave: number, transposition: number): () => QuizQuestion<IntervalPrompt>[] {
  return () => {
    const questions: QuizQuestion<IntervalPrompt>[] = [];
    for (let q = 0; q < 10; q++) {
      const rootIdx = Math.floor(Math.random() * 12);
      const baseRoot = NOTE_NAMES[rootIdx];
      const rootNote = transpose(baseRoot, transposition);
      const interval = QUIZ_INTERVALS[Math.floor(Math.random() * QUIZ_INTERVALS.length)];

      const rootPitch = `${rootNote}${octave}`;
      const targetNote = transpose(rootNote, interval.semitones);
      const targetOctave = rootIdx + interval.semitones >= 12 ? octave + 1 : octave;
      const targetPitch = `${targetNote}${targetOctave}`;

      // Generate 4 choices including the correct one
      const correctAnswer = interval.name;
      const otherIntervals = shuffleArray(
        QUIZ_INTERVALS.filter((i) => i.name !== correctAnswer),
      ).slice(0, 3);
      const choices = shuffleArray([
        correctAnswer,
        ...otherIntervals.map((i) => i.name),
      ]);

      questions.push({
        prompt: {
          rootNote,
          intervalSemitones: interval.semitones,
          rootPitch,
          targetPitch,
        },
        correctAnswer,
        choices,
      });
    }
    return questions;
  };
}

export default function IntervalTrainer({ octave, bpm, transposition }: IntervalTrainerProps) {
  const genQuestions = useCallback(
    () => generateQuestions(octave, transposition)(),
    [octave, transposition],
  );

  const {
    currentQuestion,
    questionNumber,
    score,
    totalQuestions,
    selectedAnswer,
    isCorrect,
    isFinished,
    submitAnswer,
    restart,
  } = useQuiz(genQuestions);

  const { play } = useAudioEngine();

  const handlePlayInterval = () => {
    if (!currentQuestion) return;
    const { rootPitch, targetPitch } = currentQuestion.prompt;
    play(
      () => playInterval(rootPitch, targetPitch, bpm),
      (2 * 60 / bpm) * 1000,
    );
  };

  if (isFinished) {
    return (
      <section id="ear-training" className="scroll-mt-16">
        <h2 className="text-2xl font-bold mb-4">Ear Training: Intervals</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center max-w-md mx-auto">
          <p className="text-4xl font-bold mb-2">
            {score} / {totalQuestions}
          </p>
          <p className="text-gray-500 mb-6">
            {score === totalQuestions
              ? "Perfect score!"
              : score >= 7
                ? "Great job!"
                : score >= 5
                  ? "Keep practicing!"
                  : "Don't give up!"}
          </p>
          <button
            onClick={restart}
            className="px-6 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white font-medium"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="ear-training" className="scroll-mt-16">
      <h2 className="text-2xl font-bold mb-4">Ear Training: Intervals</h2>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500">
            Question {questionNumber} / {totalQuestions}
          </span>
          <span className="text-sm text-gray-500">
            Score: {score}
          </span>
        </div>

        <div className="text-center mb-6">
          <button
            onClick={handlePlayInterval}
            className="px-6 py-3 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-medium text-lg"
          >
            Play Interval
          </button>
          {currentQuestion && (
            <p className="text-xs text-gray-400 mt-2">
              Starting from {currentQuestion.prompt.rootNote}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {currentQuestion?.choices.map((choice) => {
            let btnClass = "px-4 py-3 rounded-lg text-sm font-medium transition-colors ";
            if (selectedAnswer !== null) {
              if (choice === currentQuestion.correctAnswer) {
                btnClass += "bg-green-500 text-white";
              } else if (choice === selectedAnswer && !isCorrect) {
                btnClass += "bg-red-500 text-white";
              } else {
                btnClass += "bg-gray-100 text-gray-400";
              }
            } else {
              btnClass += "bg-gray-100 hover:bg-gray-200 text-gray-900 cursor-pointer";
            }

            return (
              <button
                key={choice}
                onClick={() => submitAnswer(choice)}
                disabled={selectedAnswer !== null}
                className={btnClass}
              >
                {choice}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
