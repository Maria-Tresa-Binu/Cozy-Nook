import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SOUNDS, type SoundId } from "../sounds";
import { SynthTrack } from "./synth";

export type TrackState = {
  volume: number;
  muted: boolean;
};

export type MixerState = Record<SoundId, TrackState>;

const initialState = (): MixerState =>
  Object.fromEntries(
    SOUNDS.map((sound) => [sound.id, { volume: sound.defaultVolume, muted: false }])
  ) as MixerState;

const clamp = (value: number) => Math.max(0, Math.min(1, value));

export type Mixer = {
  tracks: MixerState;
  playing: boolean;
  /** Volume actually reaching the speakers, i.e. muting and play state applied. */
  effectiveVolume: (id: SoundId) => number;
  setVolume: (id: SoundId, volume: number) => void;
  toggleMute: (id: SoundId) => void;
  togglePlay: () => void;
  randomize: () => void;
};

export function useMixer(): Mixer {
  const [tracks, setTracks] = useState<MixerState>(initialState);
  const [playing, setPlaying] = useState(false);

  const elements = useRef(new Map<SoundId, HTMLAudioElement>());
  const synths = useRef(new Map<SoundId, SynthTrack>());
  const context = useRef<AudioContext | null>(null);

  const effectiveVolume = useCallback(
    (id: SoundId) => {
      const track = tracks[id];
      return playing && !track.muted ? track.volume : 0;
    },
    [playing, tracks]
  );

  useEffect(() => {
    const created = elements.current;
    SOUNDS.forEach((sound) => {
      const audio = new Audio();
      audio.loop = true;
      audio.preload = "auto";
      audio.crossOrigin = "anonymous";
      audio.volume = 0;
      audio.src = sound.src;
      created.set(sound.id, audio);
    });
    return () => {
      created.forEach((audio) => {
        audio.pause();
        audio.src = "";
      });
      created.clear();
      synths.current.forEach((synth) => synth.dispose());
      synths.current.clear();
      void context.current?.close();
      context.current = null;
    };
  }, []);

  /** Shaped-noise stand-in used when the placeholder URL cannot be played. */
  const synthFor = useCallback((id: SoundId): SynthTrack | null => {
    const sound = SOUNDS.find((item) => item.id === id);
    if (!sound) return null;
    if (!context.current) {
      context.current = new AudioContext();
    }
    const ctx = context.current;
    void ctx.resume();
    let synth = synths.current.get(id);
    if (!synth) {
      synth = new SynthTrack(ctx, sound.fallback);
      synth.start();
      synths.current.set(id, synth);
    }
    return synth;
  }, []);

  useEffect(() => {
    SOUNDS.forEach((sound) => {
      const volume = effectiveVolume(sound.id);
      const audio = elements.current.get(sound.id);
      const synth = synths.current.get(sound.id);
      synth?.setVolume(volume);
      if (!audio) return;
      audio.volume = volume;
      if (volume > 0) {
        audio.play().catch(() => {
          synthFor(sound.id)?.setVolume(volume);
        });
      } else {
        audio.pause();
      }
    });
  }, [effectiveVolume, synthFor]);

  const setVolume = useCallback((id: SoundId, volume: number) => {
    setTracks((prev) => ({
      ...prev,
      [id]: { volume: clamp(volume), muted: volume > 0 ? false : prev[id].muted },
    }));
  }, []);

  const toggleMute = useCallback((id: SoundId) => {
    setTracks((prev) => ({ ...prev, [id]: { ...prev[id], muted: !prev[id].muted } }));
  }, []);

  const togglePlay = useCallback(() => setPlaying((prev) => !prev), []);

  const randomize = useCallback(() => {
    const shuffled = [...SOUNDS].sort(() => Math.random() - 0.5);
    const active = shuffled.slice(0, 2 + Math.floor(Math.random() * 2));
    setTracks(() => {
      const next = initialState();
      SOUNDS.forEach((sound) => {
        next[sound.id] = { volume: 0, muted: false };
      });
      active.forEach((sound) => {
        next[sound.id] = { volume: 0.3 + Math.random() * 0.7, muted: false };
      });
      return next;
    });
    setPlaying(true);
  }, []);

  return useMemo(
    () => ({ tracks, playing, effectiveVolume, setVolume, toggleMute, togglePlay, randomize }),
    [tracks, playing, effectiveVolume, setVolume, toggleMute, togglePlay, randomize]
  );
}
