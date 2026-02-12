export interface Chord {
  name: string;
  symbol: string;
  intervals: number[];
}

export const CHORDS: Chord[] = [
  { name: "Major", symbol: "", intervals: [0, 4, 7] },
  { name: "Minor", symbol: "m", intervals: [0, 3, 7] },
  { name: "Diminished", symbol: "dim", intervals: [0, 3, 6] },
  { name: "Augmented", symbol: "aug", intervals: [0, 4, 8] },
  { name: "Suspended 2nd", symbol: "sus2", intervals: [0, 2, 7] },
  { name: "Suspended 4th", symbol: "sus4", intervals: [0, 5, 7] },
  { name: "Major 7th", symbol: "maj7", intervals: [0, 4, 7, 11] },
  { name: "Minor 7th", symbol: "m7", intervals: [0, 3, 7, 10] },
  { name: "Dominant 7th", symbol: "7", intervals: [0, 4, 7, 10] },
  { name: "Diminished 7th", symbol: "dim7", intervals: [0, 3, 6, 9] },
  { name: "Half-Diminished 7th", symbol: "m7b5", intervals: [0, 3, 6, 10] },
  { name: "Augmented 7th", symbol: "aug7", intervals: [0, 4, 8, 10] },
];

export function invertChord(intervals: number[], inversion: number): number[] {
  if (inversion <= 0 || inversion >= intervals.length) return [...intervals];
  const result = [...intervals];
  for (let i = 0; i < inversion; i++) {
    const note = result.shift()!;
    result.push(note + 12);
  }
  return result;
}
