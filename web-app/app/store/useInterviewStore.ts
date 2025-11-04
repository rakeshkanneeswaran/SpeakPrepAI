import { create } from "zustand";

interface InterviewStore {

    questions: string[] | []

    setInterviewData: (questions: string[]) => void;
    clearData: () => void;
}

export const useInterviewStore = create<InterviewStore>((set) => ({

    questions: [],
    setInterviewData: (questions) => set({ questions }),
    clearData: () => set({ questions: [] }),
}));
