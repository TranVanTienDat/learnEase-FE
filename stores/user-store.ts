import { create } from "zustand";

// const myMiddlewares = (f) => devtools(persist(f, { name: "bearStore" }));

export type UserType = null | {
  id: number;
  username: string;
  email: string;
  uid: string;
  name: string;
};

interface BearState {
  user: UserType;
  saveUser: (by: UserType) => void;
}

const useUserDetailStore = create<BearState>()((set) => ({
  user: null,
  saveUser: (user: UserType) => set(() => ({ user })),
}));

export default useUserDetailStore;
