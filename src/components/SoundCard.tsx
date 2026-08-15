import type { SoundDef } from "../sounds";

type Props = {
  sound: SoundDef;
  volume: number;
  muted: boolean;
  onVolume: (volume: number) => void;
  onToggleMute: () => void;
};

export default function SoundCard({ sound, volume, muted, onVolume, onToggleMute }: Props) {
  const percent = Math.round(volume * 100);
  return (
    <div className="rounded-2xl bg-cream/5 px-2.5 py-2 shadow-sm ring-1 ring-cream/10 transition hover:bg-cream/10">
      <div className="flex items-center justify-between gap-1">
        <span className="flex min-w-0 items-center gap-1.5">
          <span aria-hidden className="text-sm">
            {sound.emoji}
          </span>
          <span className="truncate text-[10px] font-semibold tracking-wide text-cream/85">
            {sound.label}
          </span>
        </span>
        <button
          type="button"
          onClick={onToggleMute}
          aria-label={`${muted ? "Unmute" : "Mute"} ${sound.label}`}
          aria-pressed={muted}
          className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold transition ${
            muted ? "bg-cream/10 text-cream/40" : "bg-amber-nook/20 text-amber-nook"
          }`}
        >
          {muted ? "\u{1F507}" : "\u{1F50A}"}
        </button>
      </div>
      <div className="mt-1.5 flex items-center gap-2">
        <input
          type="range"
          min={0}
          max={100}
          value={percent}
          aria-label={`${sound.label} volume`}
          onChange={(event) => onVolume(Number(event.target.value) / 100)}
          className="slider-track w-full"
          style={{
            background: `linear-gradient(to right, ${
              muted ? "#7E998A" : "#E0A458"
            } ${percent}%, rgba(250,246,238,0.18) ${percent}%)`,
          }}
        />
        <span className="w-7 shrink-0 text-right font-mono text-[9px] text-cream/60">
          {percent}
        </span>
      </div>
    </div>
  );
}
