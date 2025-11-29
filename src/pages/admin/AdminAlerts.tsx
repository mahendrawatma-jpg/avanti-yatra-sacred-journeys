import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Bell, AlertTriangle, CloudRain, Users, Star, Info } from "lucide-react";
import { format } from "date-fns";

interface Alert {
  id: string;
  title: string;
  description: string;
  alert_type: string;
  temple_id: string | null;
  is_active: boolean;
  valid_from: string;
  valid_until: string | null;
  created_at: string;
}

interface Temple {
  id: string;
  name: string;
}

const alertTypes = [
  { value: "festival", label: "Festival Alert", icon: Star },
  { value: "crowd", label: "Crowd Alert", icon: Users },
  { value: "closure", label: "Darshan Closed", icon: AlertTriangle },
  { value: "weather", label: "Weather Alert", icon: CloudRain },
  { value: "vip", label: "VIP Movement", icon: Info },
  { value: "general", label: "General", icon: Bell },
];

export default function AdminAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [temples, setTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const [form, setForm] = useState({
    title: "",
    description: "",
    alert_type: "general",
    temple_id: "",
    valid_until: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [alertsRes, templesRes] = await Promise.all([
      supabase.from("alerts").select("*").order("created_at", { ascending: false }),
      supabase.from("temples").select("id, name").order("name"),
    ]);

    if (alertsRes.data) setAlerts(alertsRes.data);
    if (templesRes.data) setTemples(templesRes.data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data: userData } = await supabase.auth.getUser();

      const payload = {
        title: form.title,
        description: form.description,
        alert_type: form.alert_type,
        temple_id: form.temple_id || null,
        valid_until: form.valid_until || null,
        created_by: userData.user?.id,
      };

      const { data, error } = await supabase
        .from("alerts")
        .insert([payload])
        .select();

      console.log("Insert alert result:", { data, error });

      if (error) {
        console.error("Insert alert error:", error);
        toast({ title: "Error creating alert", description: error.message, variant: "destructive" });
        return;
      }
      
      toast({ title: "Alert sent successfully" });
      await fetchData();
      resetForm();
    } catch (err) {
      console.error("Unexpected error:", err);
      toast({ title: "Unexpected error occurred", variant: "destructive" });
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const { data, error } = await supabase
        .from("alerts")
        .update({ is_active: !isActive })
        .eq("id", id)
        .select();

      console.log("Toggle alert result:", { data, error });

      if (error) {
        console.error("Toggle alert error:", error);
        toast({ title: "Error updating alert", description: error.message, variant: "destructive" });
        return;
      }
      
      await fetchData();
    } catch (err) {
      console.error("Unexpected error:", err);
      toast({ title: "Unexpected error occurred", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this alert?")) return;

    try {
      const { data, error } = await supabase
        .from("alerts")
        .delete()
        .eq("id", id)
        .select();

      console.log("Delete alert result:", { data, error });

      if (error) {
        console.error("Delete alert error:", error);
        toast({ title: "Error deleting alert", description: error.message, variant: "destructive" });
        return;
      }
      
      toast({ title: "Alert deleted" });
      await fetchData();
    } catch (err) {
      console.error("Unexpected error:", err);
      toast({ title: "Unexpected error occurred", variant: "destructive" });
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      alert_type: "general",
      temple_id: "",
      valid_until: "",
    });
    setDialogOpen(false);
  };

  const getAlertIcon = (type: string) => {
    const alertType = alertTypes.find((t) => t.value === type);
    return alertType?.icon || Bell;
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "festival":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "crowd":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "closure":
        return "bg-red-100 text-red-700 border-red-200";
      case "weather":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "vip":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTempleName = (templeId: string | null) => {
    if (!templeId) return "All Temples";
    const temple = temples.find((t) => t.id === templeId);
    return temple?.name || "Unknown";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Alerts & Notifications</h1>
          <p className="text-muted-foreground">Send alerts to all users</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Send Alert
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Alert</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Alert Title *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g., High Crowd Alert"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Detailed message for users..."
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Alert Type *</Label>
                  <Select
                    value={form.alert_type}
                    onValueChange={(v) => setForm({ ...form, alert_type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {alertTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className="h-4 w-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Temple (Optional)</Label>
                  <Select
                    value={form.temple_id || "all"}
                    onValueChange={(v) => setForm({ ...form, temple_id: v === "all" ? "" : v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Temples" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Temples</SelectItem>
                      {temples.map((temple) => (
                        <SelectItem key={temple.id} value={temple.id}>
                          {temple.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Valid Until (Optional)</Label>
                <Input
                  type="datetime-local"
                  value={form.valid_until}
                  onChange={(e) => setForm({ ...form, valid_until: e.target.value })}
                />
              </div>
              <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">Send Alert</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Alerts */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>All Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No alerts found. Create your first alert to notify users.
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => {
                const Icon = getAlertIcon(alert.alert_type);
                return (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border ${
                      alert.is_active ? getAlertColor(alert.alert_type) : "bg-muted/50 border-border opacity-60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <Icon className="h-5 w-5 mt-0.5" />
                        <div>
                          <h3 className="font-semibold">{alert.title}</h3>
                          <p className="text-sm mt-1">{alert.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs">
                            <span>Temple: {getTempleName(alert.temple_id)}</span>
                            <span>Created: {format(new Date(alert.created_at), "MMM d, yyyy h:mm a")}</span>
                            {alert.valid_until && (
                              <span>Expires: {format(new Date(alert.valid_until), "MMM d, yyyy h:mm a")}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {alert.is_active ? "Active" : "Inactive"}
                          </span>
                          <Switch
                            checked={alert.is_active}
                            onCheckedChange={() => handleToggleActive(alert.id, alert.is_active)}
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(alert.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
