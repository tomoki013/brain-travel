'use client';

import { useState, useMemo } from 'react';
import countriesData from '@/data/countries.json'; // データ読み込み

// 修正点1: Countryの型定義をより正確に修正
interface Country {
	name: {
		common: string;
		official: string;
		nativeName?: {
			[key: string]: {
				official: string;
				common: string;
			};
		};
	};
	cca3: string;
	borders?: string[];
}

export default function Home() {
	const allCountries: Country[] = useMemo(() => {
		// Preprocess to remove undefined values from nativeName
		return (countriesData as unknown as Country[]).map((country) => {
			if (country.name?.nativeName) {
				const cleanedNativeName: { [key: string]: { official: string; common: string } } = {};
				Object.entries(country.name.nativeName).forEach(([lang, value]) => {
					if (
						value &&
						typeof value === 'object' &&
						(value as { official?: string; common?: string }).official &&
						(value as { official?: string; common?: string }).common
					) {
						cleanedNativeName[lang] = value as { official: string; common: string };
					}
				});
				return {
					...country,
					name: {
						...country.name,
						nativeName: cleanedNativeName,
					},
				};
			}
			return {
				...country,
				name: {
					...country.name,
					nativeName: undefined,
				},
			};
		});
	}, []);
	
	const [startCountry, setStartCountry] = useState<Country | null>(null);
	const [goalCountry, setGoalCountry] = useState<Country | null>(null);
	const [currentCountry, setCurrentCountry] = useState<Country | null>(null);
	const [path, setPath] = useState<Country[]>([]);
	const [inputValue, setInputValue] = useState('');
	const [error, setError] = useState('');
	const [isFinished, setIsFinished] = useState(false);

	// ゲーム開始処理
	const handleStartGame = () => {
		if (startCountry && goalCountry && startCountry.cca3 !== goalCountry.cca3) {
			setCurrentCountry(startCountry);
			setPath([startCountry]);
			setIsFinished(false);
			setError('');
		} else {
			setError('スタートとゴールには、異なる国を選択してください。');
		}
	};
	
	// 回答処理
	const handleAnswerSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!currentCountry || !goalCountry) return;

		const answeredCountry = allCountries.find(
			(c) => c.name.common.toLowerCase() === inputValue.toLowerCase()
		);

		if (!answeredCountry) {
			setError('その国は存在しません。');
			return;
		}

		if (currentCountry.borders?.includes(answeredCountry.cca3)) {
			const newPath = [...path, answeredCountry];
			setPath(newPath);
			setCurrentCountry(answeredCountry);
			setError('');
			setInputValue('');

			if (answeredCountry.cca3 === goalCountry.cca3) {
				setIsFinished(true);
			}
		} else {
			setError(`${currentCountry.name.common}と${answeredCountry.name.common}は隣接していません。`);
		}
	};

	// 修正点2: 国選択のプルダウンメニューを実装
	const handleSelectChange = (cca3: string, type: 'start' | 'goal') => {
		const selected = allCountries.find(c => c.cca3 === cca3) || null;
		if (type === 'start') {
			setStartCountry(selected);
		} else {
			setGoalCountry(selected);
		}
	};

	return (
		<main className="container mx-auto p-4 md:p-8 bg-gray-900 text-white min-h-screen font-sans">
			<h1 className="text-3xl md:text-4xl font-bold text-center mb-8">脳内世界旅行 🧠✈️</h1>
			
			<div className="max-w-2xl mx-auto">
				{/* ゲーム設定エリア */}
				<div className="bg-gray-800 p-4 rounded-lg mb-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
						<div>
							<label htmlFor="start-country" className="block mb-1 text-sm font-medium">スタート国</label>
							<select 
								id="start-country"
								onChange={(e) => handleSelectChange(e.target.value, 'start')}
								className="w-full p-2 bg-gray-700 rounded border border-gray-600"
							>
								<option>国を選択...</option>
								{allCountries.map(c => <option key={c.cca3} value={c.cca3}>{c.name.common}</option>)}
							</select>
						</div>
						<div>
							<label htmlFor="goal-country" className="block mb-1 text-sm font-medium">ゴール国</label>
							<select 
								id="goal-country"
								onChange={(e) => handleSelectChange(e.target.value, 'goal')}
								className="w-full p-2 bg-gray-700 rounded border border-gray-600"
							>
								<option>国を選択...</option>
								{allCountries.map(c => <option key={c.cca3} value={c.cca3}>{c.name.common}</option>)}
							</select>
						</div>
					</div>
					<button onClick={handleStartGame} disabled={!startCountry || !goalCountry} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 p-2 rounded transition-colors">
						ゲーム開始
					</button>
				</div>

				{/* ゲームプレイエリア */}
				{currentCountry && !isFinished && (
					<div className="bg-gray-800 p-4 rounded-lg">
						<div className="flex justify-between items-baseline mb-4">
							<p>現在地: <span className="font-bold text-xl text-yellow-400">{currentCountry.name.common}</span></p>
							<p>ゴール: <span className="font-bold text-xl text-green-400">{goalCountry?.name.common}</span></p>
						</div>
						
						<form onSubmit={handleAnswerSubmit} className="flex gap-2">
							<input 
								type="text" 
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
								className="bg-gray-700 p-2 rounded w-full border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
								placeholder="隣接する国名を入力..."
								autoFocus
							/>
							<button type="submit" className="bg-green-600 hover:bg-green-700 p-2 rounded transition-colors">回答</button>
						</form>
					</div>
				)}

				{/* 結果表示 */}
				{error && <p className="text-red-500 mt-4 text-center">{error}</p>}
				{isFinished && (
					<div className="text-center mt-4 p-8 bg-green-800 rounded-lg">
						<h2 className="text-4xl font-bold">🎉 クリア！ 🎉</h2>
						<p className="mt-2">おめでとうございます！</p>
					</div>
				)}

				{/* 辿ったルート */}
				{path.length > 0 && (
					<div className="mt-8">
						<h3 className="text-xl mb-3">ルート</h3>
						<div className="flex flex-wrap gap-2 items-center">
							{path.map((country, index) => (
								<div key={country.cca3} className="flex items-center gap-2">
									{index > 0 && <span className="text-gray-400">→</span>}
									<span className="bg-gray-600 px-3 py-1 rounded-full text-sm">
										{country.name.common}
									</span>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</main>
	);
}
