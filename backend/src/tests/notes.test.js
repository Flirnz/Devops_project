import { expect, jest } from "@jest/globals";
import request from "supertest";

// 1. Mock the modules
jest.unstable_mockModule("../middleware/rateLimiter.js", () => ({
  default: (req, res, next) => next()
}));

jest.unstable_mockModule("../models/Note.js", () => {
  const mockNote = {
    find: jest.fn().mockReturnThis(),
    sort: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn()
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

  test("should successfully return status code 200 and all notes", async () => {
    const mockNotes = [
      { _id: "1", title: "Learning DevOps", content: "Active recall method is awesome!" }
    ];

    // Mock Note.find().sort() to resolve with mock data
    Note.find().sort.mockResolvedValue(mockNotes);

    const response = await request(app).get("/api/notes");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockNotes);
  });
});
describe("GET /api/notes/:id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("should successfully return status code 200 and a message:Note found", async () => {
    const mockNote = 
      { _id: "1", title: "Learning DevOps", content: "Active recall method is awesome!" };
    Note.findById.mockResolvedValue(mockNote);

    const response = await request(app).get("/api/notes/1");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockNote);

  });
});
describe("DELETE /api/notes/:id", () => {
  const mockNote = [
      { _id: "1", title: "Learning DevOps", content: "Active recall method is awesome!" }
    ];
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("should successfully return status code 200 and a message:Note deleted successfully", async () => {
    Note.findByIdAndDelete.mockResolvedValue(mockNote);

    const response = await request(app).delete("/api/notes/1");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "note deleted successfully" });
  });
});

