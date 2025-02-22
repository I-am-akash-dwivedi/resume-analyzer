import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEFAULT_MODEL_FEEDBACK } from "@/lib/config";
import { useStore } from "@/store/useStore";

export function Sidebar() {
  const { apiKey, setApiKey } = useStore();
  const models = {
    "gemini-1.5-pro": "Gemini 1.5 Pro",
    "gemini-1.5-flash": "Gemini 1.5 Flash",
    "gemini-1.5-flash-8b": "Gemini 1.5 Flash 8B",
    "gemini-2.0-flash": "Gemini 2.0 Flash",
  };

  return (
    <div className="w-80 border-r h-[calc(100vh-4rem)] p-4 space-y-6">
      <div className="space-y-2">
        <Label htmlFor="model">LLM Model</Label>
        <Select defaultValue={DEFAULT_MODEL_FEEDBACK}>
          <SelectTrigger>
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(models).map(([key, value]) => (
              <SelectItem key={key} value={key}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="apiKey">API Key</Label>
        <Input
          id="apiKey"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your API key"
        />
        <p>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noreferrer"
            className="text-blue-500"
          >
            Click here to get your API key.
          </a>
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="industry">Target Industry</Label>
        <Select defaultValue="tech">
          <SelectTrigger>
            <SelectValue placeholder="Select industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tech">Technology</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="healthcare">Healthcare</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="p-4 bg-muted/50">
        <p className="text-sm text-muted-foreground">
          Your API key is stored locally and never sent to our servers. We only
          use it to communicate with the LLM provider directly from your
          browser.
        </p>
      </Card>
    </div>
  );
}
