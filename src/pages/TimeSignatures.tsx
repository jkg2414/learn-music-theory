import BeatVisualizer from "../components/BeatVisualizer.tsx";

export default function TimeSignatures() {
  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-bold text-gray-900">Time Signatures</h2>

      <div className="text-gray-600 space-y-4 leading-relaxed">
        <p>
          A <strong>time signature</strong> tells us how beats are grouped into
          repeating patterns called <strong>measures</strong>. The top number
          says how many beats are in each measure, and the bottom number says
          what kind of note gets one beat (4 means a quarter note).
        </p>
        <p>
          The first beat of each measure — called the{" "}
          <strong>downbeat</strong> — is typically emphasized, creating a natural
          sense of pulse and phrasing. Different time signatures create
          different "feels" in music.
        </p>
      </div>

      {/* 4/4 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          4/4 — "Common Time"
        </h3>
        <p className="text-gray-600 text-sm">
          Four beats per measure. This is by far the most common time signature
          in Western music — pop, rock, hip-hop, electronic, and most jazz use
          4/4. The strong accent on beat 1, with a lighter accent on beat 3,
          gives it a steady, balanced feel:{" "}
          <strong>ONE</strong>-two-<em>three</em>-four.
        </p>

        <BeatVisualizer beats={4} showBpmSlider={true} />

        <p className="text-gray-600 text-sm">
          Can you hear the rhythm in this song?
        </p>
        <div className="rounded-xl overflow-hidden border border-gray-200 aspect-video">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/kTHNpusq654?start=31"
            title="4/4 Time Example"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="block"
          />
        </div>
      </div>

      {/* 3/4 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          3/4 — "Waltz Time"
        </h3>
        <p className="text-gray-600 text-sm">
          Three beats per measure. This creates a lilting, dance-like feel —
          it's the rhythm of the waltz. The emphasis pattern is{" "}
          <strong>ONE</strong>-two-three, <strong>ONE</strong>-two-three, which
          gives it a graceful, circular quality.
        </p>

        <BeatVisualizer beats={3} showBpmSlider={true} />

        <div className="rounded-xl overflow-hidden border border-gray-200 aspect-video">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/7iDfvoqOhD8"
            title="3/4 Time Example — Waltz"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="block"
          />
        </div>
      </div>

      {/* 5/4 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          5/4 — "Odd Time"
        </h3>
        <p className="text-gray-600 text-sm">
          Five beats per measure. This is an "odd" or "asymmetric" time
          signature — it feels uneven compared to 4/4 or 3/4, which is exactly
          what makes it interesting. It's often felt as 3+2 or 2+3, creating a
          distinctive, slightly off-kilter groove.
        </p>

        <BeatVisualizer beats={5} showBpmSlider={true} />

        <div className="rounded-xl overflow-hidden border border-gray-200 aspect-video">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/vmDDOFXSgAs"
            title="5/4 Time Example"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="block"
          />
        </div>
      </div>
    </div>
  );
}
