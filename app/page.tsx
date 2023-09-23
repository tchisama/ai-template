"use client"
import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import React from 'react'
import { Search, StarsIcon as Star } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

function page() {
  const router = useRouter()
  return (
    <div className='bg-gray-50 min-h-screen'>
      <div className='container mx-auto'>
          <div className='py-8 grid grid-cols-3'>
              <UserButton/>
              <div className='flex justify-center'>
                <div className='flex items-center gap-2'>
                    <Input placeholder='search.' className='pr-10 min-w-[300px]'></Input>
                    <Search className='translate-x-[-40px]' size={18}/>
                </div>
              </div>
              <div className='flex justify-end'>
                <Button onClick={()=>router.push("/playground")} className='flex gap-2 w-fit'>Create new <Star/></Button>
              </div>
          </div>
          <div className='mt-8'>
            <h1 className='text-4xl font-semibold text-gray-800'>Skitches</h1>
            <div></div>
          </div>
      </div>

    </div>
  )
}

export default page