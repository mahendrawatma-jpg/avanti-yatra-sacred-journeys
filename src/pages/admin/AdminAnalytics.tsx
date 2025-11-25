import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { generateAnalyticsData, predictDay, getTempleType } from "@/lib/predictionEngine";
import { temples as localTemples } from "@/data/temples";

const COLORS = {
  low: "#22c55e",
  medium: "#eab308",
  high: "#ef4444",
};

const timeSlots = ["Morning", "Afternoon", "Evening", "Night"];

export default function AdminAnalytics() {
  const [selectedTemple, setSelectedTemple] = useState<string>("all");

  // Convert local temples to format needed
  const temples = localTemples.map(t => ({
    id: t.id,
    name: t.name,
    type: t.type,
  }));

  // Generate analytics data using the prediction engine
  const analyticsData = useMemo(() => {
    return generateAnalyticsData(temples);
  }, []);

  // Today's predictions for selected temple or all temples
  const todayCrowdData = useMemo(() => {
    if (selectedTemple === "all") {
      return analyticsData.todayCrowd;
    }
    
    const temple = temples.find(t => t.id === selectedTemple);
    if (!temple) return analyticsData.todayCrowd;
    
    const predictions = predictDay(temple.id, temple.type, new Date());
    const result: Record<string, "Low" | "Medium" | "High"> = {};
    predictions.forEach(p => {
      const slotKey = p.time_slot.split(" ")[0];
      result[slotKey] = p.crowd_level;
    });
    return result;
  }, [selectedTemple, analyticsData]);

  // Filtered temple comparison
  const filteredTempleComparison = useMemo(() => {
    if (selectedTemple === "all") {
      return analyticsData.templeComparison;
    }
    return analyticsData.templeComparison.filter(t => t.id === selectedTemple);
  }, [selectedTemple, analyticsData]);

  const getCrowdColor = (level: string) => {
    switch (level.toLowerCase()) {
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
              const level = todayCrowdData[slot] || "Low";

              return (
                <div
                  key={slot}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 hover:scale-[1.02] ${getCrowdColor(level)}`}
                >
                  <h3 className="font-semibold">{slot}</h3>
                  <p className="text-2xl font-bold mt-1">{level}</p>
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
                <BarChart data={analyticsData.weeklyTrend}>
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
                    data={analyticsData.crowdDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {analyticsData.crowdDistribution.map((entry, index) => (
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
                  {analyticsData.templeComparison.map((temple) => (
                    <tr key={temple.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-medium">{temple.name}</td>
                      {timeSlots.map((slot) => {
                        const level = temple.slots[slot] || "Low";

                        return (
                          <td key={slot} className="text-center py-3 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getCrowdColor(level)}`}
                            >
                              {level}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
