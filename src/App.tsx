
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ChatbotProvider } from "@/components/ChatbotProvider";
import { ThemeProvider } from "@/hooks/useTheme";
import { useStorageInit } from "@/hooks/useStorageInit";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Exercises from "./pages/Exercises";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import DiagnosticTest from "./pages/DiagnosticTest";
import Library from "./pages/Library";
import Donation from "./pages/Donation";
import Reviews from "./pages/Reviews";
import ChatbotAssistant from "./components/ChatbotAssistant";

const queryClient = new QueryClient();

const AppContent = () => {
  // Initialize storage buckets
  useStorageInit();
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/about" element={<About />} />
        <Route path="/test" element={<DiagnosticTest />} />
        <Route path="/library" element={<Library />} />
        <Route path="/donation" element={<Donation />} />
        <Route path="/reviews" element={<Reviews />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {/* Chatbot Assistant visible on all pages */}
      <ChatbotAssistant />
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ThemeProvider>
          <ChatbotProvider>
            <Toaster />
            <Sonner />
            <AppContent />
          </ChatbotProvider>
        </ThemeProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
