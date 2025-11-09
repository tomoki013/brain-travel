# 🧠 Geo Linker アプリ AI 開発ガイドライン (GEMINI.md)

このファイルは、AI 開発エージェント（Jules, Gemini など）が本プロジェクトの開発を行う際に**必ず守るべき**ルールと設計を定義したものです。AI はコーディングの際、必ずこのファイルを参照してください。

## 【最重要】開発に着手する前に

- まず `DEVELOPMENT_LOG.md` を確認し、過去の開発経緯や知見を把握してください。
- 開発中に問題が発生した場合や実装に迷った際も、まずこのログに類似のケースや解決策がないか確認することで、解決のヒントが得られることがあります。

## 1. プロジェクト概要

- **名称:** Geo Linker アプリ
- **目的:** 「Geo Linker」の Web アプリ化。単なるクイズではなく、d3.js の地図や国の写真（Framer Motion 活用）を通じて「旅の体験（世界観）」を重視する。
- **管理:** 開発の主要部分は AI が担当し、ユーザーは PM（プロジェクトマネージャー）として機能する。

## 2. 技術スタック（確定）

- **フレームワーク:** Next.js v16 (App Router)
- **ライブラリ:** React v19 (Actions, useFormState, use の活用)
- **言語:** TypeScript
- **ディレクトリ:** `src` ディレクトリを使用
- **スタイリング:** Tailwind CSS v4
- **アニメーション:** Framer Motion
- **地図描画:** d3.js
- **認証:** NextAuth.js または Supabase Auth

## 3. 設計書（厳守）

AI は、以下の「内部設計書 v2」に厳密に従って開発を行うこと。

### 3.1. ディレクトリ構成

```txt
src/
├── app/
│   ├── (auth)/                   # 認証ルートグループ
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── layout.tsx              # 認証専用レイアウト
│   ├── (main)/                   # メイン機能のルートグループ
│   │   ├── (withFooter)/         # フッター表示グループ
│   │   │   ├── page.tsx            # トップページ
│   │   │   ├── terms/
│   │   │   │   └── page.tsx        # 利用規約
│   │   │   ├── privacy/
│   │   │   │   └── page.tsx        # プライバシーポリシー
│   │   │   ├── contact/
│   │   │   │   └── page.tsx        # お問い合わせ
│   │   │   ├── sitemap/
│   │   │   │   └── page.tsx        # サイトマップ
│   │   │   └── layout.tsx          # フッター付きレイアウト
│   │   ├── game/
│   │   │   └── page.tsx            # ゲームページ
│   │   ├── result/
│   │   │   └── page.tsx            # 結果ページ
│   │   ├── dashboard/
│   │   │   └── page.tsx            # マイページ
│   │   └── layout.tsx              # メインレイアウト (Headerのみ)
│   └── layout.tsx                  # ルートレイアウト
├── components/
│   ├── features/                   # ドメイン固有のコンポーネント
│   │   ├── game/
│   │   │   ├── WorldMap.tsx        # ★ d3.js 地図
│   │   │   ├── GamePanel.tsx       # ★ 右側パネル
│   │   ├── shared/
│   │   │   └── CountryModal.tsx    # ★ 国選択モーダル
│   │   └── result/                 # (結果表示関連コンポーネント)
│   ├── layout/                     # ページレイアウト用コンポーネント
│   │   └── Header.tsx
│   └── ui/                         # 汎用的なUIコンポーネント
│       └── Button.tsx              # 汎用ボタン
├── constants/                      # 定数
│   └── index.ts
├── lib/
│   ├── hooks/
│   │   ├── useGameLogic.ts         # ★ ゲームロジック集約
│   │   └── useCountryData.ts       # ★ 写真ロジック集約
│   ├── data/
│   │   ├── borders.json            # (国境データ)
│   │   └── world.json              # (地図データ)
│   └── auth.ts
│   └── utils.ts                  # 汎用ヘルパー関数
└── types/
    └── index.ts                  # グローバル型定義
```

### 3.2. 国 ID の統一

- `borders.json` は A3 コード (例: FRA) を使用します。`world.json` は M49 数値 ID (例: 250) を使用します。これらのマッピングは `useCountryData` フック（`country-codes.json` を参照）によって解決されます。

### 3.3. ロジックの分離（重要）

- コンポーネント（`.tsx`）内にビジネスロジックを記述しないこと。
- **ゲームロジック:** `src/lib/hooks/useGameLogic.ts` に集約する。
  - 責務: 国境判定、状態管理（現在の国、履歴、ステータス）
- **データ取得ロジック:** `src/lib/hooks/useCountryData.ts` に集約する。
  - 責務: 写真 URL の取得（ハイブリッド方式）、国名のローカライズ

## 4. データファイル仕様

- **地図データ:** `public/data/world.json`
  - 形式: TopoJSON
  - ID: `id` (数値文字列, 例: "250")
- **国境データ:** `src/lib/data/borders.json`
  - 形式: `Record<string, string[]>` (例: `{ "FRA": ["BEL", "DEU", ...], ... }`)

## 5. 機能別 AI 開発ルール

### 5.1. 写真表示 (F-07: ハイブリッド方式)

- `useCountryData.ts` 内の `getImageUrl(countryId)` 関数は、以下の優先順位で URL を返すロジックを実装すること。
  1. PM が用意したローカル写真（例: `public/images/countries/JPN.jpg`）
  2. （1 がない場合）PM が用意する外部 API（Unsplash など）を Fetch して取得
  3. （1, 2 がない場合）デフォルト画像（`public/default-globe.jpg`）

### 5.2. d3.js (`WorldMap.tsx`)

- `WorldMap.tsx` はクライアントコンポーネント (`'use client'`) とすること。
- SVG の描画、ズーム、ハイライト処理は `useEffect` 内で実行すること。
- スタイリング（国の色、境界線）は、Tailwind のクラスを `d3` で操作する (`.attr('class', '...')`) ことを優先する。

### 5.3. PM（ユーザー）への確認

- API キー (`UNSPLASH_API_KEY` など) やデータベース接続情報などの秘匿情報が必要な場合は、AI が仮置きせず、PM に `.env.local` への設定を依頼すること。
- この `GEMINI.md` に記載のない仕様変更や、設計の根本に関わる実装が必要になった場合は、AI が独断で実装せず、PM に確認を求めること。

## 6. コーディング規約

### 6-1. Tailwind CSS (最重要)

- **`tailwind.config.ts` は存在しません。**
- Tailwind v4 の規約に従い、`tailwind.config.ts` を**作成・参照するコードは禁止**します。
- カスタムテーマ（色、フォントなど）や `darkMode: 'class'` の設定は、すべて **`src/app/global.css`** 内の `@theme` ルールで定義します。
- スタイルクラスの結合には `clsx` （または `tailwind-merge`）の使用を推奨します。

### 6-2. TypeScript とコンテンツ管理

- **`"strict": true` 必須**: `tsconfig.json` の `strict` モードは常に `true` とします。
- **`any` の禁止**: `any` 型の使用は原則禁止します。型が不明な場合は `unknown` を使用し、型ガードを行ってから使用します。

### 6-3. パフォーマンス最適化

- **`next/image`**: すべての `<img>` タグは、`next/image` コンポーネントに置き換えます。`width`, `height`, `alt` 属性は必須です。
- **`next/font`**: すべての Web フォントは `next/font` を使用して最適化し、`src/app/layout.tsx` で適用します。
- **Dynamic Imports**: 初期表示に不要な重いコンポーネント（例：`SearchModal` や記事本文 `ArticleBody`）は、`next/dynamic` を使用して動的インポート（遅延読み込み）します。

### 6-4. Error と Loading

- **`loading.tsx`**: 主要なルートセグメント（例: `src/app/blog/[slug]/loading.tsx`）には `loading.tsx` ファイルを作成し、`Suspense` を利用したローディング UI（スケルトンなど）を実装します。
- **`error.tsx`**: ルートセグメント単位で `error.tsx` ファイルを作成し、エラーバウンダリを実装します。

### 6-5. コード品質

- **`console.log` の削除**: デバッグ用の `console.log` は、マージ前にすべて削除します。
- **コメントアウトされたコードの削除**: 不要なコメントアウトされたコードはすべて削除します。（Git の履歴で管理します）
- **JSDoc**: `src/lib/` や `src/actions/` 内の関数、複雑なロジックを持つカスタムフックには、JSDoc 形式でパラメータと戻り値のコメントを追加します。

## 7. 開発完了時のルール

- 開発タスクが完了した際には、本ドキュメント (`GEMINI.md`) や `README.md` に変更が必要ないか確認し、必要であれば更新を行うこと。
  - 例えば、新しいライブラリの導入、環境変数の追加、ビルド手順の変更などがあった場合は、`README.md` を更新する。
  - 設計やルールに大きな変更があった場合は、`GEMINI.md` を更新する。
- 開発タスクが完了したら、`DEVELOPMENT_LOG.md` にその開発で何をしたか、どのような知見を得たかを必ず記録すること。
  - 記録する内容は、実装した機能の概要、開発中に発生した問題とその解決策、新しい学びなどを含める。
  - このログは、将来の参照や他の開発者への情報共有のために重要である。
