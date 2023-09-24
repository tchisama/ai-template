
"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Send ,ArrowLeft,Save,Plus,Code,Diamond,RedoDot,RocketIcon, Redo ,Undo,ArrowRight,Copy,Eye, Edit, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UserButton } from '@clerk/nextjs/app-beta';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from '@/components/ui/menubar';
import { Dialog, DialogClose, DialogTrigger } from '@radix-ui/react-dialog';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import useStore from '@/hooks/store';
import GitCodeButton from '@/components/global/GitCodeButton';
import { useToast } from '@/components/ui/use-toast';
import { Toast } from '@/components/ui/toast';
import { ToastProvider } from '@radix-ui/react-toast';
import { Toaster } from '@/components/ui/toaster';

interface State {
  html: string;
}

export default function Home() {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [historyPointer, setHistoryPointer] = useState<number>(-1);
  const router = useRouter()
  const {code , setCode,history,setHistory}=useStore()
  const {toast} = useToast()

  
  function copyToClipboard() {
    if(code){

    const tempInput = document.createElement("input");
    tempInput.value = code;
  
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
  

    toast({
      title:"Copied",
      description:"code copied to clipboard"
    })

    }
  }
  


  const Genirate = async (e:any) => {
    e.preventDefault ();
    try {
      const msg = message;
      setLoading(true);
      setMessage('');
      const response = await axios.post<string>('http://localhost:3001/api/genirate', {
        message: msg,
        code,
      });
      setCode(response.data);

      // Add the current state to the history when generating new content
      const newHistory = history.slice(0, historyPointer + 1);
      newHistory.push({ code: response.data,prompt:msg });
      setHistory(newHistory);
      setHistoryPointer(newHistory.length - 1);
      console.log(response.data)
    } catch {
      console.log('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const undo = () => {
    if (historyPointer > 0) {
      setHistoryPointer(historyPointer - 1);
      setCode(history[historyPointer - 1].code);
    }
  };

  const redo = () => {
    if (historyPointer < history.length - 1) {
      setHistoryPointer(historyPointer + 1);
      setCode(history[historyPointer + 1].code);
    }
  };
  const example = ()=>{
    setMessage("make me an e-commerce item card")
  }
  const newWorkSpace =()=>{
    setHistory([])
    setCode("")
  }

  return (
    <ToastProvider>

    <div className='min-h-screen  gap-2 bg-white w-full '>
      <Toaster/>
      <div className='container items-center border top-2 shadow left-[50%] translate-x-[-50%] fixed p-2 bg-white rounded-xl flex justify-between'>
        <div className='flex items-center gap-4 px-1'>
        <UserButton/>
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={()=>router.push("/")} className="flex gap-2"><ArrowLeft size={16}/>Go back</MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={newWorkSpace} className="flex gap-2">
                <Plus size={16}/>
                New WorkSpace 
              </MenubarItem>
              <MenubarItem className="flex gap-2"><Save size={16}/>Save</MenubarItem>
              <MenubarItem className="flex gap-2"><Save size={16}/>Save As</MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger>Edit</MenubarTrigger>
            <MenubarContent>
              <MenubarItem disabled={historyPointer < 1} onClick={undo} className="flex gap-2"><Undo size={16}/>Undo</MenubarItem>
              <MenubarItem disabled={historyPointer > history.length - 2} onClick={redo} className="flex gap-2"><Redo size={16}/>Redo</MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger>Control</MenubarTrigger>
            <MenubarContent>
              <MenubarItem disabled={!code} onClick={copyToClipboard} className="flex gap-2"><Copy size={16}/>Copy code</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>

        {/* <div className='px-1 flex text-green-700 items-center gap-2 border border-green-400 rounded-lg bg-green-100'>
          <h3 className='text-sm '>149 </h3>
          <Diamond size={14}/>
        </div> */}

        </div>
        <div className='flex items-center'>
          <Input placeholder='title of the sketch' className='bg-gray-50 pr-9'></Input>
          <Edit2 size={16} className='-translate-x-7'/>
        </div>
        <div className='flex gap-2'>
          <GitCodeButton/>
          <Button disabled={!code} onClick={copyToClipboard} className='flex gap-2' variant={"outline"}>Copy<Copy size={18}></Copy></Button>
        </div>
      </div>


      <div  className=' grid-bg mx-auto flex-1 rounded-xl w-full h-screen shadow-inner flex justify-center items-center'>
                    {
                    loading?
                    <div>Loading</div>
                    :
                    !code?
                    (
                      <div className='w-full max-w-2xl'>
                          <Alert className='shadow'>
                          <RocketIcon className="h-4 w-4" />
                          <AlertTitle>Ready to stat </AlertTitle>
                          <AlertDescription className='py-2'>
                            type what time of element you want me to create , you can specify the colors and the style you want .
                          </AlertDescription>
                          <AlertDescription>
                            <div onClick={example} className='border hover:bg-gray-50 duration-150 flex text-gray-700 cursor-pointer justify-between mt-2 rounded-lg p-4'>
                                    make me an e-commerce item card
                                    <ArrowRight/>
                            </div>
                          </AlertDescription>
                        </Alert>
                        </div>
                    )
                        :
                        <div dangerouslySetInnerHTML={{ __html: code }} />
                  }
        </div>
      <div className=' p-2 shadow-md border fixed bottom-4 z-50 left-[50%] translate-x-[-50%] max-w-4xl flex gap-2 w-full mx-auto bg-white rounded-lg'>
        <Button disabled={historyPointer<1} onClick={undo}  variant={"outline"}><Undo size={18}/></Button>
        <Button disabled={historyPointer > history.length - 2}  onClick={redo} variant={"outline"}><Redo size={18}/></Button>
        <form onSubmit={Genirate} className='flex-1 flex gap-2'>
          <Input value={message} onInput={(e)=>setMessage((e.target as any).value)}/>
          <Button type='submit' className='flex gap-2'>{loading?"Loading":<>Send<Send size={20}/></>}</Button>
        </form>
      </div>
      </div>
    </ToastProvider>
  );
}