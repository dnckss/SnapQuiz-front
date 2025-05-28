import { create } from 'zustand';

export type Question = {
  question: string;
  type: string;
  choices?: string[];
  correct_answer?: string;
  status?: 'correct' | 'incorrect';
  feedback?: string;
};

type Subject = {
  name: string;
  pdfUrl: string;
};

type QuizState = {
  questions: Question[];
  subjects: Subject[];
  loading: boolean;
  error: string | null;
  setQuestions: (questions: Question[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateQuestionStatus: (index: number, status: 'correct' | 'incorrect', feedback?: string) => void;
  addSubject: (subject: Subject) => void;
};

export const useQuizStore = create<QuizState>((set) => ({
  questions: [],
  subjects: [
    { name: 'Math', pdfUrl: '' },
    { name: 'English', pdfUrl: '' },
    { name: 'History', pdfUrl: '' }
  ],
  loading: false,
  error: null,
  setQuestions: (questions) => set({ questions }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  updateQuestionStatus: (index, status, feedback) => 
    set((state) => ({
      questions: state.questions.map((q, i) => 
        i === index ? { ...q, status, feedback } : q
      )
    })),
  addSubject: (subject) =>
    set((state) => ({
      subjects: [...state.subjects, subject]
    }))
}));