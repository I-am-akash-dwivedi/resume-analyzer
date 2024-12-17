import { Loader2 } from "lucide-react";

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-lg font-medium">Analyzing your resume...</p>
      </div>
    </div>
  );
}
