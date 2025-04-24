import { StudentType } from "@/apiRequest/students";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// const myMiddlewares = (f) => devtools(persist(f, { name: "bearStore" }));

interface GivePointState {
  isOpen: boolean;
  toggle: () => void;
  student: null | StudentType[];
  updateStudent: (stu: StudentType[]) => void;
}

const useGivePointStore = create<GivePointState>()((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  student: null,
  updateStudent: (stu: StudentType[]) => set(() => ({ student: stu })),
}));

export default useGivePointStore;
