export type SoundId =
  | "rain"
  | "fireplace"
  | "pencil"
  | "brush"
  | "cafe"
  | "keyboard";

export type SoundDef = {
  id: SoundId;
  label: string;
  emoji: string;
  /** Bundled asset under `public/sounds/`, or a remote royalty-free loop. */
  src: string;
  /** Timbre used by the offline synth fallback when `src` cannot be loaded. */
  fallback: "rain" | "fire" | "pencil" | "brush" | "cafe" | "keyboard";
  defaultVolume: number;
};

/**
 * Placeholder royalty-free loops (Pixabay CDN, free for commercial use, no
 * attribution required). Drop your own files in `public/sounds/<id>.mp3` and
 * point `src` at `/sounds/<id>.mp3` to ship them with the bundle.
 */
export const SOUNDS: SoundDef[] = [
  {
    id: "rain",
    label: "Rainfall",
    emoji: "\u{1F327}\uFE0F",
    src: "/sounds/rain.mp3",
    fallback: "rain",
    defaultVolume: 0.6,
  },
  {
    id: "fireplace",
    label: "Fireplace",
    emoji: "\u{1F525}",
    src: "https://cdn.pixabay.com/audio/2022/03/15/audio_c8e4bd2ba2.mp3",
    fallback: "fire",
    defaultVolume: 0.45,
  },
  {
    id: "pencil",
    label: "Pencil Writing",
    emoji: "\u270F\uFE0F",
    src: "https://cdn.pixabay.com/audio/2022/03/24/audio_bb630cc098.mp3",
    fallback: "pencil",
    defaultVolume: 0.0,
  },
  {
    id: "brush",
    label: "Hairbrushing ASMR",
    emoji: "\u{1F9F9}",
    src: "/sounds/brush.mp3",
    fallback: "brush",
    defaultVolume: 0.0,
  },
  {
    id: "cafe",
    label: "Cafe Ambience",
    emoji: "\u2615",
    src: "https://cdn.pixabay.com/audio/2022/03/10/audio_4dedf6b3ba.mp3",
    fallback: "cafe",
    defaultVolume: 0.25,
  },
  {
    id: "keyboard",
    label: "Keyboard Clacks",
    emoji: "\u2328\uFE0F",
    src: "https://cdn.pixabay.com/audio/2022/03/15/audio_8d1b0d0e0f.mp3",
    fallback: "keyboard",
    defaultVolume: 0.0,
  },
];
