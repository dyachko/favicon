# Favicon Generator
https://favicon.evgeni.co

Minimal, fast, client‑side favicon generator. Load an image, crop 1:1, preview sizes in the export list, and download either a ZIP with common favicon files or individual PNGs. Everything runs locally in your browser.

## Features
- Image choose (drag & drop or click), PNG/JPG/SVG
- Crop 1:1 with zoom
- Export:
  - ZIP with ready files and HTML snippet
  - Individual PNG files: 16/32/48/64, apple‑touch‑icon (180), android‑chrome (192/512), .icp
- Optional favicon.ico and more sizes can be added later
- No server, private by design

## Tech stack
- React + TypeScript + Vite
- react-easy-crop for cropping
- fflate for ZIP

## Privacy
All processing happens in the browser. Your images are not uploaded anywhere.
