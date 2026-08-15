# Cozy Nook Widget

A compact always-on-top desktop widget (340x520, frameless, transparent) that mixes cozy
ambient sounds behind a pixel-art scene of a sleeping cat by a rainy window.

Built with **Tauri v2 + React + Vite + Tailwind CSS**.

## Features

- Frameless, transparent, non-resizable always-on-top window with a custom drag region in the header.
- Header controls: pin/unpin (toggles always-on-top), minimize, close - via `@tauri-apps/api/window`.
- Pixel-art scene (top 40%) with reactive micro-animations:
  - the cat breathes slowly by default,
  - a sketch bubble appears when **Pencil Writing** is above 20%,
  - the tail sways when **Hairbrushing ASMR** is above 20%,
  - rain density and fireplace glow follow their track volumes.
- Mixer (bottom 60%): master Play/Pause All, per-track mute toggles and 0-100% volume sliders for
  Rainfall, Fireplace, Pencil Writing, Hairbrushing ASMR, Cafe Ambience and Keyboard Clacks.
- "Mix" button randomizes 2-3 tracks for an instant cozy blend.

## Audio sources

`src/sounds.ts` holds the source for each track. **Hairbrushing ASMR** ships bundled at
`public/sounds/brush.mp3` (6-minute seamless-ish excerpt, mono 64 kbps, loudness-normalised);
the remaining tracks still point at placeholder royalty-free loop URLs. To ship your own audio,
drop files into `public/sounds/` and point each `src` at `/sounds/<id>.mp3`.

If a URL cannot be loaded (offline dev, blocked host), each track falls back to a shaped-noise
WebAudio synth so the mixer stays audible and testable.

## Development

```bash
npm install
npm run dev        # frontend only, http://localhost:1420
npm run tauri:dev  # full desktop widget
npm run build      # typecheck + production frontend build
npm run tauri:build
```

Linux desktop builds need the usual Tauri v2 system dependencies
(`libwebkit2gtk-4.1-dev`, `libgtk-3-dev`, `libayatana-appindicator3-dev`, `librsvg2-dev`,
`build-essential`, `curl`, `wget`, `file`, `libssl-dev`).

## Palette

| Token | Hex |
| --- | --- |
| Sage green | `#7E998A` |
| Cream | `#FAF6EE` |
| Dark slate | `#1E292B` |
| Amber accent | `#E0A458` |
