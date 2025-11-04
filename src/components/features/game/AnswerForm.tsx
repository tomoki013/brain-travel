"use client";

import { useState } from "react";
import { useCountryData } from "@/lib/hooks/useCountryData";

type AnswerFormProps = {
  onSubmit: (answer: string) => void;
  disabled: boolean;
  onSuggestionSelect: (countryId: string | null) => void;
};

type Suggestion = {
  a3: string;
  englishName: string;
  japaneseName: string;
};

export const AnswerForm = ({
  onSubmit,
  disabled,
  onSuggestionSelect,
}: AnswerFormProps) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const { findCountryA3CodeByName, getCountrySuggestions } = useCountryData();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value) {
      setSuggestions(getCountrySuggestions(value));
    } else {
      setSuggestions([]);
      onSuggestionSelect(null); // Clear selection
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setInputValue(suggestion.japaneseName || suggestion.englishName);
    setSuggestions([]);
    onSuggestionSelect(suggestion.a3); // Set selection
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const a3Code = findCountryA3CodeByName(inputValue);
    if (a3Code) {
      onSubmit(a3Code);
      setInputValue("");
      onSuggestionSelect(null); // Clear selection after submit
    } else {
      onSubmit(""); // Pass an empty string to indicate an error
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <fieldset disabled={disabled} className="flex w-full gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="次の国を入力..."
            className="w-full rounded-md border-2 border-white/50 bg-white/20 px-4 py-2 text-white placeholder-white/70 transition-colors focus:border-cyan-400 focus:bg-white/30 focus:outline-none disabled:cursor-not-allowed disabled:bg-white/10"
            autoComplete="off"
          />
          <button
            type="submit"
            className="shrink-0 rounded-md bg-cyan-500 px-6 py-2 font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:bg-cyan-500/50 disabled:shadow-none"
          >
            回答
          </button>
        </fieldset>
      </form>
      {suggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto rounded-md border border-white/30 bg-black/50 text-white shadow-lg backdrop-blur-lg">
          {suggestions.map((s) => (
            <li
              key={s.a3}
              onClick={() => handleSuggestionClick(s)}
              className="cursor-pointer px-4 py-2 transition-colors hover:bg-cyan-500/50"
            >
              {s.japaneseName} ({s.englishName})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
