import { useState, useCallback, useRef, useEffect } from "react";
import { startTone, stopTone, setFrequency } from "../../audio/audioEngine.ts";

const NOTE_NAMES_SHARP = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
];

function frequencyToNoteName(freq: number): { name: string; octave: number; cents: number } {
  const semitones = 12 * Math.log2(freq / 440);
  const rounded = Math.round(semitones);
  const cents = Math.round((semitones - rounded) * 100);
  // A4 is index 9 in the chromatic scale (C=0), octave 4
  const noteIndex = ((rounded % 12) + 12 + 9) % 12;
  const octave = 4 + Math.floor((rounded + 9) / 12);
  return { name: NOTE_NAMES_SHARP[noteIndex], octave, cents };
}

// Logarithmic mapping: slider 0–1 → freq range
const MIN_FREQ = 20;
const MAX_FREQ = 2000;
const LOG_MIN = Math.log2(MIN_FREQ);
const LOG_MAX = Math.log2(MAX_FREQ);

function freqToSlider(freq: number): number {
  return (Math.log2(freq) - LOG_MIN) / (LOG_MAX - LOG_MIN);
}

function sliderToFreq(value: number): number {
  return Math.pow(2, LOG_MIN + value * (LOG_MAX - LOG_MIN));
}

// Map frequency to a visible number of cycles on the canvas (log scale)
function freqToVisualCycles(freq: number): number {
  const minCycles = 1;
  const maxCycles = 12;
  const t = (Math.log2(freq) - LOG_MIN) / (LOG_MAX - LOG_MIN);
  return minCycles + t * (maxCycles - minCycles);
}

export default function FrequencyExplorer() {
  const [frequency, setFrequencyState] = useState(440);
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const phaseRef = useRef(0);
  const frequencyRef = useRef(frequency);

  // Keep refs in sync
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    frequencyRef.current = frequency;
  }, [frequency]);

  // Sine wave animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastTime = 0;

    function draw(time: number) {
      const dt = lastTime ? (time - lastTime) / 1000 : 0;
      lastTime = time;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas!.getBoundingClientRect();
      canvas!.width = rect.width * dpr;
      canvas!.height = rect.height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const w = rect.width;
      const h = rect.height;
      const freq = frequencyRef.current;
      const playing = isPlayingRef.current;

      // Advance phase only while playing
      if (playing) {
        const cycles = freqToVisualCycles(freq);
        phaseRef.current += dt * cycles * 2;
      }

      ctx!.clearRect(0, 0, w, h);

      const cycles = freqToVisualCycles(freq);
      const amplitude = h * 0.38;
      const midY = h / 2;

      // Draw wave
      ctx!.beginPath();
      for (let x = 0; x <= w; x++) {
        const t = x / w;
        const angle = t * cycles * Math.PI * 2 + phaseRef.current;
        const y = midY + Math.sin(angle) * amplitude;
        if (x === 0) ctx!.moveTo(x, y);
        else ctx!.lineTo(x, y);
      }

      if (playing) {
        ctx!.strokeStyle = "#818cf8"; // indigo-400
        ctx!.lineWidth = 2.5;
        ctx!.shadowColor = "#6366f1";
        ctx!.shadowBlur = 8;
      } else {
        ctx!.strokeStyle = "#4b5563"; // gray-600
        ctx!.lineWidth = 1.5;
        ctx!.shadowColor = "transparent";
        ctx!.shadowBlur = 0;
      }
      ctx!.stroke();

      animFrameRef.current = requestAnimationFrame(draw);
    }

    animFrameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  // Stop tone on unmount
  useEffect(() => {
    return () => {
      if (isPlayingRef.current) stopTone();
    };
  }, []);

  const handleToggle = useCallback(async () => {
    if (isPlaying) {
      stopTone();
      setIsPlaying(false);
    } else {
      await startTone(frequency);
      setIsPlaying(true);
    }
  }, [isPlaying, frequency]);

  const handleSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const freq = sliderToFreq(parseFloat(e.target.value));
      const rounded = Math.round(freq * 10) / 10;
      setFrequencyState(rounded);
      if (isPlayingRef.current) {
        setFrequency(rounded);
      }
    },
    [],
  );

  const noteInfo = frequencyToNoteName(frequency);
  const centsLabel =
    noteInfo.cents === 0
      ? ""
      : noteInfo.cents > 0
        ? ` +${noteInfo.cents}¢`
        : ` ${noteInfo.cents}¢`;

  return (
    <section id="foundations" className="scroll-mt-16">
      <h2 className="text-2xl font-bold text-white mb-4">
        Foundations: Sound &amp; Frequency
      </h2>

      <div className="text-gray-300 space-y-3 mb-6 max-w-3xl">
        <p>
          All of music begins with vibrations in the air. When something
          vibrates at a steady rate, we hear it as a <strong>pitch</strong>
          &mdash;a single musical tone. The speed of that vibration is
          measured in <strong>hertz (Hz)</strong>, or cycles per second.
        </p>
        <p>
          Try the slider below to hear different frequencies. Notice how
          lower numbers sound deep and rumbly, while higher numbers sound
          bright and piercing.
        </p>
      </div>

      {/* Interactive player */}
      <div className="bg-gray-800 rounded-xl p-6 max-w-xl space-y-4">
        <canvas
          ref={canvasRef}
          className="w-full h-24 rounded-lg bg-gray-900/50"
        />
        <div className="flex items-center gap-4">
          <button
            onClick={handleToggle}
            className={`px-5 py-2 rounded-lg font-semibold text-sm transition-colors ${
              isPlaying
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            {isPlaying ? "Stop" : "Play"}
          </button>

          <div className="text-2xl font-mono text-white tabular-nums">
            {frequency.toFixed(1)}{" "}
            <span className="text-base text-gray-400">Hz</span>
          </div>

          <div className="text-lg text-indigo-400 font-semibold ml-auto">
            {noteInfo.name}
            {noteInfo.octave}
            <span className="text-sm text-gray-500">{centsLabel}</span>
          </div>
        </div>

        <input
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={freqToSlider(frequency)}
          onChange={handleSliderChange}
          className="w-full accent-indigo-500"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>{MIN_FREQ} Hz</span>
          <span>{MAX_FREQ} Hz</span>
        </div>
      </div>

      {/* Educational notes */}
      <div className="text-gray-400 text-sm space-y-2 mt-6 max-w-3xl">
        <p>
          <strong className="text-gray-300">Octaves:</strong> When you
          double a frequency, you get the same note one octave higher.
          A4&nbsp;=&nbsp;440&nbsp;Hz, so A5&nbsp;=&nbsp;880&nbsp;Hz and
          A3&nbsp;=&nbsp;220&nbsp;Hz.
        </p>
        <p>
          <strong className="text-gray-300">The 12-note system:</strong>{" "}
          Western music divides each octave into 12 equally spaced
          semitones. This is called <em>equal temperament</em>, and it's
          why pianos have 12 keys per octave (7&nbsp;white +
          5&nbsp;black).
        </p>
        <p>
          <strong className="text-gray-300">A4 = 440 Hz:</strong> The
          note A above middle C is tuned to 440&nbsp;Hz by international
          convention. Every other note's frequency is derived from this
          reference.
        </p>
      </div>
    </section>
  );
}
