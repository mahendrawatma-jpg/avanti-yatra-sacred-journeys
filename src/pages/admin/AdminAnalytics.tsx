import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { format, subDays, addDays } from "date-fns";

interface CrowdData {
  prediction_date: string;
  time_slot: string;
  crowd_level: string;
  temple_id: string;
  manual_count: number | null;
}

interface Temple {
  id: string;
  name: string;
}

const COLORS = {
  low: "#22c55e",
  medium: "#eab308",
  high: "#ef4444",
};

const timeSlots = ["Morning", "Afternoon", "Evening", "Night"];

export default function AdminAnalytics() {
  const [crowdData, setCrowdData] = useState<CrowdData[]>([]);
  const [temples, setTemples] = useState<Temple[]>([]);
  const [selectedTemple, setSelectedTemple] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const today = new Date();
    const weekAgo = subDays(today, 7);

    const [crowdRes, templesRes] = await Promise.all([
      supabase
        .from("crowd_predictions")
        .select("*")
        .gte("prediction_date", weekAgo.toISOString().split("T")[0])
        .order("prediction_date"),
      supabase.from("temples").select("id, name").order("name"),
    ]);

    if (crowdRes.data) setCrowdData(crowdRes.data);
    if (templesRes.data) setTemples(templesRes.data);
    setLoading(false);
  };

  const getTempleName = (templeId: string) => {
    const temple = temples.find((t) => t.id === templeId);
    return temple?.name || templeId;
  };

  const filteredData =
    selectedTemple === "all"
      ? crowdData
      : crowdData.filter((d) => d.temple_id === selectedTemple);

  // Today's crowd data
  const today = new Date().toISOString().split("T")[0];
  const todayCrowd = filteredData.filter((d) => d.prediction_date === today);

  // Prepare chart data - daily crowd levels
  const dailyChartData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dateStr = date.toISOString().split("T")[0];
    const dayData = filteredData.filter((d) => d.prediction_date === dateStr);
    
    const highCount = dayData.filter((d) => d.crowd_level === "high").length;
    const mediumCount = dayData.filter((d) => d.crowd_level === "medium").length;
    const lowCount = dayData.filter((d) => d.crowd_level === "low").length;

    return {
      date: format(date, "MMM d"),
      high: highCount,
      medium: mediumCount,
      low: lowCount,
      total: highCount + mediumCount + lowCount,
    };
  });

  // Pie chart data - overall distribution
  const crowdDistribution = [
    { name: "Low", value: filteredData.filter((d) => d.crowd_level === "low").length, color: COLORS.low },
    { name: "Medium", value: filteredData.filter((d) => d.crowd_level === "medium").length, color: COLORS.medium },
    { name: "High", value: filteredData.filter((d) => d.crowd_level === "high").length, color: COLORS.high },
  ];

  const getCrowdColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-100 text-green-700 border-green-300";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "high":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Crowd Analytics</h1>
          <p className="text-muted-foreground">View crowd trends and predictions</p>
        </div>
        <Select value={selectedTemple} onValueChange={setSelectedTemple}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Filter by temple" />
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

      {/* Today's Crowd Status */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Today's Crowd Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {timeSlots.map((slot) => {
              const slotData = todayCrowd.find((d) => d.time_slot.toLowerCase() === slot.toLowerCase());
              const level = slotData?.crowd_level || "low";
              const count = slotData?.manual_count;

              return (
                <div
                  key={slot}
                  className={`p-4 rounded-lg border-2 ${getCrowdColor(level)}`}
                >
                  <h3 className="font-semibold">{slot}</h3>
                  <p className="text-2xl font-bold capitalize mt-1">{level}</p>
                  {count && <p className="text-sm mt-1">Count: {count}</p>}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Trend Chart */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Weekly Crowd Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="low" stackId="a" fill={COLORS.low} name="Low" />
                  <Bar dataKey="medium" stackId="a" fill={COLORS.medium} name="Medium" />
                  <Bar dataKey="high" stackId="a" fill={COLORS.high} name="High" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Crowd Distribution Pie Chart */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Crowd Distribution (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={crowdDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {crowdDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Temple-wise Comparison */}
      {selectedTemple === "all" && temples.length > 0 && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Temple Comparison (Today)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Temple</th>
                    {timeSlots.map((slot) => (
                      <th key={slot} className="text-center py-3 px-4">
                        {slot}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {temples.map((temple) => {
                    const templeData = crowdData.filter(
                      (d) => d.temple_id === temple.id && d.prediction_date === today
                    );

                    return (
                      <tr key={temple.id} className="border-b">
                        <td className="py-3 px-4 font-medium">{temple.name}</td>
                        {timeSlots.map((slot) => {
                          const slotData = templeData.find(
                            (d) => d.time_slot.toLowerCase() === slot.toLowerCase()
                          );
                          const level = slotData?.crowd_level || "low";

                          return (
                            <td key={slot} className="text-center py-3 px-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getCrowdColor(level)}`}
                              >
                                {level.charAt(0).toUpperCase() + level.slice(1)}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
