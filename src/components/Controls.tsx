interface ControlsProps {
  bpm: number;
  setBpm: (bpm: number) => void;
  octave: number;
  setOctave: (octave: number) => void;
  transposition: number;
  setTransposition: (t: number) => void;
}

export default function Controls({
  bpm,
  setBpm,
  octave,
  setOctave,
  transposition,
  setTransposition,
}: ControlsProps) {
  return (
    <div className="flex items-center gap-4 text-sm">
      <label className="flex items-center gap-2">
        <span className="text-gray-500">BPM</span>
        <input
          type="range"
          min={40}
          max={200}
          value={bpm}
          onChange={(e) => setBpm(Number(e.target.value))}
          className="w-20 accent-blue-500"
        />
        <span className="w-8 text-center">{bpm}</span>
      </label>

      <div className="flex items-center gap-1">
        <span className="text-gray-500">Oct</span>
        <button
          className="px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
          onClick={() => setOctave(octave - 1)}
          disabled={octave <= 2}
        >
          -
        </button>
        <span className="w-4 text-center">{octave}</span>
        <button
          className="px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
          onClick={() => setOctave(octave + 1)}
          disabled={octave >= 6}
        >
          +
        </button>
      </div>

      <div className="flex items-center gap-1">
        <span className="text-gray-500">Trans</span>
        <button
          className="px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200"
          onClick={() => setTransposition(transposition - 1)}
        >
          -
        </button>
        <span className="w-6 text-center">{transposition > 0 ? `+${transposition}` : transposition}</span>
        <button
          className="px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200"
          onClick={() => setTransposition(transposition + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
}
