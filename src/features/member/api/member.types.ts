export interface MyProfileResponse {
  memberId: number;
  nickname: string;
  universityName?: string;
  collegeId?: number;
  collegeName?: string;
  age?: number;
  mbtiCode?: string;
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
