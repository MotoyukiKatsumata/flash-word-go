import { atom } from "jotai";

export const selectedCsvAtom = atom<string | null>(null);
export const quizModeAtom = atom<"enToJa" | "jaToEn" | null>(null);
export const quizListAtom = atom<{ en: string; ja: string }[]>([]);
export const progressAtom = atom<number>(0);
export const incorrectListAtom = atom<{ en: string; ja: string }[]>([]);
