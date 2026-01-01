import { useEffect, useState } from "react";
import { fetchNotes, createNote, deleteNote, updateNote } from "../api";

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editNoteId, setEditNoteId] = useState(undefined);

    useEffect(() => {
        const getNotes = async () => {
            setLoading(true);
            try {
                const data = await fetchNotes();
                setNotes(data);
            } catch (error) {
                console.log("Error fetching notes: ", error);
            } finally {
                setLoading(false);
            }
        };
        getNotes();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        if(!title.trim() && !content.trim()) return;

        const payload = { 
            title: title.trim(), 
            content: content.trim() 
        };

        setSaving(true);

        try {
        const created = await createNote(payload);

        console.log("POST response: ", created);

        console.log("notes  before: ", notes);
        setNotes((prev) => [created, ...prev]);
        console.log("notes  after: ", notes);

        setTitle("");
        setContent("");
        } catch (error) {
        console.error("Error adding new note: ", error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        // Optimistic UI : remove locally first, then call API
        const prev = notes;
        setNotes((prevNotes) => prevNotes.filter( (n) => n._id !== id));

        try {
           await deleteNote(id);
        } catch (error) {
            console.error("Delete failed, reverting UI: ", error);
            setNotes(prev); // revert on failure
        }
    };

    const handleEdit = async (note) => {
        try{
            if(title !== "" || content !== ""){
                alert("Save or clear unsaved note first.")
                return;
            }
            
            const existingNote = notes.find((n) => n._id === note._id);
            if(!existingNote){
                throw new Error("Could not find note");
            }
            setTitle(existingNote.title);
            setContent(existingNote.content);
            setEditNoteId(existingNote._id);
        } catch (err) {
            console.error(err);
        }
    }

    const handleSaveEdit = async (e) => {
        // Prevent the form from causing a page reload
        e.preventDefault();
        if(!title.trim() && !content.trim()) return;

        const noteToEdit = notes.find((n) => n._id === editNoteId);
        if (!noteToEdit) return;

        const updatedNoteData = {
            ...noteToEdit,
            title: title.trim(),
            content: content.trim(),
        };

        setSaving(true);
        const prev = notes;

        try {
            // Optimistic update
            const filteredNotes = notes.filter((n) => n._id !== noteToEdit._id);
            setNotes((prevNotes) => [updatedNoteData, ...filteredNotes]);

            // Send update to server and use the server response to update local state
            const updatedNote = await updateNote(updatedNoteData);
            if (!updatedNote || !updatedNote._id) {
                throw new Error("Error updating note.");
            }

            // Replace optimistic entry with server-authoritative data
            setNotes((prevNotes) => prevNotes.map((n) => (n._id === noteToEdit._id ? updatedNote : n)));
        } catch (err) {
            console.error(err, "Reverting UI.");
            setNotes(prev);
        } finally {
            // Clear the form
            setTitle("");
            setContent("");
            setSaving(false);
            setEditNoteId(undefined);
        }
    }

    const handleCancel = async () => {
        setTitle("");
        setContent("");
        setEditNoteId(undefined);
    }

    return (
        <div className="notes-container">
            <h1>Notes</h1>

            <form className="note-form" onSubmit={editNoteId? handleSaveEdit: handleAdd}>
                <input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="note-input"
                />

                <textarea
                    placeholder="Write your note..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="note-textarea"
                />

                <button type="submit" disabled = {saving}>
                    {saving ? "Saving..." : editNoteId? "Edit Note" : "Add note"}
                </button>

                <button onClick={handleCancel}>Cancel</button>
            </form>

            {loading ? (
                <p>Loading</p>
            ) : (
                notes.map((note) => (
                    <div className="note-card" key={note._id}>
                        <h4>{note.title}</h4>
                        <p>{note.content}</p>
                        <button className="red-button" onClick={() => handleDelete(note._id)}>Delete</button>
                        <button disabled={editNoteId} onClick={() => handleEdit(note)}>Edit</button>
                    </div>
                ))
            )}
        </div>
    );
};

export default Notes;