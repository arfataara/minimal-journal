const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
// app is running at http://localhost:4000

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
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
  try {
  // Validate request body
  if (request.body.title === "" && request.body.content === "") {
    return response
      .status(400)
      .json({ error: "Note must  have a title or content" });
  }

  const note = await Note.create(request.body);
  response.status(201).json(note);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// UPDATE
app.put("/notes/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (req.body.title === "" && req.body.content === "") {
      return res
        .status(400)
        .json({ error: "Note must have a title or content" });
    }

    const updatedNote = await Note.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedNote) return res.status(404).json({ error: "Note not found" });

    return res.status(200).json(updatedNote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET
app.get("/notes", async (request, response) => {
  try {
  const notes = await Note.find().sort({ createdAt: -1 });
  response.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
app.delete("/notes/:id", async (request, response) => {
  try {
  const deleted = await Note.findByIdAndDelete(request.params.id);

  if (!deleted) return response.sendStatus(404);

  response.sendStatus(204);
  } catch (err) {
    response.status(500).json({ error: err.message });
  }
});

// connect DB then start server
mongoose
  .connect(MONGO_URI, { dbName: "journal" })
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB database: ", error);
    process.exit(1);
  });
