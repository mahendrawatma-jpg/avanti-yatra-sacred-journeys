// Prediction Engine for Crowd Prediction System
// Rule-based + random logic for realistic predictions

export interface PredictionResult {
  time_slot: string;
  crowd_level: "Low" | "Medium" | "High";
  score: number;
  weather: string;
  is_festival: boolean;
}

export interface TempleType {
  type: string;
  baseScore: number;
}

// Base scores by temple type
const templeBaseScores: Record<string, number> = {
  "Jyotirlinga": 60,
  "Devi Temple": 45,
  "Ganesh Temple": 40,
  "Shiva Temple": 35,
  "Local Temple": 30,
};

// Slot modifiers
const slotModifiers: Record<string, number> = {
  "Morning": 10,
  "Afternoon": 20,
  "Evening": -10,
  "Night": -5,
};

// Weather modifiers
const weatherModifiers: Record<string, number> = {
  "Clear": 0,
  "Sunny": 0,
  "Cloudy": -5,
  "Rainy": -20,
  "Hot": 5,
};

// Get a seeded random number for consistent daily results
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generate a hash from string for seeding
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Determine crowd level from score
export function getCrowdLevel(score: number): "Low" | "Medium" | "High" {
  if (score < 40) return "Low";
  if (score <= 75) return "Medium";
  return "High";
}

// Get base score for a temple type
export function getBaseScore(templeType: string): number {
  return templeBaseScores[templeType] || templeBaseScores["Local Temple"];
}

// Check if a date is a weekend
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

// Generate prediction for a single time slot
export function predictSlot(
  templeId: string,
  templeType: string,
  date: Date,
  slot: string,
  weather: string = "Clear",
  isFestival: boolean = false
): PredictionResult {
  // Base score from temple type
  let score = getBaseScore(templeType);

  // Add slot modifier
  const slotKey = slot.split(" ")[0]; // Extract "Morning", "Afternoon", etc.
  score += slotModifiers[slotKey] || 0;

  // Weekend modifier
  if (isWeekend(date)) {
    score += 20;
  }

  // Festival modifier
  if (isFestival) {
    score += 40;
  }

  // Weather modifier
  score += weatherModifiers[weather] || 0;

  // Random factor (-5 to +5) - seeded for consistency
  const seed = hashString(`${templeId}-${date.toISOString().split("T")[0]}-${slot}`);
  const randomFactor = Math.floor(seededRandom(seed) * 11) - 5;
  score += randomFactor;

  // Clamp score between 0 and 100
  score = Math.max(0, Math.min(100, score));

  return {
    time_slot: slot,
    crowd_level: getCrowdLevel(score),
    score,
    weather,
    is_festival: isFestival,
  };
}

// Generate predictions for all time slots for a given date
export function predictDay(
  templeId: string,
  templeType: string,
  date: Date,
  weather: string = "Clear",
  isFestival: boolean = false
): PredictionResult[] {
  const timeSlots = [
    "Morning (6-10 AM)",
    "Afternoon (10 AM-4 PM)",
    "Evening (4-8 PM)",
    "Night (8 PM onwards)",
  ];

  return timeSlots.map((slot) =>
    predictSlot(templeId, templeType, date, slot, weather, isFestival)
  );
}

// Generate predictions for the next 7 days
export function predictWeek(
  templeId: string,
  templeType: string,
  weather: string = "Clear"
): Array<{ date: Date; dayName: string; predictions: PredictionResult[] }> {
  const predictions = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    // Vary weather slightly across the week for realism
    const dayWeathers = ["Clear", "Clear", "Sunny", "Cloudy", "Clear", "Clear", "Sunny"];
    const dayWeather = dayWeathers[i] || weather;

    predictions.push({
      date,
      dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
      predictions: predictDay(templeId, templeType, date, dayWeather, false),
    });
  }

  return predictions;
}

// Find the best time slot (lowest crowd)
export function findBestTimeSlot(predictions: PredictionResult[]): string {
  if (predictions.length === 0) return "Early morning before 6 AM";

  // Sort by score (lower is better)
  const sorted = [...predictions].sort((a, b) => a.score - b.score);
  const best = sorted[0];

  return best.time_slot;
}

// Generate analytics data for admin dashboard
export function generateAnalyticsData(
  temples: Array<{ id: string; name: string; type?: string }>
): {
  weeklyTrend: Array<{ date: string; low: number; medium: number; high: number }>;
  crowdDistribution: Array<{ name: string; value: number; color: string }>;
  templeComparison: Array<{
    id: string;
    name: string;
    slots: Record<string, "Low" | "Medium" | "High">;
  }>;
  todayCrowd: Record<string, "Low" | "Medium" | "High">;
} {
  const today = new Date();
  
  // Weekly trend data
  const weeklyTrend = [];
  let totalLow = 0;
  let totalMedium = 0;
  let totalHigh = 0;

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Generate varied counts based on date seed
    const seed = hashString(date.toISOString().split("T")[0]);
    const randomBase = seededRandom(seed);
    
    const low = Math.floor(randomBase * 4) + (isWeekend(date) ? 1 : 3);
    const medium = Math.floor(seededRandom(seed + 1) * 5) + (isWeekend(date) ? 4 : 2);
    const high = Math.floor(seededRandom(seed + 2) * 4) + (isWeekend(date) ? 3 : 1);

    weeklyTrend.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      low,
      medium,
      high,
    });

    totalLow += low;
    totalMedium += medium;
    totalHigh += high;
  }

  // Crowd distribution pie chart data
  const crowdDistribution = [
    { name: "Low", value: totalLow, color: "#22c55e" },
    { name: "Medium", value: totalMedium, color: "#eab308" },
    { name: "High", value: totalHigh, color: "#ef4444" },
  ];

  // Temple comparison
  const timeSlots = ["Morning", "Afternoon", "Evening", "Night"];
  const templeComparison = temples.map((temple) => {
    const slots: Record<string, "Low" | "Medium" | "High"> = {};
    timeSlots.forEach((slot, index) => {
      const prediction = predictSlot(
        temple.id,
        temple.type || "Local Temple",
        today,
        slot
      );
      slots[slot] = prediction.crowd_level;
    });

    return {
      id: temple.id,
      name: temple.name,
      slots,
    };
  });

  // Today's overall crowd by slot
  const todayCrowd: Record<string, "Low" | "Medium" | "High"> = {};
  timeSlots.forEach((slot) => {
    // Aggregate across all temples and pick most common
    const levels = temples.map((temple) => 
      predictSlot(temple.id, temple.type || "Local Temple", today, slot).crowd_level
    );
    
    const counts = { Low: 0, Medium: 0, High: 0 };
    levels.forEach((l) => counts[l]++);
    
    // Pick the most common level
    todayCrowd[slot] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as "Low" | "Medium" | "High";
  });

  return {
    weeklyTrend,
    crowdDistribution,
    templeComparison,
    todayCrowd,
  };
}

// Temple type mapping for local temples data
export const templeTypeMap: Record<string, string> = {
  "mahakaleshwar": "Jyotirlinga",
  "omkareshwar": "Jyotirlinga",
  "kalbhairav": "Shiva Temple",
  "maihar": "Devi Temple",
  "salkanpur": "Devi Temple",
  "khajrana": "Ganesh Temple",
  "chintaman-ganesh": "Ganesh Temple",
  "bhojpur": "Shiva Temple",
  "jatashankar": "Shiva Temple",
  "kaal-bhairav-dhar": "Shiva Temple",
};

// Get temple type by ID
export function getTempleType(templeId: string, typeFromData?: string): string {
  return typeFromData || templeTypeMap[templeId] || "Local Temple";
}
