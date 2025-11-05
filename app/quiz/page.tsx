"use client";

import { useAtom } from "jotai";
import {
  quizModeAtom,
  quizListAtom,
  progressAtom,
  incorrectListAtom,
  selectedCsvAtom,
} from "@/atoms/quizAtoms";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Pair = { en: string; ja: string };

export default function QuizPage() {
  const router = useRouter();
  const [mode] = useAtom(quizModeAtom);
  const [list] = useAtom(quizListAtom);
  const [progress, setProgress] = useAtom(progressAtom);
  const [incorrect, setIncorrect] = useAtom(incorrectListAtom);
  const [selectedCsv] = useAtom(selectedCsvAtom);

  const [leftWords, setLeftWords] = useState<Pair[]>([]);
  const [rightWords, setRightWords] = useState<Pair[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<Pair | null>(null);
  const [selectedRight, setSelectedRight] = useState<Pair | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackColor, setFeedbackColor] = useState("text-green-400");
  const [remainingIndices, setRemainingIndices] = useState<number[]>([]);

  const MAX_DISPLAY = 8; // 1画面表示上限

  const shuffle = (arr: Pair[]) => arr.sort(() => Math.random() - 0.5);

  useEffect(() => {
    if (!list.length) router.push("/");

    // すべての問題のインデックスをシャッフル
    const allIndices = list.map((_, i) => i);
    const shuffledIndices = allIndices.sort(() => Math.random() - 0.5);

    // 最初の8問を取得
    const initialIndices = shuffledIndices.slice(0, MAX_DISPLAY);
    const init = initialIndices.map(i => list[i]);

    // 残りのインデックスを保存
    setRemainingIndices(shuffledIndices.slice(MAX_DISPLAY));

    // 左右両方をシャッフル
    setLeftWords(shuffle([...init]));
    setRightWords(shuffle([...init]));
  }, [list]);

  // 正誤判定
  useEffect(() => {
    if (selectedLeft && selectedRight) {
      const correct =
        mode === "enToJa"
          ? selectedLeft.ja === selectedRight.ja
          : selectedLeft.en === selectedRight.en;

      if (correct) {
        setFeedback("正解！");
        setFeedbackColor("text-green-400");
        setTimeout(() => setFeedback(null), 1000);

        // 正解したペアを削除
        const newLeftWords = leftWords.filter((p) => p !== selectedLeft);
        const newRightWords = rightWords.filter((p) => p !== selectedRight);

        // 進捗を更新
        setProgress((p) => p + 1);

        // 次の問題を追加（remainingIndicesから取得）
        if (remainingIndices.length > 0) {
          const nextIndex = remainingIndices[0];
          const nextPair = list[nextIndex];

          // 残りのインデックスを更新
          setRemainingIndices(remainingIndices.slice(1));

          // 新しい問題を追加して、左右両方をシャッフル
          setLeftWords(shuffle([...newLeftWords, nextPair]));
          setRightWords(shuffle([...newRightWords, nextPair]));
        } else {
          // 残りの問題がない場合はそのまま設定
          setLeftWords(newLeftWords);
          setRightWords(newRightWords);
        }

        setSelectedLeft(null);
        setSelectedRight(null);
      } else {
        setFeedback(
          `不正解。正解は「${
            mode === "enToJa" ? selectedLeft.ja : selectedLeft.en
          }」`
        );
        setFeedbackColor("text-red-400");
        setTimeout(() => setFeedback(null), 3000);
        setIncorrect((prev) => [...prev, selectedLeft]);
        setSelectedLeft(null);
        setSelectedRight(null);
      }
    }
  }, [selectedLeft, selectedRight]);

  if (progress >= list.length) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">全問終了！</h1>
        <button
          onClick={() => router.push("/result")}
          className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded"
        >
          結果を見る
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col items-center min-h-screen relative overflow-hidden">
      {/* === ヘッダー === */}
      <div className="w-full max-w-3xl mb-2 bg-gray-800 p-3 rounded-md shadow flex flex-wrap justify-center sm:justify-between gap-3">
        {/* CSVファイル選択 */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => router.push("/")}
            className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded text-sm text-white whitespace-nowrap"
          >
            CSVファイル選択
          </button>
          <span className="text-gray-200 text-sm truncate max-w-[8rem]">
            {selectedCsv || "未選択"}
          </span>
        </div>

        {/* 出題モード選択 */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => router.push("/mode")}
            className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded text-sm text-white whitespace-nowrap"
          >
            出題モード選択
          </button>
          <span className="text-gray-200 text-sm">
            {mode === "enToJa" ? "英単語問題" : "日本語問題"}
          </span>
        </div>
      </div>

      {/* === タイトル === */}
      <h1 className="text-center text-xl font-bold mb-1">
        同じ意味のペアをタップしてください
      </h1>

      {/* === 問題＆解答（上寄せ配置） === */}
      <div className="grid grid-cols-2 gap-2 w-full max-w-3xl mt-1">
        {/* 左側（問題） */}
        <div className="flex flex-col justify-start space-y-1">
          {leftWords.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedLeft(item)}
              className={`h-12 w-full rounded text-center px-2 break-words overflow-hidden transition-all flex items-center justify-center ${
                selectedLeft === item
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 hover:bg-gray-600 text-white"
              }`}
              style={{ fontSize: "clamp(12px, 2vw, 16px)" }}
            >
              {mode === "enToJa" ? item.en : item.ja}
            </button>
          ))}
        </div>

        {/* 右側（選択肢） */}
        <div className="flex flex-col justify-start space-y-1">
          {rightWords.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedRight(item)}
              className={`h-12 w-full rounded text-center px-2 break-words overflow-hidden transition-all flex items-center justify-center ${
                selectedRight === item
                  ? "bg-orange-500 text-white"
                  : "bg-gray-700 hover:bg-gray-600 text-white"
              }`}
              style={{ fontSize: "clamp(12px, 2vw, 16px)" }}
            >
              {mode === "enToJa" ? item.ja : item.en}
            </button>
          ))}
        </div>
      </div>

      {/* === フィードバック（固定下部） === */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center pointer-events-none">
        <div className="h-6 text-center">
          {feedback && (
            <p className={`font-semibold ${feedbackColor} transition-opacity`}>
              {feedback}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
