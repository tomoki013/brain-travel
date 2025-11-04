"use client";

import { useState, useRef, useEffect } from "react";
import { useCountryData } from "@/lib/hooks/useCountryData";
import { Country } from "@/types";

interface CountrySelectorProps {
  value: string | null;
  onChange: (a3Code: string) => void;
  id: string; // for label htmlFor
  countriesList?: Country[];
  disabled?: boolean;
}

export const CountrySelector = ({
  value,
  onChange,
  id,
  countriesList,
  disabled = false,
}: CountrySelectorProps) => {
  const { getCountrySuggestions, countries, getCountryName } = useCountryData();
  const countrySource = countriesList || countries;

  // The text inside the input field
  const [inputValue, setInputValue] = useState("");
  // The list of countries shown in the dropdown (can be suggestions or all countries)
  const [displayCountries, setDisplayCountries] = useState<Country[]>([]);
  // Whether the dropdown list is visible
  const [isListOpen, setIsListOpen] = useState(false);
  // Differentiate between suggestion list and full country list for placeholder text
  const [isSuggestMode, setIsSuggestMode] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // When the parent component's value changes, update the input field text
  useEffect(() => {
    setInputValue(value ? getCountryName(value) ?? "" : "");
  }, [value, getCountryName]);

  // Handle click outside to close the dropdown list
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

    if (query) {
      const normalizedQuery = query.toLowerCase();
      const suggestions = countrySource.filter((country) =>
        country.name.toLowerCase().includes(normalizedQuery)
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
    // If the list is already open showing all countries, close it
    if (isListOpen && !isSuggestMode) {
      setIsListOpen(false);
    } else {
      // Otherwise, show all countries
      setDisplayCountries(countrySource);
      setIsSuggestMode(false);
      setIsListOpen(true);
    }
  };

  const handleSelectCountry = (country: Country) => {
    setInputValue(country.name);
    onChange(country.id);
    setIsListOpen(false);
  };

  // When the input loses focus, reset the text to the officially selected country name
  const onBlur = () => {
    // A brief timeout allows the click event on the list to register before the blur closes it
    setTimeout(() => {
        if (!isListOpen) {
            setInputValue(value ? getCountryName(value) ?? "" : "");
        }
    }, 150);
  };

  return (
    <div ref={containerRef} className="relative w-full">
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
              const suggestions = countrySource.filter((country) =>
                country.name.toLowerCase().includes(normalizedQuery)
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

      {isListOpen && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white/30 backdrop-blur-lg py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
          {displayCountries.length > 0 ? (
            displayCountries.map((country) => (
              <li
                key={country.id}
                onMouseDown={(e) => {
                  // Prevent onBlur from firing before the selection is made
                  e.preventDefault();
                  handleSelectCountry(country);
                }}
                className="relative cursor-pointer select-none py-2 pl-3 pr-9 text-white hover:bg-indigo-500/50"
              >
                <span className="block truncate">{country.name}</span>
              </li>
            ))
          ) : (
            <li className="relative cursor-default select-none py-2 px-4 text-gray-200">
              {isSuggestMode
                ? "一致する国がありません"
                : "国リストを読み込めません"}
            </li>
          )}
        </ul>
      )}
    </div>
  );
};
