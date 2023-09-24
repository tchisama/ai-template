"use client"
import { Button } from '@/components/ui/button'
import { UserButton, auth, currentUser, useClerk, useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import { ArrowRight, ArrowUpRight, Copy, Delete, Search, StarsIcon as Star, Trash } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import useSketchs, { Sketch } from '@/hooks/sketchs'
import axios from "axios"
import { Dialog } from '@radix-ui/react-dialog'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu'
import { useToast } from '@/components/ui/use-toast'

function page() {
  const router = useRouter()
  const { sketchs, setSketchs } = useSketchs();
  const { user } = useClerk();
  const [loaded,setLoaded]=useState(false)
  const userId = user?.id;
  const [newInput,setNewInput]=useState({
    name:"",
    description:""
  })
  
  useEffect(() => {
    if (userId) { // Check if userId is defined
      const getSketchs = async () => {
        try {
          const response = await axios.post("http://localhost:3001/sketch/get-sketchs", {
            owner: userId
          });
          setSketchs(response.data);
          console.log(response.data);
          console.log(userId);
          setLoaded(true)
        } catch (error) {
          // Handle any errors here
          console.error(error);
        }
      };
  
      if (sketchs.length === 0 && !loaded) {
        getSketchs(); // Call getSketchs when userId is defined
      }
    }
  }, [userId, sketchs]); // Add userId to the dependency array
  
  if (userId === undefined) {
    return <div className='w-full min-h-screen flex justify-center items-center'>Loading</div>;
  }



  const createNewSketch = async()=>{
        try {
          const response = await axios.post("http://localhost:3001/sketch/create", {
            owner: userId,
            ...newInput
          });
          console.log(response.data);
          router.push("/playground/"+response.data._id)
        } catch (error) {
          // Handle any errors here
          console.error(error);
        }
  }





  return (
    <div className='bg-gray-50 min-h-screen'>
      <div className='container mx-auto'>
          <div className='py-8 grid grid-cols-3'>
              <UserButton afterSignOutUrl='/'/>
              <div className='flex justify-center'>
                <div className='flex items-center gap-2'>
                    <Input placeholder='search.' className='pr-10 min-w-[300px]'></Input>
                    <Search className='translate-x-[-40px]' size={18}/>
                </div>
              </div>
              <div className='flex justify-end'>


              <Dialog>
                <DialogTrigger>
                  <Button className='flex gap-2 w-fit'>Create new <Star/></Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Let's create a new sketch</DialogTitle>
                    <DialogDescription className='flex flex-col gap-2 mt-2 py-2'>
                      <label>Name</label>
                      <Input value={newInput.name} onInput={(e)=>setNewInput(p=>({...p,name:(e.target as any).value}))} ></Input>
                      <label>Descriptin</label>
                      <Input value={newInput.description}  onInput={(e)=>setNewInput(p=>({...p,description:(e.target as any).value}))} ></Input>
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant={"outline"}>Cancle</Button>
                    <Button className='flex gap-2' onClick={createNewSketch}>Create <ArrowRight size={15}/></Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>





              </div>
          </div>
          <div className='mt-8'>
            <h1 className='text-4xl font-semibold text-gray-800'>Skitches</h1>
            <div className='grid gap-2 grid-cols-4 mt-8'>
              {
                sketchs.map((sketch,id)=>(
                  <SketchCard sketch={sketch} key={id}/>
                ))
              }
            </div>
          </div>
      </div>

    </div>
  )
}


const SketchCard = ({sketch}:{sketch:Sketch})=>{
  const router = useRouter()
  const { toast } = useToast()
  const {sketchs,setSketchs}=useSketchs()

  const deleteSketch = async()=>{
        try {
          const response = await axios.post("http://localhost:3001/sketch/delete-sketch", {
            id: sketch._id,
          });
          toast({
            title:"Sketch deleted",
            description:"done deleting the sketch"
          })

          setSketchs(sketchs.filter((s:Sketch) => s._id !== sketch._id));

        } catch (error) {
          // Handle any errors here
          console.error(error);
        }
  }



return(
  <ContextMenu>
  <ContextMenuTrigger>

    <Card onClick={()=>router.push("/playground/"+sketch._id)} className='overflow-hidden cursor-pointer'>
      <div className='w-ful m-1 mb-0 rounded-lg bg-gray-100 aspect-video'></div>
      <CardHeader>
        <CardTitle>{sketch.name}</CardTitle>
        <CardDescription>{sketch.description || "no descriptin"}</CardDescription>
      </CardHeader>
    </Card>

  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem onClick={()=>router.push(`/playground/${sketch._id}`)} className='flex gap-2'><ArrowUpRight size={15}></ArrowUpRight> Open</ContextMenuItem>
    <ContextMenuItem className='flex gap-2'><Copy size={15}></Copy> Copy</ContextMenuItem>
    <ContextMenuItem onClick={deleteSketch} className='flex gap-2'><Trash size={15}></Trash> Delete</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>

)
}

export default page