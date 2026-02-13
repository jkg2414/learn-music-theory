import { useState, useRef, useEffect } from "react";
import Controls from "./Controls.tsx";
import type { Page } from "../App.tsx";

interface NavBarProps {
  bpm: number;
  setBpm: (bpm: number) => void;
  octave: number;
  setOctave: (octave: number) => void;
  transposition: number;
  setTransposition: (t: number) => void;
  page: Page;
  setPage: (page: Page) => void;
}

const LINKS: { label: string; page: Page }[] = [
  { label: "Foundations", page: "foundations" },
  { label: "Scales", page: "scales" },
  { label: "Chords", page: "chords" },
  { label: "Ear Training", page: "ear-training" },
];

export default function NavBar(props: NavBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200 px-4 py-2">
      <div className="mx-auto flex items-center justify-between gap-4" style={{ maxWidth: "1000px" }}>
        <div className="flex items-center gap-3" ref={menuRef}>
          {/* Hamburger button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900"
            aria-label="Table of contents"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="3" y1="5" x2="17" y2="5" />
              <line x1="3" y1="10" x2="17" y2="10" />
              <line x1="3" y1="15" x2="17" y2="15" />
            </svg>
          </button>

          <h1 className="text-lg font-bold text-gray-900 whitespace-nowrap">
            Music Theory
          </h1>

          {/* Dropdown menu */}
          {menuOpen && (
            <div className="absolute top-full left-4 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-48">
              <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Pages
              </div>
              {LINKS.map((link) => (
                <button
                  key={link.page}
                  onClick={() => { props.setPage(link.page); setMenuOpen(false); }}
                  className={`block w-full text-left px-3 py-2 text-sm transition-colors ${
                    props.page === link.page
                      ? "bg-gray-100 text-gray-900 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <Controls {...props} />
      </div>
    </nav>
  );
}
