"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react"; // lucide-reactがなければ、"X"のテキストで代替

// ダミーの国リスト（UI確認用）
const DUMMY_COUNTRIES = [
"日本", "アメリカ", "中国", "インド", "ブラジル", "ロシア",
"ドイツ", "フランス", "イギリス", "イタリア", "カナダ", "オーストラリア",
"スペイン", "メキシコ", "インドネシア", "トルコ", "オランダ", "スイス",
];

interface CountryModalProps {
isOpen: boolean;
onClose: () => void;
title: string;
// onSelect: (country: Country) => void; // 次のステップで実装
}

export const CountryModal = ({ isOpen, onClose, title }: CountryModalProps) => {
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
className="relative flex w-full max-w-4xl flex-col rounded-2xl bg-gray-800/50 shadow-2xl"
onClick={(e) => e.stopPropagation()}
>
{/* 1. ヘッダー */}
<div className="flex items-center justify-between border-b border-white/10 p-4">
<h2 className="text-xl font-bold text-white">{title}</h2>
<button onClick={onClose} className="text-gray-400 hover:text-white">
<X size={24} />
</button>
</div>

{/* 2. 検索バー */}
<div className="p-4">
<input
type="text"
placeholder="国名を検索..."
className="w-full rounded-lg border-none bg-white/10 p-3 text-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
</div>

{/* 3. 国グリッド（ダミー） */}
<div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
{DUMMY_COUNTRIES.map((country) => (
<motion.button
key={country}
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
className="rounded-lg bg-white/5 p-3 text-center text-white transition-colors hover:bg-white/10"
>
{country}
</motion.button>
))}
</div>
</motion.div>
</motion.div>
)}
</AnimatePresence>
);
};
