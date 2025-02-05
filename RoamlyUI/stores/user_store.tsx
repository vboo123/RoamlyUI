import { create } from "zustand";

// Zustand Store
export const useUserStore = create((set) => ({
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
}));
