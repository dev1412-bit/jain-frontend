import { create } from "zustand";

type UIStore = {
  signInOpen: boolean;
  signUpOpen: boolean;
  openSignIn: () => void;
  closeSignIn: () => void;
  openSignUp: () => void;
  closeSignUp: () => void;
  // switch between modals
  switchToSignUp: () => void;
  switchToSignIn: () => void;
  forgotPasswordOpen: boolean;
  openForgotPassword: () => void;
  closeForgotPassword: () => void;
};

export const useUIStore = create<UIStore>((set) => ({
  signInOpen: false,
  signUpOpen: false,
  openSignIn: () => set({ signInOpen: true, signUpOpen: false }),
  closeSignIn: () => set({ signInOpen: false }),
  openSignUp: () => set({ signUpOpen: true, signInOpen: false }),
  closeSignUp: () => set({ signUpOpen: false }),
  switchToSignUp: () => set({ signUpOpen: true, signInOpen: false }),
  switchToSignIn: () => set({ signInOpen: true, signUpOpen: false }),
  forgotPasswordOpen: false,
openForgotPassword: () => set({ signInOpen: false, forgotPasswordOpen: true }),
closeForgotPassword: () => set({ forgotPasswordOpen: false }),
}));