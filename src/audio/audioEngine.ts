import * as Tone from "tone";

let started = false;

async function ensureStarted(): Promise<void> {
  if (!started) {
    await Tone.start();
    started = true;
  }
}

const synth = new Tone.PolySynth(Tone.Synth, {
  oscillator: { type: "triangle" as const },
  envelope: { attack: 0.02, decay: 0.3, sustain: 0.4, release: 0.8 },
}).toDestination();
synth.maxPolyphony = 8;

export async function playNote(pitch: string, duration = "8n"): Promise<void> {
  await ensureStarted();
  synth.triggerAttackRelease(pitch, duration);
}

export async function playChord(
  pitches: string[],
  duration = "2n",
): Promise<void> {
  await ensureStarted();
  synth.triggerAttackRelease(pitches, duration);
}

export async function playInterval(
  pitch1: string,
  pitch2: string,
  bpm: number,
): Promise<() => void> {
  await ensureStarted();
  const beatDuration = 60 / bpm;
  const now = Tone.now();
  let cancelled = false;

  synth.triggerAttackRelease(pitch1, "4n", now);
  const id = setTimeout(() => {
    if (!cancelled) {
      synth.triggerAttackRelease(pitch2, "4n", Tone.now());
    }
  }, beatDuration * 1000);

  return () => {
    cancelled = true;
    clearTimeout(id);
    synth.releaseAll();
  };
}

export async function playSequence(
  pitches: string[],
  bpm: number,
): Promise<() => void> {
  await ensureStarted();
  const beatDuration = 60 / bpm;
  let cancelled = false;
  const timeouts: ReturnType<typeof setTimeout>[] = [];

  pitches.forEach((pitch, i) => {
    const id = setTimeout(() => {
      if (!cancelled) {
        synth.triggerAttackRelease(pitch, "8n", Tone.now());
      }
    }, i * beatDuration * 1000);
    timeouts.push(id);
  });

  return () => {
    cancelled = true;
    timeouts.forEach(clearTimeout);
    synth.releaseAll();
  };
}

export async function playChordSequence(
  chordPitches: string[][],
  bpm: number,
): Promise<() => void> {
  await ensureStarted();
  const beatDuration = 60 / bpm;
  let cancelled = false;
  const timeouts: ReturnType<typeof setTimeout>[] = [];

  chordPitches.forEach((pitches, i) => {
    const id = setTimeout(() => {
      if (!cancelled) {
        synth.triggerAttackRelease(pitches, "2n", Tone.now());
      }
    }, i * beatDuration * 2 * 1000);
    timeouts.push(id);
  });

  return () => {
    cancelled = true;
    timeouts.forEach(clearTimeout);
    synth.releaseAll();
  };
}

export function stopAll(): void {
  synth.releaseAll();
}

// --- Frequency Explorer: continuous oscillator for arbitrary frequencies ---

const toneVolume = new Tone.Volume(-12).toDestination();
const oscillator = new Tone.Oscillator({ type: "sine", frequency: 440 }).connect(toneVolume);

export async function startTone(freq: number): Promise<void> {
  await ensureStarted();
  oscillator.frequency.value = freq;
  if (oscillator.state !== "started") {
    oscillator.start();
  }
}

export function stopTone(): void {
  if (oscillator.state === "started") {
    oscillator.stop();
  }
}

export function setFrequency(freq: number): void {
  oscillator.frequency.value = freq;
}
