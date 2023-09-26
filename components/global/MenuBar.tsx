// MenuBar.tsx
import React from 'react';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from '@/components/ui/menubar';
import { ArrowLeft, Copy, Edit2, Eraser, Plus, Redo, Save, Trash, Undo } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Input } from '../ui/input';
import GitCodeButton from './GitCodeButton';
import { Button } from '../ui/button';
import { Sketch } from '@/hooks/sketchs';

interface MenuBarProps {
  createNewSketch: () => Promise<void>;
  updateSketch: () => void;
  deleteSketch: () => void;
  historyPointer: number;
  cleanWorkSpace: () => void;
  copyToClipboard:(text:string)=>void;
  history:{
    prompt:string,
    code:string
  }[]
  code:string;
  undo: () => void;
  redo: () => void;
  sketch:Sketch | null,
  setSketch:(a:Sketch|null)=>void;
  addHistory:()=>void;
}

const MenuBar: React.FC<MenuBarProps> = ({
  createNewSketch,
  updateSketch,
  deleteSketch,
  historyPointer,
  cleanWorkSpace,
  copyToClipboard,
  code,
  undo,
  redo,
  history,
  sketch,
  setSketch,
  addHistory,
}) => {
  const router = useRouter()
    
    return(
      <div className='container items-center border top-2 shadow left-[50%] translate-x-[-50%] fixed p-2 bg-white rounded-xl flex justify-between'>
        <div className='flex items-center gap-4 px-1'>
        <UserButton/>
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={()=>router.push("/")} className="flex gap-2"><ArrowLeft size={16}/>Go back</MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={createNewSketch} className="flex gap-2">
                <Plus size={16}/>
                New WorkSpace 
              </MenubarItem>
              <MenubarItem className="flex gap-2" onClick={updateSketch}><Save size={16}/>Save</MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={deleteSketch} className="flex gap-2"><Trash size={16}/>Delete Sketch</MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger>Edit</MenubarTrigger>
            <MenubarContent>
              <MenubarItem disabled={historyPointer < 1} onClick={undo} className="flex gap-2"><Undo size={16}/>Undo</MenubarItem>
              <MenubarItem disabled={historyPointer > history.length - 2} onClick={redo} className="flex gap-2"><Redo size={16}/>Redo</MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={cleanWorkSpace} className="flex gap-2"><Eraser size={16}/>Clean workspace</MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger>Control</MenubarTrigger>
            <MenubarContent>
              <MenubarItem disabled={!code} onClick={()=>copyToClipboard(code)} className="flex gap-2"><Copy size={16}/>Copy code</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>


        </div>
        <div className='flex items-center'>
        <Input
            onChange={updateSketch}
            onInput={(e) =>
              setSketch(
               sketch
                  ? { ...sketch, name: (e.target as HTMLInputElement).value }
                  : null
              )
            }
            value={sketch?.name || ''}
            placeholder="title of the sketch"
            className="bg-gray-50 pr-9"
          />
          <Edit2 size={16} className='-translate-x-7'/>
        </div>
        <div className='flex gap-2'>
          <GitCodeButton addHistory={addHistory} updateSketch={updateSketch}/>
          <Button disabled={!code} onClick={()=>copyToClipboard(code)} className='flex gap-2' variant={"outline"}>Copy<Copy size={18}></Copy></Button>
        </div>
      </div>
)}

export default MenuBar;
