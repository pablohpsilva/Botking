import { describe, it, expect, beforeEach, vi } from "vitest";
import { timeChain, SystemClock, Timer } from "../index";

describe("TimeChain Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("timeChain API", () => {
    it("should provide current system time", () => {
      const now = timeChain.now();

      expect(now).toHaveProperty("timestamp");
      expect(now).toHaveProperty("utc");
      expect(now).toHaveProperty("iso");
      expect(now).toHaveProperty("unix");

      expect(typeof now.timestamp).toBe("number");
      expect(now.utc).toBeInstanceOf(Date);
      expect(typeof now.iso).toBe("string");
      expect(typeof now.unix).toBe("number");
      expect(now.timestamp).toBeGreaterThan(1640000000000); // After 2021
    });

    it("should provide different time formats", () => {
      const timestamp = timeChain.timestamp();
      const unix = timeChain.unix();
      const iso = timeChain.iso();
      const date = timeChain.date();

      expect(typeof timestamp).toBe("number");
      expect(typeof unix).toBe("number");
      expect(typeof iso).toBe("string");
      expect(date).toBeInstanceOf(Date);

      // Unix should be timestamp in seconds
      expect(Math.abs(unix - timestamp / 1000)).toBeLessThan(1);

      // ISO should be valid ISO string
      expect(iso).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it("should measure execution time", async () => {
      const testFn = async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return "result";
      };

      const { result, duration } = await timeChain.measure(testFn);

      expect(result).toBe("result");
      expect(typeof duration).toBe("number");
      expect(duration).toBeGreaterThan(0);
    });

    it("should create timer", () => {
      const timer = timeChain.timer();

      expect(timer).toBeInstanceOf(Timer);
      expect(typeof timer.elapsed()).toBe("number");
    });

    it("should provide sleep utility", async () => {
      const start = Date.now();
      await timeChain.sleep(10);
      const elapsed = Date.now() - start;

      expect(elapsed).toBeGreaterThanOrEqual(8); // Allow some variance
    });
  });

  describe("SystemClock", () => {
    it("should be singleton", () => {
      const clock1 = SystemClock.getInstance();
      const clock2 = SystemClock.getInstance();

      expect(clock1).toBe(clock2);
    });

    it("should provide time methods", () => {
      const clock = SystemClock.getInstance();

      const now = clock.now();
      const timestamp = clock.timestamp();
      const unix = clock.unix();
      const iso = clock.iso();
      const date = clock.date();

      expect(typeof timestamp).toBe("number");
      expect(typeof unix).toBe("number");
      expect(typeof iso).toBe("string");
      expect(date).toBeInstanceOf(Date);
      expect(now).toHaveProperty("timestamp");
    });
  });

  describe("Timer", () => {
    it("should track elapsed time", () => {
      const timer = new Timer();

      // Small delay
      const start = Date.now();
      while (Date.now() - start < 5) {
        // Wait
      }

      const elapsed = timer.elapsed();
      expect(elapsed).toBeGreaterThan(0);
    });

    it("should reset", () => {
      const timer = new Timer();

      // Wait a bit
      const start = Date.now();
      while (Date.now() - start < 5) {
        // Wait
      }

      timer.reset();
      const elapsed = timer.elapsed();
      expect(elapsed).toBeLessThan(5);
    });

    it("should lap time", () => {
      const timer = new Timer();

      // Wait a bit
      const start = Date.now();
      while (Date.now() - start < 5) {
        // Wait
      }

      const lap1 = timer.lap();
      const lap2 = timer.elapsed();

      expect(lap1).toBeGreaterThan(0);
      expect(lap2).toBeLessThan(lap1); // Should be reset
    });
  });
});
