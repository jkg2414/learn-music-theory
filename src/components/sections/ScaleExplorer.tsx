import { useState } from "react";
import { NOTE_NAMES } from "../../data/notes.ts";
import { SCALES } from "../../data/scales.ts";
import { getScaleNotes, getScalePitches, transpose } from "../../utils/musicTheory.ts";
import { playNote, playSequence } from "../../audio/audioEngine.ts";
import { useAudioEngine } from "../../hooks/useAudioEngine.ts";
import PianoKeyboard from "../PianoKeyboard.tsx";

interface ScaleExplorerProps {
  octave: number;
  bpm: number;
  transposition: number;
}

export default function ScaleExplorer({ octave, bpm, transposition }: ScaleExplorerProps) {
  const [rootIdx, setRootIdx] = useState(0);
  const [scaleIdx, setScaleIdx] = useState(0);
  const { isPlaying, play, stop } = useAudioEngine();

  const baseRoot = NOTE_NAMES[rootIdx];
  const root = transpose(baseRoot, transposition);
  const scale = SCALES[scaleIdx];
  const scaleNotes = getScaleNotes(root, scale.intervals);

  const handlePlayAscending = () => {
    const pitches = getScalePitches(root, scale.intervals, octave);
    // Add the octave note at the end
    const rootPitch = `${root}${octave + 1}`;
    const allPitches = [...pitches, rootPitch];
    const durationMs = (allPitches.length * 60 / bpm) * 1000;
    play(() => playSequence(allPitches, bpm), durationMs);
  };

  const handlePlayDescending = () => {
    const pitches = getScalePitches(root, scale.intervals, octave);
    const rootPitch = `${root}${octave + 1}`;
    const allPitches = [...pitches, rootPitch].reverse();
    const durationMs = (allPitches.length * 60 / bpm) * 1000;
    play(() => playSequence(allPitches, bpm), durationMs);
  };

  const handleNoteClick = (pitch: string) => {
    playNote(pitch);
  };

  return (
    <section id="scales" className="scroll-mt-16">
      <h2 className="text-2xl font-bold mb-4">Scale Explorer</h2>

      <div className="flex flex-wrap gap-4 mb-4">
        <label className="flex items-center gap-2">
          <span className="text-gray-400">Root</span>
          <select
            value={rootIdx}
            onChange={(e) => setRootIdx(Number(e.target.value))}
            className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-white"
          >
            {NOTE_NAMES.map((note, i) => (
              <option key={note} value={i}>{note}</option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2">
          <span className="text-gray-400">Scale</span>
          <select
            value={scaleIdx}
            onChange={(e) => setScaleIdx(Number(e.target.value))}
            className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-white"
          >
            {SCALES.map((s, i) => (
              <option key={s.name} value={i}>{s.name}</option>
            ))}
          </select>
        </label>

        <div className="flex gap-2">
          <button
            onClick={isPlaying ? stop : handlePlayAscending}
            className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium"
          >
            {isPlaying ? "Stop" : "Play Ascending"}
          </button>
          <button
            onClick={isPlaying ? stop : handlePlayDescending}
            className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium"
            disabled={isPlaying}
          >
            Play Descending
          </button>
        </div>
      </div>

      <PianoKeyboard
        startOctave={octave}
        numOctaves={2}
        highlightedNotes={scaleNotes}
        rootNote={root}
        onNoteClick={handleNoteClick}
      />

      <div className="mt-3 text-sm text-gray-400">
        <span className="font-medium text-gray-300">{root} {scale.name}:</span>{" "}
        {scaleNotes.join(" – ")}
        <span className="ml-4 text-gray-500">
          Formula: {scale.intervals.join(" ")}
        </span>
      </div>
    </section>
  );
}
