"use client";
import { useAtom } from "jotai";
import {
  quizModeAtom,
  quizListAtom,
  progressAtom,
  incorrectListAtom,
} from "@/atoms/quizAtoms";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Pair = { en: string; ja: string };

export default function QuizPage() {
  const [mode] = useAtom(quizModeAtom);
  const [list] = useAtom(quizListAtom);
  const [progress, setProgress] = useAtom(progressAtom);
  const [incorrect, setIncorrect] = useAtom(incorrectListAtom);
  const [visible, setVisible] = useState<Pair[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackColor, setFeedbackColor] = useState("text-green-400");
  const router = useRouter();

  useEffect(() => {
    if (!list.length) router.push("/");
    setVisible(list.slice(0, 10));
  }, [list]);

  const handleAnswer = (q: Pair, answer: string) => {
    const correct = mode === "enToJa" ? q.ja : q.en;
    if (answer === correct) {
      setFeedback("正解！");
      setFeedbackColor("text-green-400");
      setTimeout(() => setFeedback(null), 1000);

      setProgress((p) => p + 1);
      const next = list[progress + 10];
      setVisible((v) => v.filter((x) => x !== q).concat(next ? [next] : []));
    } else {
      setFeedback(`不正解。正解は「${correct}」`);
      setFeedbackColor("text-red-400");
      setTimeout(() => setFeedback(null), 3000);
      setIncorrect((prev) => [...prev, q]);
    }
  };

  if (progress >= list.length)
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

  return (
    <div className="p-4">
      <h1 className="text-center text-xl font-bold mb-4">
        同じ意味のペアをタップしてください
      </h1>
      {feedback && (
        <p className={`text-center mb-3 ${feedbackColor}`}>{feedback}</p>
      )}
      <div className="grid grid-cols-2 gap-2">
        {visible.map((q, i) => (
          <div
            key={i}
            className="flex flex-col items-center bg-gray-800 p-2 rounded"
          >
            <p className="text-lg mb-2">{mode === "enToJa" ? q.en : q.ja}</p>
            {visible.map((opt, j) => (
              <button
                key={j}
                className="bg-orange-500 hover:bg-orange-600 w-full py-2 rounded text-sm"
                onClick={() =>
                  handleAnswer(q, mode === "enToJa" ? opt.ja : opt.en)
                }
              >
                {mode === "enToJa" ? opt.ja : opt.en}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
