"use client"
import { UserButton, useClerk } from '@clerk/nextjs'
import React, { useState } from 'react'
import { Input } from '../ui/input'
import { ArrowRight, Search, Star, Stars } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { DialogClose } from '@radix-ui/react-dialog'
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '../ui/navigation-menu'
import Link from 'next/link'
import axios from "axios"
import useSketchs from '@/hooks/sketchs'
import { useRouter } from 'next/navigation'

type Props = {
}

const Navbar = (props: Props) => {
  const [newInput, setNewInput] = useState({
    name: "",
    description: "",
  });
  const { sketchs, setSketchs } = useSketchs();
  const { user } = useClerk();
  const userId = user?.id;
  const router = useRouter();

  const createNewSketch = async () => {
    try {
      const response = await axios.post("http://localhost:3001/sketch/create", {
        owner: userId,
        ...newInput,
      });
      console.log(response.data);
      setSketchs([...sketchs, response.data]);
      router.push("/playground/" + response.data._id);
    } catch (error) {
      // Handle any errors here
      console.error(error);
    }
  };

  return (
        <div className="py-8 grid grid-cols-3">
          <UserButton afterSignOutUrl="/" />


          <div className="flex justify-center">
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                            <Link href="/" legacyBehavior passHref>
                                <NavigationMenuLink className="p-2">
                                    Home
                                </NavigationMenuLink>
                            </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                            <Link href="/" legacyBehavior passHref>
                                <NavigationMenuLink className="p-2">
                                Documentation
                                </NavigationMenuLink>
                            </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                            <Link href="/pricing" legacyBehavior passHref>
                                <NavigationMenuLink className="p-2">
                                    Pricing
                                </NavigationMenuLink>
                            </Link>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>

          </div>


          <div className="flex justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex gap-2 w-fit">
                  New Sketch <Stars />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Let's create a new sketch</DialogTitle>
                  <div className="flex flex-col gap-2 mt-2 py-2">
                    <label>Name</label>
                    <Input
                      value={newInput.name}
                      onInput={(e) =>
                        setNewInput((p) => ({
                          ...p,
                          name: (e.target as any).value,
                        }))
                      }
                    ></Input>
                    <label>Descriptin</label>
                    <Input
                      value={newInput.description}
                      onInput={(e) =>
                        setNewInput((p) => ({
                          ...p,
                          description: (e.target as any).value,
                        }))
                      }
                    ></Input>
                  </div>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose>
                    <Button variant={"outline"}>Cancle</Button>
                  </DialogClose>
                  <Button className="flex gap-2" onClick={createNewSketch}>
                    Create <ArrowRight size={15} />
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
  )
}

export default Navbar