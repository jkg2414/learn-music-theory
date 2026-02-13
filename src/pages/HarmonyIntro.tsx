import { useState, useCallback, type ReactNode } from "react";
import FrequencySlider from "../components/FrequencySlider.tsx";
import { startTone, stopAllTones } from "../audio/audioEngine.ts";
import { useLanguage } from "../i18n/LanguageContext.tsx";
import { common } from "../i18n/common.ts";

const content: Record<"en" | "ko", Record<string, ReactNode>> = {
  en: {
    heading: "Harmony",
    p1: (
      <p>
        We can combine multiple pitches sounding at the same time to form{" "}
        <strong>chords</strong>, or <strong>harmony</strong>. Harmony is what
        gives music its richness and emotional depth — it's the difference
        between a single voice singing alone and a full choir.
      </p>
    ),
    p2: (
      <p>
        Try playing each of the three tones below individually, then use the
        "Play All" button to hear them together as a chord.
      </p>
    ),
    tone1: "Tone 1",
    tone2: "Tone 2",
    tone3: "Tone 3",
    octaveNote: (
      <p>
        <strong className="text-gray-700">Note that an octave is double
        the frequency of another wave.</strong> If one tone is at 220 Hz, the
        same note one octave higher is at 440 Hz — exactly twice the
        frequency. Try setting two sliders to frequencies in a 2:1 ratio and
        listen to how they blend together almost as one sound.
      </p>
    ),
    ratios: (
      <p className="text-sm text-gray-500">
        Simple frequency ratios tend to sound consonant (pleasant) together.
        A 2:1 ratio is an octave, 3:2 is a perfect fifth, and 4:3 is a
        perfect fourth. These relationships are the mathematical foundation
        of harmony.
      </p>
    ),
  },
  ko: {
    heading: "화성",
    p1: (
      <p>
        여러 음을 동시에 울려 <strong>코드(화음)</strong>, 즉{" "}
        <strong>화성</strong>을 만들 수 있습니다. 화성은 음악에 풍부함과
        감정적 깊이를 부여하는 요소로, 혼자 노래하는 목소리와 합창단 전체의
        차이를 만들어 냅니다.
      </p>
    ),
    p2: (
      <p>
        아래 세 개의 음을 각각 개별적으로 재생해 본 다음, "모두 재생" 버튼을
        눌러 코드로 함께 들어 보세요.
      </p>
    ),
    tone1: "음 1",
    tone2: "음 2",
    tone3: "음 3",
    octaveNote: (
      <p>
        <strong className="text-gray-700">옥타브는 다른 파동의 두 배
        주파수입니다.</strong> 한 음이 220 Hz라면, 한 옥타브 높은 같은
        음은 440 Hz — 정확히 두 배의 주파수입니다. 두 슬라이더를 2:1
        비율의 주파수로 설정하고 거의 하나의 소리처럼 섞이는 것을 들어
        보세요.
      </p>
    ),
    ratios: (
      <p className="text-sm text-gray-500">
        단순한 주파수 비율은 협화음(쾌적한 소리)을 만듭니다. 2:1 비율은
        옥타브, 3:2는 완전 5도, 4:3은 완전 4도입니다. 이러한 관계가
        화성의 수학적 기초입니다.
      </p>
    ),
  },
};

export default function HarmonyIntro() {
  const { lang } = useLanguage();
  const c = content[lang];
  const t = common[lang];

  const [allPlaying, setAllPlaying] = useState(false);
  const [frequencies] = useState([262, 330, 392]); // C4, E4, G4 approx

  const handleToggleAll = useCallback(async () => {
    if (allPlaying) {
      stopAllTones();
      setAllPlaying(false);
    } else {
      await startTone(frequencies[0], "harmony-1");
      await startTone(frequencies[1], "harmony-2");
      await startTone(frequencies[2], "harmony-3");
      setAllPlaying(true);
    }
  }, [allPlaying, frequencies]);

  const handleStopAll = useCallback(() => {
    stopAllTones();
    setAllPlaying(false);
  }, []);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">{c.heading}</h2>

      <div className="text-gray-600 space-y-4 leading-relaxed">
        {c.p1}
        {c.p2}
      </div>

      <div className="space-y-4">
        <FrequencySlider
          id="harmony-1"
          initialFrequency={262}
          label={c.tone1 as string}
        />
        <FrequencySlider
          id="harmony-2"
          initialFrequency={330}
          label={c.tone2 as string}
        />
        <FrequencySlider
          id="harmony-3"
          initialFrequency={392}
          label={c.tone3 as string}
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleToggleAll}
          className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors ${
            allPlaying
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-indigo-500 hover:bg-indigo-600 text-white"
          }`}
        >
          {allPlaying ? t.stopAll : t.playAll}
        </button>
        {allPlaying && (
          <button
            onClick={handleStopAll}
            className="px-6 py-2.5 rounded-lg font-semibold text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
          >
            {t.reset}
          </button>
        )}
      </div>

      <div className="border-t border-gray-200 pt-6 text-gray-600 space-y-4 leading-relaxed">
        {c.octaveNote}
        {c.ratios}
      </div>
    </div>
  );
}
