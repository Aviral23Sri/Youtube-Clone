# YouTube Clone — MERN + Vite

A full‑stack YouTube‑style web app built with the **MERN** stack and **Vite React** on the client.  
Supports uploading/streaming videos using **MongoDB GridFS**, displaying them in a UI similar to YouTube, with comments, view counts, and optional fallback to embedded YouTube videos.

---

## 🚀 Features
- **Video upload** with thumbnail
- **GridFS** storage for large media files
- **HTTP Range** support for smooth streaming & scrubbing
- **Comments & views** count
- **Responsive UI** with a Watch page
- **Fallback to YouTube embeds** for development/demo

---

## 📦 Prerequisites
- **Node.js** v18+
- **npm**
- **MongoDB** (local or Atlas)
- **Git** (optional but recommended)

---

## 📂 Project Structure

```
youtube-clone/
│
├── README.md                  # Project readme
├── package.json               # Root (optional, if managing both client/server scripts here)
├── .gitignore
│
├── server/                     # Backend — Node.js + Express + MongoDB
│   ├── package.json
│   ├── .env                    # Backend environment variables
│   ├── index.js                # Entry point (Express server)
│   ├── config/
│   │   └── db.js               # MongoDB connection setup
│   ├── middlewares/
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Video.js            # Mongoose schema for videos
│   │   └── Comment.js          # Mongoose schema for comments
│   ├── routes/
│   │   ├── videoRoutes.js      # Upload + stream + list videos
│   │   ├── commentRoutes.js    # CRUD comments
│   │   └── uploadRoutes.js     # File upload route
│   ├── controllers/
│   │   ├── videoController.js  # Logic for video endpoints
│   │   ├── commentController.js
│   │   └── uploadController.js
│   ├── utils/
│   │   └── gridfs.js           # GridFS storage helpers
│   └── uploads/                # (If using disk storage for temp uploads)
│
├── client/                     # Frontend — Vite + React + Redux
│   ├── package.json
│   ├── .env                    # Frontend env variables (VITE_API_URL)
│   ├── vite.config.js
│   ├── index.html
│   ├── src/
│   │   ├── main.jsx
│   │   ├── index.css
│   │   │
│   │   ├── app/
│   │   │   ├── store.js        # Redux store
│   │   │   └── rootReducer.js
│   │   │
│   │   ├── features/           # Redux slices
│   │   │   ├── videos/
│   │   │   │   ├── videoSlice.js
│   │   │   │   └── videoService.js
│   │   │   └── comments/
│   │   │       ├── commentSlice.js
│   │   │       └── commentService.js
│   │   │
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── VideoCard.jsx
│   │   │   └── YoutubeEmbed.jsx  # Reusable iframe component
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Watch.jsx        # Single video view
│   │   │   └── Upload.jsx       # Upload form
│   │   │
│   │   ├── assets/              # Static images, icons
│   │   └── utils/               # Helper functions
│   └── public/                  # Public static files
│
└── scripts/                     # (Optional) Deployment/build scripts
```

---

## ⚙️ Environment Variables

### Server `.env`

```baash
MONGODB_URI=mongodb://127.0.0.1:27017/youtube_clone
PORT=4000
JWT_SECRET=your-secret-string
```

```bash

### Client `.env`

```
```bash
cd server
npm install
npm start
or use `nodemon` for live reload:

```

---

## 💻 Frontend Setup (client)
```bash
cd client
npm install
npm run dev
```
The app will start on a development server (default `http://localhost:5173`).

---

## 📜 Scripts

From **client**:
- `npm run dev` — Start Vite dev server
- `npm run build` — Build production bundle to `dist/`
- `npm run preview` — Preview the production build locally

From **server**:
- `npm start` — Start Express API

---

## 🎥 Uploading Videos & Thumbnails
- Use the **Upload** page in the UI.
- Backend stores videos and thumbnails in **GridFS** using custom buckets.
- The `videoFileId` and `thumbnailFileId` are stored in MongoDB and referenced in the `videos` collection.

---

## 📺 Video Playback
- **Thumbnails** — served in full with proper `Content-Type` (no Range needed)
- **Videos** — streamed with **HTTP Range** support (`206 Partial Content` for scrubbing)

---

## ▶️ Fallback: Embedded YouTube Videos
When database is empty or for demo purposes, render **hard‑coded iframe embeds** using a reusable `YoutubeEmbed` component:

## 🛠 Troubleshooting

- **Blank page**
  - Check the browser console (DevTools → Console) for runtime errors.
  - Verify the network tab for failed requests.
  - Ensure `VITE_API_URL` in `client/.env` points to the correct backend base URL (e.g., `http://localhost:4000/api`).

- **Video not streaming**
  - Confirm your video streaming route supports HTTP Range requests.
  - Make sure the server returns `206 Partial Content`, sets `Accept-Ranges: bytes`, and includes a correct `Content-Range` header.

- **Thumbnails missing**
  - Verify the thumbnail route path matches what the client calls.
  - Return the correct `Content-Type` (e.g., `image/jpeg`, `image/png`).

- **CORS issues**
  - Enable CORS in Express:
    ```
    import cors from "cors";
    app.use(cors({ origin: "*" })); // tighten for production
    ```
  - If cookies/auth are used, configure `credentials`, allowed origins, and headers accordingly.

---

## 🚢 Deployment

### Backend (Node/Express API)
- Deploy to a provider such as Render, Railway, or Heroku.
- Set environment variables:
  - `MONGODB_URI`
  - `PORT` (if required by host)
  - Any secrets (e.g., `JWT_SECRET`)
- Ensure your streaming endpoints work on the deployed environment (Range support, correct headers).

### Frontend (Vite React)
1. Build:

```bash
cd client
npm run build
```
2. Host the `dist/` folder on a static host (e.g., Netlify, Vercel, StaticFile host).
3. Configure environment:
- In `client/.env`, set:
  ```
  VITE_API_URL=https://your-deployed-api.example.com/api
  ```
- Rebuild after changing envs:
  ```
  npm run build
  ```

Notes:
- If deploying under a subpath, configure Vite’s `base` in `vite.config.js`.
- For previews:

```bash
npm run preview
```
Serves the production build locally.

---

## 📚 References

- Vite Documentation: https://vitejs.dev/
- MongoDB GridFS: https://www.mongodb.com/docs/manual/core/gridfs/
- YouTube Embed API (player parameters): https://developers.google.com/youtube/player_parameters

