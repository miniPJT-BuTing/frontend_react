import { create } from 'zustand';
import type { SignupState, SignupProfile, SignupPersonality, SignupAvatar } from './signup.types';

const initialProfile: SignupProfile = {
  email: '',
  nickname: '',
  college: '',
  studentId: '',
  age: null,
  gender: null,
};

const initialPersonality: SignupPersonality = {
  mbti: null,
  keywords: [],
  oneLiner: '',
};

const initialAvatar: SignupAvatar = {
  animal: null,
};

const initialState = {
  ...initialProfile,
  ...initialPersonality,
  ...initialAvatar,
} as const;

export const useSignupStore = create<SignupState>((set) => ({
  ...initialState,

  setProfile: (data) => set((s) => ({ ...s, ...data })),
  setPersonality: (data) => set((s) => ({ ...s, ...data })),
  setAvatar: (data) => set((s) => ({ ...s, ...data })),
  reset: () => set(initialState),
}));
