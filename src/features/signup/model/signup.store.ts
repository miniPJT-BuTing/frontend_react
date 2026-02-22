import { create } from 'zustand';
import type { SignupState, SignupProfile, SignupPersonality, SignupAvatar } from './signup.types';
import type { PersonalityKeywordKey } from '@/shared/lib/personalityKeyword';

const initialProfile: SignupProfile = {
  email: '',
  nickname: '',
  college: '',
  collegeId: null,
  universityName: '',
  universityDomainId: null,
  signUpToken: '',
  providerName: '',
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

  toggleKeywordKey: (key: PersonalityKeywordKey) =>
    set((s) => {
      const exists = s.keywords.includes(key);

      if (exists) {
        return { ...s, keywords: s.keywords.filter((k) => k !== key) };
      }

      if (s.keywords.length >= 5) return s;

      return { ...s, keywords: [...s.keywords, key] };
    }),

  reset: () => set(initialState),
}));
