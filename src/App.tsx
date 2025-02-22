import { Header } from "@/components/Header";
import { MainContent } from "@/components/MainContent";
import { Sidebar } from "@/components/Sidebar";
import { useStore } from "@/store/useStore";
import { ToastContainer } from "react-toastify";

function App() {
  const { isSidebarOpen } = useStore();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        // theme="colored"
      />
      <div className="flex">
        <Sidebar />
        <div
          className={`flex-1 transition-all duration-300 ${
            isSidebarOpen ? "ml-0" : ""
          }`}
        >
          <MainContent />
        </div>
      </div>
    </div>
  );
}

export default App;
