import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  Calendar,
  Ticket,
  Users,
  Bell,
  TrendingUp,
  AlertTriangle,
  Sun,
} from "lucide-react";

interface DashboardStats {
  totalTemples: number;
  totalEvents: number;
  todayBookings: number;
  totalUsers: number;
  activeAlerts: number;
  upcomingFestivals: number;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTemples: 0,
    totalEvents: 0,
    todayBookings: 0,
    totalUsers: 0,
    activeAlerts: 0,
    upcomingFestivals: 0,
  });
  const [crowdStatus, setCrowdStatus] = useState<string>("Normal");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const today = new Date().toISOString().split("T")[0];

    const [
      templesRes,
      eventsRes,
      bookingsRes,
      usersRes,
      alertsRes,
      festivalsRes,
      crowdRes,
    ] = await Promise.all([
      supabase.from("temples").select("id", { count: "exact", head: true }),
      supabase.from("festivals").select("id", { count: "exact", head: true }),
      supabase.from("bookings").select("id", { count: "exact", head: true }).eq("booking_date", today),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("alerts").select("id", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("festivals").select("id", { count: "exact", head: true }).gte("start_date", today),
      supabase.from("crowd_predictions").select("crowd_level").eq("prediction_date", today),
    ]);

    setStats({
      totalTemples: templesRes.count || 0,
      totalEvents: eventsRes.count || 0,
      todayBookings: bookingsRes.count || 0,
      totalUsers: usersRes.count || 0,
      activeAlerts: alertsRes.count || 0,
      upcomingFestivals: festivalsRes.count || 0,
    });

    // Calculate overall crowd status
    if (crowdRes.data && crowdRes.data.length > 0) {
      const highCount = crowdRes.data.filter(c => c.crowd_level === "high").length;
      const mediumCount = crowdRes.data.filter(c => c.crowd_level === "medium").length;
      if (highCount > mediumCount) setCrowdStatus("High");
      else if (mediumCount > 0) setCrowdStatus("Medium");
      else setCrowdStatus("Low");
    }

    setLoading(false);
  };

  const statCards = [
    {
      title: "Total Temples",
      value: stats.totalTemples,
      icon: Building2,
      color: "text-primary",
      bgColor: "bg-primary/10",
      link: "/admin/temples",
    },
    {
      title: "Total Events",
      value: stats.totalEvents,
      icon: Calendar,
      color: "text-accent",
      bgColor: "bg-accent/10",
      link: "/admin/events",
    },
    {
      title: "Today's Bookings",
      value: stats.todayBookings,
      icon: Ticket,
      color: "text-green-600",
      bgColor: "bg-green-100",
      link: "/admin/bookings",
    },
    {
      title: "Current Crowd",
      value: crowdStatus,
      icon: TrendingUp,
      color: crowdStatus === "High" ? "text-red-600" : crowdStatus === "Medium" ? "text-yellow-600" : "text-green-600",
      bgColor: crowdStatus === "High" ? "bg-red-100" : crowdStatus === "Medium" ? "bg-yellow-100" : "bg-green-100",
      link: "/admin/analytics",
    },
    {
      title: "Active Alerts",
      value: stats.activeAlerts,
      icon: Bell,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      link: "/admin/alerts",
    },
    {
      title: "Upcoming Festivals",
      value: stats.upcomingFestivals,
      icon: Sun,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      link: "/admin/events",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      link: "/admin/users",
    },
    {
      title: "Warnings",
      value: stats.activeAlerts > 0 ? "Check Alerts" : "None",
      icon: AlertTriangle,
      color: stats.activeAlerts > 0 ? "text-red-600" : "text-green-600",
      bgColor: stats.activeAlerts > 0 ? "bg-red-100" : "bg-green-100",
      link: "/admin/alerts",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Link key={stat.title} to={stat.link}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/admin/temples" className="block p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
              <span className="font-medium">Add New Temple</span>
              <p className="text-sm text-muted-foreground">Create a new temple entry</p>
            </Link>
            <Link to="/admin/events" className="block p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
              <span className="font-medium">Add Festival/Event</span>
              <p className="text-sm text-muted-foreground">Schedule upcoming events</p>
            </Link>
            <Link to="/admin/alerts" className="block p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
              <span className="font-medium">Send Alert</span>
              <p className="text-sm text-muted-foreground">Notify users about important updates</p>
            </Link>
            <Link to="/admin/predictions" className="block p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
              <span className="font-medium">Update Crowd Data</span>
              <p className="text-sm text-muted-foreground">Enter today's crowd predictions</p>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Database</span>
              <span className="text-green-600 font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Booking System</span>
              <span className="text-green-600 font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Prediction Model</span>
              <span className="text-green-600 font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Running
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Alert Service</span>
              <span className="text-green-600 font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Active
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
