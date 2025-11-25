import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { User, Calendar, QrCode, LogOut, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Booking {
  id: string;
  temple_name: string;
  booking_date: string;
  time_slot: string;
  qr_code: string;
  status: string;
  created_at: string;
}

interface Profile {
  full_name: string;
  phone: string;
}

const UserDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile>({ full_name: "", phone: "" });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setUser(user);
    fetchProfile(user.id);
    fetchBookings(user.id);
  };

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (data) {
      setProfile({
        full_name: data.full_name || "",
        phone: data.phone || "",
      });
    }
    setLoading(false);
  };

  const fetchBookings = async (userId: string) => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (data) {
      setBookings(data);
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        phone: profile.phone,
      })
      .eq("id", user.id);

    if (error) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });
    }
    setUpdating(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const downloadQR = (qrCode: string, bookingId: string) => {
    const link = document.createElement("a");
    link.href = qrCode;
    link.download = `${bookingId}-darshan-ticket.png`;
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <p>Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <BackButton />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold bg-gradient-devotional bg-clip-text text-transparent">
              My Dashboard
            </h1>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile" className="gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="bookings" className="gap-2">
                <Calendar className="h-4 w-4" />
                My Bookings
              </TabsTrigger>
              <TabsTrigger value="qr-codes" className="gap-2">
                <QrCode className="h-4 w-4" />
                QR Codes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={updateProfile} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={user?.email || ""}
                        disabled
                        className="bg-muted"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={profile.full_name}
                        onChange={(e) =>
                          setProfile({ ...profile, full_name: e.target.value })
                        }
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) =>
                          setProfile({ ...profile, phone: e.target.value })
                        }
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <Button type="submit" disabled={updating}>
                      {updating ? "Updating..." : "Update Profile"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bookings">
              <div className="space-y-4">
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <Card key={booking.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">
                            {booking.temple_name}
                          </CardTitle>
                          <Badge
                            variant={
                              booking.status === "confirmed" ? "default" : "secondary"
                            }
                          >
                            {booking.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <p>
                            <strong>Date:</strong>{" "}
                            {new Date(booking.booking_date).toLocaleDateString()}
                          </p>
                          <p>
                            <strong>Time Slot:</strong> {booking.time_slot}
                          </p>
                          <p className="text-muted-foreground">
                            Booked on:{" "}
                            {new Date(booking.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <p className="text-muted-foreground mb-4">
                        No bookings yet
                      </p>
                      <Button onClick={() => navigate("/temples")}>
                        Book Darshan
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="qr-codes">
              <div className="space-y-4">
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <Card key={booking.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {booking.temple_name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                          <div className="bg-white p-4 rounded-lg">
                            <img
                              src={booking.qr_code}
                              alt="QR Code"
                              className="w-48 h-48"
                            />
                          </div>
                          <div className="flex-1 space-y-2">
                            <p>
                              <strong>Date:</strong>{" "}
                              {new Date(booking.booking_date).toLocaleDateString()}
                            </p>
                            <p>
                              <strong>Time:</strong> {booking.time_slot}
                            </p>
                            <Button
                              onClick={() => downloadQR(booking.qr_code, booking.id)}
                              className="gap-2"
                            >
                              <Download className="h-4 w-4" />
                              Download QR Code
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <p className="text-muted-foreground">No QR codes available</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserDashboard;
