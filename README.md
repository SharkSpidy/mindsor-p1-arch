# Mindstor Architecture Viewer

Vite + React + TypeScript app that renders the Mindstor architecture document
(Mermaid diagrams, SQL, API tables, monorepo plan).

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview
```

Requires Node 18+. The content lives in `src/content/architecture.md`; edit it and the page updates.
