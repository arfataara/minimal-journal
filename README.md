# Minimal Journal

A simple full-stack journaling application built with the MERN stack to practice fundamental CRUD operations and React hooks.

# Features

### Create Entries: Add new journal notes to the database.

### Fetch All Notes: View a complete list of your stored notes.

### Delete Notes: Remove unwanted entries directly from the UI.

# Tech stack

Frontend: React.js
Backend: Node.js, Express.js
Database: MongoDB (via Mongoose)
Communication: REST API with Axios

# Installation & Setup

Follow these steps to run the project locally:

### Setup backend

#### `cd backend`

#### `npm install`

##### Create a .env file and add your MONGO_URI

#### `npm start`

### Setup frontend

#### `cd ../frontend`

#### `npm install`

#### `npm start`

# Learning Goals (Current Progress)

This project is currently in its early stages.
My primary focus was:
Connecting a React frontend to an Express/MongoDB backend.
Understanding the flow of data: UI -> API -> Database -> UI.
Practicing the use of useEffect to trigger data fetching on component mount.

# Known Limitations & Future Roadmap

Security: Currently lacks user authentication (JWT). All notes are public to any user.
Per-User Data: Planning to implement a "User" model to allow private journaling.
UI/UX: Basic styling; plan to integrate Tailwind CSS or Bootstrap soon.
State Management: Currently using local state; planning to explore Context API or Redux for more complex data flows.
