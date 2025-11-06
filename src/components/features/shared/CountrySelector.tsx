"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCountryData } from "@/lib/hooks/useCountryData";
import { Country } from "@/types";
import * as i18nCountries from "i18n-iso-countries";

// Helper to convert country code to flag emoji
const getFlagEmoji = (a3Code: string) => {
  const a2Code = i18nCountries.alpha3ToAlpha2(a3Code);
  if (!a2Code) return "🌐";
  return a2Code
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397));
};

interface CountrySelectorProps {
  value: string | null;
  id: string;
  availableCountries?: Country[];
  disabled?: boolean;
  onChange?: (a3Code: string) => void; // Restored for homepage
  onSuggestionSelect?: (a3Code: string | null) => void;
  onSubmit?: (a3Code: string) => void;
  onError?: (message: string) => void;
}

export const CountrySelector = ({
  value,
  id,
  availableCountries,
  disabled = false,
  onChange,
  onSuggestionSelect,
  onSubmit,
  onError,
}: CountrySelectorProps) => {
  const { countries, getCountryName, findCountryA3CodeByName } =
    useCountryData();
  const countrySource = useMemo(() => {
    const source = availableCountries || countries;
    // Enhance with flag and English name for display
    return source.map((country) => ({
      ...country,
      flag: getFlagEmoji(country.id),
      englishName: i18nCountries.getName(country.id, "en") || country.id,
    }));
  }, [availableCountries, countries]);

  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false); // For suggestions
  const [isFocused, setIsFocused] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isFocused) {
      setInputValue(value ? (getCountryName(value) ?? "") : "");
    }
  }, [value, isFocused, getCountryName]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsListOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setInputValue(query);
    onSuggestionSelect?.(null);

    if (query) {
      const normalizedQuery = query.toLowerCase();
      const filteredSuggestions = countrySource.filter(
        (country) =>
          country.name.toLowerCase().startsWith(normalizedQuery) ||
          country.englishName.toLowerCase().startsWith(normalizedQuery)
      );
      setSuggestions(filteredSuggestions);
      setIsListOpen(true);
    } else {
      setSuggestions([]);
      setIsListOpen(false);
    }
  };

  const handleSelectCountry = (country: (typeof countrySource)[0]) => {
    onChange?.(country.id);
    onSuggestionSelect?.(country.id);
    setInputValue(""); // 入力欄をクリア
    setIsListOpen(false);
    setIsModalOpen(false); // Close modal on selection
    setIsFocused(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (disabled) return;

    // Case 1: If there is exactly one suggestion, submit it.
    if (suggestions.length === 1) {
      onSubmit?.(suggestions[0].id);
      onSuggestionSelect?.(suggestions[0].id); // Highlight it
      setInputValue(""); // Clear input after submission
      onSuggestionSelect?.(null);
      setIsFocused(false);
      setIsListOpen(false);
      return;
    }

    // Case 2: Validate the text input and submit if it's a valid country.
    const a3Code = findCountryA3CodeByName(inputValue);
    if (a3Code) {
      onSubmit?.(a3Code);
      onSuggestionSelect?.(a3Code); // Highlight it
    } else {
      onError?.("有効な国名を入力してください");
      onSuggestionSelect?.(null);
    }
    setInputValue(""); // 入力欄をクリア
    setIsFocused(false);
    setIsListOpen(false);
  };

  // suggestions state
  const [suggestions, setSuggestions] = useState<typeof countrySource>([]);

  const Modal = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      setIsMounted(true);
      return () => setIsMounted(false);
    }, []);

    const filteredCountries = countrySource.filter(
      (country) =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.englishName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const modalContent = (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm p-4 overflow-y-auto flex flex-col"
      >
        <div className="w-full max-w-6xl mx-auto h-full flex flex-col">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h2 className="text-xl font-bold text-white">国を選択</h2>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-white text-2xl"
            >
              &times;
            </button>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="国名を検索..."
            className="w-full rounded-md border-0 bg-white/20 py-2.5 px-4 text-white placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-400 sm:text-sm shrink-0"
          />
          <ul className="w-full max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 p-4 overflow-y-auto mt-4">
            {filteredCountries.map((country) => (
              <li
                key={country.id}
                onClick={() => handleSelectCountry(country)}
                className="p-2 bg-white/10 rounded-md hover:bg-white/20 flex items-center gap-4 cursor-pointer"
              >
                <span className="text-3xl font-sans">{country.flag}</span>
                <div>
                  <p className="font-semibold text-white">{country.name}</p>
                  <p className="text-sm text-gray-300">{country.englishName}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    );

    if (!isMounted) {
      return null;
    }

    return createPortal(modalContent, document.body);
  };

  const inputElement = (
    <div className="relative">
      <input
        id={id}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
        className={`w-full rounded-md border-0 bg-white/70 py-2.5 pl-4 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-white/50 placeholder:text-gray-500 focus:bg-white/90 focus:ring-2 focus:ring-inset focus:ring-indigo-400 sm:text-sm sm:leading-6 transition ${
          disabled ? "cursor-not-allowed opacity-50" : ""
        }`}
        placeholder={
          disabled ? "スタート国を先に選んでください" : "国名を入力..."
        }
        autoComplete="off"
      />
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        disabled={disabled}
        className="absolute inset-y-0 right-0 flex items-center justify-center w-12 text-xl text-gray-600 hover:text-indigo-500 rounded-r-md transition-colors"
        aria-label="すべての国を表示"
      >
        <span>🌐</span>
      </button>
    </div>
  );

  return (
    <div ref={containerRef} className="relative w-full">
      {onSubmit ? (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="grow">{inputElement}</div>
          <button
            type="submit"
            disabled={disabled}
            className="shrink-0 rounded-md bg-cyan-500 px-6 py-2.5 font-bold text-white shadow-lg transition-all hover:bg-cyan-400 active:scale-95 disabled:cursor-not-allowed disabled:bg-cyan-500/50 disabled:shadow-none"
          >
            回答
          </button>
        </form>
      ) : (
        inputElement
      )}

      {/* Inline Suggestions */}
      <AnimatePresence>
        {isListOpen && suggestions.length > 0 && !isModalOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full mt-1 bg-white/90 backdrop-blur-md rounded-md shadow-lg max-h-60 overflow-auto"
          >
            {suggestions.map((country) => (
              <li
                key={country.id}
                onMouseDown={() => handleSelectCountry(country)}
                className="p-3 flex items-center gap-4 cursor-pointer hover:bg-white"
              >
                <span className="text-2xl font-sans">{country.flag}</span>
                <div>
                  <p className="font-semibold text-gray-800">{country.name}</p>
                  <p className="text-sm text-gray-500">{country.englishName}</p>
                </div>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      <AnimatePresence>{isModalOpen && <Modal />}</AnimatePresence>
    </div>
  );
};
