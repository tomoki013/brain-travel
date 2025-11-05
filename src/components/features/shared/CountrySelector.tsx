"use client";

import { useState, useRef, useEffect, useMemo } from "react";
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
    .replace(/./g, (char) =>
      String.fromCodePoint(char.charCodeAt(0) + 127397)
    );
};

interface CountrySelectorProps {
  value: string | null;
  id: string;
  countriesList?: Country[];
  disabled?: boolean;
  onChange?: (a3Code: string) => void; // Restored for homepage
  onSuggestionSelect?: (a3Code: string | null) => void;
  onSubmit?: (a3Code: string) => void;
}

export const CountrySelector = ({
  value,
  id,
  countriesList,
  disabled = false,
  onChange,
  onSuggestionSelect,
  onSubmit,
}: CountrySelectorProps) => {
  const { countries, getCountryName, findCountryA3CodeByName } = useCountryData();
  const countrySource = useMemo(() => {
    const source = countriesList || countries;
    // Enhance with flag and English name for display
    return source.map(country => ({
      ...country,
      flag: getFlagEmoji(country.id),
      englishName: i18nCountries.getName(country.id, "en") || country.id,
    }));
  }, [countriesList, countries]);

  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false); // For suggestions

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value ? getCountryName(value) ?? "" : "");
  }, [value]);

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
      const suggestions = countrySource.filter(
        (country) =>
          country.name.toLowerCase().includes(normalizedQuery) ||
          country.englishName.toLowerCase().includes(normalizedQuery)
      );
      // setDisplayCountries(suggestions);
      // setIsSuggestMode(true);
      setIsListOpen(true);
    } else {
      // setDisplayCountries([]);
      setIsListOpen(false);
    }
  };

  const handleSelectCountry = (country: typeof countrySource[0]) => {
    setInputValue(country.name);
    onChange?.(country.id);
    onSuggestionSelect?.(country.id);
    setIsListOpen(false);
    setIsModalOpen(false); // Close modal on selection
  };

  const onBlur = () => {
    setTimeout(() => {
        if (!isListOpen) {
          const currentCountryName = value ? getCountryName(value) ?? "" : "";
          if(findCountryA3CodeByName(inputValue) !== value) {
            setInputValue(currentCountryName);
          }
        }
    }, 150);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const a3Code = findCountryA3CodeByName(inputValue);
    if (a3Code) {
      onSubmit?.(a3Code);
      setInputValue("");
      onSuggestionSelect?.(null);
    } else {
      onSubmit?.("");
    }
  };

  // suggestions state
  const [suggestions, setSuggestions] = useState<typeof countrySource>([]);

  const Modal = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredCountries = countrySource.filter(
      (country) =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.englishName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 flex flex-col"
      >
        <div className="flex items-center justify-between mb-4">
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
          className="w-full rounded-md border-0 bg-white/20 py-2.5 px-4 text-white placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-400 sm:text-sm"
        />
        <ul className="flex-1 overflow-y-auto mt-4 space-y-2">
          {filteredCountries.map((country) => (
            <li
              key={country.id}
              onClick={() => handleSelectCountry(country)}
              className="p-2 flex items-center gap-4 cursor-pointer rounded-md hover:bg-white/20"
            >
              <span className="text-3xl font-sans">{country.flag}</span>
              <div>
                <p className="font-semibold text-white">{country.name}</p>
                <p className="text-sm text-gray-300">{country.englishName}</p>
              </div>
            </li>
          ))}
        </ul>
      </motion.div>
    );
  };

  const inputElement = (
    <div className="relative">
      <input
        id={id}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => {
          if (inputValue) {
            // Logic to show suggestions under the input
          }
        }}
        onBlur={onBlur}
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
          <div className="flex-grow">{inputElement}</div>
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
      <AnimatePresence>{isModalOpen && <Modal />}</AnimatePresence>
    </div>
  );
};
