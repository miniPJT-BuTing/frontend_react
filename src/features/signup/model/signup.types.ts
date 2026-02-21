export type Gender = 'male' | 'female';

export type SignupProfile = {
  email: string;
  nickname: string;
  college: string;
  collegeId: number | null;
  universityName: string;
  universityDomainId: number | null;
  signUpToken: string;
  providerName: string;
  studentId: string;
  age: number | null;
  gender: Gender | null;
};

export type SignupPersonality = {
  mbti: string | null;
  keywords: string[];
  oneLiner: string;
};

export type SignupAvatar = {
  animal: string | null;
};

export type SignupState = SignupProfile &
  SignupPersonality &
  SignupAvatar & {
    setProfile: (data: Partial<SignupProfile>) => void;
    setPersonality: (data: Partial<SignupPersonality>) => void;
    setAvatar: (data: Partial<SignupAvatar>) => void;
    reset: () => void;
  };
