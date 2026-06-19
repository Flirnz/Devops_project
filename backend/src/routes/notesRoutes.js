import express from "express";
import * as notesController from "../controllers/notesControllers.js"
const router = express.Router();

router.get("/",notesController.getAllNotes);
router.get("/:id",notesController.getNotebyId);
router.post('/', notesController.createNote);
router.put('/:id',notesController.updateNote);
router.delete('/:id',notesController.deleteNote);

export default router