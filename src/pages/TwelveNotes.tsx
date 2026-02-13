import type { ReactNode } from "react";
import { playNote } from "../audio/audioEngine.ts";
import PianoKeyboard from "../components/PianoKeyboard.tsx";
import { NOTE_NAMES } from "../data/notes.ts";
import { useLanguage } from "../i18n/LanguageContext.tsx";

const content: Record<"en" | "ko", Record<string, ReactNode>> = {
  en: {
    heading: "The 12 Notes",
    p1: (
      <p>
        For reasons we won't get into now, Western harmony has settled on
        subdividing each octave into <strong>12 equally spaced notes</strong>.
        This system is called <em>equal temperament</em>.
      </p>
    ),
    p2: (
      <p>
        These 12 notes repeat in every octave, getting higher in pitch each
        time. On a piano, you can see them clearly: 7 white keys and 5 black
        keys make up one octave.
      </p>
    ),
    clickHint: "Click any key to hear the note.",
    theNotes: "The 12 notes are:",
    sharpNote: (
      <p className="text-sm text-gray-500">
        The sharp (#) notes are the black keys on the piano. They sit between
        the white keys — for example, C# is between C and D. These same notes
        can also be called "flats" (Db instead of C#), but they refer to the
        same pitch.
      </p>
    ),
  },
  ko: {
    heading: "12개의 음",
    p1: (
      <p>
        지금 자세히 다루지는 않겠지만, 서양 화성학은 각 옥타브를{" "}
        <strong>12개의 균등한 음</strong>으로 나누는 방식을 채택했습니다.
        이 체계를 <em>평균율</em>이라고 합니다.
      </p>
    ),
    p2: (
      <p>
        이 12개의 음은 매 옥타브마다 반복되며, 매번 음높이가 올라갑니다.
        피아노에서 분명하게 볼 수 있습니다: 흰 건반 7개와 검은 건반
        5개가 한 옥타브를 이룹니다.
      </p>
    ),
    clickHint: "아무 건반이나 클릭하면 음을 들을 수 있습니다.",
    theNotes: "12개의 음은 다음과 같습니다:",
    sharpNote: (
      <p className="text-sm text-gray-500">
        샤프(#) 음은 피아노의 검은 건반입니다. 흰 건반 사이에 위치하며,
        예를 들어 C#은 C와 D 사이에 있습니다. 같은 음을 "플랫"(C#
        대신 Db)이라고도 부르지만, 같은 음높이를 가리킵니다.
      </p>
    ),
  },
};

export default function TwelveNotes() {
  const { lang } = useLanguage();
  const c = content[lang];

  const handleNoteClick = (pitch: string) => {
    playNote(pitch);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">{c.heading}</h2>

      <div className="text-gray-600 space-y-4 leading-relaxed">
        {c.p1}
        {c.p2}
      </div>

      <div>
        <div className="overflow-x-auto rounded-lg -mx-1 px-1">
          <div className="min-w-[560px]">
            <PianoKeyboard
              startOctave={3}
              numOctaves={3}
              highlightedNotes={[]}
              onNoteClick={handleNoteClick}
            />
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {c.clickHint}
        </p>
      </div>

      <div className="text-gray-600 space-y-4 leading-relaxed">
        <p>{c.theNotes}</p>
        <div className="flex flex-wrap gap-2">
          {NOTE_NAMES.map((note) => (
            <span
              key={note}
              className={`px-3 py-1.5 rounded-lg text-sm font-mono font-medium ${
                note.includes("#")
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-800 border border-gray-200"
              }`}
            >
              {note}
            </span>
          ))}
        </div>
        {c.sharpNote}
      </div>
    </div>
  );
}
