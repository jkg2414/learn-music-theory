import { NOTE_NAMES, type NoteName } from "../data/notes.ts";
import PianoKey from "./PianoKey.tsx";

interface PianoKeyboardProps {
  startOctave: number;
  numOctaves: number;
  highlightedNotes: NoteName[];
  rootNote?: NoteName;
  onNoteClick: (pitch: string) => void;
}

const WHITE_NOTES: NoteName[] = ["C", "D", "E", "F", "G", "A", "B"];
const BLACK_NOTES: { note: NoteName; position: number }[] = [
  { note: "C#", position: 1 },
  { note: "D#", position: 2 },
  { note: "F#", position: 4 },
  { note: "G#", position: 5 },
  { note: "A#", position: 6 },
];

export default function PianoKeyboard({
  startOctave,
  numOctaves,
  highlightedNotes,
  rootNote,
  onNoteClick,
}: PianoKeyboardProps) {
  const octaves = Array.from({ length: numOctaves }, (_, i) => startOctave + i);

  return (
    <div className="flex w-full select-none">
      {octaves.map((octave) => (
        <div key={octave} className="relative flex flex-1 h-40">
          {WHITE_NOTES.map((note) => {
            const pitch = `${note}${octave}`;
            return (
              <PianoKey
                key={pitch}
                note={note}
                isBlack={false}
                isHighlighted={highlightedNotes.includes(note)}
                isRoot={note === rootNote}
                onClick={() => onNoteClick(pitch)}
              />
            );
          })}
          {BLACK_NOTES.map(({ note, position }) => {
            const pitch = `${note}${octave}`;
            const leftPercent = (position / 7) * 100 - 4;
            const noteIdx = NOTE_NAMES.indexOf(note);
            return (
              <div
                key={pitch}
                className="absolute top-0 z-10"
                style={{
                  left: `${leftPercent}%`,
                  width: "8%",
                  height: "60%",
                }}
              >
                <PianoKey
                  note={note}
                  isBlack={true}
                  isHighlighted={highlightedNotes.includes(NOTE_NAMES[noteIdx])}
                  isRoot={NOTE_NAMES[noteIdx] === rootNote}
                  onClick={() => onNoteClick(pitch)}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
