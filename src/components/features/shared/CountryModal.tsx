"use client";

import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { Country } from "@/types";

interface CountryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onSelect: (country: Country) => void;
  availableCountries: Country[];
}

export const CountryModal = ({
  isOpen,
  onClose,
  title,
  onSelect,
  availableCountries,
}: CountryModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCountries = useMemo(() => {
    if (!searchQuery) {
      return availableCountries;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return availableCountries.filter(
      (country) =>
        country.name.toLowerCase().includes(lowercasedQuery) ||
        country.id.toLowerCase().includes(lowercasedQuery), // Also search by A3 code
    );
  }, [searchQuery, availableCountries]);

  const handleSelect = (country: Country) => {
    onSelect(country);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-start bg-black/50 p-4 pt-20 backdrop-blur-xl"
          onClick={onClose}
        >
          {/* モーダルコンテンツ（クリックが伝播しないように） */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 500 }}
            className="relative flex h-full max-h-[80vh] w-full max-w-4xl flex-col rounded-2xl bg-neutral-900/80 border border-neutral-700 backdrop-blur-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 1. ヘッダー */}
            <div className="flex-shrink-0 flex items-center justify-between border-b border-white/10 p-4">
              <h2 className="text-xl font-bold text-white">{title}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>

            {/* 2. 検索バー */}
            <div className="flex-shrink-0 p-4">
              <input
                type="text"
                placeholder="国名を検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border-none bg-neutral-800/70 p-3 text-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>

            {/* 3. 国グリッド */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {filteredCountries.map((country) => (
                  <motion.button
                    key={country.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-neutral-700/60 rounded-xl p-3 text-center text-white transition-colors hover:bg-neutral-700"
                    onClick={() => handleSelect(country)}
                  >
                    {country.name}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
