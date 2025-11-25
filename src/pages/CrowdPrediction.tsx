import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, Sun, CloudRain, Users } from "lucide-react";

interface CrowdData {
  time_slot: string;
  crowd_level: string;
  weather?: string;
  is_festival: boolean;
}

const CrowdPrediction = () => {
  const [selectedTemple, setSelectedTemple] = useState("mahakaleshwar");
  const [selectedDate, setSelectedDate] = useState("");
  const [todayCrowd, setTodayCrowd] = useState<CrowdData[]>([]);
  const [selectedDateCrowd, setSelectedDateCrowd] = useState<CrowdData[]>([]);
  const [weekPredictions, setWeekPredictions] = useState<any[]>([]);
  const [bestTimeSlot, setBestTimeSlot] = useState("");

  const temples = [
    { id: "mahakaleshwar", name: "Mahakaleshwar Temple" },
    { id: "omkareshwar", name: "Omkareshwar Temple" },
    { id: "kalbhairav", name: "Kal Bhairav Temple" },
    { id: "maihar", name: "Maihar Temple" },
    { id: "salkanpur", name: "Salkanpur Temple" },
    { id: "khajrana", name: "Khajrana Ganesh Temple" },
  ];

  const timeSlots = [
    "Morning (6-10 AM)",
    "Afternoon (10 AM-4 PM)",
    "Evening (4-8 PM)",
    "Night (8 PM onwards)",
  ];

  useEffect(() => {
    fetchTodayCrowd();
    fetchWeekPredictions();
  }, [selectedTemple]);

  useEffect(() => {
    if (selectedDate) {
      fetchCrowdForDate(selectedDate);
    }
  }, [selectedDate, selectedTemple]);

  const fetchTodayCrowd = async () => {
    const today = new Date().toISOString().split("T")[0];
    
    const { data, error } = await supabase
      .from("crowd_predictions")
      .select("*")
      .eq("temple_id", selectedTemple)
      .eq("prediction_date", today);

    if (data && data.length > 0) {
      setTodayCrowd(data);
      findBestTimeSlot(data);
    } else {
      // Generate default predictions if none exist
      const defaultPredictions = generateDefaultPredictions();
      setTodayCrowd(defaultPredictions);
      findBestTimeSlot(defaultPredictions);
    }
  };

  const fetchCrowdForDate = async (date: string) => {
    const { data } = await supabase
      .from("crowd_predictions")
      .select("*")
      .eq("temple_id", selectedTemple)
      .eq("prediction_date", date);

    if (data && data.length > 0) {
      setSelectedDateCrowd(data);
    } else {
      const defaultPredictions = generateDefaultPredictions();
      setSelectedDateCrowd(defaultPredictions);
    }
  };

  const fetchWeekPredictions = async () => {
    const predictions = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      
      const { data } = await supabase
        .from("crowd_predictions")
        .select("*")
        .eq("temple_id", selectedTemple)
        .eq("prediction_date", dateStr);

      predictions.push({
        date: dateStr,
        dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
        predictions: data && data.length > 0 ? data : generateDefaultPredictions(),
      });
    }
    setWeekPredictions(predictions);
  };

  const generateDefaultPredictions = (): CrowdData[] => {
    const dayOfWeek = new Date().getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    return timeSlots.map((slot) => ({
      time_slot: slot,
      crowd_level: isWeekend ? "High" : slot.includes("Morning") ? "High" : "Medium",
      weather: "Clear",
      is_festival: false,
    }));
  };

  const findBestTimeSlot = (predictions: CrowdData[]) => {
    const lowCrowd = predictions.find((p) => p.crowd_level === "Low");
    const mediumCrowd = predictions.find((p) => p.crowd_level === "Medium");
    
    if (lowCrowd) {
      setBestTimeSlot(lowCrowd.time_slot);
    } else if (mediumCrowd) {
      setBestTimeSlot(mediumCrowd.time_slot);
    } else {
      setBestTimeSlot("Early morning before 6 AM");
    }
  };

  const getCrowdColor = (level: string) => {
    switch (level) {
      case "Low":
        return "bg-green-500 text-white";
      case "Medium":
        return "bg-yellow-500 text-white";
      case "High":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getCrowdBorder = (level: string) => {
    switch (level) {
      case "Low":
        return "border-green-500 shadow-lg shadow-green-500/50";
      case "Medium":
        return "border-yellow-500";
      case "High":
        return "border-red-500";
      default:
        return "border-gray-500";
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="bg-gradient-peaceful py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Crowd Prediction
          </h1>
          <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto">
            Plan your visit with AI-powered crowd predictions
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Temple Selector */}
          <Card>
            <CardHeader>
              <CardTitle>Select Temple</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedTemple} onValueChange={setSelectedTemple}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {temples.map((temple) => (
                    <SelectItem key={temple.id} value={temple.id}>
                      {temple.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Today's Crowd */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Today's Crowd Prediction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {todayCrowd.map((slot, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      slot.time_slot === bestTimeSlot
                        ? `${getCrowdBorder("Low")} animate-pulse-slow`
                        : "border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{slot.time_slot}</span>
                      {slot.is_festival && (
                        <Badge variant="outline" className="text-xs">Festival</Badge>
                      )}
                    </div>
                    <Badge className={getCrowdColor(slot.crowd_level)}>
                      {slot.crowd_level} Crowd
                    </Badge>
                    {slot.weather && (
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        {slot.weather === "Rainy" ? (
                          <CloudRain className="h-4 w-4" />
                        ) : (
                          <Sun className="h-4 w-4" />
                        )}
                        <span>{slot.weather}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {bestTimeSlot && (
                <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                  <p className="flex items-center gap-2 font-semibold">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Best Time to Visit:
                  </p>
                  <p className="text-lg mt-1">{bestTimeSlot}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Next 7 Days */}
          <Card>
            <CardHeader>
              <CardTitle>Next 7 Days Prediction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weekPredictions.map((day, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">
                      {day.dayName} - {new Date(day.date).toLocaleDateString()}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {day.predictions.map((slot: CrowdData, slotIndex: number) => (
                        <div
                          key={slotIndex}
                          className="text-center p-2 rounded border"
                        >
                          <p className="text-xs mb-1">{slot.time_slot.split(" ")[0]}</p>
                          <Badge className={`${getCrowdColor(slot.crowd_level)} text-xs`}>
                            {slot.crowd_level}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Custom Date Prediction */}
          <Card>
            <CardHeader>
              <CardTitle>Check Specific Date</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="custom-date">Select Date</Label>
                <Input
                  id="custom-date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              {selectedDate && selectedDateCrowd.length > 0 && (
                <div className="grid md:grid-cols-2 gap-4 pt-4">
                  {selectedDateCrowd.map((slot, index) => (
                    <div key={index} className="p-4 rounded-lg border">
                      <p className="font-medium mb-2">{slot.time_slot}</p>
                      <Badge className={getCrowdColor(slot.crowd_level)}>
                        {slot.crowd_level} Crowd
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CrowdPrediction;
