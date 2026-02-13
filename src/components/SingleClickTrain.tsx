import { useState, useEffect, useRef, useCallback } from "react";
import {
  startClickTrain,
  setClickTrainRate,
  stopClickTrain,
} from "../audio/audioEngine.ts";

const NOTE_NAMES = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
];

function freqToNote(freq: number): string {
  const semitones = 12 * Math.log2(freq / 440);
  const rounded = Math.round(semitones);
  const noteIndex = ((rounded % 12) + 12 + 9) % 12;
  const octave = 4 + Math.floor((rounded + 9) / 12);
  return `${NOTE_NAMES[noteIndex]}${octave}`;
}

const MIN_RATE = 0.5;
const MAX_RATE = 500;
const LOG_MIN = Math.log2(MIN_RATE);
const LOG_MAX = Math.log2(MAX_RATE);

function sliderToRate(v: number): number {
  return Math.pow(2, LOG_MIN + v * (LOG_MAX - LOG_MIN));
}
function rateToSlider(r: number): number {
  return (Math.log2(r) - LOG_MIN) / (LOG_MAX - LOG_MIN);
}

interface SingleClickTrainProps {
  id?: string;
}

export default function SingleClickTrain({ id = "solo" }: SingleClickTrainProps) {
  const [rate, setRate] = useState(2);
  const [playing, setPlaying] = useState(false);
  const rateRef = useRef(rate);

  useEffect(() => { rateRef.current = rate; }, [rate]);

  useEffect(() => {
    if (!playing) return;
    startClickTrain(id, rateRef.current, true);
    return () => { stopClickTrain(id); };
  }, [playing, id]);

  useEffect(() => {
    if (!playing) return;
    setClickTrainRate(id, rate);
  }, [rate, playing, id]);

  useEffect(() => {
    return () => { stopClickTrain(id); };
  }, [id]);

  const handleStop = useCallback(() => {
    setPlaying(false);
    stopClickTrain(id);
  }, [id]);

  const handleSlider = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setRate(sliderToRate(parseFloat(e.target.value)));
    },
    [],
  );

  let rateLabel: string;
  if (rate < 20) {
    rateLabel = `${rate.toFixed(1)} clicks/sec`;
  } else {
    rateLabel = `${rate.toFixed(1)} Hz — ${freqToNote(rate)}`;
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={playing ? handleStop : () => setPlaying(true)}
          className={`px-5 py-2 rounded-lg font-semibold text-sm transition-colors ${
            playing
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-indigo-500 hover:bg-indigo-600 text-white"
          }`}
        >
          {playing ? "Stop" : "Play"}
        </button>
        <div className="text-right">
          <div className="font-mono text-gray-900 font-medium">{rateLabel}</div>
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={1}
        step={0.001}
        value={rateToSlider(rate)}
        onChange={handleSlider}
        className="w-full accent-indigo-500"
      />
      <div className="flex justify-between text-xs text-gray-400">
        <span>Slow (rhythm)</span>
        <span>Fast (pitch)</span>
      </div>
    </div>
  );
}
