"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { selectedCsvAtom, quizListAtom } from "@/atoms/quizAtoms";

export default function Page() {
  const router = useRouter();
  const [files, setFiles] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [, setCsv] = useAtom(selectedCsvAtom);
  const [, setQuizList] = useAtom(quizListAtom);

  useEffect(() => {
    fetch("/api/csv-list")
      .then((r) => r.json())
      .then((data) => setFiles(data.files))
      .catch(() => setError("CSVファイルの一覧取得に失敗しました"));
  }, []);

  const handleSelect = async (file: string) => {
    const res = await fetch(`/api/csv-data?file=${file}`);
    const data = await res.json();
    if (res.ok) {
      setCsv(file);
      setQuizList(data);
      router.push("/mode");
    } else setError(data.error);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl mb-6 font-bold">CSVファイルを選択</h1>

      {error && <p className="text-red-400 mb-3">{error}</p>}

      {/* 中央寄せされたボタンリスト */}
      <div className="flex flex-col items-center space-y-4 w-full max-w-xs">
        {files.map((f) => (
          <button
            key={f}
            onClick={() => handleSelect(f)}
            className="bg-orange-500 hover:bg-orange-600 w-full py-3 rounded text-white text-center"
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );
}
