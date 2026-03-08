import { create } from 'zustand';

type CurrentUserState = {
  memberId: number | null;
  setMemberId: (memberId: number | null) => void;
  clear: () => void;
};

export const useCurrentUserStore = create<CurrentUserState>((set) => ({
  memberId: null,
  setMemberId: (memberId) => set({ memberId }),
  clear: () => set({ memberId: null }),
}));

