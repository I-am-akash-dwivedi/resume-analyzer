import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { generateFeedback } from "@/lib/llm";
import { useStore } from "@/store/useStore";
import { Upload, Wand2 } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { LoadingOverlay } from "./LoadingOverlay";

export function MainContent() {
  const { isLoading, setIsLoading, apiKey, model, industry } = useStore();
  const [file, setFile] = useState<File | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const fileType = selectedFile.type;
      const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase();

      if (
        fileType === "application/pdf" ||
        fileType ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        fileType === "text/plain" ||
        fileExtension === "pdf" ||
        fileExtension === "docx" ||
        fileExtension === "txt"
      ) {
        setFile(selectedFile);
      } else {
        toast({
          title: "Unsupported file type",
          description: "Please upload a PDF, DOCX, or TXT file.",
          variant: "destructive",
        });
      }
    }
  };

  const handleGenerateFeedback = async () => {
    if (!apiKey || !file) return;

    setIsLoading(true);
    try {
      const result = await generateFeedback(file, apiKey, model, industry);
      console.log(result);
      if (result.success) {
        setFeedback(result.data);
      } else {
        toast({
          title: "Error",
          description: result.data,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate feedback. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="p-8 text-center border-dashed">
            <input
              type="file"
              id="resume"
              className="hidden"
              accept=".pdf,.docx,.txt"
              onChange={handleFileUpload}
            />
            <label
              htmlFor="resume"
              className="flex flex-col items-center cursor-pointer"
            >
              <Upload className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Upload Your Resume</h3>
              <p className="text-sm text-muted-foreground">
                Supported formats: PDF, DOCX, TXT
              </p>
            </label>
          </Card>

          {file && (
            <>
              {/* <Collapsible className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Resume Preview</h2>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost">Toggle Preview</Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                  <ResumeViewer file={file} />
                </CollapsibleContent>
              </Collapsible> */}

              {/* show file details */}
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-2">File Details</h3>
                <p className="text-muted-foreground flex justify-between">
                  <span className="font-semibold">{file.name}</span>
                  <span>{Math.round(file.size / 1024)} kb</span>
                </p>
              </Card>

              <div className="flex justify-center">
                <Button
                  size="lg"
                  onClick={handleGenerateFeedback}
                  disabled={isLoading || !apiKey}
                  className="w-full max-w-md"
                >
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Feedback
                </Button>
              </div>
            </>
          )}

          {feedback && (
            <Collapsible className="space-y-4" defaultOpen>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">AI Feedback</h2>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost">Toggle Feedback</Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <Card className="p-4">
                  <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown>{feedback}</ReactMarkdown>
                  </div>
                </Card>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </div>
    </>
  );
}
