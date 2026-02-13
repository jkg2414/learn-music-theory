import { useState, useEffect, useRef } from "react";
import WhatIsMusic from "./pages/WhatIsMusic.tsx";
import WhatIsANote from "./pages/WhatIsANote.tsx";
import HarmonyIntro from "./pages/HarmonyIntro.tsx";
import TwelveNotes from "./pages/TwelveNotes.tsx";
import RhythmIntro from "./pages/RhythmIntro.tsx";
import TimeSignatures from "./pages/TimeSignatures.tsx";
import RhythmToPitch from "./pages/RhythmToPitch.tsx";
import { stopAllTones } from "./audio/audioEngine.ts";

export type Page = "what-is-music" | "what-is-a-note" | "harmony" | "twelve-notes" | "rhythm" | "time-signatures" | "rhythm-to-pitch";

const PAGES: { key: Page; label: string }[] = [
  { key: "what-is-music", label: "What is Music?" },
  { key: "what-is-a-note", label: "What is a Note?" },
  { key: "harmony", label: "Harmony" },
  { key: "twelve-notes", label: "The 12 Notes" },
  { key: "rhythm", label: "Rhythm" },
  { key: "time-signatures", label: "Time Signatures" },
  { key: "rhythm-to-pitch", label: "Rhythm → Pitch" },
];

const FADE_MS = 180;

const PAGE_KEYS = new Set(PAGES.map((p) => p.key));

function pageFromHash(): Page {
  const hash = window.location.hash.replace("#", "");
  if (PAGE_KEYS.has(hash as Page)) return hash as Page;
  return PAGES[0].key;
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

export default function App() {
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

  const idx = PAGES.findIndex((p) => p.key === page);
  const prev = idx > 0 ? PAGES[idx - 1] : null;
  const next = idx < PAGES.length - 1 ? PAGES[idx + 1] : null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center gap-3">
        <button
          className="lg:hidden flex flex-col justify-center gap-[5px] w-8 h-8 shrink-0"
          onClick={() => setSidebarOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          <span className="block h-0.5 w-5 bg-gray-600 rounded" />
          <span className="block h-0.5 w-5 bg-gray-600 rounded" />
          <span className="block h-0.5 w-5 bg-gray-600 rounded" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Learn Music Theory</h1>
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
            Contents
          </div>
          <ul className="space-y-1">
            {PAGES.map((p, i) => (
              <li key={p.key}>
                <a
                  href={`#${p.key}`}
                  onClick={(e) => { e.preventDefault(); navigate(p.key); }}
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    page === p.key
                      ? "bg-indigo-50 text-indigo-700 font-medium"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <span className="text-gray-400 mr-2">{i + 1}.</span>
                  {p.label}
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
                  onClick={() => navigate(prev.key)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors"
                >
                  <span aria-hidden="true">&larr;</span> {prev.label}
                </button>
              )}
              {next && (
                <button
                  onClick={() => navigate(next.key)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
                >
                  {next.label} <span aria-hidden="true">&rarr;</span>
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
