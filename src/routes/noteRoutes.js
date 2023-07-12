const express = require("express");
const noteRouter = express.Router();
const {getNotes, createNote, updateNote, deleteNote} = require("../userControllers/noteControlle");
const auth = require("../middleware/auth");

noteRouter.get("/", auth, getNotes);
noteRouter.post("/", auth, createNote);
noteRouter.delete("/:id", auth, deleteNote);
noteRouter.put("/:id", auth, updateNote );

module.exports = noteRouter;
