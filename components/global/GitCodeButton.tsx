"use client";
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { Code, Copy, RedoDot, Save } from 'lucide-react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select'
import useStore from '@/hooks/store'
import { DialogClose } from '@radix-ui/react-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import * as z from 'zod'
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem } from '../ui/form';

const formSchema = z.object({
  framework:z.string(),
  styling:z.string(),
})

function GitCodeButton({updateSketch,addHistory}:{addHistory:()=>void,updateSketch:()=>void}) {
    const {code , setCode } = useStore()


    const form = useForm<z.infer<typeof formSchema>>({
      resolver:zodResolver(formSchema),
      defaultValues:{
        framework:"",
        styling:""
      }
    })

    const onSubmit = (values:z.infer<typeof formSchema>)=>{
      console.log(values)
    }

  return (
          <Dialog>
            <DialogTrigger className='flex gap-2' asChild>
                <Button >Get code <Code size={18}></Code></Button>
            </DialogTrigger>
            <DialogContent className='w-screen max-w-[1000px]' >
            <Tabs defaultValue="template" className="w-full">
              <TabsList>
                <TabsTrigger value="template">Template</TabsTrigger>
                <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
              </TabsList>
              <TabsContent value="template">
                  <DialogDescription className='w-full '>
                    <textarea value={code} onChange={(e)=>setCode((e.target as any).value)} className=' w-full bg-gray-50 border rounded-xl overflow-auto min-h-[50vh] p-4 max-h-[60vh]'>
                    </textarea>

                  </DialogDescription>
                  <DialogFooter className='mt-2'>
                  <DialogClose>
                    <Button variant={'outline'} className='flex gap-2' >close</Button>
                  </DialogClose>
                  <DialogClose>
                    <Button onClick={()=>{updateSketch();addHistory()}} className='flex gap-2' >Save <Save size={14}></Save></Button>
                  </DialogClose>
                  </DialogFooter>
              </TabsContent>
              <TabsContent value="frameworks" >

              <DialogHeader>
                <DialogTitle className='py-2'>Choose your framework</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                this is still in early stages , if you get any assues please report them to this github repo
              </DialogDescription>
              <DialogDescription className=' max-w-xl py-2'>


              <Form {...form} >
                <form className="flex gap-2" onSubmit={form.handleSubmit(onSubmit)}>

                <FormField
                control={form.control}
                name='framework'
                render={({field})=>(
                  <FormItem className='flex-1'>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Framework" />
                      </SelectTrigger>
                      <SelectContent >
                        <SelectGroup>
                        <SelectLabel>Frameworks</SelectLabel>
                        <SelectItem value="reactjs">Reactjs</SelectItem>
                        <SelectItem value="vuejs">Vuejs</SelectItem>
                        <SelectItem value="angularjs">Angularjs</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name='styling'
                render={({field})=>(
                  <FormItem className='flex-1'>
                    <Select  onValueChange={field.onChange}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Styling" />
                      </SelectTrigger>
                      <SelectContent defaultValue={"css"}>
                        <SelectGroup>
                        <SelectLabel>Styling</SelectLabel>
                        <SelectItem value="css">Css</SelectItem>
                        <SelectItem value="tailwindcss">Tailwind css</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
                />

                <Button  type='submit' className='flex gap-2'>Recode <RedoDot size={16}/></Button>

                </form>
              </Form>



              </DialogDescription>
                <DialogDescription>
                  <textarea value={code} onChange={(e)=>setCode((e.target as any).value)} className=' w-full bg-gray-50 border rounded-xl overflow-auto min-h-[50vh] p-4 max-h-[60vh]'>
                  </textarea>
                </DialogDescription>

              </TabsContent>
            </Tabs>


            </DialogContent>
          </Dialog>
  )
}

export default GitCodeButton