const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
// app is running at http://localhost:4000

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/journal";
// mongoDB names the database "journal"

const NoteSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
});

const Note = mongoose.model("Note", NoteSchema);
// mongoDB names the table/collection as "notes"

// ** ----- REST API endpoints ----- **

// CREATE
app.post("/notes", async (request, response) => {
  // Validate request body
  if (request.body.title === "" && request.body.content === "") {
    return response
      .status(400)
      .json({ error: "Note must  have a title or content" });
  }

  const note = await Note.create(request.body);
  response.status(201).json(note);
});

// GET
app.get("/notes", async (request, response) => {
  const notes = await Note.find().sort({ createdAt: -1 });
  response.json(notes);
});

// DELETE
app.delete("/notes/:id", async (request, response) => {
  const deleted = await Note.findByIdAndDelete(request.params.id);

  if (!deleted) return response.sendStatus(404);

  response.sendStatus(204);
});

// connect DB then start server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB database: ", error);
    process.exit(1);
  });
