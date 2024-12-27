import { AppUtil } from "../../src/utils/app.utils";

describe("AppUtil", () => {
  describe("isValidDate", () => {
    it("should return true for valid date strings", () => {
      expect(AppUtil.isValidDate("2024-12-25")).toBe(true);
      expect(AppUtil.isValidDate("2024-01-01T00:00:00.000Z")).toBe(true);
    });

    it("should return false for invalid date strings", () => {
      expect(AppUtil.isValidDate("invalid-date")).toBe(false);
      expect(AppUtil.isValidDate("2024-13-01")).toBe(false);
    });
  });

  describe("parseDateOrDefault", () => {
    it("should return a Date object for valid date strings", () => {
      const date = AppUtil.parseDateOrDefault("2024-12-25");
      expect(date).toBeInstanceOf(Date);
      expect(date.toISOString()).toBe("2024-12-25T00:00:00.000Z");
    });

    it("should return the current date for invalid date strings", () => {
      const currentDate = new Date();
      const parsedDate = AppUtil.parseDateOrDefault("invalid-date");
      expect(parsedDate).toBeInstanceOf(Date);
      expect(parsedDate.toISOString().split("T")[0]).toBe(
        currentDate.toISOString().split("T")[0]
      );
    });

    it("should return the current date when no argument is provided", () => {
      const currentDate = new Date();
      const parsedDate = AppUtil.parseDateOrDefault();
      expect(parsedDate).toBeInstanceOf(Date);
      expect(parsedDate.toISOString().split("T")[0]).toBe(
        currentDate.toISOString().split("T")[0]
      );
    });
  });
});
