import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("merges basic classes", () => {
    expect(cn("p-2", "text-sm")).toBe("p-2 text-sm");
  });

  it("deduplicates and resolves conflicting tailwind classes", () => {
    expect(cn("p-2", "p-4", "text-sm", "text-lg")).toBe("p-4 text-lg");
  });

  it("supports conditional and falsey values via clsx", () => {
    const isActive = true;
    expect(cn("base", isActive && "active", false && "hidden", undefined, null, "end")).toBe("base active end");
  });
});
