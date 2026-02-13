import type { ReactNode } from "react";
import BeatVisualizer from "../components/BeatVisualizer.tsx";
import { useLanguage } from "../i18n/LanguageContext.tsx";

const content: Record<"en" | "ko", Record<string, ReactNode>> = {
  en: {
    heading: "Rhythm",
    p1: (
      <p>
        <strong>Rhythm</strong> is the pattern of sounds and silences in time.
        It's what makes you tap your foot, nod your head, or want to dance.
        While melody and harmony deal with <em>which</em> pitches we hear,
        rhythm is about <em>when</em> we hear them.
      </p>
    ),
    p2: (
      <p>
        The most fundamental element of rhythm is the <strong>beat</strong> —
        a steady, recurring pulse. We measure how fast the beat goes in{" "}
        <strong>beats per minute (BPM)</strong>. A relaxed tempo might be
        around 60–80 BPM (one beat per second), while an energetic dance track
        might be 120–140 BPM.
      </p>
    ),
    p3: (
      <p>
        Try the metronome below. Adjust the BPM slider to feel the difference
        between a slow, deliberate pulse and a fast, driving beat.
      </p>
    ),
    metronome: "Metronome",
    tempoMarkings: (
      <p>
        <strong className="text-gray-700">Tempo markings:</strong> Classical
        music uses Italian words for tempo — <em>Largo</em> (very slow,
        ~40–60 BPM), <em>Andante</em> (walking pace, ~76–108 BPM),{" "}
        <em>Allegro</em> (fast, ~120–156 BPM), and <em>Presto</em> (very
        fast, ~168–200 BPM).
      </p>
    ),
    whyMatters: (
      <p>
        <strong className="text-gray-700">Why rhythm matters:</strong> Even
        without melody or harmony, rhythm alone can create music. Drumming
        traditions around the world prove that pattern, timing, and accent are
        enough to create something deeply musical.
      </p>
    ),
  },
  ko: {
    heading: "리듬",
    p1: (
      <p>
        <strong>리듬</strong>은 시간 속에서 소리와 침묵이 이루는 패턴입니다.
        발을 구르고, 고개를 끄덕이고, 춤추고 싶게 만드는 것이 바로
        리듬입니다. 멜로디와 화성이 <em>어떤</em> 음을 듣느냐에 관한
        것이라면, 리듬은 <em>언제</em> 듣느냐에 관한 것입니다.
      </p>
    ),
    p2: (
      <p>
        리듬의 가장 근본적인 요소는 <strong>박(beat)</strong> —
        꾸준히 반복되는 맥박입니다. 박의 빠르기를{" "}
        <strong>분당 박수(BPM)</strong>로 측정합니다. 느긋한 템포는 대략
        60–80 BPM(초당 한 박), 에너지 넘치는 댄스 트랙은
        120–140 BPM 정도입니다.
      </p>
    ),
    p3: (
      <p>
        아래 메트로놈을 사용해 보세요. BPM 슬라이더를 조절하여 느리고
        신중한 맥박과 빠르고 추진력 있는 박자의 차이를 느껴 보세요.
      </p>
    ),
    metronome: "메트로놈",
    tempoMarkings: (
      <p>
        <strong className="text-gray-700">빠르기말:</strong> 클래식 음악은
        템포에 이탈리아어를 사용합니다 — <em>라르고(Largo)</em> (매우 느림,
        ~40–60 BPM), <em>안단테(Andante)</em> (걷는 속도, ~76–108 BPM),{" "}
        <em>알레그로(Allegro)</em> (빠름, ~120–156 BPM),{" "}
        <em>프레스토(Presto)</em> (매우 빠름, ~168–200 BPM).
      </p>
    ),
    whyMatters: (
      <p>
        <strong className="text-gray-700">리듬이 중요한 이유:</strong>{" "}
        멜로디나 화성 없이도 리듬만으로 음악을 만들 수 있습니다. 전 세계의
        타악기 전통은 패턴, 타이밍, 강세만으로도 깊이 있는 음악을
        만들 수 있음을 증명합니다.
      </p>
    ),
  },
};

export default function RhythmIntro() {
  const { lang } = useLanguage();
  const c = content[lang];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">{c.heading}</h2>

      <div className="text-gray-600 space-y-4 leading-relaxed">
        {c.p1}
        {c.p2}
        {c.p3}
      </div>

      <BeatVisualizer beats={4} showBpmSlider={true} label={c.metronome as string} />

      <div className="text-gray-500 text-sm space-y-2">
        {c.tempoMarkings}
        {c.whyMatters}
      </div>
    </div>
  );
}
