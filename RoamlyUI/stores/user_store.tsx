import { create } from "zustand";

// Define types for user info
interface UserInfo {
  user_id: string;
  name: string;
  interestOne: string;
  interestTwo: string;
  interestThree: string;
  age: string;
  country: string;
  language: string;
}

// Zustand Store
export const useUserStore = create<{
  userInfo: UserInfo;
  setUserInfo: (userInfo: UserInfo) => void;
}>((set) => ({
  userInfo: {
    user_id: "",
    name: "",
    interestOne: "",
    interestTwo: "",
    interestThree: "",
    age: "",
    country: "",
    language: "",
  },
  setUserInfo: (userInfo) => set({ userInfo }),
}));
