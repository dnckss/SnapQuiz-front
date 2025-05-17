import { create } from 'zustand';

export type Question = {
  question: string;
  type: string;
  choices?: string[];
  correct_answer?: string;
};

type QuizState = {
  questions: Question[];
  loading: boolean;
  error: string | null;
  setQuestions: (questions: Question[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};

export const useQuizStore = create<QuizState>((set) => ({
  questions: [],
  loading: false,
  error: null,
  setQuestions: (questions) => set({ questions }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));