import { create } from 'zustand';

export interface InvitedMember {
  memberId: number;
  nickname: string;
}

interface CreateTeamState {
  // Step 1: Basic Info
  title: string;
  introduction: string;

  // Step 2: Preferences
  atmosphere: string[]; // e.g., '조용한', '활발한'
  minStudentId: number | null;
  maxStudentId: number | null;
  minAge: number | null;
  maxAge: number | null;

  // Step 3: Members
  memberCount: number; // 2, 3, 4, 5, 6
  invitedMembers: InvitedMember[];

  // Actions
  setBasicInfo: (data: Partial<Pick<CreateTeamState, 'title' | 'introduction'>>) => void;
  setPreferences: (
    data: Partial<
      Pick<CreateTeamState, 'atmosphere' | 'minStudentId' | 'maxStudentId' | 'minAge' | 'maxAge'>
    >
  ) => void;
  setMembers: (data: Partial<Pick<CreateTeamState, 'memberCount' | 'invitedMembers'>>) => void;
  setAllData: (data: Partial<CreateTeamState>) => void;
  reset: () => void;
}

export const useCreateTeamStore = create<CreateTeamState>((set) => ({
  title: '',
  introduction: '',
  atmosphere: [],
  minStudentId: null,
  maxStudentId: null,
  minAge: null,
  maxAge: null,
  memberCount: 2,
  invitedMembers: [],

  setBasicInfo: (data) => set((state) => ({ ...state, ...data })),
  setPreferences: (data) => set((state) => ({ ...state, ...data })),
  setMembers: (data) => set((state) => ({ ...state, ...data })),
  setAllData: (data) => set((state) => ({ ...state, ...data })),
  reset: () =>
    set({
      title: '',
      introduction: '',
      atmosphere: [],
      minStudentId: null,
      maxStudentId: null,
      minAge: null,
      maxAge: null,
      memberCount: 2,
      invitedMembers: [],
    }),
}));
