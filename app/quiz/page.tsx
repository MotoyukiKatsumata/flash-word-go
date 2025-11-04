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

  // 出題データ初期化
  useEffect(() => {
    if (!list.length) router.push("/");
    const init = list.slice(0, 10);
    setLeftWords(init);
    setRightWords(shuffle([...init]));
  }, [list]);

  const shuffle = (arr: Pair[]) => arr.sort(() => Math.random() - 0.5);

  // ペア選択ロジック
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

        // 正解したペアを削除して次の問題に置き換え
        setLeftWords((prev) => prev.filter((p) => p !== selectedLeft));
        setRightWords((prev) => prev.filter((p) => p !== selectedRight));
        setProgress((p) => p + 1);

        const nextIndex = progress + 10;
        const nextPair = list[nextIndex];
        if (nextPair) {
          setLeftWords((prev) => [...prev, nextPair]);
          setRightWords((prev) => shuffle([...prev, nextPair]));
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
    <div className="p-4 flex flex-col items-center">
      {/* --- ヘッダーエリア --- */}
      <div className="flex items-center justify-between w-full max-w-3xl mb-4">
        <div className="flex space-x-3">
          <button
            onClick={() => router.push("/")}
            className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded text-sm"
          >
            CSVファイル選択
          </button>
          <button
            onClick={() => router.push("/mode")}
            className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded text-sm"
          >
            出題モード選択
          </button>
        </div>

        {/* 現在の状態表示 */}
        <div className="text-right text-sm text-gray-300">
          <p>
            選択CSV: <span className="font-semibold">{selectedCsv}</span>
          </p>
          <p>
            モード:{" "}
            <span className="font-semibold">
              {mode === "enToJa" ? "英単語問題" : "日本語問題"}
            </span>
          </p>
        </div>
      </div>

      <h1 className="text-center text-xl font-bold mb-4">
        同じ意味のペアをタップしてください
      </h1>
      {feedback && <p className={`mb-3 ${feedbackColor}`}>{feedback}</p>}

      {/* --- 問題と解答の2カラム --- */}
      <div className="grid grid-cols-2 gap-6 w-full max-w-3xl">
        {/* 左：問題 */}
        <div className="flex flex-col space-y-3">
          {leftWords.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedLeft(item)}
              className={`w-full py-3 rounded text-center break-words transition-colors ${
                selectedLeft === item
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {mode === "enToJa" ? item.en : item.ja}
            </button>
          ))}
        </div>

        {/* 右：選択肢 */}
        <div className="flex flex-col space-y-3">
          {rightWords.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedRight(item)}
              className={`w-full py-3 rounded text-center break-words transition-colors ${
                selectedRight === item
                  ? "bg-orange-500 text-white"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {mode === "enToJa" ? item.ja : item.en}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
