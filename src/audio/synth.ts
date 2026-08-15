import type { SoundDef } from "../sounds";

type Timbre = SoundDef["fallback"];

function noiseBuffer(ctx: AudioContext, seconds = 4): AudioBuffer {
  const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

type FilterSpec = { type: BiquadFilterType; frequency: number; q: number };

const TIMBRES: Record<Timbre, { filter: FilterSpec; lfoRate: number; lfoDepth: number }> = {
  rain: { filter: { type: "highpass", frequency: 900, q: 0.7 }, lfoRate: 0.25, lfoDepth: 0.12 },
  fire: { filter: { type: "lowpass", frequency: 420, q: 1.2 }, lfoRate: 1.8, lfoDepth: 0.45 },
  pencil: { filter: { type: "bandpass", frequency: 2600, q: 6 }, lfoRate: 3.4, lfoDepth: 0.8 },
  brush: { filter: { type: "bandpass", frequency: 5200, q: 2 }, lfoRate: 0.9, lfoDepth: 0.7 },
  cafe: { filter: { type: "lowpass", frequency: 900, q: 0.5 }, lfoRate: 0.4, lfoDepth: 0.25 },
  keyboard: { filter: { type: "bandpass", frequency: 1800, q: 9 }, lfoRate: 6.5, lfoDepth: 0.9 },
};

/**
 * Offline stand-in for a missing/blocked audio file: shaped noise so the mixer
 * still behaves (and is audible) without network access.
 */
export class SynthTrack {
  private readonly gain: GainNode;
  private readonly source: AudioBufferSourceNode;
  private readonly lfo: OscillatorNode;
  private readonly lfoGain: GainNode;
  private started = false;

  constructor(ctx: AudioContext, timbre: Timbre) {
    const spec = TIMBRES[timbre];
    this.source = ctx.createBufferSource();
    this.source.buffer = noiseBuffer(ctx);
    this.source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = spec.filter.type;
    filter.frequency.value = spec.filter.frequency;
    filter.Q.value = spec.filter.q;

    const shaper = ctx.createGain();
    shaper.gain.value = 1 - spec.lfoDepth;

    this.lfo = ctx.createOscillator();
    this.lfo.frequency.value = spec.lfoRate;
    this.lfoGain = ctx.createGain();
    this.lfoGain.gain.value = spec.lfoDepth;
    this.lfo.connect(this.lfoGain).connect(shaper.gain);

    this.gain = ctx.createGain();
    this.gain.gain.value = 0;

    this.source.connect(filter).connect(shaper).connect(this.gain).connect(ctx.destination);
  }

  start(): void {
    if (this.started) return;
    this.started = true;
    this.source.start();
    this.lfo.start();
  }

  setVolume(volume: number): void {
    this.gain.gain.value = Math.max(0, Math.min(1, volume)) * 0.35;
  }

  dispose(): void {
    try {
      this.source.stop();
      this.lfo.stop();
    } catch {
      /* already stopped */
    }
    this.gain.disconnect();
  }
}
