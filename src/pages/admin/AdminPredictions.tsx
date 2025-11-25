import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { format, addDays } from "date-fns";
import { Brain, CloudSun, Star } from "lucide-react";

interface Temple {
  id: string;
  name: string;
}

interface PredictionForm {
  temple_id: string;
  prediction_date: string;
  morning_level: string;
  afternoon_level: string;
  evening_level: string;
  night_level: string;
  morning_count: string;
  afternoon_count: string;
  evening_count: string;
  night_count: string;
  weather: string;
  is_festival: boolean;
}

const crowdLevels = ["low", "medium", "high"];
const weatherOptions = ["sunny", "cloudy", "rainy", "hot"];

export default function AdminPredictions() {
  const [temples, setTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const [form, setForm] = useState<PredictionForm>({
    temple_id: "",
    prediction_date: new Date().toISOString().split("T")[0],
    morning_level: "medium",
    afternoon_level: "medium",
    evening_level: "medium",
    night_level: "medium",
    morning_count: "",
    afternoon_count: "",
    evening_count: "",
    night_count: "",
    weather: "sunny",
    is_festival: false,
  });

  useEffect(() => {
    fetchTemples();
  }, []);

  const fetchTemples = async () => {
    const { data } = await supabase.from("temples").select("id, name").order("name");
    if (data) setTemples(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const slots = [
      { time_slot: "morning", level: form.morning_level, count: form.morning_count },
      { time_slot: "afternoon", level: form.afternoon_level, count: form.afternoon_count },
      { time_slot: "evening", level: form.evening_level, count: form.evening_count },
      { time_slot: "night", level: form.night_level, count: form.night_count },
    ];

    try {
      for (const slot of slots) {
        const { error } = await supabase
          .from("crowd_predictions")
          .upsert(
            {
              temple_id: form.temple_id,
              prediction_date: form.prediction_date,
              time_slot: slot.time_slot,
              crowd_level: slot.level,
              manual_count: slot.count ? parseInt(slot.count) : null,
              weather: form.weather,
              is_festival: form.is_festival,
            },
            {
              onConflict: "temple_id,prediction_date,time_slot",
            }
          );

        if (error) throw error;
      }

      toast({ title: "Predictions saved successfully" });
    } catch (error: any) {
      toast({ title: "Error saving predictions", description: error.message, variant: "destructive" });
    }

    setSubmitting(false);
  };

  // Generate next 7 days predictions display
  const next7Days = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  const getCrowdColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-100 text-green-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "high":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

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
        <h1 className="text-3xl font-bold text-foreground">Crowd Predictions</h1>
        <p className="text-muted-foreground">Enter and manage crowd prediction data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Manual Data Entry Form */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Enter Crowd Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Temple *</Label>
                  <Select
                    value={form.temple_id}
                    onValueChange={(v) => setForm({ ...form, temple_id: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select temple" />
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
                  <Label>Date *</Label>
                  <Input
                    type="date"
                    value={form.prediction_date}
                    onChange={(e) => setForm({ ...form, prediction_date: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Morning */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded-lg">
                <div className="space-y-2">
                  <Label>Morning Level</Label>
                  <Select
                    value={form.morning_level}
                    onValueChange={(v) => setForm({ ...form, morning_level: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {crowdLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Morning Count</Label>
                  <Input
                    type="number"
                    value={form.morning_count}
                    onChange={(e) => setForm({ ...form, morning_count: e.target.value })}
                    placeholder="Optional"
                  />
                </div>
              </div>

              {/* Afternoon */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded-lg">
                <div className="space-y-2">
                  <Label>Afternoon Level</Label>
                  <Select
                    value={form.afternoon_level}
                    onValueChange={(v) => setForm({ ...form, afternoon_level: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {crowdLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Afternoon Count</Label>
                  <Input
                    type="number"
                    value={form.afternoon_count}
                    onChange={(e) => setForm({ ...form, afternoon_count: e.target.value })}
                    placeholder="Optional"
                  />
                </div>
              </div>

              {/* Evening */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded-lg">
                <div className="space-y-2">
                  <Label>Evening Level</Label>
                  <Select
                    value={form.evening_level}
                    onValueChange={(v) => setForm({ ...form, evening_level: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {crowdLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Evening Count</Label>
                  <Input
                    type="number"
                    value={form.evening_count}
                    onChange={(e) => setForm({ ...form, evening_count: e.target.value })}
                    placeholder="Optional"
                  />
                </div>
              </div>

              {/* Night */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded-lg">
                <div className="space-y-2">
                  <Label>Night Level</Label>
                  <Select
                    value={form.night_level}
                    onValueChange={(v) => setForm({ ...form, night_level: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {crowdLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Night Count</Label>
                  <Input
                    type="number"
                    value={form.night_count}
                    onChange={(e) => setForm({ ...form, night_count: e.target.value })}
                    placeholder="Optional"
                  />
                </div>
              </div>

              {/* Weather & Festival */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <CloudSun className="h-4 w-4" />
                    Weather
                  </Label>
                  <Select
                    value={form.weather}
                    onValueChange={(v) => setForm({ ...form, weather: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {weatherOptions.map((w) => (
                        <SelectItem key={w} value={w}>
                          {w.charAt(0).toUpperCase() + w.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Festival Day
                  </Label>
                  <div className="flex items-center gap-2 h-10">
                    <Checkbox
                      checked={form.is_festival}
                      onCheckedChange={(checked) =>
                        setForm({ ...form, is_festival: checked as boolean })
                      }
                    />
                    <span className="text-sm">Is this a festival day?</span>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={submitting || !form.temple_id}>
                {submitting ? "Saving..." : "Save Predictions"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Prediction Model Info */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Prediction Model Factors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold mb-2">Input Factors</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Day of Week (Weekend/Weekday)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Month & Season
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Festival Indicator
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Weather Conditions
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Historical Crowd Data
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Temple Base Crowd Level
                </li>
              </ul>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold mb-2">Output Levels</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">Low</span>
                  <span className="text-sm text-muted-foreground">Less than 500 visitors</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">Medium</span>
                  <span className="text-sm text-muted-foreground">500 - 1500 visitors</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-700">High</span>
                  <span className="text-sm text-muted-foreground">More than 1500 visitors</span>
                </div>
              </div>
            </div>

            <div className="p-4 border border-primary/20 rounded-lg bg-primary/5">
              <h3 className="font-semibold mb-2 text-primary">Admin Override</h3>
              <p className="text-sm text-muted-foreground">
                You can manually override predictions by entering crowd data using the form.
                Manual entries take precedence over automated predictions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next 7 Days Preview */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Next 7 Days Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {next7Days.map((date, index) => (
              <div
                key={index}
                className="p-3 rounded-lg border border-border text-center"
              >
                <p className="text-sm font-medium">{format(date, "EEE")}</p>
                <p className="text-xs text-muted-foreground">{format(date, "MMM d")}</p>
                <div className="mt-2 space-y-1">
                  <div className={`px-2 py-0.5 rounded text-xs ${getCrowdColor("medium")}`}>M</div>
                  <div className={`px-2 py-0.5 rounded text-xs ${getCrowdColor("medium")}`}>A</div>
                  <div className={`px-2 py-0.5 rounded text-xs ${getCrowdColor("low")}`}>E</div>
                  <div className={`px-2 py-0.5 rounded text-xs ${getCrowdColor("low")}`}>N</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
