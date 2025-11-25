import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Settings, Bell, Shield, Database, Mail } from "lucide-react";

export default function AdminSettings() {
  const { toast } = useToast();

  const [settings, setSettings] = useState({
    emailNotifications: true,
    alertNotifications: true,
    autoBackup: true,
    maintenanceMode: false,
    maxBookingsPerDay: 1000,
    bookingAdvanceDays: 30,
  });

  const handleSave = () => {
    // In a real app, this would save to the database
    toast({ title: "Settings saved successfully" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage system settings and configurations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Settings */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>Configure how notifications are handled</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive email alerts for important events</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Alert Notifications</Label>
                <p className="text-sm text-muted-foreground">Show alerts in dashboard</p>
              </div>
              <Switch
                checked={settings.alertNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, alertNotifications: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Booking Settings */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Booking Settings
            </CardTitle>
            <CardDescription>Configure booking limits and rules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Max Bookings Per Day</Label>
              <Input
                type="number"
                value={settings.maxBookingsPerDay}
                onChange={(e) => setSettings({ ...settings, maxBookingsPerDay: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Advance Booking Days</Label>
              <Input
                type="number"
                value={settings.bookingAdvanceDays}
                onChange={(e) => setSettings({ ...settings, bookingAdvanceDays: parseInt(e.target.value) })}
              />
              <p className="text-xs text-muted-foreground">
                How many days in advance users can book darshan
              </p>
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              System Settings
            </CardTitle>
            <CardDescription>System maintenance and backup options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto Backup</Label>
                <p className="text-sm text-muted-foreground">Automatically backup data daily</p>
              </div>
              <Switch
                checked={settings.autoBackup}
                onCheckedChange={(checked) => setSettings({ ...settings, autoBackup: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">Disable public access temporarily</p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>Security and access control</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Admin Access</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Admin accounts are managed through the database. Contact the system administrator to add or remove admin privileges.
              </p>
              <p className="text-xs text-muted-foreground">
                Security Note: Admin roles are stored in a separate user_roles table and validated server-side for maximum security.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Settings</Button>
      </div>
    </div>
  );
}
