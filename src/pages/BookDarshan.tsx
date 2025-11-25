import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { temples } from "@/data/temples";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Download, QrCode } from "lucide-react";
import QRCode from "qrcode";

const BookDarshan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const temple = temples.find((t) => t.id === id);

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const timeSlots = ["Morning (6-10 AM)", "Afternoon (10 AM-4 PM)", "Evening (4-8 PM)", "Night (8 PM onwards)"];

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book darshan",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    setUser(user);
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingDate || !timeSlot) {
      toast({
        title: "Missing Information",
        description: "Please select date and time slot",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book darshan",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!temple) {
      toast({
        title: "Temple Not Found",
        description: "Please select a valid temple",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Generate unique booking ID
      const newBookingId = `BK-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
      
      // Generate QR code data
      const qrData = JSON.stringify({
        bookingId: newBookingId,
        temple: temple.name,
        date: bookingDate,
        timeSlot: timeSlot,
        userId: user.id,
      });

      // Generate QR code image
      const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
        width: 400,
        margin: 2,
      });

      // Save booking to database
      const { error } = await supabase.from("bookings").insert({
        user_id: user.id,
        temple_id: temple.id,
        temple_name: temple.name,
        booking_date: bookingDate,
        time_slot: timeSlot,
        qr_code: qrCodeDataUrl,
        status: "confirmed",
      });

      if (error) throw error;

      setQrCodeUrl(qrCodeDataUrl);
      setBookingId(newBookingId);
      setShowConfirmation(true);

      toast({
        title: "Booking Confirmed!",
        description: "Your darshan has been booked successfully",
      });
    } catch (error: any) {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = `${bookingId}-darshan-ticket.png`;
    link.click();
  };

  if (!temple) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Temple not found</h1>
          <Button onClick={() => navigate("/temples")}>View All Temples</Button>
        </div>
        <Footer />
      </div>
    );
  }

  if (showConfirmation) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <BackButton />
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-2xl bg-gradient-devotional bg-clip-text text-transparent">
                🙏 Booking Confirmed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold">{temple.name}</p>
                <p className="text-muted-foreground">{bookingDate}</p>
                <p className="text-muted-foreground">{timeSlot}</p>
              </div>

              <div className="bg-muted/30 p-6 rounded-lg text-center">
                <p className="text-sm font-medium mb-4">Booking ID: {bookingId}</p>
                {qrCodeUrl && (
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="mx-auto border-4 border-primary rounded-lg"
                  />
                )}
              </div>

              <div className="space-y-3">
                <Button onClick={downloadQR} className="w-full gap-2">
                  <Download className="h-4 w-4" />
                  Download QR Code
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/user-dashboard")}
                  className="w-full"
                >
                  View My Bookings
                </Button>
              </div>

              <div className="bg-primary/10 p-4 rounded-lg text-sm">
                <p className="font-semibold mb-2">Important Instructions:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Download and save this QR code</li>
                  <li>• Show QR code at temple entrance</li>
                  <li>• Arrive 15 minutes before your time slot</li>
                  <li>• Carry a valid ID proof</li>
                </ul>
              </div>
            </CardContent>
          </Card>
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
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl bg-gradient-devotional bg-clip-text text-transparent">
              Book Darshan at {temple.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBooking} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="temple">Temple</Label>
                <Input
                  id="temple"
                  value={temple.name}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Select Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeSlot" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Select Time Slot
                </Label>
                <Select value={timeSlot} onValueChange={setTimeSlot} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose time slot" />
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

              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Temple Timings:</strong> {temple.timings}
                </p>
              </div>

              <Button type="submit" className="w-full gap-2" disabled={loading}>
                <QrCode className="h-4 w-4" />
                {loading ? "Booking..." : "Confirm Booking"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default BookDarshan;
