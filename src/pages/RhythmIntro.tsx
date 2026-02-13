import BeatVisualizer from "../components/BeatVisualizer.tsx";

export default function RhythmIntro() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Rhythm</h2>

      <div className="text-gray-600 space-y-4 leading-relaxed">
        <p>
          <strong>Rhythm</strong> is the pattern of sounds and silences in time.
          It's what makes you tap your foot, nod your head, or want to dance.
          While melody and harmony deal with <em>which</em> pitches we hear,
          rhythm is about <em>when</em> we hear them.
        </p>
        <p>
          The most fundamental element of rhythm is the <strong>beat</strong> —
          a steady, recurring pulse. We measure how fast the beat goes in{" "}
          <strong>beats per minute (BPM)</strong>. A relaxed tempo might be
          around 60–80 BPM (one beat per second), while an energetic dance track
          might be 120–140 BPM.
        </p>
        <p>
          Try the metronome below. Adjust the BPM slider to feel the difference
          between a slow, deliberate pulse and a fast, driving beat.
        </p>
      </div>

      <BeatVisualizer beats={4} showBpmSlider={true} label="Metronome" />

      <div className="text-gray-500 text-sm space-y-2">
        <p>
          <strong className="text-gray-700">Tempo markings:</strong> Classical
          music uses Italian words for tempo — <em>Largo</em> (very slow,
          ~40–60 BPM), <em>Andante</em> (walking pace, ~76–108 BPM),{" "}
          <em>Allegro</em> (fast, ~120–156 BPM), and <em>Presto</em> (very
          fast, ~168–200 BPM).
        </p>
        <p>
          <strong className="text-gray-700">Why rhythm matters:</strong> Even
          without melody or harmony, rhythm alone can create music. Drumming
          traditions around the world prove that pattern, timing, and accent are
          enough to create something deeply musical.
        </p>
      </div>
    </div>
  );
}
