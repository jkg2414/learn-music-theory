import { useState, useEffect, useRef, useCallback } from "react";
import { playClick } from "../audio/audioEngine.ts";

interface BeatVisualizerProps {
  beats: number;
  bpm?: number;
  onBpmChange?: (bpm: number) => void;
  showBpmSlider?: boolean;
  label?: string;
}

export default function BeatVisualizer({
  beats,
  bpm: externalBpm,
  onBpmChange,
  showBpmSlider = false,
  label,
}: BeatVisualizerProps) {
  const [internalBpm, setInternalBpm] = useState(100);
  const bpm = externalBpm ?? internalBpm;
  const [playing, setPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(-1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const beatRef = useRef(-1);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setPlaying(false);
    setCurrentBeat(-1);
    beatRef.current = -1;
  }, []);

  const start = useCallback(() => {
    stop();
    beatRef.current = 0;
    setCurrentBeat(0);
    playClick(true);
    setPlaying(true);

    const ms = (60 / bpm) * 1000;
    intervalRef.current = setInterval(() => {
      beatRef.current = (beatRef.current + 1) % beats;
      setCurrentBeat(beatRef.current);
      playClick(beatRef.current === 0);
    }, ms);
  }, [bpm, beats, stop]);

  // Restart if bpm or beats change while playing
  useEffect(() => {
    if (playing) {
      start();
    }
  }, [bpm, beats]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleBpmChange = (val: number) => {
    setInternalBpm(val);
    onBpmChange?.(val);
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
      {label && (
        <div className="text-sm font-medium text-gray-500">{label}</div>
      )}

      {/* Beat circles */}
      <div className="flex flex-wrap items-end justify-center gap-2 sm:gap-3">
        {Array.from({ length: beats }, (_, i) => {
          const isAccent = i === 0;
          const isActive = i === currentBeat;
          const size = isAccent ? "w-9 h-9 sm:w-12 sm:h-12" : "w-8 h-8 sm:w-10 sm:h-10";

          let bg: string;
          if (isActive && isAccent) {
            bg = "bg-indigo-500 shadow-lg shadow-indigo-200";
          } else if (isActive) {
            bg = "bg-indigo-400 shadow-md shadow-indigo-100";
          } else if (isAccent) {
            bg = "bg-gray-300";
          } else {
            bg = "bg-gray-200";
          }

          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className={`${size} ${bg} rounded-full flex items-center justify-center transition-all duration-75`}
              >
                <span
                  className={`text-sm font-bold ${
                    isActive ? "text-white" : "text-gray-500"
                  }`}
                >
                  {i + 1}
                </span>
              </div>
              {isAccent && (
                <span className="text-[10px] text-gray-400 font-medium">
                  accent
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={playing ? stop : start}
          className={`px-5 py-2 rounded-lg font-semibold text-sm transition-colors ${
            playing
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-indigo-500 hover:bg-indigo-600 text-white"
          }`}
        >
          {playing ? "Stop" : "Play"}
        </button>

        {showBpmSlider && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">BPM</span>
            <input
              type="range"
              min={40}
              max={208}
              value={bpm}
              onChange={(e) => handleBpmChange(Number(e.target.value))}
              className="w-32 accent-indigo-500"
            />
            <span className="text-sm font-mono text-gray-700 w-8 text-center tabular-nums">
              {bpm}
            </span>
          </div>
        )}
      </div>

      {/* Time signature display */}
      <div className="flex justify-center">
        <div className="flex flex-col items-center leading-none border border-gray-200 rounded-lg px-4 py-2 bg-white">
          <span className="text-2xl font-bold text-gray-800">{beats}</span>
          <div className="w-6 h-px bg-gray-400 my-0.5" />
          <span className="text-2xl font-bold text-gray-800">4</span>
        </div>
      </div>
    </div>
  );
}
