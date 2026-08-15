---
name: testing-cozy-nook
description: How to run and end-to-end test the Cozy Nook Tauri v2 + React desktop widget (window behavior, mixer, pixel-scene reactivity, audio fallback) on a Linux VNC box.
---

# Testing the Cozy Nook widget

## Running the real desktop window (preferred)

```bash
cd <repo> && npm run tauri:dev > /tmp/tauri-dev.log 2>&1 &
```

- First Rust build takes ~5-10 min; grep the log for `Running \`target/debug/cozy-nook-widget\`` or poll
  `wmctrl -l | grep -i "Cozy Nook"` instead of guessing at sleeps.
- Browser-only mode (`npm run dev`, http://localhost:1420) is a fallback, but the window controls
  (drag / pin / minimize / close) are no-ops there, so prefer the real Tauri window.
- Verify window spec from the shell rather than by eye:
  `xdotool getwindowgeometry $(xdotool search --name "Cozy Nook" | head -1)` (expect `340x520`) and
  `xprop -id <id> _NET_WM_STATE` (expect `_NET_WM_STATE_ABOVE` while pinned, empty after unpin).
  `WM_STATE ... Iconic` proves minimize; `pgrep -af cozy-nook-widget` proves close terminated the app.

## Gotcha: stuck window move-grab after a header drag

Dragging `data-tauri-drag-region` uses a WM move-grab. If `left_mouse_down` and `left_mouse_up` are issued in
*separate* computer-tool calls, the grab can stay active and the window then follows every later mouse move —
which silently makes subsequent clicks land on the wrong widgets (sliders jumping on their own). Always do
mouse_down → moves → mouse_up inside a single tool call, and if the window starts trailing the cursor press
`Escape` to cancel the grab before continuing.

## Reading the UI

- `zoom` crops can be misleading while the window is moving; take a full screenshot first to re-derive
  coordinates whenever the window has moved.
- Slider rows are `<input type=range>`; click at a fraction of the track to set a value, or do a real
  mouse_down/move/mouse_up drag. The numeric readout at the right of each row is the ground truth (0-100).

## Verifying CSS animations objectively

Animation assertions ("tail sways", "glow brightens") are unreliable by eye. Capture a burst of frames and
diff pixels:

```bash
for i in $(seq 1 6); do scrot -o /tmp/f_$i.png; sleep 0.25; done
# then compare crops with PIL/numpy: a swaying element's white-pixel row range oscillates,
# a static one is identical across frames.
```

Beware: a Tailwind `animate-*` class that animates `opacity` **overrides** an SVG `opacity={...}`
presentation attribute, so a volume-driven opacity can look implemented but never change. Always measure
mean pixel brightness at 0% and 100% instead of trusting the code.

## Verifying audio without a sound card

These boxes typically have no `/dev/snd`, so audibility cannot be proven. Open the WebKit inspector in the
Tauri dev window (right-click → Inspect Element) and inspect state instead:

- The mixer's `HTMLAudioElement`s are created with `new Audio()` and never attached to the DOM, so
  `document.querySelectorAll('audio')` finds nothing. Reach them through the React fiber:
  walk `document.getElementById('root')[__reactContainer$...]`, following `child`/`sibling`, and read each
  fiber's `memoizedState` hook chain for a `ref.current instanceof Map`.
- Expect either `error.code === 4` / `networkState === 3` (remote MP3 rejected — the placeholder Pixabay URLs
  fail inside the app even though `curl` returns 200, most likely the `crossOrigin="anonymous"` CORS request),
  in which case the WebAudio fallback should be running: find the synth `Map` the same way and check
  `synth.gain.gain.value ≈ volume * 0.35` and `context.state === "running"`.

## Devin secrets needed

None.
