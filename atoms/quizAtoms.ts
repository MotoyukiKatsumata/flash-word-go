import { atom } from "jotai";

export type Pair = { en: string; ja: string };
export type Mode = "enToJa" | "jaToEn";

export const selectedCsvAtom = atom<string | null>(null);
export const quizModeAtom = atom<Mode>("enToJa");
export const quizListAtom = atom<Pair[]>([]);
export const progressAtom = atom(0);
export const incorrectListAtom = atom<Pair[]>([]);

/**
 * 🔁 クイズ状態をリセットするためのユーティリティ関数
 */
export const resetQuizState = (set: (atom: any, val: any) => void) => {
  set(selectedCsvAtom, null);
  set(quizModeAtom, "enToJa");
  set(quizListAtom, []);
  set(progressAtom, 0);
  set(incorrectListAtom, []);
};
