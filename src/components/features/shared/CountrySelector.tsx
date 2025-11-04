"use client";

import { useState, useRef, useEffect, useMemo } from "react";
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
  const [displayCountries, setDisplayCountries] = useState(countrySource);
  const [isListOpen, setIsListOpen] = useState(false);
  const [isSuggestMode, setIsSuggestMode] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value ? getCountryName(value) ?? "" : "");
  }, [value, getCountryName]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
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
      setDisplayCountries(suggestions);
      setIsSuggestMode(true);
      setIsListOpen(true);
    } else {
      setDisplayCountries([]);
      setIsListOpen(false);
    }
  };

  const handleDropdownClick = () => {
    if (isListOpen && !isSuggestMode) {
      setIsListOpen(false);
    } else {
      setDisplayCountries(countrySource);
      setIsSuggestMode(false);
      setIsListOpen(true);
    }
  };

  const handleSelectCountry = (country: typeof countrySource[0]) => {
    setInputValue(country.name);
    onChange?.(country.id); // Call onChange for homepage
    onSuggestionSelect?.(country.id); // Call onSuggestionSelect for game page
    setIsListOpen(false);
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

  const inputElement = (
    <div className="relative">
       <input
        id={id}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => {
          if (inputValue) {
            setIsSuggestMode(true);
            const normalizedQuery = inputValue.toLowerCase();
            const suggestions = countrySource.filter(
              (country) =>
                country.name.toLowerCase().includes(normalizedQuery) ||
                country.englishName.toLowerCase().includes(normalizedQuery)
            );
            setDisplayCountries(suggestions);
            setIsListOpen(true);
          }
        }}
        onBlur={onBlur}
        disabled={disabled}
        className={`w-full rounded-md border-0 bg-white/70 py-2.5 pl-4 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-white/50 placeholder:text-gray-500 focus:bg-white/90 focus:ring-2 focus:ring-inset focus:ring-indigo-400 sm:text-sm sm:leading-6 transition ${
          disabled ? "cursor-not-allowed opacity-50" : ""
        }`}
        placeholder={disabled ? "スタート国を先に選んでください" : "国名を入力..."}
        autoComplete="off"
      />
      <button
        type="button"
        onClick={handleDropdownClick}
        disabled={disabled}
        className="absolute inset-y-0 right-0 flex items-center justify-center w-12 text-xl text-gray-600 hover:text-indigo-500 rounded-r-md transition-colors"
        aria-label="すべての国を表示"
      >
        <span>🌐</span>
      </button>
    </div>
  );

  const listElement = isListOpen && (
    <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white/30 backdrop-blur-lg py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
      {displayCountries.length > 0 ? (
        displayCountries.map((country) => (
          <li
            key={country.id}
            onMouseDown={(e) => {
              e.preventDefault();
              handleSelectCountry(country);
            }}
            className="relative cursor-pointer select-none py-2 pl-3 pr-9 text-white hover:bg-indigo-500/50"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{country.flag}</span>
              <span className="block truncate font-semibold">{country.name}</span>
              <span className="block truncate text-sm text-gray-200">{country.englishName}</span>
            </div>
          </li>
        ))
      ) : (
        <li className="relative cursor-default select-none py-2 px-4 text-gray-200">
          {isSuggestMode ? "一致する国がありません" : "国リストを読み込めません"}
        </li>
      )}
    </ul>
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
      {listElement}
    </div>
  );
};
