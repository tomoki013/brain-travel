// src/lib/data/countries.ts

export interface Country {
  id: string; // ISO 3166-1 alpha-3
  name: string; // Japanese name
}

export const countries: Country[] = [
  { id: 'JPN', name: '日本' },
  { id: 'USA', name: 'アメリカ' },
  { id: 'FRA', name: 'フランス' },
  { id: 'CHN', name: '中国' },
  { id: 'IND', name: 'インド' },
  { id: 'BRA', name: 'ブラジル' },
  { id: 'RUS', name: 'ロシア' },
  { id: 'DEU', name: 'ドイツ' },
  { id: 'GBR', name: 'イギリス' },
  { id: 'ITA', name: 'イタリア' },
  { id: 'CAN', name: 'カナダ' },
  { id: 'AUS', name: 'オーストラリア' },
  { id: 'ESP', name: 'スペイン' },
  { id: 'MEX', name: 'メキシコ' },
  { id: 'IDN', name: 'インドネシア' },
  { id: 'SAU', name: 'サウジアラビア' },
  { id: 'ZAF', name: '南アフリカ' },
  { id: 'ARG', name: 'アルゼンチン' },
  { id: 'EGY', name: 'エジプト' },
  { id: 'KOR', name: '韓国' },
];
