export default function WhatIsMusic() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">What is Music?</h2>

      <div className="text-gray-600 space-y-4 leading-relaxed">
        <p>
          Music is the art of organizing sound in time. At its core, music is
          vibrations in the air — but through structure, intention, and
          expression, those vibrations become something that can move us
          emotionally, tell stories, and connect people across cultures and
          centuries.
        </p>
        <p>
          Music can encompass or emphasize many different elements. Here are
          just a few:
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Composition
          </h3>
          <p className="text-gray-600 text-sm mb-3">
            The art of arranging musical ideas into a complete work — melody,
            harmony, and structure woven together.
          </p>
          <div className="rounded-xl overflow-hidden border border-gray-200 aspect-video">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/yxxSJzloDjg"
              title="Clair de Lune - Debussy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="block"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Clair de Lune — Claude Debussy
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Rhythm</h3>
          <p className="text-gray-600 text-sm mb-3">
            The pattern of beats and accents that gives music its pulse and
            drive.
          </p>
          <div className="rounded-xl overflow-hidden border border-gray-200 aspect-video">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/uOkRdcTxZko"
              title="African Drumming"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="block"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">African Drumming</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Sonority
          </h3>
          <p className="text-gray-600 text-sm">
            The quality and color of sound — the difference between a violin
            and a trumpet playing the same note, or the lush wash of a full
            orchestra versus a solo voice.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Lyrics</h3>
          <p className="text-gray-600 text-sm">
            Words set to music, adding narrative, poetry, and human expression
            to the sonic experience.
          </p>
        </div>

        <p className="text-gray-500 text-sm italic">And the list goes on.</p>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <p className="text-gray-700 font-medium text-lg">
          For the purposes of this primer, let's focus on{" "}
          <span className="text-indigo-600">melody</span>,{" "}
          <span className="text-indigo-600">harmony</span>, and{" "}
          <span className="text-indigo-600">rhythm</span>.
        </p>
      </div>
    </div>
  );
}
