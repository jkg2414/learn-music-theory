import { useState } from "react";
import { NOTE_NAMES } from "../../data/notes.ts";
import { CHORDS, invertChord } from "../../data/chords.ts";
import { PROGRESSIONS } from "../../data/progressions.ts";
import { getChordNotes, getChordPitches, transpose } from "../../utils/musicTheory.ts";
import { playNote, playChord, playSequence, playChordSequence } from "../../audio/audioEngine.ts";
import { useAudioEngine } from "../../hooks/useAudioEngine.ts";
import PianoKeyboard from "../PianoKeyboard.tsx";

interface ChordExplorerProps {
  octave: number;
  bpm: number;
  transposition: number;
}

export default function ChordExplorer({ octave, bpm, transposition }: ChordExplorerProps) {
  const [rootIdx, setRootIdx] = useState(0);
  const [chordIdx, setChordIdx] = useState(0);
  const [inversion, setInversion] = useState(0);
  const [progressionIdx, setProgressionIdx] = useState(0);
  const { isPlaying, play, stop } = useAudioEngine();

  const baseRoot = NOTE_NAMES[rootIdx];
  const root = transpose(baseRoot, transposition);
  const chord = CHORDS[chordIdx];
  const intervals = invertChord(chord.intervals, inversion);
  const chordNotes = getChordNotes(root, intervals);
  const maxInversion = chord.intervals.length - 1;

  const handlePlayChord = () => {
    const pitches = getChordPitches(root, intervals, octave);
    play(() => playChord(pitches, "2n"), 2000);
  };

  const handleArpeggiate = () => {
    const pitches = getChordPitches(root, intervals, octave);
    const durationMs = (pitches.length * 60 / bpm) * 1000;
    play(() => playSequence(pitches, bpm), durationMs);
  };

  const handlePlayProgression = () => {
    const progression = PROGRESSIONS[progressionIdx];
    const chordPitches = progression.degrees.map((degree, i) => {
      const chordRoot = transpose(root, degree);
      const chordType = CHORDS.find((c) => c.name === progression.qualities[i]);
      if (!chordType) return [];
      return getChordPitches(chordRoot, chordType.intervals, octave);
    });
    const durationMs = chordPitches.length * 2 * (60 / bpm) * 1000;
    play(() => playChordSequence(chordPitches, bpm), durationMs);
  };

  const handleNoteClick = (pitch: string) => {
    playNote(pitch);
  };

  const inversionLabel = (n: number) => {
    if (n === 0) return "Root";
    return `${n}${n === 1 ? "st" : n === 2 ? "nd" : "rd"} Inv`;
  };

  return (
    <section id="chords" className="scroll-mt-16">
      <h2 className="text-2xl font-bold mb-4">Chord Explorer</h2>

      <div className="flex flex-wrap gap-4 mb-4">
        <label className="flex items-center gap-2">
          <span className="text-gray-500">Root</span>
          <select
            value={rootIdx}
            onChange={(e) => setRootIdx(Number(e.target.value))}
            className="bg-white border border-gray-300 rounded px-3 py-1.5 text-gray-900"
          >
            {NOTE_NAMES.map((note, i) => (
              <option key={note} value={i}>{note}</option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2">
          <span className="text-gray-500">Type</span>
          <select
            value={chordIdx}
            onChange={(e) => { setChordIdx(Number(e.target.value)); setInversion(0); }}
            className="bg-white border border-gray-300 rounded px-3 py-1.5 text-gray-900"
          >
            {CHORDS.map((c, i) => (
              <option key={c.name} value={i}>{c.name}</option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2">
          <span className="text-gray-500">Inversion</span>
          <select
            value={inversion}
            onChange={(e) => setInversion(Number(e.target.value))}
            className="bg-white border border-gray-300 rounded px-3 py-1.5 text-gray-900"
          >
            {Array.from({ length: maxInversion + 1 }, (_, i) => (
              <option key={i} value={i}>{inversionLabel(i)}</option>
            ))}
          </select>
        </label>

        <div className="flex gap-2">
          <button
            onClick={isPlaying ? stop : handlePlayChord}
            className="px-4 py-1.5 rounded bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium"
          >
            {isPlaying ? "Stop" : "Play Chord"}
          </button>
          <button
            onClick={isPlaying ? stop : handleArpeggiate}
            className="px-4 py-1.5 rounded bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium"
            disabled={isPlaying}
          >
            Arpeggiate
          </button>
        </div>
      </div>

      <PianoKeyboard
        startOctave={octave}
        numOctaves={2}
        highlightedNotes={chordNotes}
        rootNote={root}
        onNoteClick={handleNoteClick}
      />

      <div className="mt-3 text-sm text-gray-500">
        <span className="font-medium text-gray-700">
          {root}{chord.symbol}
          {inversion > 0 ? ` (${inversionLabel(inversion)})` : ""}:
        </span>{" "}
        {chordNotes.join(" – ")}
      </div>

      {/* Progressions */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold mb-3">Chord Progressions</h3>
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2">
            <span className="text-gray-500">Progression</span>
            <select
              value={progressionIdx}
              onChange={(e) => setProgressionIdx(Number(e.target.value))}
              className="bg-white border border-gray-300 rounded px-3 py-1.5 text-gray-900"
            >
              {PROGRESSIONS.map((p, i) => (
                <option key={p.name} value={i}>{p.name}</option>
              ))}
            </select>
          </label>
          <button
            onClick={isPlaying ? stop : handlePlayProgression}
            className="px-4 py-1.5 rounded bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium"
          >
            {isPlaying ? "Stop" : "Play Progression"}
          </button>
          <span className="text-sm text-gray-400">
            in {root}: {PROGRESSIONS[progressionIdx].numerals.join(" → ")}
          </span>
        </div>
      </div>
    </section>
  );
}
