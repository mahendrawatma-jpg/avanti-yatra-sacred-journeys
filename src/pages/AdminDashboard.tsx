import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Shield, Users, Calendar, TrendingUp, Cloud, Plus, Edit, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [festivals, setFestivals] = useState<any[]>([]);

  // Festival form state
  const [festivalForm, setFestivalForm] = useState({
    name: "",
    temple_id: "",
    start_date: "",
    end_date: "",
    description: "",
    category: "Festival"
  });

  // Crowd prediction form state
  const [crowdForm, setCrowdForm] = useState({
    temple_id: "",
    prediction_date: "",
    time_slot: "",
    crowd_level: "",
    weather: "",
    is_festival: false,
    manual_count: 0
  });

  const temples = ["mahakaleshwar", "omkareshwar", "kalbhairav", "maihar", "salkanpur", "khajrana"];
  const timeSlots = ["Morning (6-10 AM)", "Afternoon (10 AM-4 PM)", "Evening (4-8 PM)", "Night (8 PM onwards)"];
  const crowdLevels = ["Low", "Medium", "High"];
  const weatherOptions = ["Clear", "Cloudy", "Rainy"];
  const categories = ["Festival", "Special Darshan", "Rally", "Procession"];

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    setUser(user);

    // Check if user has admin role
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (!roles) {
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    setIsAdmin(true);
    setLoading(false);
    fetchData();
  };

  const fetchData = async () => {
    // Fetch all bookings
    const { data: bookingsData } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (bookingsData) setBookings(bookingsData);

    // Fetch festivals
    const { data: festivalsData } = await supabase
      .from("festivals")
      .select("*")
      .order("start_date", { ascending: true });
    
    if (festivalsData) setFestivals(festivalsData);
  };

  const handleAddFestival = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase.from("festivals").insert([festivalForm]);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Festival Added",
        description: "Festival has been added successfully",
      });
      setFestivalForm({
        name: "",
        temple_id: "",
        start_date: "",
        end_date: "",
        description: "",
        category: "Festival"
      });
      fetchData();
    }
  };

  const handleDeleteFestival = async (id: string) => {
    const { error } = await supabase.from("festivals").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Deleted",
        description: "Festival has been deleted",
      });
      fetchData();
    }
  };

  const handleAddCrowdPrediction = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase.from("crowd_predictions").upsert([{
      temple_id: crowdForm.temple_id,
      prediction_date: crowdForm.prediction_date,
      time_slot: crowdForm.time_slot,
      crowd_level: crowdForm.crowd_level,
      weather: crowdForm.weather,
      is_festival: crowdForm.is_festival,
      manual_count: crowdForm.manual_count
    }], {
      onConflict: "temple_id,prediction_date,time_slot"
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Crowd Data Updated",
        description: "Crowd prediction has been updated successfully",
      });
      setCrowdForm({
        temple_id: "",
        prediction_date: "",
        time_slot: "",
        crowd_level: "",
        weather: "",
        is_festival: false,
        manual_count: 0
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold bg-gradient-devotional bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="festivals">Festivals</TabsTrigger>
            <TabsTrigger value="crowd">Crowd Data</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{bookings.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Festivals</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{festivals.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active Temples</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">6</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Weather Updates</CardTitle>
                  <Cloud className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Clear</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>All Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-semibold">{booking.temple_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(booking.booking_date).toLocaleDateString()} - {booking.time_slot}
                        </p>
                      </div>
                      <Badge>{booking.status}</Badge>
                    </div>
                  ))}
                  {bookings.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No bookings yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="festivals">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add Festival
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddFestival} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Festival Name</Label>
                      <Input
                        value={festivalForm.name}
                        onChange={(e) => setFestivalForm({ ...festivalForm, name: e.target.value })}
                        placeholder="Mahashivratri"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Temple</Label>
                      <Select
                        value={festivalForm.temple_id}
                        onValueChange={(value) => setFestivalForm({ ...festivalForm, temple_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select temple" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Temples</SelectItem>
                          {temples.map((temple) => (
                            <SelectItem key={temple} value={temple}>
                              {temple}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={festivalForm.start_date}
                          onChange={(e) => setFestivalForm({ ...festivalForm, start_date: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={festivalForm.end_date}
                          onChange={(e) => setFestivalForm({ ...festivalForm, end_date: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select
                        value={festivalForm.category}
                        onValueChange={(value) => setFestivalForm({ ...festivalForm, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={festivalForm.description}
                        onChange={(e) => setFestivalForm({ ...festivalForm, description: e.target.value })}
                        placeholder="Festival description"
                        rows={3}
                      />
                    </div>

                    <Button type="submit" className="w-full">Add Festival</Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Existing Festivals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {festivals.map((festival) => (
                      <div key={festival.id} className="flex items-start justify-between p-3 border rounded-lg">
                        <div className="space-y-1">
                          <p className="font-semibold">{festival.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(festival.start_date).toLocaleDateString()}
                          </p>
                          <Badge variant="outline">{festival.category}</Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteFestival(festival.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="crowd">
            <Card>
              <CardHeader>
                <CardTitle>Update Crowd Prediction</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddCrowdPrediction} className="space-y-4 max-w-2xl">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Temple</Label>
                      <Select
                        value={crowdForm.temple_id}
                        onValueChange={(value) => setCrowdForm({ ...crowdForm, temple_id: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select temple" />
                        </SelectTrigger>
                        <SelectContent>
                          {temples.map((temple) => (
                            <SelectItem key={temple} value={temple}>
                              {temple}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={crowdForm.prediction_date}
                        onChange={(e) => setCrowdForm({ ...crowdForm, prediction_date: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Time Slot</Label>
                      <Select
                        value={crowdForm.time_slot}
                        onValueChange={(value) => setCrowdForm({ ...crowdForm, time_slot: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Crowd Level</Label>
                      <Select
                        value={crowdForm.crowd_level}
                        onValueChange={(value) => setCrowdForm({ ...crowdForm, crowd_level: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select crowd level" />
                        </SelectTrigger>
                        <SelectContent>
                          {crowdLevels.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Weather</Label>
                      <Select
                        value={crowdForm.weather}
                        onValueChange={(value) => setCrowdForm({ ...crowdForm, weather: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select weather" />
                        </SelectTrigger>
                        <SelectContent>
                          {weatherOptions.map((weather) => (
                            <SelectItem key={weather} value={weather}>
                              {weather}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Manual Count</Label>
                      <Input
                        type="number"
                        value={crowdForm.manual_count}
                        onChange={(e) => setCrowdForm({ ...crowdForm, manual_count: parseInt(e.target.value) })}
                        placeholder="Visitor count"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_festival"
                      checked={crowdForm.is_festival}
                      onChange={(e) => setCrowdForm({ ...crowdForm, is_festival: e.target.checked })}
                      className="rounded"
                    />
                    <Label htmlFor="is_festival">Festival Day</Label>
                  </div>

                  <Button type="submit" className="w-full">Update Crowd Data</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  User management features coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
