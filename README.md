# Favicon Generator

Minimal, fast, client‑side favicon generator. Load an image, crop 1:1, preview sizes in the export list, and download either a ZIP with common favicon files or individual PNGs. Everything runs locally in your browser.

## Features
- Image choose (drag & drop or click), PNG/JPG/SVG
- Crop 1:1 with zoom
- Export:
  - ZIP with ready files and HTML snippet
  - Individual PNG files: 16/32/48/64, apple‑touch‑icon (180), android‑chrome (192/512)
- Optional favicon.ico and more sizes can be added later
- No server, private by design

## Quick start
```bash
npm install
npm run dev
# open http://localhost:5173
```

## Build
```bash
npm run build
npm run preview
```

## Deploy (GitHub Pages)
This repo is configured to deploy via GitHub Actions.
- Production base path is taken from `BASE_PATH` env (defaults to `/`).
- For this repository it is `/favicon/`.

Manual build artifact is in `dist/`.

## Tech stack
- React + TypeScript + Vite
- react-easy-crop for cropping
- fflate for ZIP

## Privacy
All processing happens in the browser. Your images are not uploaded anywhere.
