import type { ReactNode } from "react";
import BeatVisualizer from "../components/BeatVisualizer.tsx";
import { useLanguage } from "../i18n/LanguageContext.tsx";

const content: Record<"en" | "ko", Record<string, ReactNode>> = {
  en: {
    heading: "Time Signatures",
    p1: (
      <p>
        A <strong>time signature</strong> tells us how beats are grouped into
        repeating patterns called <strong>measures</strong>. The top number
        says how many beats are in each measure, and the bottom number says
        what kind of note gets one beat (4 means a quarter note).
      </p>
    ),
    p2: (
      <p>
        The first beat of each measure — called the{" "}
        <strong>downbeat</strong> — is typically emphasized, creating a natural
        sense of pulse and phrasing. Different time signatures create
        different "feels" in music.
      </p>
    ),
    fourFourTitle: '4/4 — "Common Time"',
    fourFourDesc: (
      <p className="text-gray-600 text-sm">
        Four beats per measure. This is by far the most common time signature
        in Western music — pop, rock, hip-hop, electronic, and most jazz use
        4/4. The strong accent on beat 1, with a lighter accent on beat 3,
        gives it a steady, balanced feel:{" "}
        <strong>ONE</strong>-two-<em>three</em>-four.
      </p>
    ),
    fourFourHear: "Can you hear the rhythm in this song?",
    threeFourTitle: '3/4 — "Waltz Time"',
    threeFourDesc: (
      <p className="text-gray-600 text-sm">
        Three beats per measure. This creates a lilting, dance-like feel —
        it's the rhythm of the waltz. The emphasis pattern is{" "}
        <strong>ONE</strong>-two-three, <strong>ONE</strong>-two-three, which
        gives it a graceful, circular quality.
      </p>
    ),
    fiveFourTitle: '5/4 — "Odd Time"',
    fiveFourDesc: (
      <p className="text-gray-600 text-sm">
        Five beats per measure. This is an "odd" or "asymmetric" time
        signature — it feels uneven compared to 4/4 or 3/4, which is exactly
        what makes it interesting. It's often felt as 3+2 or 2+3, creating a
        distinctive, slightly off-kilter groove.
      </p>
    ),
  },
  ko: {
    heading: "박자표",
    p1: (
      <p>
        <strong>박자표</strong>는 박자가 <strong>마디</strong>라는 반복
        패턴으로 어떻게 묶이는지 알려 줍니다. 위의 숫자는 각 마디에 몇 박이
        있는지, 아래 숫자는 어떤 음표가 한 박인지를 나타냅니다(4는 4분음표).
      </p>
    ),
    p2: (
      <p>
        각 마디의 첫 번째 박 — <strong>강박(다운비트)</strong>이라고
        합니다 — 은 보통 강조되어 자연스러운 맥박감과 프레이징을
        만들어 냅니다. 다양한 박자표가 음악에 다양한 "느낌"을 만들어 줍니다.
      </p>
    ),
    fourFourTitle: '4/4 — "보통 박자"',
    fourFourDesc: (
      <p className="text-gray-600 text-sm">
        마디당 4박입니다. 서양 음악에서 가장 흔한 박자표로, 팝, 록, 힙합,
        일렉트로닉, 대부분의 재즈가 4/4를 사용합니다. 1박에 강한 강세,
        3박에 약간의 강세가 있어 안정적이고 균형 잡힌 느낌을 줍니다:{" "}
        <strong>하나</strong>-둘-<em>셋</em>-넷.
      </p>
    ),
    fourFourHear: "이 노래에서 리듬이 들리나요?",
    threeFourTitle: '3/4 — "왈츠 박자"',
    threeFourDesc: (
      <p className="text-gray-600 text-sm">
        마디당 3박입니다. 경쾌하고 춤추는 듯한 느낌을 만들어 냅니다 —
        왈츠의 리듬이 바로 이것입니다. 강세 패턴은{" "}
        <strong>하나</strong>-둘-셋, <strong>하나</strong>-둘-셋으로,
        우아하고 원형적인 느낌을 줍니다.
      </p>
    ),
    fiveFourTitle: '5/4 — "홀수 박자"',
    fiveFourDesc: (
      <p className="text-gray-600 text-sm">
        마디당 5박입니다. "홀수" 또는 "비대칭" 박자표로, 4/4나 3/4에 비해
        불균등하게 느껴지는데, 바로 그 점이 흥미로운 부분입니다. 보통
        3+2 또는 2+3으로 느껴지며, 독특하고 약간 기울어진 그루브를
        만들어 냅니다.
      </p>
    ),
  },
};

export default function TimeSignatures() {
  const { lang } = useLanguage();
  const c = content[lang];

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-bold text-gray-900">{c.heading}</h2>

      <div className="text-gray-600 space-y-4 leading-relaxed">
        {c.p1}
        {c.p2}
      </div>

      {/* 4/4 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {c.fourFourTitle}
        </h3>
        {c.fourFourDesc}

        <BeatVisualizer beats={4} showBpmSlider={true} />

        <p className="text-gray-600 text-sm">
          {c.fourFourHear}
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
          {c.threeFourTitle}
        </h3>
        {c.threeFourDesc}

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
          {c.fiveFourTitle}
        </h3>
        {c.fiveFourDesc}

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
