import { describe, it, expect } from "vitest";
import { formatReleaseYear, formatRating } from "./format";

describe("format utils", () => {
  describe("formatReleaseYear", () => {
    it("should extract year from valid date string", () => {
      expect(formatReleaseYear("2023-12-25")).toBe(2023);
      expect(formatReleaseYear("2020-01-01")).toBe(2020);
    });

    it("should return null for invalid date", () => {
      expect(formatReleaseYear("")).toBe(null);
      expect(formatReleaseYear("invalid-date")).toBe(null);
    });

    it("should handle null or undefined", () => {
      expect(formatReleaseYear(null)).toBe(null);
    });
  });

  describe("formatRating", () => {
    it("should format rating to one decimal place", () => {
      expect(formatRating(8.567)).toBe("8.6");
      expect(formatRating(7.234)).toBe("7.2");
      expect(formatRating(10)).toBe("10.0");
    });

    it("should handle zero rating", () => {
      expect(formatRating(0)).toBe("0.0");
    });

    it("should handle single digit ratings", () => {
      expect(formatRating(5)).toBe("5.0");
      expect(formatRating(9.9)).toBe("9.9");
    });
  });
});
