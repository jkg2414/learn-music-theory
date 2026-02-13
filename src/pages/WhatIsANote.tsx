import type { ReactNode } from "react";
import FrequencySlider from "../components/FrequencySlider.tsx";
import { useLanguage } from "../i18n/LanguageContext.tsx";

const content: Record<"en" | "ko", Record<string, ReactNode>> = {
  en: {
    heading: "What is a Note?",
    p1: (
      <p>
        A <strong>note</strong> is a single musical sound with a specific
        pitch. When something vibrates at a steady rate — a guitar string, a
        column of air, a speaker cone — it creates pressure waves that our
        ears interpret as pitch.
      </p>
    ),
    p2: (
      <p>
        The speed of that vibration is measured in{" "}
        <strong>hertz (Hz)</strong>, or cycles per second. A faster vibration
        means a higher pitch. For example, the note A above middle C vibrates
        at 440 times per second (440 Hz).
      </p>
    ),
    p3: (
      <p>
        Try the slider below to hear different frequencies. Notice how lower
        numbers sound deep and rumbly, while higher numbers sound bright and
        piercing.
      </p>
    ),
    funFact: (
      <p>
        <strong className="text-gray-700">Fun fact:</strong> The note A above
        middle C is tuned to 440 Hz by international convention. Every other
        note's frequency is derived from this reference point.
      </p>
    ),
    octaves: (
      <p>
        <strong className="text-gray-700">Octaves:</strong> When you double a
        frequency, you get the same note one octave higher.
        A4&nbsp;=&nbsp;440&nbsp;Hz, so A5&nbsp;=&nbsp;880&nbsp;Hz and
        A3&nbsp;=&nbsp;220&nbsp;Hz.
      </p>
    ),
  },
  ko: {
    heading: "음이란 무엇인가?",
    p1: (
      <p>
        <strong>음(note)</strong>은 특정 음높이를 가진 하나의 음악적
        소리입니다. 기타 줄, 공기 기둥, 스피커 콘 등 무언가가 일정한
        속도로 진동하면 우리 귀가 음높이로 인식하는 압력파가 만들어집니다.
      </p>
    ),
    p2: (
      <p>
        그 진동의 속도는 <strong>헤르츠(Hz)</strong>, 즉 초당 진동 수로
        측정합니다. 진동이 빠를수록 음이 높아집니다. 예를 들어, 가온다
        위의 A음은 초당 440회 진동합니다(440 Hz).
      </p>
    ),
    p3: (
      <p>
        아래 슬라이더로 다양한 주파수를 들어 보세요. 낮은 숫자는 깊고
        웅웅거리는 소리가, 높은 숫자는 밝고 날카로운 소리가 나는 것을
        느껴 보세요.
      </p>
    ),
    funFact: (
      <p>
        <strong className="text-gray-700">재미있는 사실:</strong> 가온다 위의
        A음은 국제 규약에 따라 440 Hz로 조율됩니다. 다른 모든 음의 주파수는
        이 기준점에서 파생됩니다.
      </p>
    ),
    octaves: (
      <p>
        <strong className="text-gray-700">옥타브:</strong> 주파수를 두 배로
        하면 한 옥타브 높은 같은 음이 됩니다.
        A4&nbsp;=&nbsp;440&nbsp;Hz이므로 A5&nbsp;=&nbsp;880&nbsp;Hz,
        A3&nbsp;=&nbsp;220&nbsp;Hz입니다.
      </p>
    ),
  },
};

export default function WhatIsANote() {
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

      <FrequencySlider id="note-explorer" initialFrequency={440} />

      <div className="text-gray-500 text-sm space-y-2">
        {c.funFact}
        {c.octaves}
      </div>
    </div>
  );
}
