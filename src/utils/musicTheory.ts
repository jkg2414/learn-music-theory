import { NOTE_NAMES, type NoteName, pitchString } from "../data/notes.ts";

export function transpose(note: NoteName, semitones: number): NoteName {
  const idx = NOTE_NAMES.indexOf(note);
  return NOTE_NAMES[((idx + semitones) % 12 + 12) % 12];
}

export function getScaleNotes(root: NoteName, intervals: number[]): NoteName[] {
  return intervals.map((s) => transpose(root, s));
}

export function getChordNotes(root: NoteName, intervals: number[]): NoteName[] {
  return intervals.map((s) => transpose(root, s % 12));
}

export function getScalePitches(
  root: NoteName,
  intervals: number[],
  octave: number,
): string[] {
  const rootIdx = NOTE_NAMES.indexOf(root);
  return intervals.map((s) => {
    const noteIdx = (rootIdx + s) % 12;
    const octaveOffset = Math.floor((rootIdx + s) / 12);
    return pitchString(NOTE_NAMES[noteIdx], octave + octaveOffset);
  });
}

export function getChordPitches(
  root: NoteName,
  intervals: number[],
  octave: number,
): string[] {
  const rootIdx = NOTE_NAMES.indexOf(root);
  return intervals.map((s) => {
    const noteIdx = (rootIdx + s) % 12;
    const octaveOffset = Math.floor((rootIdx + s) / 12);
    return pitchString(NOTE_NAMES[noteIdx], octave + octaveOffset);
  });
}
