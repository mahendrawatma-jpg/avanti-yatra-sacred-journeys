import { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Calendar, TrendingUp, Sun, CloudRain, Users, Sparkles } from "lucide-react";
import { 
  predictDay, 
  predictWeek, 
  findBestTimeSlot, 
  PredictionResult,
  getTempleType 
} from "@/lib/predictionEngine";

const CrowdPrediction = () => {
  const [selectedTemple, setSelectedTemple] = useState("mahakaleshwar");
  const [selectedDate, setSelectedDate] = useState("");
  const [weather, setWeather] = useState("Clear");
  const [isFestival, setIsFestival] = useState(false);

  const temples = [
    { id: "mahakaleshwar", name: "Mahakaleshwar Temple", type: "Jyotirlinga" },
    { id: "omkareshwar", name: "Omkareshwar Temple", type: "Jyotirlinga" },
    { id: "kalbhairav", name: "Kal Bhairav Temple", type: "Shiva Temple" },
    { id: "maihar", name: "Maihar Temple", type: "Devi Temple" },
    { id: "salkanpur", name: "Salkanpur Temple", type: "Devi Temple" },
    { id: "khajrana", name: "Khajrana Ganesh Temple", type: "Ganesh Temple" },
  ];

  // Get current temple type
  const currentTemple = temples.find(t => t.id === selectedTemple);
  const templeType = currentTemple?.type || getTempleType(selectedTemple);

  // Today's predictions - recalculates when temple/weather/festival changes
  const todayCrowd = useMemo(() => {
    return predictDay(selectedTemple, templeType, new Date(), weather, isFestival);
  }, [selectedTemple, templeType, weather, isFestival]);

  // Best time to visit
  const bestTimeSlot = useMemo(() => {
    return findBestTimeSlot(todayCrowd);
  }, [todayCrowd]);

  // Week predictions
  const weekPredictions = useMemo(() => {
    return predictWeek(selectedTemple, templeType, weather);
  }, [selectedTemple, templeType, weather]);

  // Custom date predictions
  const selectedDateCrowd = useMemo(() => {
    if (!selectedDate) return [];
    const date = new Date(selectedDate);
    return predictDay(selectedTemple, templeType, date, weather, isFestival);
  }, [selectedDate, selectedTemple, templeType, weather, isFestival]);

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
        return "border-green-500 shadow-lg shadow-green-500/30";
      case "Medium":
        return "border-yellow-500 shadow-lg shadow-yellow-500/30";
      case "High":
        return "border-red-500 shadow-lg shadow-red-500/30";
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
          {/* Temple Selector & Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Prediction Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Select Temple</Label>
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
                </div>
                <div className="space-y-2">
                  <Label>Weather Condition</Label>
                  <Select value={weather} onValueChange={setWeather}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Clear">Clear</SelectItem>
                      <SelectItem value="Sunny">Sunny</SelectItem>
                      <SelectItem value="Cloudy">Cloudy</SelectItem>
                      <SelectItem value="Rainy">Rainy</SelectItem>
                      <SelectItem value="Hot">Hot</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span className="font-medium">Festival Day</span>
                </div>
                <Switch checked={isFestival} onCheckedChange={setIsFestival} />
              </div>
              {isFestival && (
                <p className="text-sm text-muted-foreground bg-primary/10 p-3 rounded-lg">
                  Festival mode enabled: Expect +40 to crowd levels due to festival rush.
                </p>
              )}
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
                    className={`p-4 rounded-lg border-2 transition-all duration-300 hover:scale-[1.02] ${
                      slot.time_slot === bestTimeSlot
                        ? `${getCrowdBorder("Low")} bg-green-500/5`
                        : "border-border hover:border-muted-foreground/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{slot.time_slot}</span>
                      {slot.time_slot === bestTimeSlot && (
                        <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 border-green-500">
                          Recommended
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge className={getCrowdColor(slot.crowd_level)}>
                        {slot.crowd_level} Crowd
                      </Badge>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {slot.weather === "Rainy" || slot.weather === "Cloudy" ? (
                          <CloudRain className="h-4 w-4" />
                        ) : (
                          <Sun className="h-4 w-4" />
                        )}
                        <span>{slot.weather}</span>
                      </div>
                    </div>
                    {slot.is_festival && (
                      <Badge variant="outline" className="text-xs mt-2">Festival Day</Badge>
                    )}
                  </div>
                ))}
              </div>

              {bestTimeSlot && (
                <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
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
                  <div 
                    key={index} 
                    className="border rounded-lg p-4 transition-all duration-200 hover:shadow-md hover:border-primary/30"
                  >
                    <h3 className="font-semibold mb-3">
                      {day.dayName} - {day.date.toLocaleDateString()}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {day.predictions.map((slot: PredictionResult, slotIndex: number) => (
                        <div
                          key={slotIndex}
                          className="text-center p-2 rounded border transition-all duration-200 hover:bg-muted/30"
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
                  {selectedDateCrowd.map((slot, index) => {
                    const isBest = findBestTimeSlot(selectedDateCrowd) === slot.time_slot;
                    return (
                      <div 
                        key={index} 
                        className={`p-4 rounded-lg border transition-all duration-200 hover:scale-[1.02] ${
                          isBest ? getCrowdBorder("Low") + " bg-green-500/5" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">{slot.time_slot}</p>
                          {isBest && (
                            <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 border-green-500">
                              Best
                            </Badge>
                          )}
                        </div>
                        <Badge className={getCrowdColor(slot.crowd_level)}>
                          {slot.crowd_level} Crowd
                        </Badge>
                      </div>
                    );
                  })}
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
