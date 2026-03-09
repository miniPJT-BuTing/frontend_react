export interface MyProfileResponse {
  memberId: number;
  nickname: string;
  universityName?: string;
  collegeId?: number;
  collegeName?: string;
  age?: number;
  gender?: string;
  entryYear?: number;
  mbtiCode?: string;
  mbtiDescription?: string;
  personalityTypes: string[];
  bio?: string;
  faceShape?: string;
}

export interface UpdateMyProfileRequest {
  nickname: string;
  mbti: string;
  personalityTypes: string[];
  bio?: string;
}

export interface PersonalityKeywordItem {
  code: string;
  description: string;
}
