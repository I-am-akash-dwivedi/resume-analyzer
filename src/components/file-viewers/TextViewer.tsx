import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";

interface TextViewerProps {
  file: File;
}

export function TextViewer({ file }: TextViewerProps) {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setContent(e.target?.result as string);
    };
    reader.readAsText(file);
  }, [file]);

  return (
    <ScrollArea className="h-[600px] w-full rounded-lg border bg-muted/5 p-4">
      <pre className="whitespace-pre-wrap font-mono text-sm">{content}</pre>
    </ScrollArea>
  );
}
