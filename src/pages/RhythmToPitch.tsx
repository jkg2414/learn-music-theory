import { useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import {
  startClickTrain,
  setClickTrainRate,
  stopClickTrain,
} from "../audio/audioEngine.ts";
import SingleClickTrain from "../components/SingleClickTrain.tsx";
import { useLanguage, type Lang } from "../i18n/LanguageContext.tsx";
import { common } from "../i18n/common.ts";

const NOTE_NAMES = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
];

function freqToNote(freq: number): string {
  const semitones = 12 * Math.log2(freq / 440);
  const rounded = Math.round(semitones);
  const noteIndex = ((rounded % 12) + 12 + 9) % 12;
  const octave = 4 + Math.floor((rounded + 9) / 12);
  return `${NOTE_NAMES[noteIndex]}${octave}`;
}

const RATIO_INTERVALS: Record<Lang, Record<string, string>> = {
  en: {
    "2:1": "Octave",
    "3:2": "Perfect Fifth",
    "4:3": "Perfect Fourth",
    "5:4": "Major Third",
    "5:3": "Major Sixth",
    "6:5": "Minor Third",
    "7:4": "Harmonic Seventh",
    "8:5": "Minor Sixth",
  },
  ko: {
    "2:1": "옥타브",
    "3:2": "완전 5도",
    "4:3": "완전 4도",
    "5:4": "장 3도",
    "5:3": "장 6도",
    "6:5": "단 3도",
    "7:4": "자연 7도",
    "8:5": "단 6도",
  },
};

// Log-scale slider: 0.5 Hz to 150 Hz base rate
const MIN_RATE = 0.5;
const MAX_RATE = 150;
const LOG_MIN = Math.log2(MIN_RATE);
const LOG_MAX = Math.log2(MAX_RATE);

function sliderToRate(v: number): number {
  return Math.pow(2, LOG_MIN + v * (LOG_MAX - LOG_MIN));
}
function rateToSlider(r: number): number {
  return (Math.log2(r) - LOG_MIN) / (LOG_MAX - LOG_MIN);
}

const content: Record<Lang, {
  heading: string;
  p1: ReactNode;
  p2: (num: number, den: number) => ReactNode;
  p3: (num: number, den: number, intervalName: string | undefined) => ReactNode;
  physics: ReactNode;
  tryRatios: ReactNode;
  polyrhythmNow: (num: number, den: number, intervalName: string) => ReactNode;
}> = {
  en: {
    heading: "From Rhythm to Pitch",
    p1: (
      <p>
        Here's a mind-bending idea:{" "}
        <strong>
          rhythm and pitch are the same thing at different speeds.
        </strong>{" "}
        A drum hit repeated 4 times per second is a rhythm. Speed it up to
        440 times per second and it becomes the note A4. There's no hard
        boundary — just a gradual transition from hearing individual beats to
        hearing a continuous tone.
      </p>
    ),
    p2: (num, den) => (
      <p>
        Now imagine two of these at once. A{" "}
        <strong>polyrhythm</strong> is two rhythms playing simultaneously
        with different beat counts. Below, two voices repeat in a{" "}
        <strong>
          {num}:{den}
        </strong>{" "}
        ratio — voice 1 plays {num} evenly spaced clicks for every{" "}
        {den} clicks of voice 2.
      </p>
    ),
    p3: (num, den, intervalName) => (
      <p>
        Slowly drag the speed slider to the right and listen: the clicks blur
        into a buzz, then into two distinct pitches. The{" "}
        <strong>
          {num}:{den}
        </strong>{" "}
        ratio between the rhythms becomes a frequency ratio between the tones
        {intervalName ? (
          <>
            {" "}
            — a <strong>{intervalName}</strong>
          </>
        ) : (
          ""
        )}
        .
      </p>
    ),
    physics: (
      <p>
        This isn't just a metaphor — it's physics. A vibration at 20 Hz is
        perceived as a low hum. The exact same vibration at 2 Hz is perceived
        as a beat. Our ears draw the line somewhere around 20 Hz, but there's
        really a continuous spectrum from rhythm to pitch.
      </p>
    ),
    tryRatios: (
      <p className="text-sm text-gray-500">
        <strong className="text-gray-700">Try different ratios:</strong> 3:2
        gives a perfect fifth, 4:3 gives a perfect fourth, 2:1 gives an
        octave. The simple ratios that make pleasant-sounding intervals are
        the same ratios that make interlocking polyrhythms.
      </p>
    ),
    polyrhythmNow: (num, den, intervalName) => (
      <>
        The {num}:{den} polyrhythm is now a{" "}
        {intervalName.toLowerCase()}!
      </>
    ),
  },
  ko: {
    heading: "리듬에서 음높이로",
    p1: (
      <p>
        놀라운 생각을 해 봅시다:{" "}
        <strong>
          리듬과 음높이는 속도만 다를 뿐 같은 현상입니다.
        </strong>{" "}
        초당 4번 반복되는 드럼 타격은 리듬입니다. 이를 초당 440번으로
        빠르게 하면 A4 음이 됩니다. 명확한 경계는 없으며, 개별 박자를
        듣는 것에서 연속적인 음을 듣는 것으로 점진적으로 전환됩니다.
      </p>
    ),
    p2: (num, den) => (
      <p>
        이제 이것을 두 개 동시에 상상해 보세요.{" "}
        <strong>폴리리듬</strong>은 서로 다른 박자 수로 동시에 재생되는
        두 개의 리듬입니다. 아래에서 두 성부가{" "}
        <strong>
          {num}:{den}
        </strong>{" "}
        비율로 반복합니다 — 성부 1이 균등한 간격으로 {num}번 클릭할 때
        성부 2는 {den}번 클릭합니다.
      </p>
    ),
    p3: (num, den, intervalName) => (
      <p>
        속도 슬라이더를 천천히 오른쪽으로 드래그하며 들어 보세요: 클릭이
        윙윙거림으로, 그다음 두 개의 뚜렷한 음높이로 변합니다.{" "}
        리듬 사이의{" "}
        <strong>
          {num}:{den}
        </strong>{" "}
        비율이 음 사이의 주파수 비율이 됩니다
        {intervalName ? (
          <>
            {" "}
            — <strong>{intervalName}</strong>
          </>
        ) : (
          ""
        )}
        .
      </p>
    ),
    physics: (
      <p>
        이것은 단순한 비유가 아니라 물리학입니다. 20 Hz의 진동은 낮은
        웅웅 소리로 인식됩니다. 똑같은 진동이 2 Hz에서는 박자로
        인식됩니다. 우리 귀는 대략 20 Hz 부근에서 구분하지만, 실제로는
        리듬에서 음높이까지 연속적인 스펙트럼입니다.
      </p>
    ),
    tryRatios: (
      <p className="text-sm text-gray-500">
        <strong className="text-gray-700">다양한 비율을 시도해 보세요:</strong>{" "}
        3:2는 완전 5도, 4:3은 완전 4도, 2:1은 옥타브를 만듭니다.
        쾌적한 음정을 만드는 단순한 비율이 바로 맞물리는 폴리리듬을
        만드는 비율과 같습니다.
      </p>
    ),
    polyrhythmNow: (num, den, intervalName) => (
      <>
        {num}:{den} 폴리리듬이 이제{" "}
        {intervalName}이(가) 되었습니다!
      </>
    ),
  },
};

export default function RhythmToPitch() {
  const { lang } = useLanguage();
  const c = content[lang];
  const t = common[lang];

  const [numerator, setNumerator] = useState(5);
  const [denominator, setDenominator] = useState(4);
  const [baseRate, setBaseRate] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [beat1, setBeat1] = useState(-1);
  const [beat2, setBeat2] = useState(-1);

  const baseRateRef = useRef(baseRate);
  const numeratorRef = useRef(numerator);
  const denominatorRef = useRef(denominator);
  const playingRef = useRef(false);

  useEffect(() => { baseRateRef.current = baseRate; }, [baseRate]);
  useEffect(() => { numeratorRef.current = numerator; }, [numerator]);
  useEffect(() => { denominatorRef.current = denominator; }, [denominator]);
  useEffect(() => { playingRef.current = playing; }, [playing]);

  const rate1 = baseRate * numerator;
  const rate2 = baseRate * denominator;
  const isMaxed = baseRate >= MAX_RATE * 0.97;

  const ratioKey = `${numerator}:${denominator}`;
  const intervalName = RATIO_INTERVALS[lang][ratioKey];

  // Start / stop click trains
  useEffect(() => {
    if (!playing) return;

    const r1 = baseRateRef.current * numeratorRef.current;
    const r2 = baseRateRef.current * denominatorRef.current;

    startClickTrain("poly-1", r1, true);
    startClickTrain("poly-2", r2, false);

    return () => {
      stopClickTrain("poly-1");
      stopClickTrain("poly-2");
    };
  }, [playing]);

  // Update click train rates when slider or ratio changes
  useEffect(() => {
    if (!playing) return;
    setClickTrainRate("poly-1", baseRate * numerator);
    setClickTrainRate("poly-2", baseRate * denominator);
  }, [baseRate, numerator, denominator, playing]);

  // Visual beat tracking via requestAnimationFrame
  useEffect(() => {
    if (!playing) return;

    let frameId: number;
    const startTime = performance.now();

    function animate() {
      if (!playingRef.current) return;
      const elapsed = (performance.now() - startTime) / 1000;
      const r1 = baseRateRef.current * numeratorRef.current;
      const r2 = baseRateRef.current * denominatorRef.current;
      setBeat1(Math.floor(elapsed * r1) % numeratorRef.current);
      setBeat2(Math.floor(elapsed * r2) % denominatorRef.current);
      frameId = requestAnimationFrame(animate);
    }

    frameId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frameId);
      setBeat1(-1);
      setBeat2(-1);
    };
  }, [playing]);

  // Restart click trains when ratio changes while playing
  useEffect(() => {
    if (!playing) return;
    stopClickTrain("poly-1");
    stopClickTrain("poly-2");
    const r1 = baseRate * numerator;
    const r2 = baseRate * denominator;
    startClickTrain("poly-1", r1, true);
    startClickTrain("poly-2", r2, false);
  }, [numerator, denominator]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopClickTrain("poly-1");
      stopClickTrain("poly-2");
    };
  }, []);

  const handleStop = useCallback(() => {
    setPlaying(false);
    stopClickTrain("poly-1");
    stopClickTrain("poly-2");
  }, []);

  const handleSlider = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setBaseRate(sliderToRate(parseFloat(e.target.value)));
    },
    [],
  );

  // Mode label
  let modeLabel: string;
  if (baseRate < 2) {
    modeLabel = `${Math.round(baseRate * 60)} ${t.cyclesMin}`;
  } else {
    modeLabel = `${baseRate.toFixed(1)} ${t.hzBase}`;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">
        {c.heading}
      </h2>

      <div className="text-gray-600 space-y-4 leading-relaxed">
        {c.p1}
      </div>

      <SingleClickTrain id="solo-demo" />

      <div className="text-gray-600 space-y-4 leading-relaxed">
        {c.p2(numerator, denominator)}
        {c.p3(numerator, denominator, intervalName)}
      </div>

      {/* Ratio selector */}
      <div className="flex items-center justify-center gap-4">
        <div className="text-center">
          <select
            value={numerator}
            onChange={(e) => setNumerator(Number(e.target.value))}
            className="text-3xl font-bold text-indigo-600 bg-transparent border-b-2 border-indigo-200 focus:border-indigo-500 outline-none text-center w-16 appearance-none cursor-pointer"
          >
            {[2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <div className="text-xs text-gray-400 mt-1">{t.beats}</div>
        </div>
        <div className="text-2xl font-bold text-gray-300">:</div>
        <div className="text-center">
          <select
            value={denominator}
            onChange={(e) => setDenominator(Number(e.target.value))}
            className="text-3xl font-bold text-amber-600 bg-transparent border-b-2 border-amber-200 focus:border-amber-500 outline-none text-center w-16 appearance-none cursor-pointer"
          >
            {[2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <div className="text-xs text-gray-400 mt-1">{t.beats}</div>
        </div>
        {intervalName && (
          <div className="text-sm text-gray-500 ml-4 border-l border-gray-200 pl-4">
            {intervalName}
          </div>
        )}
      </div>

      {/* Main control panel */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-5">
        {/* Speed slider */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">{t.speed}</span>
            <span className="font-mono text-gray-700">{modeLabel}</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.001}
            value={rateToSlider(baseRate)}
            onChange={handleSlider}
            className="w-full accent-indigo-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{t.slowRhythm}</span>
            <span>{t.fastPitch}</span>
          </div>
        </div>

        {/* Voice info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-100 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">{t.voice1} ({t.highClick})</div>
            <div className="text-indigo-600 font-mono font-medium">
              {rate1.toFixed(1)}{" "}
              <span className="text-gray-400">
                {rate1 > 20 ? t.hz : t.clicksSec}
              </span>
            </div>
            {rate1 > 20 && (
              <div className="text-xs text-gray-400 mt-0.5">
                ≈ {freqToNote(rate1)}
              </div>
            )}
          </div>
          <div className="bg-white border border-gray-100 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">{t.voice2} ({t.lowClick})</div>
            <div className="text-amber-600 font-mono font-medium">
              {rate2.toFixed(1)}{" "}
              <span className="text-gray-400">
                {rate2 > 20 ? t.hz : t.clicksSec}
              </span>
            </div>
            {rate2 > 20 && (
              <div className="text-xs text-gray-400 mt-0.5">
                ≈ {freqToNote(rate2)}
              </div>
            )}
          </div>
        </div>

        {isMaxed && intervalName && (
          <div className="text-center py-2 px-4 bg-green-50 border border-green-200 rounded-lg text-sm font-medium text-green-700">
            {c.polyrhythmNow(numerator, denominator, intervalName)}
          </div>
        )}

        {/* Beat visualization */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-indigo-600 w-14">
              {t.voice1}
            </span>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {Array.from({ length: numerator }, (_, i) => (
                <div
                  key={i}
                  className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-75 ${
                    i === beat1
                      ? "bg-indigo-500 text-white shadow-md shadow-indigo-200 scale-110"
                      : "bg-indigo-100 text-indigo-400"
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-amber-600 w-14">
              {t.voice2}
            </span>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {Array.from({ length: denominator }, (_, i) => (
                <div
                  key={i}
                  className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-75 ${
                    i === beat2
                      ? "bg-amber-500 text-white shadow-md shadow-amber-200 scale-110"
                      : "bg-amber-100 text-amber-400"
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Play / Stop */}
        <div className="flex justify-center pt-2">
          <button
            onClick={playing ? handleStop : () => setPlaying(true)}
            className={`px-8 py-2.5 rounded-lg font-semibold text-sm transition-colors ${
              playing
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-indigo-500 hover:bg-indigo-600 text-white"
            }`}
          >
            {playing ? t.stop : t.play}
          </button>
        </div>
      </div>

      {/* Explanation */}
      <div className="border-t border-gray-200 pt-6 text-gray-600 space-y-4 leading-relaxed">
        {c.physics}
        {c.tryRatios}
      </div>
    </div>
  );
}
