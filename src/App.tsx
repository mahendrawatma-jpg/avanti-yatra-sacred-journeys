import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Index from "./pages/Index";
import Temples from "./pages/Temples";
import TempleDetails from "./pages/TempleDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Events from "./pages/Events";
import VirtualDarshan from "./pages/VirtualDarshan";
import Travel from "./pages/Travel";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import BookDarshan from "./pages/BookDarshan";
import UserDashboard from "./pages/UserDashboard";
import CrowdPrediction from "./pages/CrowdPrediction";

// Admin imports
import AdminLayout from "./components/admin/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminTemples from "./pages/admin/AdminTemples";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminSlots from "./pages/admin/AdminSlots";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminPredictions from "./pages/admin/AdminPredictions";
import AdminAlerts from "./pages/admin/AdminAlerts";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Index /></PageWrapper>} />
        <Route path="/temples" element={<PageWrapper><Temples /></PageWrapper>} />
        <Route path="/temple/:id" element={<PageWrapper><TempleDetails /></PageWrapper>} />
        <Route path="/book-darshan/:id" element={<PageWrapper><BookDarshan /></PageWrapper>} />
        <Route path="/user-dashboard" element={<PageWrapper><UserDashboard /></PageWrapper>} />
        <Route path="/crowd-prediction" element={<PageWrapper><CrowdPrediction /></PageWrapper>} />
        <Route path="/events" element={<PageWrapper><Events /></PageWrapper>} />
        <Route path="/virtual-darshan" element={<PageWrapper><VirtualDarshan /></PageWrapper>} />
        <Route path="/travel" element={<PageWrapper><Travel /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
        <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
        <Route path="/auth" element={<PageWrapper><Auth /></PageWrapper>} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<PageWrapper><AdminOverview /></PageWrapper>} />
          <Route path="temples" element={<PageWrapper><AdminTemples /></PageWrapper>} />
          <Route path="events" element={<PageWrapper><AdminEvents /></PageWrapper>} />
          <Route path="slots" element={<PageWrapper><AdminSlots /></PageWrapper>} />
          <Route path="analytics" element={<PageWrapper><AdminAnalytics /></PageWrapper>} />
          <Route path="predictions" element={<PageWrapper><AdminPredictions /></PageWrapper>} />
          <Route path="alerts" element={<PageWrapper><AdminAlerts /></PageWrapper>} />
          <Route path="bookings" element={<PageWrapper><AdminBookings /></PageWrapper>} />
          <Route path="users" element={<PageWrapper><AdminUsers /></PageWrapper>} />
          <Route path="settings" element={<PageWrapper><AdminSettings /></PageWrapper>} />
        </Route>
        
        <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
