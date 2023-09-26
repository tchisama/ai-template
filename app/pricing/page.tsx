import Navbar from '@/components/global/Navbar'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Star, StarIcon, Stars, TriangleIcon } from 'lucide-react'
import React from 'react'

const page = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto  flex flex-col h-full">
            <Navbar />
            <h1 className='text-5xl w-full my-10 text-center font-semibold text-gray-800'>Get Your Plan</h1>
            <div className='w-full flex mt-4 gap-8 justify-center'>
                {/* i will add price card options  */}
                <Card className='min-w-[300px] h-fit hover:scale-[1.02] duration-200  relative rounded-3xl'>
                    <CardHeader >
                        <CardTitle className='font-semibold text-3xl'>Free</CardTitle>
                        <CardDescription className='flex gap-1 items-center'>
                            daily 3000 <TriangleIcon size={13} /> points
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button variant={"secondary"} className='flex gap-2'>Get it <ArrowRight size={16}/></Button>
                    </CardFooter>
                </Card>
                <Card className='min-w-[300px] hover:scale-[1.13] duration-200 group relative  hover:border-2 hover:border-gray-600 rounded-3xl scale-110'>
                    <Stars className='absolute group-hover:scale-100 duration-200 scale-0 -top-4 right-2 fill-white text-gray-600 rounded-xl' strokeWidth={1} size={50}></Stars>
                    <CardHeader>
                        <CardTitle className='font-semibold text-5xl'>6 <span className='text-2xl'>$</span></CardTitle>
                        <CardDescription className='flex gap-1 items-center'>
                            Per 12000 <TriangleIcon size={13} /> points
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button className='flex gap-2'>Get it <ArrowRight size={16}/></Button>
                    </CardFooter>
                </Card>
                <Card className='min-w-[300px] hover:scale-[1.02] duration-200 rounded-3xl'>
                    <CardHeader>
                        <CardTitle className='font-semibold text-5xl'>10 <span className='text-2xl'>$</span></CardTitle>
                        <CardDescription className='flex gap-1 items-center'>
                            Per 25000 <TriangleIcon size={13} /> points
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button variant={"secondary"} className='flex gap-2'>Get it <ArrowRight size={16}/></Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    </div>
  )
}

export default page