import { useState, useCallback } from "react";
import FrequencySlider from "../components/FrequencySlider.tsx";
import { startTone, stopAllTones } from "../audio/audioEngine.ts";

export default function HarmonyIntro() {
  const [allPlaying, setAllPlaying] = useState(false);
  const [frequencies] = useState([262, 330, 392]); // C4, E4, G4 approx

  const handleToggleAll = useCallback(async () => {
    if (allPlaying) {
      stopAllTones();
      setAllPlaying(false);
    } else {
      await startTone(frequencies[0], "harmony-1");
      await startTone(frequencies[1], "harmony-2");
      await startTone(frequencies[2], "harmony-3");
      setAllPlaying(true);
    }
  }, [allPlaying, frequencies]);

  const handleStopAll = useCallback(() => {
    stopAllTones();
    setAllPlaying(false);
  }, []);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Harmony</h2>

      <div className="text-gray-600 space-y-4 leading-relaxed">
        <p>
          We can combine multiple pitches sounding at the same time to form{" "}
          <strong>chords</strong>, or <strong>harmony</strong>. Harmony is what
          gives music its richness and emotional depth — it's the difference
          between a single voice singing alone and a full choir.
        </p>
        <p>
          Try playing each of the three tones below individually, then use the
          "Play All" button to hear them together as a chord.
        </p>
      </div>

      <div className="space-y-4">
        <FrequencySlider
          id="harmony-1"
          initialFrequency={262}
          label="Tone 1"
        />
        <FrequencySlider
          id="harmony-2"
          initialFrequency={330}
          label="Tone 2"
        />
        <FrequencySlider
          id="harmony-3"
          initialFrequency={392}
          label="Tone 3"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleToggleAll}
          className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors ${
            allPlaying
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-indigo-500 hover:bg-indigo-600 text-white"
          }`}
        >
          {allPlaying ? "Stop All" : "Play All"}
        </button>
        {allPlaying && (
          <button
            onClick={handleStopAll}
            className="px-6 py-2.5 rounded-lg font-semibold text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      <div className="border-t border-gray-200 pt-6 text-gray-600 space-y-4 leading-relaxed">
        <p>
          <strong className="text-gray-700">Note that an octave is double
          the frequency of another wave.</strong> If one tone is at 220 Hz, the
          same note one octave higher is at 440 Hz — exactly twice the
          frequency. Try setting two sliders to frequencies in a 2:1 ratio and
          listen to how they blend together almost as one sound.
        </p>
        <p className="text-sm text-gray-500">
          Simple frequency ratios tend to sound consonant (pleasant) together.
          A 2:1 ratio is an octave, 3:2 is a perfect fifth, and 4:3 is a
          perfect fourth. These relationships are the mathematical foundation
          of harmony.
        </p>
      </div>
    </div>
  );
}
