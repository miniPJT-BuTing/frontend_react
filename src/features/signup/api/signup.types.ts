import type { PersonalityKeywordKey } from '@/shared/lib/personalityKeyword';

export type SignupGender = 'M' | 'W';

export interface CompleteSignupRequest {
  signUpToken: string;
  nickname: string;
  universityEmail: string;
  universityDomainId: number;
  age: number;
  gender: SignupGender;
  mbti: string;
  entryYear: number;
  personalityTypes: PersonalityKeywordKey[];
  bio?: string;
  collegeId: number;
  faceShapeId?: number;
}

export type AvailabilityType = 'EMAIL' | 'NICKNAME';

export interface MemberAvailabilityItem {
  type: AvailabilityType;
  value: string;
  isAvailable: boolean;
}

export interface MemberAvailabilityParams {
  email?: string;
  nickname?: string;
}

export interface CollegeItem {
  id: number;
  name: string;
}
