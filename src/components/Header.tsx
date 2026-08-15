import { useCallback, useState } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";

/** Window controls no-op gracefully when the UI runs in a plain browser. */
async function withWindow(action: (win: ReturnType<typeof getCurrentWindow>) => Promise<void>) {
  try {
    await action(getCurrentWindow());
  } catch {
    /* not running inside Tauri */
  }
}

export default function Header() {
  const [pinned, setPinned] = useState(true);

  const togglePin = useCallback(() => {
    const next = !pinned;
    setPinned(next);
    void withWindow((win) => win.setAlwaysOnTop(next));
  }, [pinned]);

  const minimize = useCallback(() => void withWindow((win) => win.minimize()), []);
  const close = useCallback(() => void withWindow((win) => win.close()), []);

  return (
    <header
      data-tauri-drag-region
      className="flex cursor-grab items-center justify-between rounded-t-2xl bg-slate-nook/80 px-3 py-2 active:cursor-grabbing"
    >
      <h1
        data-tauri-drag-region
        className="select-none font-pixel text-[11px] tracking-[0.18em] text-cream"
      >
        COZY NOOK
      </h1>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label={pinned ? "Unpin window" : "Pin window on top"}
          aria-pressed={pinned}
          title={pinned ? "Unpin" : "Pin on top"}
          onClick={togglePin}
          className={`grid h-6 w-6 place-items-center rounded-full text-xs transition hover:bg-cream/15 ${
            pinned ? "text-amber-nook" : "text-cream/45"
          }`}
        >
          {"\u{1F4CC}"}
        </button>
        <button
          type="button"
          aria-label="Minimize window"
          title="Minimize"
          onClick={minimize}
          className="grid h-6 w-6 place-items-center rounded-full text-cream/70 transition hover:bg-cream/15 hover:text-cream"
        >
          <span className="mb-1 text-sm leading-none">{"\u2013"}</span>
        </button>
        <button
          type="button"
          aria-label="Close window"
          title="Close"
          onClick={close}
          className="grid h-6 w-6 place-items-center rounded-full text-cream/70 transition hover:bg-red-400/80 hover:text-cream"
        >
          <span className="text-sm leading-none">{"\u00D7"}</span>
        </button>
      </div>
    </header>
  );
}
