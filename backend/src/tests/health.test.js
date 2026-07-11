import { expect, jest } from "@jest/globals";
import request from "supertest";

// Mock middleware to keep it simple
jest.unstable_mockModule("../middleware/rateLimiter.js", () => ({
  default: (req, res, next) => next()
}));

const app = (await import("../app.js")).default;

describe("Health Check API", () => {
  test("GET /api/health should return status 200 and state UP", async () => {
    const response = await request(app).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "UP" });
  });
});
