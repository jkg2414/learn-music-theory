export interface Progression {
  name: string;
  numerals: string[];
  degrees: number[];
  qualities: string[];
}

export const PROGRESSIONS: Progression[] = [
  {
    name: "I-IV-V-I",
    numerals: ["I", "IV", "V", "I"],
    degrees: [0, 5, 7, 0],
    qualities: ["Major", "Major", "Major", "Major"],
  },
  {
    name: "I-V-vi-IV",
    numerals: ["I", "V", "vi", "IV"],
    degrees: [0, 7, 9, 5],
    qualities: ["Major", "Major", "Minor", "Major"],
  },
  {
    name: "ii-V-I",
    numerals: ["ii", "V", "I"],
    degrees: [2, 7, 0],
    qualities: ["Minor 7th", "Dominant 7th", "Major 7th"],
  },
  {
    name: "I-vi-IV-V",
    numerals: ["I", "vi", "IV", "V"],
    degrees: [0, 9, 5, 7],
    qualities: ["Major", "Minor", "Major", "Major"],
  },
  {
    name: "vi-IV-I-V",
    numerals: ["vi", "IV", "I", "V"],
    degrees: [9, 5, 0, 7],
    qualities: ["Minor", "Major", "Major", "Major"],
  },
  {
    name: "I-IV-vi-V",
    numerals: ["I", "IV", "vi", "V"],
    degrees: [0, 5, 9, 7],
    qualities: ["Major", "Major", "Minor", "Major"],
  },
  {
    name: "ii-V-I (minor)",
    numerals: ["ii°", "V", "i"],
    degrees: [2, 7, 0],
    qualities: ["Half-Diminished 7th", "Dominant 7th", "Minor 7th"],
  },
];
