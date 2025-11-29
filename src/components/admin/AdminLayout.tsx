import { useState, useEffect } from "react";
import { useNavigate, Outlet, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard,
  Building2,
  Calendar,
  Clock,
  BarChart3,
  Brain,
  Bell,
  Ticket,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Building2, label: "Temples", path: "/admin/temples" },
  { icon: Calendar, label: "Events", path: "/admin/events" },
  { icon: Clock, label: "Slots & Timings", path: "/admin/slots" },
  { icon: BarChart3, label: "Crowd Analytics", path: "/admin/analytics" },
  { icon: Brain, label: "Predictions", path: "/admin/predictions" },
  { icon: Bell, label: "Alerts", path: "/admin/alerts" },
  { icon: Ticket, label: "Bookings", path: "/admin/bookings" },
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

export default function AdminLayout() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    checkAdmin();
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    setIsAdmin(true);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col bg-card border-r border-border transition-all duration-300",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-primary">Admin Panel</h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <ChevronLeft className={cn("h-5 w-5 transition-transform", !sidebarOpen && "rotate-180")} />
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <Link
            to="/"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-muted text-muted-foreground hover:text-foreground w-full",
              !sidebarOpen && "justify-center"
            )}
          >
            <Home className="h-5 w-5" />
            {sidebarOpen && <span>Back to Site</span>}
          </Link>
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-3", !sidebarOpen && "justify-center")}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span>Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-primary">Admin Panel</h1>
        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <aside className="w-64 h-full bg-card border-r border-border" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-border">
              <h1 className="text-xl font-bold text-primary">Admin Panel</h1>
            </div>
            <nav className="p-4 space-y-2">
              {sidebarItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-border space-y-2">
              <Link
                to="/"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-muted text-muted-foreground hover:text-foreground w-full"
              >
                <Home className="h-5 w-5" />
                <span>Back to Site</span>
              </Link>
              <Button variant="ghost" className="w-full justify-start gap-3" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </Button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:p-6 p-4 pt-20 lg:pt-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
