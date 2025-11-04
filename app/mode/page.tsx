"use client";
import { useAtom } from "jotai";
import { quizModeAtom } from "@/atoms/quizAtoms";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ModePage() {
  const router = useRouter();
  const [, setMode] = useAtom(quizModeAtom);
  const [selected, setSelected] = useState<"enToJa" | "jaToEn" | null>(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl mb-6 font-bold">出題モードを選択</h1>
      <div className="space-y-4">
        <button
          onClick={() => setSelected("enToJa")}
          className={`w-64 py-3 rounded ${
            selected === "enToJa" ? "bg-blue-500" : "bg-gray-700"
          }`}
        >
          英単語問題
        </button>
        <button
          onClick={() => setSelected("jaToEn")}
          className={`w-64 py-3 rounded ${
            selected === "jaToEn" ? "bg-blue-500" : "bg-gray-700"
          }`}
        >
          日本語問題
        </button>
      </div>
      <button
        disabled={!selected}
        onClick={() => {
          if (selected) {
            setMode(selected);
            router.push("/quiz");
          }
        }}
        className="mt-6 bg-green-500 hover:bg-green-600 px-6 py-3 rounded text-white disabled:opacity-50"
      >
        確定
      </button>
    </div>
  );
}
