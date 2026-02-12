import { useState, useCallback } from "react";

export interface QuizQuestion<T> {
  prompt: T;
  correctAnswer: string;
  choices: string[];
}

interface QuizState {
  currentIndex: number;
  score: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  isFinished: boolean;
}

export function useQuiz<T>(
  generateQuestions: () => QuizQuestion<T>[],
  numQuestions = 10,
) {
  const [questions, setQuestions] = useState<QuizQuestion<T>[]>(() =>
    generateQuestions().slice(0, numQuestions),
  );
  const [state, setState] = useState<QuizState>({
    currentIndex: 0,
    score: 0,
    totalQuestions: numQuestions,
    selectedAnswer: null,
    isCorrect: null,
    isFinished: false,
  });

  const currentQuestion = questions[state.currentIndex] ?? null;

  const submitAnswer = useCallback(
    (answer: string) => {
      if (state.selectedAnswer !== null || state.isFinished) return;

      const correct = answer === currentQuestion?.correctAnswer;
      setState((prev) => ({
        ...prev,
        selectedAnswer: answer,
        isCorrect: correct,
        score: correct ? prev.score + 1 : prev.score,
      }));

      setTimeout(() => {
        setState((prev) => {
          const nextIndex = prev.currentIndex + 1;
          if (nextIndex >= prev.totalQuestions) {
            return { ...prev, isFinished: true, selectedAnswer: null, isCorrect: null };
          }
          return {
            ...prev,
            currentIndex: nextIndex,
            selectedAnswer: null,
            isCorrect: null,
          };
        });
      }, 1200);
    },
    [state.selectedAnswer, state.isFinished, currentQuestion],
  );

  const restart = useCallback(() => {
    const newQuestions = generateQuestions().slice(0, numQuestions);
    setQuestions(newQuestions);
    setState({
      currentIndex: 0,
      score: 0,
      totalQuestions: numQuestions,
      selectedAnswer: null,
      isCorrect: null,
      isFinished: false,
    });
  }, [generateQuestions, numQuestions]);

  return {
    currentQuestion,
    questionNumber: state.currentIndex + 1,
    score: state.score,
    totalQuestions: state.totalQuestions,
    selectedAnswer: state.selectedAnswer,
    isCorrect: state.isCorrect,
    isFinished: state.isFinished,
    submitAnswer,
    restart,
  };
}
