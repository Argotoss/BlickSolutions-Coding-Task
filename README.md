# BlickSolutions-Coding-Task

Simple shopping list app built with React + TypeScript on the frontend and Express + MongoDB on the backend.

## Structure

- `frontend/` React + TypeScript (Vite)
- `backend/` Express + TypeScript

## Setup

You’ll need Node 20+ and a running MongoDB instance (local or Atlas).

### Backend

```sh
cd backend
npm install

# local MongoDB example
export MONGODB_URI="mongodb://127.0.0.1:27017/blicksolutions"
export PORT=3001

npm run dev
```

### Frontend

```sh
cd frontend
npm install

# default backend URL is http://localhost:3001
export VITE_API_URL="http://localhost:3001"

npm run dev
```

Open the URL shown by Vite (usually `http://localhost:5173`).

## Scripts

Backend:
- `npm run dev` start API in watch mode
- `npm run build` compile to `dist/`
- `npm start` run compiled server
- `npm test` run API tests

Frontend:
- `npm run dev` start Vite dev server
- `npm run build` production build
- `npm run preview` preview build

## UI library

None. Styling is local to the React components.
