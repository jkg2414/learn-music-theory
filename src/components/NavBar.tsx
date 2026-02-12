import Controls from "./Controls.tsx";

interface NavBarProps {
  bpm: number;
  setBpm: (bpm: number) => void;
  octave: number;
  setOctave: (octave: number) => void;
  transposition: number;
  setTransposition: (t: number) => void;
}

const LINKS = [
  { label: "Foundations", href: "#foundations" },
  { label: "Scales", href: "#scales" },
  { label: "Chords", href: "#chords" },
  { label: "Ear Training", href: "#ear-training" },
];

export default function NavBar(props: NavBarProps) {
  return (
    <nav className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur border-b border-gray-800 px-4 py-2">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-lg font-bold text-white whitespace-nowrap">
          Music Theory
        </h1>

        <div className="flex items-center gap-4">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <Controls {...props} />
      </div>
    </nav>
  );
}
