import { useState } from "react";
import NavBar from "./components/NavBar.tsx";
import FrequencyExplorer from "./components/sections/FrequencyExplorer.tsx";
import ScaleExplorer from "./components/sections/ScaleExplorer.tsx";
import ChordExplorer from "./components/sections/ChordExplorer.tsx";
import IntervalTrainer from "./components/sections/IntervalTrainer.tsx";

export default function App() {
  const [bpm, setBpm] = useState(120);
  const [octave, setOctave] = useState(4);
  const [transposition, setTransposition] = useState(0);

  return (
    <div className="min-h-screen">
      <NavBar
        bpm={bpm}
        setBpm={setBpm}
        octave={octave}
        setOctave={setOctave}
        transposition={transposition}
        setTransposition={setTransposition}
      />
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-16">
        <FrequencyExplorer />
        <ScaleExplorer octave={octave} bpm={bpm} transposition={transposition} />
        <ChordExplorer octave={octave} bpm={bpm} transposition={transposition} />
        <IntervalTrainer octave={octave} bpm={bpm} transposition={transposition} />
      </main>
    </div>
  );
}
