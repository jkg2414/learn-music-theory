export const NOTE_NAMES = [
  "C", "C#", "D", "D#", "E", "F",
  "F#", "G", "G#", "A", "A#", "B",
] as const;

export type NoteName = (typeof NOTE_NAMES)[number];

export const ENHARMONIC_MAP: Record<string, string> = {
  "C#": "Db",
  "D#": "Eb",
  "F#": "Gb",
  "G#": "Ab",
  "A#": "Bb",
};

export function noteIndex(note: NoteName): number {
  return NOTE_NAMES.indexOf(note);
}

export function pitchString(note: NoteName, octave: number): string {
  return `${note}${octave}`;
}
