"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  TriangleIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import useStore from "@/hooks/store";
import { useToast } from "@/components/ui/use-toast";
import { ToastProvider } from "@radix-ui/react-toast";
import useSketchs, { Sketch } from "@/hooks/sketchs";
import { useClerk } from "@clerk/nextjs";
import html2canvas from "html2canvas";
import ButtonGroup from "@/components/global/ButtonGroup";
import CodeContainer from "@/components/global/CodeContainer";
import MenuBar from "@/components/global/MenuBar";
import MessageAlert from "@/components/global/MessageAlert";
import useCopyToClipboard from "@/hooks/global/useCopyToClipboard";

interface State {
  html: string;
}

export default function Home() {
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [historyPointer, setHistoryPointer] = useState<number>(-1);
  const router = useRouter();
  const { code, setCode, history, setHistory } = useStore();
  const { toast } = useToast();
  const [sketch, setSketch] = useState<Sketch | null>(null);

  const { user } = useClerk();
  const userId = user?.id;

  const { sketchs, setSketchs } = useSketchs();

  const { sketchId } = useParams();

  const [update, setUpdate] = useState(0);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const {copyToClipboard}=useCopyToClipboard()

  const Genirate = async (e: any) => {
    e.preventDefault();
    try {
      const msg = message;
      setLoading(true);
      setMessage("");
      const response = await axios.post<{ message: string; data: string }>(
        "http://localhost:3001/ai/genirate",
        {
          message: msg,
          code,
          id: userId,
        }
      );
      setCode(response.data.data);
      if (response.data.message == "no more points") {
        toast({
          title: "No more points",
          description: "get more points now",
          action: (
            <Button onClick={() => router.push("/pricing")} className="flex gap-2">
              Get points
              <TriangleIcon size={15} />
            </Button>
          ),
        });
      }

      // Add the current state to the history when generating new content
      const newHistory = history.slice(0, historyPointer + 1);
      newHistory.push({ code: response.data.data, prompt: msg });
      setHistory(newHistory);
      setHistoryPointer(newHistory.length - 1);
      setUpdate((p) => p + 1);
    } catch {
      console.log("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const undo = () => {
    if (historyPointer > 0) {
      setHistoryPointer(historyPointer - 1);
      setCode(history[historyPointer - 1].code);
    }
    setUpdate((p) => p + 1);
  };

  const redo = () => {
    if (historyPointer < history.length - 1) {
      setHistoryPointer(historyPointer + 1);
      setCode(history[historyPointer + 1].code);
    }
    setUpdate((p) => p + 1);
  };
  const example = () => {
    setMessage("make me an e-commerce item card");
  };
  const newWorkSpace = () => {
    setHistory([]);
    setCode("");
  };

  useEffect(() => {
    const newHistory = history.slice(0, historyPointer + 1);
    newHistory.push({ code, prompt: "default" });
    setHistory(newHistory);
    setHistoryPointer(newHistory.length - 1);
  }, []);

  const addHistory = () => {
    const newHistory = history.slice(0, historyPointer + 1);
    newHistory.push({ code, prompt: "default" });
    setHistory(newHistory);
    setHistoryPointer(newHistory.length - 1);
  };

  useEffect(() => {
    if (update > 0) {
      updateSketch();
    }
  }, [update]);

  useEffect(() => {
    if (sketchId) {
      // Check if userId is defined
      const getSketchs = async () => {
        try {
          const response = await axios.post(
            "http://localhost:3001/sketch/get-sketch",
            {
              id: sketchId,
            }
          );
          setCode(response.data.data);
          setSketch(response.data);
          console.log(response.data);
          setHistory([]);
        } catch (error) {
          // Handle any errors here
          console.error(error);
        }
      };

      if (sketchId) {
        getSketchs(); // Call getSketchs when userId is defined
      }
    }
  }, [sketchId]);

  const updateSketch = () => {
    handleConvertToPNG().then(async (res) => {
      console.log(res?.toString());
      try {
        const response = await axios.post(
          "http://localhost:3001/sketch/update-sketch",
          {
            id: sketchId,
            data: code,
            name: sketch?.name,
            image: res,
          }
        );
      } catch (error) {
        // Handle any errors here
        console.error(error);
      }
    });
  };

  const createNewSketch = async () => {
    try {
      const response = await axios.post("http://localhost:3001/sketch/create", {
        owner: userId,
        name: "new sketch",
        description: "",
      });
      console.log(response.data);
      setSketchs([...sketchs, response.data]);
      router.push("/playground/" + response.data._id);
    } catch (error) {
      // Handle any errors here
      console.error(error);
    }
  };

  const deleteSketch = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/sketch/delete-sketch",
        {
          id: sketch?._id,
        }
      );
      toast({
        title: "Sketch deleted",
        description: "done deleting the sketch",
      });

      setSketchs(sketchs.filter((s: Sketch) => s._id !== sketch?._id));
      router.push("/");
    } catch (error) {
      // Handle any errors here
      console.error(error);
    }
  };

  const cleanWorkSpace = () => {
    setCode("");
    setMessage("");
    const newHistory = history.slice(0, historyPointer + 1);
    newHistory.push({ code: "", prompt: "default" });
    setHistory(newHistory);
    setHistoryPointer(newHistory.length - 1);
  };

  const handleConvertToPNG = async () => {
    if (containerRef !== null) {
      try {
        const canvas = await html2canvas(containerRef?.current as HTMLElement);
        const pngDataUrl = canvas.toDataURL("image/png");
        // You can now use `pngDataUrl` as needed, e.g., display it or save it.
        return pngDataUrl;
      } catch (error) {
        console.error("Error converting to PNG:", error);
      }
    }
  };


  return (
    <ToastProvider>
      <div className="min-h-screen  gap-2 bg-white w-full ">
        <MenuBar
          createNewSketch={createNewSketch}
          updateSketch={updateSketch}
          deleteSketch={deleteSketch}
          historyPointer={historyPointer}
          cleanWorkSpace={cleanWorkSpace}
          copyToClipboard={copyToClipboard}
          code={code}
          undo={undo}
          redo={undo}
          history={history}
          sketch={sketch}
          setSketch={setSketch}
          addHistory={addHistory}
        />

        <div className=" grid-bg mx-auto flex-1 rounded-xl w-full h-screen shadow-inner flex justify-center items-center">
          {loading ? (
            <div>Loading</div>
          ) : !code ? (
            <MessageAlert example={example} />
          ) : (
            <CodeContainer code={code} />
          )}
        </div>
        <ButtonGroup
          historyPointer={historyPointer}
          loading={loading}
          message={message}
          history={history}
          setMessage={setMessage}
          Genirate={Genirate}
          undo={undo}
          redo={redo}
        />
      </div>
    </ToastProvider>
  );
}
