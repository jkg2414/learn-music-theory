import { playNote } from "../audio/audioEngine.ts";
import PianoKeyboard from "../components/PianoKeyboard.tsx";
import { NOTE_NAMES } from "../data/notes.ts";

export default function TwelveNotes() {
  const handleNoteClick = (pitch: string) => {
    playNote(pitch);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">The 12 Notes</h2>

      <div className="text-gray-600 space-y-4 leading-relaxed">
        <p>
          For reasons we won't get into now, Western harmony has settled on
          subdividing each octave into <strong>12 equally spaced notes</strong>.
          This system is called <em>equal temperament</em>.
        </p>
        <p>
          These 12 notes repeat in every octave, getting higher in pitch each
          time. On a piano, you can see them clearly: 7 white keys and 5 black
          keys make up one octave.
        </p>
      </div>

      <div>
        <PianoKeyboard
          startOctave={3}
          numOctaves={3}
          highlightedNotes={[]}
          onNoteClick={handleNoteClick}
        />
        <p className="text-xs text-gray-400 mt-2">
          Click any key to hear the note.
        </p>
      </div>

      <div className="text-gray-600 space-y-4 leading-relaxed">
        <p>The 12 notes are:</p>
        <div className="flex flex-wrap gap-2">
          {NOTE_NAMES.map((note) => (
            <span
              key={note}
              className={`px-3 py-1.5 rounded-lg text-sm font-mono font-medium ${
                note.includes("#")
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-800 border border-gray-200"
              }`}
            >
              {note}
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-500">
          The sharp (#) notes are the black keys on the piano. They sit between
          the white keys — for example, C# is between C and D. These same notes
          can also be called "flats" (Db instead of C#), but they refer to the
          same pitch.
        </p>
      </div>
    </div>
  );
}
