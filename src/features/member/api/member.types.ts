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
