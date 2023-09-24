import create from 'zustand';

export interface Sketch {
   _id:string;
  data: string;
  name:string;
  image:string;
  description:string;
  owner:string;
  created_at:string;
  updated_at:string;
  __v:number;

}

interface StoreState {
  sketchs:Sketch[] 
  setSketchs: (sketchs: Sketch[]) => void;
}

const useSketchs = create<StoreState>((set) => ({
  sketchs: [],
  setSketchs: (sketchs:Sketch[]) => set({ sketchs:sketchs }),
}));

export default useSketchs;