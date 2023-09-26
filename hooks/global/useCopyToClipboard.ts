// useCopyToClipboard.ts
import { useToast } from "@/components/ui/use-toast";

const useCopyToClipboard = () => {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    if (text) {
      const tempInput = document.createElement("input");
      tempInput.value = text;

      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);

      toast({
        title: "Copied",
        description: "Code copied to clipboard",
      });
    }
  };

  return { copyToClipboard };
};

export default useCopyToClipboard;