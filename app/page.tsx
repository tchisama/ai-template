"use client";
import { Button } from "@/components/ui/button";
import {
  UserButton,
  auth,
  currentUser,
  useClerk,
  useUser,
} from "@clerk/nextjs";
import React, { useEffect, useId, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Copy,
  Delete,
  Search,
  Square,
  StarsIcon as Star,
  Trash,
  TriangleIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useSketchs, { Sketch } from "@/hooks/sketchs";
import axios from "axios";
import { Dialog, DialogClose } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useToast } from "@/components/ui/use-toast";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import useUserStore from "@/hooks/user";

const data = [
  {
    name: "Jan",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Feb",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Mar",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Apr",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "May",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Jun",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Jul",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Aug",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Sep",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Oct",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Nov",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Dec",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
];

function page() {
  const router = useRouter();
  const { sketchs, setSketchs } = useSketchs();
  const [loaded, setLoaded] = useState(false);
  const { user } = useClerk();
  const userId = user?.id;
  const [newInput, setNewInput] = useState({
    name: "",
    description: "",
  });

  const {setUser,userData}=useUserStore()
  useEffect(() => {
    if (userId) {
      // Check if userId is defined
      const getSketchs = async () => {
        try {
          const response = await axios.post(
            "http://localhost:3001/sketch/get-sketchs",
            {
              owner: userId,
            }
          );
          setSketchs(response.data);
          setLoaded(true);

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



  useEffect(() => {

    const getUser = async () => {
      
      if (user) {
        try {
          const response = await axios.post("http://localhost:3001/auth/getuser", {
            name: user?.fullName,
            email: user?.emailAddresses[0]?.emailAddress, // Use optional chaining
            photoProfile: user?.imageUrl, // Use optional chaining
            user_id: user?.id, // Use optional chaining
          })
          setUser(response.data.user);
        } catch (error) {
          // Handle any errors here
          console.error(error);
        }
      }
    };

    // Call getUser initially and whenever the user object changes
    getUser();
  }, [user,userId]); // Depend on user object

  // ...








  if (userId === undefined) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        Loading
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto">
        <div className="py-8 grid grid-cols-3">
          <UserButton afterSignOutUrl="/" />
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              <Input
                placeholder="search."
                className="pr-10 min-w-[300px]"
              ></Input>
              <Search className="translate-x-[-40px]" size={18} />
            </div>
          </div>
          <div className="flex justify-end">
            <Dialog>
              <DialogTrigger>
                <Button className="flex gap-2 w-fit">
                  Create new <Star />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Let's create a new sketch</DialogTitle>
                  <DialogDescription className="flex flex-col gap-2 mt-2 py-2">
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
                  </DialogDescription>
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
        <div className="">
          <div className="max-w-2xl my-8">
            {/* <Chart/> */}
            <Card>
              <CardHeader>
                <div className="flex gap-4">
                  <img src={user?.imageUrl} className="w-16 rounded-xl"></img>
                  <div className="flex-1">
                    <CardTitle>{user?.fullName}</CardTitle>
                    <CardDescription>
                      {user?.emailAddresses[0]?.emailAddress}
                    </CardDescription>
                  </div>
                  <div>
                    <Button className="flex gap-2">
                      Get Points <TriangleIcon size={16} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  <span className="flex gap-1 items-center">
                    {userData?.used_point} <TriangleIcon size={15} />
                  </span>
                  <span className="flex gap-1 items-center">
                    {userData?.user_point} <TriangleIcon size={15} />
                  </span>
                </div>
                <div className="w-full h-6 bg-gray-100 rounded-lg ">
                  <div style={{width:((userData?.used_point || 0 )*100)/(userData?.user_point||0) + "%"}} className="bg-black h-full shadow-xl rounded-lg"></div>
                </div>

              </CardContent>
            </Card>
          </div>
          <h1 className="text-4xl font-semibold text-gray-800">Skitches</h1>
          <div className="grid gap-2 grid-cols-4 mt-8">
            {sketchs.map((sketch, id) => (
              <SketchCard sketch={sketch} key={id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const SketchCard = ({ sketch }: { sketch: Sketch }) => {
  const router = useRouter();
  const { toast } = useToast();
  const { sketchs, setSketchs } = useSketchs();

  const deleteSketch = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/sketch/delete-sketch",
        {
          id: sketch._id,
        }
      );
      toast({
        title: "Sketch deleted",
        description: "done deleting the sketch",
      });

      setSketchs(sketchs.filter((s: Sketch) => s._id !== sketch._id));
    } catch (error) {
      // Handle any errors here
      console.error(error);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Card
          onClick={() => router.push("/playground/" + sketch._id)}
          className="overflow-hidden cursor-pointer"
        >
          <div className="w-ful m-1 mb-0 rounded-lg bg-gray-100 aspect-video"></div>
          <CardHeader>
            <CardTitle>{sketch.name}</CardTitle>
            <CardDescription>
              {sketch.description || "no descriptin"}
            </CardDescription>
          </CardHeader>
        </Card>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onClick={() => router.push(`/playground/${sketch._id}`)}
          className="flex gap-2"
        >
          <ArrowUpRight size={15}></ArrowUpRight> Open
        </ContextMenuItem>
        <ContextMenuItem className="flex gap-2">
          <Copy size={15}></Copy> Copy
        </ContextMenuItem>
        <ContextMenuItem onClick={deleteSketch} className="flex gap-2">
          <Trash size={15}></Trash> Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

function Chart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default page;
