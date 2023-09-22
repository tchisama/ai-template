"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Send ,RocketIcon, Redo ,Undo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface State {
  html: string;
}

export default function Home() {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<State[]>([]);
  const [historyPointer, setHistoryPointer] = useState<number>(-1);

  const Genirate = async () => {
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

  return (
    <div className='min-h-screen  gap-2 bg-white w-full '>
      <div  className=' grid-bg mx-auto flex-1 rounded-xl w-full h-screen shadow-inner flex justify-center items-center'>
                    {!htmlContent?
                    (
                      <div className='w-full max-w-3xl'>
                          <Alert className='shadow'>
                          <RocketIcon className="h-4 w-4" />
                          <AlertTitle>Ready to stat </AlertTitle>
                          <AlertDescription>
                            type what time of element you want me to create , you can specify the colors and the style you want 
                          </AlertDescription>
                        </Alert>
                        </div>
                    )
                        :
                        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                  }
        </div>
      <div className=' p-2 shadow-md border fixed bottom-4 z-50 left-[50%] translate-x-[-50%] max-w-4xl flex gap-2 w-full mx-auto bg-white rounded-lg'>
        <Button onClick={undo} variant={"outline"}><Undo/></Button>
        <Button onClick={redo} variant={"outline"}><Redo/></Button>
        <Input value={message} onInput={(e)=>setMessage((e.target as any).value)}/>
        <Button onClick={Genirate} className='flex gap-2'>{loading?"Loading":<>Send<Send size={20}/></>}</Button>
      </div>
      </div>
  );
}
