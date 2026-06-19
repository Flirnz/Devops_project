import { jest } from "@jest/globals";
import request from "supertest";

// 1. Mock the modules
jest.unstable_mockModule("../middleware/rateLimiter.js", () => ({
  default: (req, res, next) => next()
}));

jest.unstable_mockModule("../models/Note.js", () => {
  const mockNote = {
    find: jest.fn().mockReturnThis(),
    sort: jest.fn()
  };
  return {
    default: mockNote
  };
});

// 2. Import modules AFTER mocking
const { default: app } = await import("../app.js");
const { default: Note } = await import("../models/Note.js");

describe("GET /api/notes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Harus sukses mengembalikan kode 200", async () => {
    const mockNotes = [
      { _id: "1", title: "Belajar DevOps", content: "Metode active friction sangat asyik!" }
    ];

    // Mock Note.find().sort()
    Note.find().sort.mockResolvedValue(mockNotes);

    const response = await request(app).get("/api/notes");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockNotes);
  });
});