import {create} from 'zustand';

interface UserState {
  _id: string;
  name: string;
  email: string;
  photoProfile: string;
  user_id: string;
  user_point: number;
  used_point: number;
  created_at: string;
  updated_at: string;
  __v: number;
}

interface UserStore {
  userData: UserState | null;
  setUser: (user: UserState | null) => void;
}

const useUserStore = create<UserStore>((set) => ({
  userData: null,
  setUser: (user) => set({ userData:user }),
}));

export default useUserStore;
