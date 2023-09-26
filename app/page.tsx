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
import useStore from "@/hooks/store";
import Navbar from "@/components/global/Navbar";


function page() {
  const { sketchs, setSketchs } = useSketchs();
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const {setCode}=useStore()
  const { user } = useClerk();
  const userId = user?.id;

  const {setUser,userData}=useUserStore()
  useEffect(() => {
    setCode("")
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
        <Navbar/>
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
                    <Button onClick={()=>router.push("/pricing")} className="flex gap-2">
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
          <div className="w-ful m-1 mb-0 rounded-lg p-12 aspect-video">
            <img src={sketch.image} className="w-full h-full object-contain" alt="" />
          </div>
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


export default page;
