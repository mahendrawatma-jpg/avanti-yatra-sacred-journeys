import { describe, expect, it } from "vitest";
import {
  findBestTimeSlot,
  generateAnalyticsData,
  getBaseScore,
  getCrowdLevel,
  getTempleType,
  isWeekend,
  predictDay,
  predictSlot,
  predictWeek,
  templeTypeMap,
  type PredictionResult,
} from "./predictionEngine";

describe("predictionEngine", () => {
  describe("getCrowdLevel", () => {
    it("returns Low below 40", () => {
      expect(getCrowdLevel(0)).toBe("Low");
      expect(getCrowdLevel(39.99)).toBe("Low");
    });

    it("returns Medium for 40 through 75", () => {
      expect(getCrowdLevel(40)).toBe("Medium");
      expect(getCrowdLevel(75)).toBe("Medium");
    });

    it("returns High above 75", () => {
      expect(getCrowdLevel(75.01)).toBe("High");
      expect(getCrowdLevel(100)).toBe("High");
    });
  });

  describe("getBaseScore", () => {
    it("returns configured score for known temple type", () => {
      expect(getBaseScore("Jyotirlinga")).toBe(60);
      expect(getBaseScore("Devi Temple")).toBe(45);
    });

    it("falls back to Local Temple for unknown type", () => {
      expect(getBaseScore("Unknown Type")).toBe(30);
    });
  });

  describe("isWeekend", () => {
    it("returns true for Saturday and Sunday, false otherwise", () => {
      expect(isWeekend(new Date("2026-04-04T00:00:00.000Z"))).toBe(true); // Sat
      expect(isWeekend(new Date("2026-04-05T00:00:00.000Z"))).toBe(true); // Sun
      expect(isWeekend(new Date("2026-04-06T00:00:00.000Z"))).toBe(false); // Mon
    });
  });

  describe("predictSlot", () => {
    it("is deterministic for same inputs", () => {
      const date = new Date("2026-04-06T00:00:00.000Z");
      const one = predictSlot("mahakaleshwar", "Jyotirlinga", date, "Morning (6-10 AM)", "Clear", false);
      const two = predictSlot("mahakaleshwar", "Jyotirlinga", date, "Morning (6-10 AM)", "Clear", false);
      expect(one).toEqual(two);
    });

    it("returns score clamped between 0 and 100", () => {
      const high = predictSlot("id-1", "Jyotirlinga", new Date("2026-04-05T00:00:00.000Z"), "Morning", "Hot", true);
      const low = predictSlot("id-2", "Local Temple", new Date("2026-04-06T00:00:00.000Z"), "Evening", "Rainy", false);
      expect(high.score).toBeGreaterThanOrEqual(0);
      expect(high.score).toBeLessThanOrEqual(100);
      expect(low.score).toBeGreaterThanOrEqual(0);
      expect(low.score).toBeLessThanOrEqual(100);
    });

    it("respects weekend and festival modifiers directionally", () => {
      const weekday = predictSlot("id-3", "Shiva Temple", new Date("2026-04-06T00:00:00.000Z"), "Afternoon", "Clear", false);
      const weekend = predictSlot("id-3", "Shiva Temple", new Date("2026-04-05T00:00:00.000Z"), "Afternoon", "Clear", false);
      const festival = predictSlot("id-3", "Shiva Temple", new Date("2026-04-06T00:00:00.000Z"), "Afternoon", "Clear", true);
      expect(weekend.score).toBeGreaterThan(weekday.score);
      expect(festival.score).toBeGreaterThan(weekday.score);
    });

    it("handles unknown slot/weather by applying no modifier", () => {
      const withUnknowns = predictSlot("id-4", "Local Temple", new Date("2026-04-06T00:00:00.000Z"), "RandomSlot", "Stormy", false);
      expect(withUnknowns.time_slot).toBe("RandomSlot");
      expect(withUnknowns.weather).toBe("Stormy");
      expect(["Low", "Medium", "High"]).toContain(withUnknowns.crowd_level);
    });
  });

  describe("predictDay", () => {
    it("returns predictions for all 4 expected slots", () => {
      const result = predictDay("mahakaleshwar", "Jyotirlinga", new Date("2026-04-06T00:00:00.000Z"));
      expect(result).toHaveLength(4);
      expect(result.map((r) => r.time_slot)).toEqual([
        "Morning (6-10 AM)",
        "Afternoon (10 AM-4 PM)",
        "Evening (4-8 PM)",
        "Night (8 PM onwards)",
      ]);
    });
  });

  describe("predictWeek", () => {
    it("returns 7 days with day names and day predictions", () => {
      const week = predictWeek("mahakaleshwar", "Jyotirlinga", "Clear");
      expect(week).toHaveLength(7);
      week.forEach((d) => {
        expect(d.predictions).toHaveLength(4);
        expect(typeof d.dayName).toBe("string");
      });
    });
  });

  describe("findBestTimeSlot", () => {
    it("returns fallback for empty predictions", () => {
      expect(findBestTimeSlot([])).toBe("Early morning before 6 AM");
    });

    it("returns slot with lowest score", () => {
      const predictions: PredictionResult[] = [
        { time_slot: "A", crowd_level: "High", score: 90, weather: "Clear", is_festival: false },
        { time_slot: "B", crowd_level: "Medium", score: 55, weather: "Clear", is_festival: false },
        { time_slot: "C", crowd_level: "Low", score: 20, weather: "Clear", is_festival: false },
      ];
      expect(findBestTimeSlot(predictions)).toBe("C");
    });
  });

  describe("generateAnalyticsData", () => {
    const temples = [
      { id: "mahakaleshwar", name: "Mahakaleshwar", type: "Jyotirlinga" },
      { id: "khajrana", name: "Khajrana", type: "Ganesh Temple" },
    ];

    it("returns complete analytics structure", () => {
      const data = generateAnalyticsData(temples);
      expect(data.weeklyTrend).toHaveLength(7);
      expect(data.crowdDistribution).toHaveLength(3);
      expect(data.templeComparison).toHaveLength(2);
      expect(Object.keys(data.todayCrowd)).toEqual(["Morning", "Afternoon", "Evening", "Night"]);
    });

    it("keeps crowd distribution totals in sync with weekly trend", () => {
      const data = generateAnalyticsData(temples);
      const weeklyTotals = data.weeklyTrend.reduce(
        (acc, d) => {
          acc.low += d.low;
          acc.medium += d.medium;
          acc.high += d.high;
          return acc;
        },
        { low: 0, medium: 0, high: 0 }
      );

      const byName = Object.fromEntries(data.crowdDistribution.map((d) => [d.name, d.value]));
      expect(byName.Low).toBe(weeklyTotals.low);
      expect(byName.Medium).toBe(weeklyTotals.medium);
      expect(byName.High).toBe(weeklyTotals.high);
    });
  });

  describe("getTempleType / templeTypeMap", () => {
    it("returns explicit typeFromData when present", () => {
      expect(getTempleType("anything", "Custom Temple")).toBe("Custom Temple");
    });

    it("uses map fallback and then Local Temple fallback", () => {
      expect(templeTypeMap["mahakaleshwar"]).toBe("Jyotirlinga");
      expect(getTempleType("mahakaleshwar")).toBe("Jyotirlinga");
      expect(getTempleType("unknown-temple")).toBe("Local Temple");
    });
  });
});
