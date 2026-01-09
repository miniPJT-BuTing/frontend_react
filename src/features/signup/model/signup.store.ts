import { create } from 'zustand';

interface SignupState {
  // Step 1: Auth (Handled mostly by provider, but we might track status)
  
  // Step 2: Profile
  email: string;
  nickname: string;
  college: string;
  studentId: string; // Added studentId
  age: number | null;
  gender: 'male' | 'female' | null;
  
  // Step 3: Personality
  mbti: string | null;
  keywords: string[];
  oneLiner: string;

  // Step 4: Avatar
  animal: string | null;
  
  // Actions
  setProfile: (data: Partial<Pick<SignupState, 'email' | 'nickname' | 'college' | 'age' | 'gender' | 'studentId'>>) => void;
  setPersonality: (data: Partial<Pick<SignupState, 'mbti' | 'keywords' | 'oneLiner'>>) => void;
  setAvatar: (data: Partial<Pick<SignupState, 'animal'>>) => void;
  reset: () => void;
}

export const useSignupStore = create<SignupState>((set) => ({
  email: '',
  nickname: '',
  college: '',
  studentId: '', // Init
  age: null,
  gender: null,
  mbti: null,
  keywords: [],
  oneLiner: '',
  animal: null,

  setProfile: (data) => set((state) => ({ ...state, ...data })),
  setPersonality: (data) => set((state) => ({ ...state, ...data })),
  setAvatar: (data) => set((state) => ({ ...state, ...data })),
  reset: () => set({
    email: '',
    nickname: '',
    college: '',
    studentId: '', // Reset
    age: null,
    gender: null,
    mbti: null,
    keywords: [],
    oneLiner: '',
    animal: null,
  }),
}));
