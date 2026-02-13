import { useState, useEffect, useRef } from "react";
import WhatIsMusic from "./pages/WhatIsMusic.tsx";
import WhatIsANote from "./pages/WhatIsANote.tsx";
import HarmonyIntro from "./pages/HarmonyIntro.tsx";
import TwelveNotes from "./pages/TwelveNotes.tsx";
import RhythmIntro from "./pages/RhythmIntro.tsx";
import TimeSignatures from "./pages/TimeSignatures.tsx";
import RhythmToPitch from "./pages/RhythmToPitch.tsx";
import { stopAllTones } from "./audio/audioEngine.ts";
import { LanguageProvider, useLanguage, type Lang } from "./i18n/LanguageContext.tsx";
import { common } from "./i18n/common.ts";

export type Page = "what-is-music" | "what-is-a-note" | "harmony" | "twelve-notes" | "rhythm" | "time-signatures" | "rhythm-to-pitch";

const PAGE_LABELS: Record<Page, Record<Lang, string>> = {
  "what-is-music": { en: "What is Music?", ko: "음악이란 무엇인가?" },
  "what-is-a-note": { en: "What is a Note?", ko: "음이란 무엇인가?" },
  "harmony": { en: "Harmony", ko: "화성" },
  "twelve-notes": { en: "The 12 Notes", ko: "12개의 음" },
  "rhythm": { en: "Rhythm", ko: "리듬" },
  "time-signatures": { en: "Time Signatures", ko: "박자표" },
  "rhythm-to-pitch": { en: "Rhythm \u2192 Pitch", ko: "리듬 \u2192 음높이" },
};

const PAGE_KEYS: Page[] = [
  "what-is-music",
  "what-is-a-note",
  "harmony",
  "twelve-notes",
  "rhythm",
  "time-signatures",
  "rhythm-to-pitch",
];

const PAGE_KEY_SET = new Set(PAGE_KEYS);

const FADE_MS = 180;

const TITLE: Record<Lang, string> = {
  en: "Learn Music Theory",
  ko: "음악 이론 배우기",
};

function pageFromHash(): Page {
  const hash = window.location.hash.replace("#", "");
  if (PAGE_KEY_SET.has(hash as Page)) return hash as Page;
  return PAGE_KEYS[0];
}

function PageContent({ page }: { page: Page }) {
  switch (page) {
    case "what-is-music": return <WhatIsMusic />;
    case "what-is-a-note": return <WhatIsANote />;
    case "harmony": return <HarmonyIntro />;
    case "twelve-notes": return <TwelveNotes />;
    case "rhythm": return <RhythmIntro />;
    case "time-signatures": return <TimeSignatures />;
    case "rhythm-to-pitch": return <RhythmToPitch />;
  }
}

function AppInner() {
  const { lang, setLang } = useLanguage();
  const [page, setPage] = useState<Page>(pageFromHash);
  const [displayedPage, setDisplayedPage] = useState<Page>(pageFromHash);
  const [fading, setFading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pendingPage = useRef<Page | null>(null);

  const navigate = (newPage: Page) => {
    if (newPage === page) return;
    stopAllTones();
    window.location.hash = newPage;
    setPage(newPage);
    setSidebarOpen(false);
  };

  // Sync state when user navigates with browser back/forward
  useEffect(() => {
    function onHashChange() {
      const newPage = pageFromHash();
      stopAllTones();
      setPage(newPage);
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    if (page === displayedPage) return;
    setFading(true);
    pendingPage.current = page;
    const timer = setTimeout(() => {
      setDisplayedPage(pendingPage.current!);
      setFading(false);
    }, FADE_MS);
    return () => clearTimeout(timer);
  }, [page]);

  const idx = PAGE_KEYS.indexOf(page);
  const prev = idx > 0 ? PAGE_KEYS[idx - 1] : null;
  const next = idx < PAGE_KEYS.length - 1 ? PAGE_KEYS[idx + 1] : null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center gap-3">
        <button
          className="lg:hidden flex flex-col justify-center gap-[5px] w-8 h-8 shrink-0"
          onClick={() => setSidebarOpen((prev) => !prev)}
          aria-label={common[lang].toggleNav}
        >
          <span className="block h-0.5 w-5 bg-gray-600 rounded" />
          <span className="block h-0.5 w-5 bg-gray-600 rounded" />
          <span className="block h-0.5 w-5 bg-gray-600 rounded" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">{TITLE[lang]}</h1>
        <button
          onClick={() => setLang(lang === "en" ? "ko" : "en")}
          className="ml-auto px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-100 transition-colors text-gray-600 shrink-0"
        >
          {lang === "en" ? "한국어" : "EN"}
        </button>
      </header>

      <div className="flex flex-1">
        {/* Backdrop overlay (mobile only) */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar: fixed overlay on mobile, sticky on lg+ */}
        <nav
          className={`fixed top-[53px] left-0 z-50 h-[calc(100vh-53px)] w-56 shrink-0 border-r border-gray-200 bg-gray-50 p-4 overflow-y-auto transition-transform duration-200 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:sticky lg:translate-x-0 lg:bg-gray-50/50`}
        >
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            {common[lang].contents}
          </div>
          <ul className="space-y-1">
            {PAGE_KEYS.map((key, i) => (
              <li key={key}>
                <a
                  href={`#${key}`}
                  onClick={(e) => { e.preventDefault(); navigate(key); }}
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    page === key
                      ? "bg-indigo-50 text-indigo-700 font-medium"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <span className="text-gray-400 mr-2">{i + 1}.</span>
                  {PAGE_LABELS[key][lang]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <div
            className="mx-auto w-full px-4 sm:px-8 py-6 sm:py-8"
            style={{
              maxWidth: "800px",
              opacity: fading ? 0 : 1,
              transition: `opacity ${FADE_MS}ms ease-in-out`,
            }}
          >
            <PageContent page={displayedPage} />

            {/* Prev / Next */}
            <div className={`flex mt-12 pt-6 border-t border-gray-200 ${prev && next ? "justify-between" : prev ? "justify-start" : "justify-end"}`}>
              {prev && (
                <button
                  onClick={() => navigate(prev)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors"
                >
                  <span aria-hidden="true">&larr;</span> {PAGE_LABELS[prev][lang]}
                </button>
              )}
              {next && (
                <button
                  onClick={() => navigate(next)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
                >
                  {PAGE_LABELS[next][lang]} <span aria-hidden="true">&rarr;</span>
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppInner />
    </LanguageProvider>
  );
}
