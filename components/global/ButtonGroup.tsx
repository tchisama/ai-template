// ButtonGroup.tsx
import React from 'react';
import { Undo, Redo, Stars } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '../ui/input';

interface ButtonGroupProps {
  historyPointer: number;
  loading:boolean,
  message:string,
  setMessage:(a:string)=>void;
  history:{
    prompt: string;
    code: string;
    }[]
  undo: () => void;
  redo: () => void;
  Genirate: (e: any) => Promise<void>;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  historyPointer,
  loading,
  message,
  history,
  setMessage,
  Genirate,
  undo,
  redo,
}) => (
    <div className=' p-2 shadow-md border fixed bottom-4 z-50 left-[50%] translate-x-[-50%] max-w-4xl flex gap-2 w-full mx-auto bg-white rounded-lg'>
    <Button disabled={historyPointer<1} onClick={undo}  variant={"outline"}><Undo size={18}/></Button>
    <Button disabled={historyPointer > history.length - 2}  onClick={redo} variant={"outline"}><Redo size={18}/></Button>
    <form onSubmit={Genirate} className='flex-1 flex gap-2'>
        <Input value={message} onInput={(e)=>setMessage((e.target as any).value)}/>
        <Button type='submit' className='flex gap-2 shadow-xl'>{loading?"Loading":<>Generate<Stars size={20}/></>}</Button>
    </form>
    </div>
);

export default ButtonGroup;
