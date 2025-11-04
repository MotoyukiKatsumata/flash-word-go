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
      <h1 className="text-2xl mb-4 font-bold">CSVファイルを選択</h1>
      {error && <p className="text-red-400 mb-3">{error}</p>}
      <div className="space-y-3">
        {files.map((f) => (
          <button
            key={f}
            onClick={() => handleSelect(f)}
            className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded text-white w-64 text-center"
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );
}
