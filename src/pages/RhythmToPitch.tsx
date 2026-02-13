import { useState, useEffect, useRef, useCallback } from "react";
import {
  startClickTrain,
  setClickTrainRate,
  stopClickTrain,
} from "../audio/audioEngine.ts";
import SingleClickTrain from "../components/SingleClickTrain.tsx";

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

const RATIO_INTERVALS: Record<string, string> = {
  "2:1": "Octave",
  "3:2": "Perfect Fifth",
  "4:3": "Perfect Fourth",
  "5:4": "Major Third",
  "5:3": "Major Sixth",
  "6:5": "Minor Third",
  "7:4": "Harmonic Seventh",
  "8:5": "Minor Sixth",
};

// Log-scale slider: 0.5 Hz to 150 Hz base rate
const MIN_RATE = 0.5;
const MAX_RATE = 150;
const LOG_MIN = Math.log2(MIN_RATE);
const LOG_MAX = Math.log2(MAX_RATE);

function sliderToRate(v: number): number {
  return Math.pow(2, LOG_MIN + v * (LOG_MAX - LOG_MIN));
}
function rateToSlider(r: number): number {
  return (Math.log2(r) - LOG_MIN) / (LOG_MAX - LOG_MIN);
}

export default function RhythmToPitch() {
  const [numerator, setNumerator] = useState(5);
  const [denominator, setDenominator] = useState(4);
  const [baseRate, setBaseRate] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [beat1, setBeat1] = useState(-1);
  const [beat2, setBeat2] = useState(-1);

  const baseRateRef = useRef(baseRate);
  const numeratorRef = useRef(numerator);
  const denominatorRef = useRef(denominator);
  const playingRef = useRef(false);

  useEffect(() => { baseRateRef.current = baseRate; }, [baseRate]);
  useEffect(() => { numeratorRef.current = numerator; }, [numerator]);
  useEffect(() => { denominatorRef.current = denominator; }, [denominator]);
  useEffect(() => { playingRef.current = playing; }, [playing]);

  const rate1 = baseRate * numerator;
  const rate2 = baseRate * denominator;
  const isMaxed = baseRate >= MAX_RATE * 0.97;

  const ratioKey = `${numerator}:${denominator}`;
  const intervalName = RATIO_INTERVALS[ratioKey];

  // Start / stop click trains
  useEffect(() => {
    if (!playing) return;

    const r1 = baseRateRef.current * numeratorRef.current;
    const r2 = baseRateRef.current * denominatorRef.current;

    startClickTrain("poly-1", r1, true);
    startClickTrain("poly-2", r2, false);

    return () => {
      stopClickTrain("poly-1");
      stopClickTrain("poly-2");
    };
  }, [playing]);

  // Update click train rates when slider or ratio changes
  useEffect(() => {
    if (!playing) return;
    setClickTrainRate("poly-1", baseRate * numerator);
    setClickTrainRate("poly-2", baseRate * denominator);
  }, [baseRate, numerator, denominator, playing]);

  // Visual beat tracking via requestAnimationFrame
  useEffect(() => {
    if (!playing) return;

    let frameId: number;
    const startTime = performance.now();

    function animate() {
      if (!playingRef.current) return;
      const elapsed = (performance.now() - startTime) / 1000;
      const r1 = baseRateRef.current * numeratorRef.current;
      const r2 = baseRateRef.current * denominatorRef.current;
      setBeat1(Math.floor(elapsed * r1) % numeratorRef.current);
      setBeat2(Math.floor(elapsed * r2) % denominatorRef.current);
      frameId = requestAnimationFrame(animate);
    }

    frameId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frameId);
      setBeat1(-1);
      setBeat2(-1);
    };
  }, [playing]);

  // Restart click trains when ratio changes while playing
  useEffect(() => {
    if (!playing) return;
    stopClickTrain("poly-1");
    stopClickTrain("poly-2");
    const r1 = baseRate * numerator;
    const r2 = baseRate * denominator;
    startClickTrain("poly-1", r1, true);
    startClickTrain("poly-2", r2, false);
  }, [numerator, denominator]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopClickTrain("poly-1");
      stopClickTrain("poly-2");
    };
  }, []);

  const handleStop = useCallback(() => {
    setPlaying(false);
    stopClickTrain("poly-1");
    stopClickTrain("poly-2");
  }, []);

  const handleSlider = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setBaseRate(sliderToRate(parseFloat(e.target.value)));
    },
    [],
  );

  // Mode label
  let modeLabel: string;
  if (baseRate < 2) {
    modeLabel = `${Math.round(baseRate * 60)} cycles/min`;
  } else {
    modeLabel = `${baseRate.toFixed(1)} Hz base`;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">
        From Rhythm to Pitch
      </h2>

      <div className="text-gray-600 space-y-4 leading-relaxed">
        <p>
          Here's a mind-bending idea:{" "}
          <strong>
            rhythm and pitch are the same thing at different speeds.
          </strong>{" "}
          A drum hit repeated 4 times per second is a rhythm. Speed it up to
          440 times per second and it becomes the note A4. There's no hard
          boundary — just a gradual transition from hearing individual beats to
          hearing a continuous tone.
        </p>
      </div>

      <SingleClickTrain id="solo-demo" />

      <div className="text-gray-600 space-y-4 leading-relaxed">
        <p>
          Now imagine two of these at once. A{" "}
          <strong>polyrhythm</strong> is two rhythms playing simultaneously
          with different beat counts. Below, two voices repeat in a{" "}
          <strong>
            {numerator}:{denominator}
          </strong>{" "}
          ratio — voice 1 plays {numerator} evenly spaced clicks for every{" "}
          {denominator} clicks of voice 2.
        </p>
        <p>
          Slowly drag the speed slider to the right and listen: the clicks blur
          into a buzz, then into two distinct pitches. The{" "}
          <strong>
            {numerator}:{denominator}
          </strong>{" "}
          ratio between the rhythms becomes a frequency ratio between the tones
          {intervalName ? (
            <>
              {" "}
              — a <strong>{intervalName}</strong>
            </>
          ) : (
            ""
          )}
          .
        </p>
      </div>

      {/* Ratio selector */}
      <div className="flex items-center justify-center gap-4">
        <div className="text-center">
          <select
            value={numerator}
            onChange={(e) => setNumerator(Number(e.target.value))}
            className="text-3xl font-bold text-indigo-600 bg-transparent border-b-2 border-indigo-200 focus:border-indigo-500 outline-none text-center w-16 appearance-none cursor-pointer"
          >
            {[2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <div className="text-xs text-gray-400 mt-1">beats</div>
        </div>
        <div className="text-2xl font-bold text-gray-300">:</div>
        <div className="text-center">
          <select
            value={denominator}
            onChange={(e) => setDenominator(Number(e.target.value))}
            className="text-3xl font-bold text-amber-600 bg-transparent border-b-2 border-amber-200 focus:border-amber-500 outline-none text-center w-16 appearance-none cursor-pointer"
          >
            {[2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <div className="text-xs text-gray-400 mt-1">beats</div>
        </div>
        {intervalName && (
          <div className="text-sm text-gray-500 ml-4 border-l border-gray-200 pl-4">
            {intervalName}
          </div>
        )}
      </div>

      {/* Main control panel */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-5">
        {/* Speed slider */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Speed</span>
            <span className="font-mono text-gray-700">{modeLabel}</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.001}
            value={rateToSlider(baseRate)}
            onChange={handleSlider}
            className="w-full accent-indigo-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Slow (rhythm)</span>
            <span>Fast (pitch)</span>
          </div>
        </div>

        {/* Voice info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-100 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Voice 1 (high click)</div>
            <div className="text-indigo-600 font-mono font-medium">
              {rate1.toFixed(1)}{" "}
              <span className="text-gray-400">
                {rate1 > 20 ? "Hz" : "clicks/sec"}
              </span>
            </div>
            {rate1 > 20 && (
              <div className="text-xs text-gray-400 mt-0.5">
                ≈ {freqToNote(rate1)}
              </div>
            )}
          </div>
          <div className="bg-white border border-gray-100 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Voice 2 (low click)</div>
            <div className="text-amber-600 font-mono font-medium">
              {rate2.toFixed(1)}{" "}
              <span className="text-gray-400">
                {rate2 > 20 ? "Hz" : "clicks/sec"}
              </span>
            </div>
            {rate2 > 20 && (
              <div className="text-xs text-gray-400 mt-0.5">
                ≈ {freqToNote(rate2)}
              </div>
            )}
          </div>
        </div>

        {isMaxed && intervalName && (
          <div className="text-center py-2 px-4 bg-green-50 border border-green-200 rounded-lg text-sm font-medium text-green-700">
            The {numerator}:{denominator} polyrhythm is now a{" "}
            {intervalName.toLowerCase()}!
          </div>
        )}

        {/* Beat visualization */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-indigo-600 w-14">
              Voice 1
            </span>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {Array.from({ length: numerator }, (_, i) => (
                <div
                  key={i}
                  className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-75 ${
                    i === beat1
                      ? "bg-indigo-500 text-white shadow-md shadow-indigo-200 scale-110"
                      : "bg-indigo-100 text-indigo-400"
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-amber-600 w-14">
              Voice 2
            </span>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {Array.from({ length: denominator }, (_, i) => (
                <div
                  key={i}
                  className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-75 ${
                    i === beat2
                      ? "bg-amber-500 text-white shadow-md shadow-amber-200 scale-110"
                      : "bg-amber-100 text-amber-400"
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Play / Stop */}
        <div className="flex justify-center pt-2">
          <button
            onClick={playing ? handleStop : () => setPlaying(true)}
            className={`px-8 py-2.5 rounded-lg font-semibold text-sm transition-colors ${
              playing
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-indigo-500 hover:bg-indigo-600 text-white"
            }`}
          >
            {playing ? "Stop" : "Play"}
          </button>
        </div>
      </div>

      {/* Explanation */}
      <div className="border-t border-gray-200 pt-6 text-gray-600 space-y-4 leading-relaxed">
        <p>
          This isn't just a metaphor — it's physics. A vibration at 20 Hz is
          perceived as a low hum. The exact same vibration at 2 Hz is perceived
          as a beat. Our ears draw the line somewhere around 20 Hz, but there's
          really a continuous spectrum from rhythm to pitch.
        </p>
        <p className="text-sm text-gray-500">
          <strong className="text-gray-700">Try different ratios:</strong> 3:2
          gives a perfect fifth, 4:3 gives a perfect fourth, 2:1 gives an
          octave. The simple ratios that make pleasant-sounding intervals are
          the same ratios that make interlocking polyrhythms.
        </p>
      </div>
    </div>
  );
}
