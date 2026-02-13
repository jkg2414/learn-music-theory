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

// --- Multi-oscillator support for frequency sliders ---

const toneVolume = new Tone.Volume(-12).toDestination();

const oscillators = new Map<string, Tone.Oscillator>();

function getOscillator(id: string): Tone.Oscillator {
  let osc = oscillators.get(id);
  if (!osc) {
    osc = new Tone.Oscillator({ type: "sine", frequency: 440 }).connect(toneVolume);
    oscillators.set(id, osc);
  }
  return osc;
}

export async function startTone(freq: number, id = "default"): Promise<void> {
  await ensureStarted();
  const osc = getOscillator(id);
  osc.frequency.value = freq;
  if (osc.state !== "started") {
    osc.start();
  }
}

export function stopTone(id = "default"): void {
  const osc = oscillators.get(id);
  if (osc && osc.state === "started") {
    osc.stop();
  }
}

export function setFrequency(freq: number, id = "default"): void {
  const osc = oscillators.get(id);
  if (osc) {
    osc.frequency.value = freq;
  }
}

export function stopAllTones(): void {
  oscillators.forEach((osc) => {
    if (osc.state === "started") osc.stop();
  });
  stopAllClickTrains();
}

// --- Click train: sample-accurate pulse scheduling at any speed ---

interface ClickTrainState {
  running: boolean;
  rate: number;
  nextTime: number;
  timeout: number | null;
  buffer: AudioBuffer;
  gainNode: GainNode;
  audioCtx: AudioContext;
}

const clickTrains = new Map<string, ClickTrainState>();

function createClickBuffer(audioCtx: AudioContext, clickFreq: number): AudioBuffer {
  const duration = 0.004; // 4ms impulse
  const sampleRate = audioCtx.sampleRate;
  const length = Math.ceil(duration * sampleRate);
  const buffer = audioCtx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    const t = i / sampleRate;
    // Exponential decay envelope * sine burst
    const env = Math.exp(-t / (duration * 0.3));
    data[i] = Math.sin(2 * Math.PI * clickFreq * t) * env * 0.35;
  }
  return buffer;
}

function scheduleClickTrain(train: ClickTrainState) {
  if (!train.running) return;
  const now = train.audioCtx.currentTime;
  const lookAhead = 0.12; // schedule 120ms ahead

  while (train.nextTime < now + lookAhead) {
    const source = train.audioCtx.createBufferSource();
    source.buffer = train.buffer;
    source.connect(train.gainNode);
    source.start(Math.max(train.nextTime, now));
    train.nextTime += 1 / train.rate;
  }

  train.timeout = window.setTimeout(() => scheduleClickTrain(train), 50);
}

export async function startClickTrain(id: string, rate: number, isHigh: boolean): Promise<void> {
  await ensureStarted();
  const audioCtx = Tone.getContext().rawContext as AudioContext;

  let train = clickTrains.get(id);
  if (!train) {
    const clickFreq = isHigh ? 1500 : 1000;
    const buffer = createClickBuffer(audioCtx, clickFreq);
    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.5;
    gainNode.connect(audioCtx.destination);
    train = { running: false, rate, nextTime: 0, timeout: null, buffer, gainNode, audioCtx };
    clickTrains.set(id, train);
  }

  train.rate = rate;
  train.running = true;
  train.nextTime = audioCtx.currentTime;
  scheduleClickTrain(train);
}

export function setClickTrainRate(id: string, rate: number): void {
  const train = clickTrains.get(id);
  if (train) train.rate = rate;
}

export function stopClickTrain(id: string): void {
  const train = clickTrains.get(id);
  if (train) {
    train.running = false;
    if (train.timeout !== null) {
      clearTimeout(train.timeout);
      train.timeout = null;
    }
  }
}

export function stopAllClickTrains(): void {
  clickTrains.forEach((train) => {
    train.running = false;
    if (train.timeout !== null) {
      clearTimeout(train.timeout);
      train.timeout = null;
    }
  });
}

// --- Metronome click ---

const clickHigh = new Tone.Synth({
  oscillator: { type: "sine" },
  envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.05 },
}).toDestination();

const clickLow = new Tone.Synth({
  oscillator: { type: "sine" },
  envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.05 },
}).toDestination();

export async function playClick(accent: boolean): Promise<void> {
  await ensureStarted();
  if (accent) {
    clickHigh.triggerAttackRelease("G5", "32n");
  } else {
    clickLow.triggerAttackRelease("C5", "32n");
  }
}
