"use client";

import { useState } from "react";

type AnswerFormProps = {
  onSubmit: (answer: string) => void;
  disabled: boolean;
};

export const AnswerForm = ({ onSubmit, disabled }: AnswerFormProps) => {
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
      <fieldset disabled={disabled} className="flex gap-2 w-full">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="国名（3文字コード）を入力"
          className="border border-gray-300 rounded-md p-2 flex-grow disabled:bg-gray-200"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        >
          回答
        </button>
      </fieldset>
    </form>
  );
};
