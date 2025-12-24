# Deployment Guide

This project is built as a full-stack application. For deployment, you can deploy the frontend and backend separately or together if supported.

## 1. Backend Deployment (Render / Railway / Heroku)

The backend is a Node.js Express server.

*   **Repository Root:** `.` (Deploy the root of the repo)
*   **Build Command:** `npm install`
*   **Start Command:** `npm run start` (or `npx tsx server/index.ts`)
*   **Environment Variables:**
    *   `PORT`: `5000` (or allow the platform to assign one)
    *   `NODE_ENV`: `production`

**Note:** The backend uses a local JSON file (`server/data/transactions.json`) for data persistence in this MVP. On ephemeral filesystems (like basic Render/Heroku tiers), data will be lost on restart. For persistent data, upgrade `server/storage.ts` to use a database like PostgreSQL (the code in `server/db.ts` is already set up for this) or use a persistent volume.

## 2. Frontend Deployment (Vercel / Netlify)

The frontend is a Vite React application.

*   **Repository Root:** `.`
*   **Framework Preset:** Vite
*   **Build Command:** `npm run build`
*   **Output Directory:** `dist`
*   **Environment Variables:**
    *   `VITE_API_BASE_URL`: The URL of your deployed backend (e.g., `https://my-backend.onrender.com`).

**Important:**
Since the frontend and backend are deployed separately, you must ensure:
1.  The Backend has CORS enabled to allow requests from the Frontend domain.
2.  The Frontend uses the `VITE_API_BASE_URL` to prefix all API requests.

## Replit Deployment

To run on Replit, simply click "Run". The configuration handles both frontend and backend automatically on a single port.
