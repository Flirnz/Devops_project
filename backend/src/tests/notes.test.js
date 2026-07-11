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
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    prototype: {
      save: jest.fn()
    }
  };
  // Mock constructor behavior for "new Note()"
  const mockConstructor = jest.fn().mockImplementation(() => {
    return {
      save: mockNote.prototype.save
    };
  });
  // Assign static methods to constructor
  Object.assign(mockConstructor, mockNote);
  return {
    default: mockConstructor
  };
});

// 2. Import modules AFTER mocking
const { default: app } = await import("../app.js");
const { default: Note } = await import("../models/Note.js");

describe("Notes API Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/notes", () => {
    test("should successfully return status code 200 and all notes", async () => {
      const mockNotes = [
        { _id: "1", title: "Learning DevOps", content: "Active recall method is awesome!" }
      ];
      Note.find().sort.mockResolvedValue(mockNotes);

      const response = await request(app).get("/api/notes");
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockNotes);
    });

    test("should return 500 when database query fails", async () => {
      Note.find().sort.mockRejectedValue(new Error("Database connection lost"));

      const response = await request(app).get("/api/notes");
      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({ message: "Internal server Error" });
    });
  });

  describe("GET /api/notes/:id", () => {
    test("should successfully return status code 200 and the note object", async () => {
      const mockNote = { _id: "1", title: "Learning DevOps", content: "Active recall method is awesome!" };
      Note.findById.mockResolvedValue(mockNote);

      const response = await request(app).get("/api/notes/1");
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockNote);
    });

    test("should return 404 if the note is not found", async () => {
      Note.findById.mockResolvedValue(null);

      const response = await request(app).get("/api/notes/999");
      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual({ message: "Note not found" });
    });

    test("should return 500 if database query fails", async () => {
      Note.findById.mockRejectedValue(new Error("Database error"));

      const response = await request(app).get("/api/notes/1");
      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({ message: "Internal server Error" });
    });
  });

  describe("POST /api/notes", () => {
    test("should successfully create a new note and return 201", async () => {
      const mockSavedNote = { _id: "1", title: "New Note", content: "Some content" };
      Note.prototype.save.mockResolvedValue(mockSavedNote);

      const response = await request(app)
        .post("/api/notes")
        .send({ title: "New Note", content: "Some content" });

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual(mockSavedNote);
    });

    test("should return 500 if save operation fails", async () => {
      Note.prototype.save.mockRejectedValue(new Error("Save failed"));

      const response = await request(app)
        .post("/api/notes")
        .send({ title: "New Note", content: "Some content" });

      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({ message: "Internal server Error" });
    });
  });

  describe("PUT /api/notes/:id", () => {
    test("should successfully update a note and return 200", async () => {
      const mockUpdatedNote = { _id: "1", title: "Updated Note", content: "Updated content" };
      Note.findByIdAndUpdate.mockResolvedValue(mockUpdatedNote);

      const response = await request(app)
        .put("/api/notes/1")
        .send({ title: "Updated Note", content: "Updated content" });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ message: "note updated successfully" });
    });

    test("should return 404 if the note to update does not exist", async () => {
      Note.findByIdAndUpdate.mockResolvedValue(null);

      const response = await request(app)
        .put("/api/notes/999")
        .send({ title: "Updated Note", content: "Updated content" });

      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual({ message: "Note not found" });
    });

    test("should return 500 if update fails", async () => {
      Note.findByIdAndUpdate.mockRejectedValue(new Error("Update failed"));

      const response = await request(app)
        .put("/api/notes/1")
        .send({ title: "Updated Note", content: "Updated content" });

      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({ message: "Internal server Error" });
    });
  });

  describe("DELETE /api/notes/:id", () => {
    test("should successfully delete a note and return 200", async () => {
      const mockDeletedNote = { _id: "1", title: "Note to delete", content: "Content" };
      Note.findByIdAndDelete.mockResolvedValue(mockDeletedNote);

      const response = await request(app).delete("/api/notes/1");
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ message: "note deleted successfully" });
    });

    test("should return 404 if the note to delete does not exist", async () => {
      Note.findByIdAndDelete.mockResolvedValue(null);

      const response = await request(app).delete("/api/notes/999");
      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual({ message: "Note not found" });
    });

    test("should return 500 if delete operation fails", async () => {
      Note.findByIdAndDelete.mockRejectedValue(new Error("Delete failed"));

      const response = await request(app).delete("/api/notes/1");
      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({ message: "Internal server Error" });
    });
  });
});
