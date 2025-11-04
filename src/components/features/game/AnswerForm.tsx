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
        <fieldset disabled={disabled} className="flex gap-2 w-full">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="国名を入力..."
            className="border border-gray-300 rounded-md p-2 glow disabled:bg-gray-200"
            autoComplete="off"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            回答
          </button>
        </fieldset>
      </form>
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto">
          {suggestions.map((s) => (
            <li
              key={s.a3}
              onClick={() => handleSuggestionClick(s)}
              className="p-2 hover:bg-gray-100 cursor-pointer text-black"
            >
              {s.japaneseName} ({s.englishName})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
