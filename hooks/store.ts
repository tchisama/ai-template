import {create} from 'zustand';

interface StoreState {
  history: {
    prompt:string,
    code:string
  }[];
  code: string;
}
interface History {
    prompt:string
    code:string
}

interface StoreActions {
  setHistory: (history: History[]) => void;
  setCode: (code: string) => void;
}

const useStore = create<StoreState & StoreActions>((set) => ({
  history: [],
  code: '',

  setHistory: (history) => set({ history }),
  setCode: (code) => set({ code }),
}));

export default useStore;
