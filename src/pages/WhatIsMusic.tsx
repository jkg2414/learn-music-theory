import type { ReactNode } from "react";
import { useLanguage } from "../i18n/LanguageContext.tsx";

const content: Record<"en" | "ko", Record<string, ReactNode>> = {
  en: {
    heading: "What is Music?",
    intro1: (
      <p>
        Music is the art of organizing sound in time. At its core, music is
        vibrations in the air — but through structure, intention, and
        expression, those vibrations become something that can move us
        emotionally, tell stories, and connect people across cultures and
        centuries.
      </p>
    ),
    intro2: (
      <p>
        Music can encompass or emphasize many different elements. Here are
        just a few:
      </p>
    ),
    compositionTitle: "Composition",
    compositionDesc: (
      <p className="text-gray-600 text-sm mb-3">
        The art of arranging musical ideas into a complete work — melody,
        harmony, and structure woven together.
      </p>
    ),
    compositionCaption: "Clair de Lune — Claude Debussy",
    rhythmTitle: "Rhythm",
    rhythmDesc: (
      <p className="text-gray-600 text-sm mb-3">
        The pattern of beats and accents that gives music its pulse and
        drive.
      </p>
    ),
    rhythmCaption: "African Drumming",
    sonorityTitle: "Sonority",
    sonorityDesc: (
      <p className="text-gray-600 text-sm">
        The quality and color of sound — the difference between a violin
        and a trumpet playing the same note, or the lush wash of a full
        orchestra versus a solo voice.
      </p>
    ),
    lyricsTitle: "Lyrics",
    lyricsDesc: (
      <p className="text-gray-600 text-sm">
        Words set to music, adding narrative, poetry, and human expression
        to the sonic experience.
      </p>
    ),
    andMore: "And the list goes on.",
    focus: (
      <p className="text-gray-700 font-medium text-lg">
        For the purposes of this primer, let's focus on{" "}
        <span className="text-indigo-600">melody</span>,{" "}
        <span className="text-indigo-600">harmony</span>, and{" "}
        <span className="text-indigo-600">rhythm</span>.
      </p>
    ),
  },
  ko: {
    heading: "음악이란 무엇인가?",
    intro1: (
      <p>
        음악은 소리를 시간 속에서 조직하는 예술입니다. 본질적으로 음악은
        공기의 진동이지만, 구조와 의도, 표현을 통해 그 진동은 우리를
        감동시키고, 이야기를 전하며, 문화와 세기를 초월하여 사람들을
        연결하는 무언가가 됩니다.
      </p>
    ),
    intro2: (
      <p>
        음악은 다양한 요소를 포함하거나 강조할 수 있습니다. 그중 몇
        가지를 소개합니다:
      </p>
    ),
    compositionTitle: "작곡",
    compositionDesc: (
      <p className="text-gray-600 text-sm mb-3">
        멜로디, 화성, 구조를 엮어 음악적 아이디어를 하나의 완성된 작품으로
        배열하는 예술입니다.
      </p>
    ),
    compositionCaption: "달빛 — 클로드 드뷔시",
    rhythmTitle: "리듬",
    rhythmDesc: (
      <p className="text-gray-600 text-sm mb-3">
        음악에 맥박과 추진력을 부여하는 박자와 강세의 패턴입니다.
      </p>
    ),
    rhythmCaption: "아프리카 드럼 연주",
    sonorityTitle: "음색",
    sonorityDesc: (
      <p className="text-gray-600 text-sm">
        소리의 질감과 색채 — 같은 음을 연주하는 바이올린과 트럼펫의 차이,
        또는 풀 오케스트라의 풍성한 울림과 독창의 차이를 말합니다.
      </p>
    ),
    lyricsTitle: "가사",
    lyricsDesc: (
      <p className="text-gray-600 text-sm">
        음악에 입힌 가사는 서사, 시, 그리고 인간의 표현을 소리 경험에
        더해 줍니다.
      </p>
    ),
    andMore: "이 외에도 많은 요소들이 있습니다.",
    focus: (
      <p className="text-gray-700 font-medium text-lg">
        이 입문서에서는{" "}
        <span className="text-indigo-600">멜로디</span>,{" "}
        <span className="text-indigo-600">화성</span>, 그리고{" "}
        <span className="text-indigo-600">리듬</span>에 초점을 맞추겠습니다.
      </p>
    ),
  },
};

export default function WhatIsMusic() {
  const { lang } = useLanguage();
  const c = content[lang];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">{c.heading}</h2>

      <div className="text-gray-600 space-y-4 leading-relaxed">
        {c.intro1}
        {c.intro2}
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {c.compositionTitle}
          </h3>
          {c.compositionDesc}
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
            {c.compositionCaption}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {c.rhythmTitle}
          </h3>
          {c.rhythmDesc}
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
          <p className="text-xs text-gray-400 mt-1">{c.rhythmCaption}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {c.sonorityTitle}
          </h3>
          {c.sonorityDesc}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {c.lyricsTitle}
          </h3>
          {c.lyricsDesc}
        </div>

        <p className="text-gray-500 text-sm italic">{c.andMore}</p>
      </div>

      <div className="border-t border-gray-200 pt-6">
        {c.focus}
      </div>
    </div>
  );
}
