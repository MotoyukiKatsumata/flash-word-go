"use client";
import { useAtom } from "jotai";
import { quizModeAtom } from "@/atoms/quizAtoms";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ModePage() {
  const router = useRouter();
  const [, setMode] = useAtom(quizModeAtom);

  // ✅ デフォルトで「英単語問題」選択済みにする
  const [selected, setSelected] = useState<"enToJa" | "jaToEn">("enToJa");

  useEffect(() => {
    setMode("enToJa");
  }, [setMode]);

  const handleConfirm = () => {
    setMode(selected);
    router.push("/quiz");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl mb-6 font-bold">出題モードを選択</h1>

      {/* 中央寄せされたボタン群 */}
      <div className="flex flex-col items-center space-y-4 w-full max-w-xs">
        <button
          onClick={() => setSelected("enToJa")}
          className={`w-full py-3 rounded text-center transition-colors ${
            selected === "enToJa"
              ? "bg-blue-500 text-white"
              : "bg-gray-700 text-gray-200 hover:bg-gray-600"
          }`}
        >
          英単語問題
        </button>

        <button
          onClick={() => setSelected("jaToEn")}
          className={`w-full py-3 rounded text-center transition-colors ${
            selected === "jaToEn"
              ? "bg-blue-500 text-white"
              : "bg-gray-700 text-gray-200 hover:bg-gray-600"
          }`}
        >
          日本語問題
        </button>
      </div>

      <button
        onClick={handleConfirm}
        className="mt-8 bg-green-500 hover:bg-green-600 px-8 py-3 rounded text-white font-semibold"
      >
        確定
      </button>
    </div>
  );
}
