import Header from "./components/Header";
import PixelScene from "./components/PixelScene";
import SoundCard from "./components/SoundCard";
import { useMixer } from "./audio/useMixer";
import { SOUNDS } from "./sounds";

/** Scene reacts once a track is clearly audible rather than barely nudged. */
const ANIMATION_THRESHOLD = 0.2;

export default function App() {
  const mixer = useMixer();

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden rounded-2xl bg-slate-nook/95 shadow-2xl ring-1 ring-cream/10 backdrop-blur-md">
      <Header />

      <main className="flex min-h-0 flex-1 flex-col gap-2 px-3 pb-3">
        <section className="h-[40%] min-h-0 shrink-0">
          <PixelScene
            rain={mixer.effectiveVolume("rain")}
            fire={mixer.effectiveVolume("fireplace")}
            sketching={mixer.effectiveVolume("pencil") > ANIMATION_THRESHOLD}
            swayingTail={mixer.effectiveVolume("brush") > ANIMATION_THRESHOLD}
          />
        </section>

        <section className="flex min-h-0 flex-1 flex-col gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={mixer.togglePlay}
              aria-pressed={mixer.playing}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-sage px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-nook shadow-md transition hover:brightness-110 active:scale-[0.98]"
            >
              <span aria-hidden>{mixer.playing ? "\u23F8" : "\u25B6"}</span>
              {mixer.playing ? "Pause All" : "Play All"}
            </button>
            <button
              type="button"
              onClick={mixer.randomize}
              title="Randomize mix"
              className="rounded-2xl bg-amber-nook/90 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-nook shadow-md transition hover:brightness-110 active:scale-[0.98]"
            >
              {"\u{1F3B2}"} Mix
            </button>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-1 gap-1.5 overflow-y-auto pr-0.5">
            {SOUNDS.map((sound) => (
              <SoundCard
                key={sound.id}
                sound={sound}
                volume={mixer.tracks[sound.id].volume}
                muted={mixer.tracks[sound.id].muted}
                onVolume={(volume) => mixer.setVolume(sound.id, volume)}
                onToggleMute={() => mixer.toggleMute(sound.id)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
