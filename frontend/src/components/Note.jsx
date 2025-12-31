import { useEffect, useState } from "react";
import { fetchNotes, createNote, deleteNote } from "../api";

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

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

    return (
        <div className="notes-container">
            <h1>Notes</h1>

            <form className="note-form" onSubmit={handleAdd}>
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
                    {saving ? "Saving..." : "Add note"}
                </button>
            </form>

            {loading ? (
                <p>Loading</p>
            ) : (
                notes.map((note) => (
                    <div className="note-card" key={note._id}>
                        <h4>{note.title}</h4>
                        <p>{note.content}</p>
                        <button onClick={() => handleDelete(note._id)}>Delete note</button>
                    </div>
                ))
            )}
        </div>
    );
};

export default Notes;