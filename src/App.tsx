import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/temples" element={<Temples />} />
          <Route path="/temple/:id" element={<TempleDetails />} />
          <Route path="/book-darshan/:id" element={<BookDarshan />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/crowd-prediction" element={<CrowdPrediction />} />
          <Route path="/events" element={<Events />} />
          <Route path="/virtual-darshan" element={<VirtualDarshan />} />
          <Route path="/travel" element={<Travel />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<Auth />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="temples" element={<AdminTemples />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="slots" element={<AdminSlots />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="predictions" element={<AdminPredictions />} />
            <Route path="alerts" element={<AdminAlerts />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
