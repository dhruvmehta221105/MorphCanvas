# MorphCanvas AI

A frontend-only prototype for turning rough interface sketches into React-style UI concepts. Canvas analysis, AI assistance, and account flows are simulated locally; no backend, authentication service, or AI model is connected.

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build`.

## Demo routes

- `/` — Product landing page
- `/login`, `/signup`, `/forgot-password` — Mock account flows
- `/dashboard` — Project overview
- `/workspace/new` — Interactive sketch canvas, preview, and editable code
- `/projects`, `/templates`, `/components`, `/activity`, `/settings` — Supporting product pages

Projects and account preferences are stored in browser local storage.
