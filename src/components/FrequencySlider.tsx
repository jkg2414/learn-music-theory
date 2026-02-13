import { useState, useCallback, useRef, useEffect } from "react";
import { startTone, stopTone, setFrequency } from "../audio/audioEngine.ts";

const NOTE_NAMES_SHARP = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
];

function frequencyToNoteName(freq: number): { name: string; octave: number; cents: number } {
  const semitones = 12 * Math.log2(freq / 440);
  const rounded = Math.round(semitones);
  const cents = Math.round((semitones - rounded) * 100);
  const noteIndex = ((rounded % 12) + 12 + 9) % 12;
  const octave = 4 + Math.floor((rounded + 9) / 12);
  return { name: NOTE_NAMES_SHARP[noteIndex], octave, cents };
}

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

function freqToVisualCycles(freq: number): number {
  const minCycles = 1;
  const maxCycles = 12;
  const t = (Math.log2(freq) - LOG_MIN) / (LOG_MAX - LOG_MIN);
  return minCycles + t * (maxCycles - minCycles);
}

interface FrequencySliderProps {
  id?: string;
  initialFrequency?: number;
  label?: string;
  isPlaying?: boolean;
  onPlayingChange?: (playing: boolean) => void;
  onFrequencyChange?: (freq: number) => void;
  externalControl?: boolean;
}

export default function FrequencySlider({
  id = "default",
  initialFrequency = 440,
  label,
  isPlaying: externalIsPlaying,
  onPlayingChange,
  onFrequencyChange,
  externalControl = false,
}: FrequencySliderProps) {
  const [frequency, setFrequencyState] = useState(initialFrequency);
  const [internalPlaying, setInternalPlaying] = useState(false);
  const isPlaying = externalControl ? (externalIsPlaying ?? false) : internalPlaying;
  const isPlayingRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const phaseRef = useRef(0);
  const frequencyRef = useRef(frequency);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    frequencyRef.current = frequency;
  }, [frequency]);

  // Start/stop tone based on isPlaying
  useEffect(() => {
    if (isPlaying) {
      startTone(frequencyRef.current, id);
    } else {
      stopTone(id);
    }
  }, [isPlaying, id]);

  // Stop on unmount
  useEffect(() => {
    return () => { stopTone(id); };
  }, [id]);

  // Canvas animation
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

      if (playing) {
        const cycles = freqToVisualCycles(freq);
        phaseRef.current += dt * cycles * 2;
      }

      ctx!.clearRect(0, 0, w, h);

      const cycles = freqToVisualCycles(freq);
      const amplitude = h * 0.38;
      const midY = h / 2;

      ctx!.beginPath();
      for (let x = 0; x <= w; x++) {
        const t = x / w;
        const angle = t * cycles * Math.PI * 2 + phaseRef.current;
        const y = midY + Math.sin(angle) * amplitude;
        if (x === 0) ctx!.moveTo(x, y);
        else ctx!.lineTo(x, y);
      }

      if (playing) {
        ctx!.strokeStyle = "#6366f1";
        ctx!.lineWidth = 2.5;
        ctx!.shadowColor = "#818cf8";
        ctx!.shadowBlur = 8;
      } else {
        ctx!.strokeStyle = "#d1d5db";
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

  const handleToggle = useCallback(async () => {
    if (externalControl) return;
    if (isPlaying) {
      setInternalPlaying(false);
      onPlayingChange?.(false);
    } else {
      setInternalPlaying(true);
      onPlayingChange?.(true);
    }
  }, [isPlaying, externalControl, onPlayingChange]);

  const handleSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const freq = sliderToFreq(parseFloat(e.target.value));
      const rounded = Math.round(freq * 10) / 10;
      setFrequencyState(rounded);
      onFrequencyChange?.(rounded);
      if (isPlayingRef.current) {
        setFrequency(rounded, id);
      }
    },
    [id, onFrequencyChange],
  );

  const noteInfo = frequencyToNoteName(frequency);
  const centsLabel =
    noteInfo.cents === 0
      ? ""
      : noteInfo.cents > 0
        ? ` +${noteInfo.cents}¢`
        : ` ${noteInfo.cents}¢`;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-3">
      {label && (
        <div className="text-sm font-medium text-gray-500">{label}</div>
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-20 rounded-lg bg-white border border-gray-100"
      />
      <div className="flex items-center gap-4">
        {!externalControl && (
          <button
            onClick={handleToggle}
            className={`px-4 py-1.5 rounded-lg font-semibold text-sm transition-colors ${
              isPlaying
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-indigo-500 hover:bg-indigo-600 text-white"
            }`}
          >
            {isPlaying ? "Stop" : "Play"}
          </button>
        )}

        <div className="text-xl font-mono text-gray-900 tabular-nums">
          {frequency.toFixed(1)}{" "}
          <span className="text-sm text-gray-400">Hz</span>
        </div>

        <div className="text-base text-indigo-500 font-semibold ml-auto">
          {noteInfo.name}
          {noteInfo.octave}
          <span className="text-sm text-gray-400">{centsLabel}</span>
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
      <div className="flex justify-between text-xs text-gray-400">
        <span>{MIN_FREQ} Hz</span>
        <span>{MAX_FREQ} Hz</span>
      </div>
    </div>
  );
}
