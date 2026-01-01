import axios from "axios";

// 1. Configure the Axios instance
const API = axios.create({
  // Use an environment variable for the backend URL
  baseURL:
    process.env.REACT_APP_BACKEND_URL ||
    "https://minimal-journal-api.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Add an interceptor for authentication tokens
// API.interceptors.request.use((req) => {
//   // Check if a token exists in localStorage and attach it to the request headers
//   const user = localStorage.getItem("user");
//   if (user) {
//     req.headers.Authorization = `Bearer ${JSON.parse(user).token}`;
//   }
//   return req;
// });

// 3. Define specific API call functions
export const fetchNotes = async () => {
  const response = await API.get("/notes");
  return response.data;
};

export const createNote = async (note) => {
  const response = await API.post("/notes", note);
  return response.data;
};

export const updateNote = async (note) => {
  const payload = {
    title: note.title,
    content: note.content,
  };
  const response = await API.put(`/notes/${note._id}`, payload);
  return response.data;
};

export const deleteNote = async (id) => {
  const response = await API.delete(`/notes/${id}`);
  return response.data;
};

export default API;
