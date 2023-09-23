"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Send ,ArrowLeft,Save,Plus,Code,Diamond,RedoDot,RocketIcon, Redo ,Undo,ArrowRight,Copy,Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UserButton } from '@clerk/nextjs/app-beta';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from '@/components/ui/menubar';
import { Dialog, DialogClose, DialogTrigger } from '@radix-ui/react-dialog';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
interface State {
  html: string;
}

export default function Home() {
  const [htmlContent, setHtmlContent] = useState<string>(`
  <html>
  <head> <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"> 
  <style>
  .ITEM-CARD {
    background-color: #f2f2f2;
    width: 300px;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  }
  
  .ITEM-IMAGE {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 5px;
  }
  
  .ITEM-NAME {
    font-weight: bold;
    margin-top: 10px;
  }
  
  .ITEM-PRICE {
    color: blue;
    margin-top: 5px;
  }
  
  .ITEM-DESCRIPTION {
    margin-top: 5px;
  }
  
  .ITEM-BUTTON {
    background-color: #4caf50;
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    border-radius: 5px;
    margin-top: 10px;
  }
  
  .ITEM-BUTTON:hover {
    background-color: #45a049;
  }
  </style>
  </head>
  <body>
  
  <div class="ITEM-CARD">
    <img src="https://th.bing.com/th/id/R.77ca77d32b8b8e97122ff20b2fff9658?rik=gFvl%2bFaxCCSU9A&riu=http%3a%2f%2fcdn.wallpapersafari.com%2f24%2f66%2fjVJNKu.png&ehk=BeYPDSonYIebD%2fPBR8lb2uwto%2fWI46j07m6ceP5IG2c%3d&risl=&pid=ImgRaw&r=0" class="ITEM-IMAGE" alt="Item Image">
    <h3 class="ITEM-NAME">Item Name</h3>
    <p class="ITEM-PRICE">$10</p>
    <p class="ITEM-DESCRIPTION">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    <button class="ITEM-BUTTON">Add to Cart <i class="fas fa-shopping-cart"></i></button>
  </div>
  
  </body>
  </html> 
  `);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<State[]>([]);
  const [historyPointer, setHistoryPointer] = useState<number>(-1);

  const Genirate = async (e:any) => {
    e.preventDefault ();
    try {
      const msg = message;
      setLoading(true);
      setMessage('');
      const response = await axios.post<string>('http://localhost:3001/api/genirate', {
        message: msg,
        code: htmlContent,
      });
      setHtmlContent(response.data);

      // Add the current state to the history when generating new content
      const newHistory = history.slice(0, historyPointer + 1);
      newHistory.push({ html: response.data });
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
      setHtmlContent(history[historyPointer - 1].html);
    }
  };

  const redo = () => {
    if (historyPointer < history.length - 1) {
      setHistoryPointer(historyPointer + 1);
      setHtmlContent(history[historyPointer + 1].html);
    }
  };
  const example = ()=>{
    setMessage("make me an e-commerce item card")
  }

  return (
    <div className='min-h-screen  gap-2 bg-white w-full '>
      <div className='container items-center border top-2 shadow left-[50%] translate-x-[-50%] fixed p-2 bg-white rounded-xl flex justify-between'>
        <div className='flex items-center gap-4 px-1'>
        <UserButton/>
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem className="flex gap-2"><ArrowLeft size={16}/>Go back</MenubarItem>
              <MenubarSeparator />
              <MenubarItem className="flex gap-2">
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
              <MenubarItem className="flex gap-2"><Undo size={16}/>Undo</MenubarItem>
              <MenubarItem className="flex gap-2"><Redo size={16}/>Redo</MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger>Control</MenubarTrigger>
            <MenubarContent>
              <MenubarItem className="flex gap-2"><Copy size={16}/>Copy code</MenubarItem>
              <MenubarItem className="flex gap-2"><Eye size={16}/>View code</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>

        {/* <div className='px-1 flex text-green-700 items-center gap-2 border border-green-400 rounded-lg bg-green-100'>
          <h3 className='text-sm '>149 </h3>
          <Diamond size={14}/>
        </div> */}

        </div>
        <div className='flex gap-2'>
          <Dialog >
            <DialogTrigger className='flex gap-2' asChild>
                <Button >Get code <Code size={18}></Code></Button>
            </DialogTrigger>
            <DialogContent className='w-screen max-w-[800px]' >
              <DialogHeader>
                <DialogTitle>Choose your framework</DialogTitle>
              </DialogHeader>
              <DialogDescription className='flex gap-2'>
                <Select>
                  <SelectTrigger defaultValue={"html"} className="flex-1">
                    <SelectValue placeholder="Framework" />
                  </SelectTrigger>
                  <SelectContent >
                    <SelectItem value="html">Html</SelectItem>
                    <SelectItem value="reactjs">Reactjs</SelectItem>
                    <SelectItem value="vuejs">Vuejs</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Styling" />
                  </SelectTrigger>
                  <SelectContent defaultValue={"css"}>
                    <SelectItem value="css">Css</SelectItem>
                    <SelectItem value="tailwindcss">Tailwind css</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant={"outline"} className='flex gap-2'>Recode <RedoDot size={16}/></Button>
              </DialogDescription>
              <DialogDescription className='w-full '>
                <pre contentEditable className=' w-full outline-none max-w-[765px] overflow-auto max-h-[60vh]'>
                {htmlContent?htmlContent:"no code to preview" }
                </pre>
              </DialogDescription>
              <DialogFooter >

                <Button className='flex gap-2' >Copy <Copy size={14}></Copy></Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>





          <Button className='flex gap-2' variant={"outline"}>Copy<Copy size={18}></Copy></Button>
        </div>
      </div>


      <div  className=' grid-bg mx-auto flex-1 rounded-xl w-full h-screen shadow-inner flex justify-center items-center'>
                    {
                    loading?
                    <div>Loading</div>
                    :
                    !htmlContent?
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
                        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                  }
        </div>
      <div className=' p-2 shadow-md border fixed bottom-4 z-50 left-[50%] translate-x-[-50%] max-w-4xl flex gap-2 w-full mx-auto bg-white rounded-lg'>
        <Button onClick={undo}  variant={"outline"}><Undo size={18}/></Button>
        <Button onClick={redo} variant={"outline"}><Redo size={18}/></Button>
        <form onSubmit={Genirate} className='flex-1 flex gap-2'>
          <Input value={message} onInput={(e)=>setMessage((e.target as any).value)}/>
          <Button type='submit' className='flex gap-2'>{loading?"Loading":<>Send<Send size={20}/></>}</Button>
        </form>
      </div>
      </div>
  );
}
