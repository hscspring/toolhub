# ToolHub Demo (admin + web)
This is a minimal demo project that includes:

- `admin/` — a local admin single-page app (Vite + React) for managing tools, with:
  - Table view of tools
  - Add / edit / delete
  - "Fetch from URL" that scrapes title and meta description via AllOrigins proxy
  - Export `tools.json` which you can copy to `web/public/tools.json`

- `web/` — a static site (Vite + React) to display tools (reads `public/tools.json`)

## Quick start



### Web (deployable static site)
```
cd web
npm install
npm run dev   # for local preview
npm run build # to build for production
```

Then deploy `web/dist` to Netlify / Vercel / GitHub Pages.

Notes:
- This demo uses a public CORS proxy (AllOrigins) for fetching remote HTML for metadata. For production you might want a more reliable proxy or server-side fetch.
- This demo is intentionally minimal to be easy to run and extend.
