"use client";

import { useState } from "react";

type AnswerFormProps = {
  onSubmit: (answer: string) => void;
};

export const AnswerForm = ({ onSubmit }: AnswerFormProps) => {
  const [answer, setAnswer] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (answer.trim()) {
      onSubmit(answer.trim().toUpperCase());
      setAnswer("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="国名（3文字コード）を入力"
        className="border border-gray-300 rounded-md p-2 flex-grow"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700"
      >
        回答
      </button>
    </form>
  );
};
