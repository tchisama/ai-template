
"use client"

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send ,ArrowLeft,Save,Plus,Code,Diamond,RedoDot,RocketIcon, Redo ,Undo,ArrowRight,Copy,Eye, Edit, Edit2, Trash, Eraser, Stars, TriangleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UserButton } from '@clerk/nextjs/app-beta';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from '@/components/ui/menubar';
import { useParams, useRouter } from 'next/navigation';
import useStore from '@/hooks/store';
import GitCodeButton from '@/components/global/GitCodeButton';
import { useToast } from '@/components/ui/use-toast';
import { ToastProvider } from '@radix-ui/react-toast';
import { Toaster } from '@/components/ui/toaster';
import useSketchs, { Sketch } from '@/hooks/sketchs';
import { useClerk } from '@clerk/nextjs';
import html2canvas from 'html2canvas';

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
  const [sketch,setSketch]=useState<Sketch|null>(null)

  const { user } = useClerk();
  const userId = user?.id;

  const { sketchs, setSketchs } = useSketchs();

  const {sketchId}=useParams()

  const [update,setUpdate]=useState(0)

  const [iframeKey, setIframeKey] = useState(0);


  const containerRef = useRef<HTMLDivElement | null>(null);
  
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
      const response = await axios.post<{message:string,data:string}>('http://localhost:3001/ai/genirate', {
        message: msg,
        code,
        id:userId,
      });
      setCode(response.data.data);
      if(response.data.message=="no more points"){
          toast({
            title:"No more points",
            description:"get more points now",
            action:<Button onClick={()=>router.push("/")} className='flex gap-2'>Get points<TriangleIcon size={15}/></Button>
          })
      }

      // Add the current state to the history when generating new content
      const newHistory = history.slice(0, historyPointer + 1);
      newHistory.push({ code: response.data.data,prompt:msg });
      setHistory(newHistory);
      setHistoryPointer(newHistory.length - 1);
      setUpdate(p=>p+1)
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
    setUpdate(p=>p+1)
  };

  const redo = () => {
    if (historyPointer < history.length - 1) {
      setHistoryPointer(historyPointer + 1);
      setCode(history[historyPointer + 1].code);
    }
    setUpdate(p=>p+1)
  };
  const example = ()=>{
    setMessage("make me an e-commerce item card")
  }
  const newWorkSpace =()=>{
    setHistory([])
    setCode("")
  }

  useEffect(()=>{
      const newHistory = history.slice(0, historyPointer + 1);
      newHistory.push({ code,prompt:"default" });
      setHistory(newHistory);
      setHistoryPointer(newHistory.length - 1);
  },[])



  const addHistory=()=>{

      const newHistory = history.slice(0, historyPointer + 1);
      newHistory.push({ code,prompt:"default" });
      setHistory(newHistory);
      setHistoryPointer(newHistory.length - 1);

  }


  useEffect(()=>{
    if(update>0){
      updateSketch()
    }
  },[update])

  useEffect(() => {
    if (sketchId) { // Check if userId is defined
      const getSketchs = async () => {
        try {
          const response = await axios.post("http://localhost:3001/sketch/get-sketch", {
            id: sketchId
          });
          setCode(response.data.data)
          setSketch(response.data)
          console.log(response.data);
          setHistory([])
        } catch (error) {
          // Handle any errors here
          console.error(error);
        }
      };
  
      if (sketchId) {
        getSketchs(); // Call getSketchs when userId is defined
      }
    }
  }, [sketchId]); 


  const updateSketch = ()=>{
        handleConvertToPNG().then(async(res)=>{
          console.log(res?.toString())
          try {
            const response = await axios.post("http://localhost:3001/sketch/update-sketch", {
              id: sketchId,
              data:code,
              name:sketch?.name,
              image:res,
            });
              refreshIframe()
            } catch (error) {
            // Handle any errors here
            console.error(error);
          }
        })
  }

  const createNewSketch = async()=>{
        try {
          const response = await axios.post("http://localhost:3001/sketch/create", {
            owner: userId,
            name:"new sketch",
            description:""
          });
          console.log(response.data);
          setSketchs([...sketchs,response.data])
          router.push("/playground/"+response.data._id)
        } catch (error) {
          // Handle any errors here
          console.error(error);
        }
  }

  
  const deleteSketch = async()=>{
        try {
          const response = await axios.post("http://localhost:3001/sketch/delete-sketch", {
            id: sketch?._id,
          });
          toast({
            title:"Sketch deleted",
            description:"done deleting the sketch"
          })

          setSketchs(sketchs.filter((s:Sketch) => s._id !== sketch?._id));
          router.push("/")

        } catch (error) {
          // Handle any errors here
          console.error(error);
        }
  }

  const cleanWorkSpace = ()=>{
    setCode("")
    setMessage("")
    const newHistory = history.slice(0, historyPointer + 1);
    newHistory.push({ code:"",prompt:"default" });
    setHistory(newHistory);
    setHistoryPointer(newHistory.length - 1);
  }


  const handleConvertToPNG = async () => {
      if(containerRef!==null){
        try {
            const canvas = await html2canvas(containerRef?.current as HTMLElement);
            const pngDataUrl = canvas.toDataURL('image/png');
            // You can now use `pngDataUrl` as needed, e.g., display it or save it.
            return(pngDataUrl)
        } catch (error) {
          console.error('Error converting to PNG:', error);
        }
      }
  };


  const [iframeSrc, setIframeSrc] = useState(`http://localhost:3001/sketch/get-sketch/${sketchId}/1`); // Initial URL

  const refreshIframe = () => {
    // You can change the URL here to whatever URL you want to load
    // For example, you can add a timestamp as a query parameter to prevent caching
    const newSrc = `http://localhost:3001/sketch/get-sketch/${sketchId}/${Date.now()}`;

    setIframeSrc(newSrc);
  };
  


  return (
    <ToastProvider>

    <div className='min-h-screen  gap-2 bg-white w-full '>
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
          <Input onChange={updateSketch} onInput={(e)=>setSketch((p:Sketch|null)=>p==null?null:({...p,name:(e.target as any).value}))} value={sketch?.name} placeholder='title of the sketch' className='bg-gray-50 pr-9'></Input>
          <Edit2 size={16} className='-translate-x-7'/>
        </div>
        <div className='flex gap-2'>
          <GitCodeButton addHistory={addHistory} updateSketch={updateSketch}/>
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
                        <>
                        <div  ref={containerRef} >
                          <div dangerouslySetInnerHTML={{ __html: code }} />
                        </div>
                        {/* <iframe
                          ref={containerRef}
                          key={iframeKey}
                          title="Node.js Content"
                          src={iframeSrc} // Replace with the actual URL of your Node.js server
                          width="600"
                          height="600"
                        />
                        {iframeKey} */}
                        </>
  
                  }
        </div>
      <div className=' p-2 shadow-md border fixed bottom-4 z-50 left-[50%] translate-x-[-50%] max-w-4xl flex gap-2 w-full mx-auto bg-white rounded-lg'>
        <Button disabled={historyPointer<1} onClick={undo}  variant={"outline"}><Undo size={18}/></Button>
        <Button disabled={historyPointer > history.length - 2}  onClick={redo} variant={"outline"}><Redo size={18}/></Button>
        <form onSubmit={Genirate} className='flex-1 flex gap-2'>
          <Input value={message} onInput={(e)=>setMessage((e.target as any).value)}/>
          <Button type='submit' className='flex gap-2 shadow-xl'>{loading?"Loading":<>Generate<Stars size={20}/></>}</Button>
        </form>
      </div>
      </div>
    </ToastProvider>
  );
}