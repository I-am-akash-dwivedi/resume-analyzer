import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  apiKey: string;
  model: string;
  industry: string;
  isSidebarOpen: boolean;
  isLoading: boolean;
  setApiKey: (key: string) => void;
  setModel: (model: string) => void;
  setIndustry: (industry: string) => void;
  toggleSidebar: () => void;
  setIsLoading: (loading: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      apiKey: "",
      model: "gemini-1.5-pro",
      industry: "tech",
      isSidebarOpen: true,
      isLoading: false,
      setApiKey: (key) => {
        set({ apiKey: key });
      },
      setModel: (model) => set({ model }),
      setIndustry: (industry) => set({ industry }),
      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setIsLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "resume-analyzer-storage",
      partialize: (state) => ({
        apiKey: state.apiKey,
        model: state.model,
        industry: state.industry,
      }),
      // Optional: Add storage error handling
      onRehydrateStorage: () => {
        console.log("hydration starts");
        return (state) => {
          console.log("hydration finished", state);
        };
      },
    }
  )
);
