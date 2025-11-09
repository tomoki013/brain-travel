'use client';

import { useCountryData } from '@/lib/hooks/useCountryData';
import { useState, FormEvent, ChangeEvent } from 'react';

type Props = {
  onSubmit: (a3Code: string) => void;
  onError: (message: string) => void;
  onSuggestionSelect: (a3Code: string | null) => void;
};

const AnswerForm = ({ onSubmit, onError, onSuggestionSelect }: Props) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<{ id: string; name: string }[]>([]);
  const { getCountrySuggestions, findCountryA3CodeByName } = useCountryData();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value) {
      const rawSuggestions = getCountrySuggestions(value);
      const formattedSuggestions = rawSuggestions.map(s => ({ id: s.a3, name: s.japaneseName || s.englishName }));
      setSuggestions(formattedSuggestions);
      // Pass the top suggestion to the parent for potential map highlighting
      onSuggestionSelect(formattedSuggestions.length > 0 ? formattedSuggestions[0].id : null);
    } else {
      setSuggestions([]);
      onSuggestionSelect(null);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const a3Code = findCountryA3CodeByName(inputValue);
    if (a3Code) {
      onSubmit(a3Code);
    } else {
      onError('有効な国名を入力してください');
    }
    // Clear form after submission
    setInputValue('');
    setSuggestions([]);
    onSuggestionSelect(null);
  };

  const handleSuggestionClick = (a3Code: string) => {
    onSubmit(a3Code);
    // Clear form after selection
    setInputValue('');
    setSuggestions([]);
    onSuggestionSelect(null);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="国名を入力..."
          autoComplete="off"
          className="w-full p-2 text-white bg-black/30 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <button
          type="submit"
          className="px-4 py-2 font-bold text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors"
        >
          回答
        </button>
      </div>
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((country) => (
            <li
              key={country.id}
              onClick={() => handleSuggestionClick(country.id)}
              className="px-4 py-2 text-white cursor-pointer hover:bg-emerald-700"
            >
              {country.name}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
};

export default AnswerForm;
