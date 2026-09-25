# CardioCheck (React + Vite frontend)

A single-page form that collects a few vitals and calls the FastAPI backend's
`/predict` endpoint to show an estimated cardiovascular risk score.

## Folder contents

```
frontend/
├── index.html
├── package.json
├── vite.config.js
├── .env.example
└── src/
    ├── main.jsx
    ├── App.jsx
    └── index.css
```

## Run locally

```bash
cd frontend
npm install
npm run dev
```

Open the printed `http://localhost:5173` URL. By default it calls the API at
`http://127.0.0.1:8000` — start the backend first (see `../backend/README.md`).

## Point it at a deployed backend

Copy `.env.example` to `.env` and set:

```
VITE_API_URL=https://your-service-name.onrender.com
```

## Deploy on Vercel

1. Push this `frontend/` folder to GitHub.
2. On [vercel.com](https://vercel.com) → **Add New → Project** → import the repo
   (set **Root Directory** to `frontend` if it's part of a monorepo).
3. Vercel auto-detects Vite; leave the build settings as-is.
4. Add an environment variable `VITE_API_URL` = your Render backend URL.
5. Deploy. Then go back to the backend's `ALLOWED_ORIGINS` env var on Render
   and add this Vercel URL, and redeploy the backend.
