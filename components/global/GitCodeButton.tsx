import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { Code, Copy, RedoDot, Save } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import useStore from '@/hooks/store'
import { DialogClose } from '@radix-ui/react-dialog'

function GitCodeButton({updateSketch,addHistory}:{addHistory:()=>void,updateSketch:()=>void}) {
    const {code , setCode } = useStore()
  return (
          <Dialog >
            <DialogTrigger className='flex gap-2' asChild>
                <Button >Get code <Code size={18}></Code></Button>
            </DialogTrigger>
            <DialogContent className='w-screen max-w-[1000px]' >
              <DialogHeader>
                <DialogTitle>Choose your framework</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                this is still in early stages , if you get any assues please report them to this github repo
              </DialogDescription>
              <DialogDescription className='flex gap-2 max-w-xl py-2'>
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
                <textarea value={code} onChange={(e)=>setCode((e.target as any).value)} className=' w-full text-lg bg-gray-50 border rounded-xl overflow-auto min-h-[50vh] p-4 max-h-[60vh]'>
                </textarea>

              </DialogDescription>
              <DialogFooter >
              <DialogClose>
                <Button variant={'outline'} className='flex gap-2' >close</Button>
              </DialogClose>
              <DialogClose>
                <Button onClick={()=>{updateSketch();addHistory()}} className='flex gap-2' >Save <Save size={14}></Save></Button>
              </DialogClose>
              </DialogFooter>

            </DialogContent>
          </Dialog>
  )
}

export default GitCodeButton