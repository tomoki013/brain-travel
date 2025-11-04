import Link from "next/link";

export default function SitemapPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl px-6 py-24 lg:px-8">
        <article className="prose lg:prose-xl">
          <h1>サイトマップ</h1>
          <ul>
            <li>
              <Link href="/">トップページ</Link>
            </li>
            <li>
              <Link href="/terms">利用規約</Link>
            </li>
            <li>
              <Link href="/privacy">プライバシーポリシー</Link>
            </li>
            <li>
              <Link href="/contact">お問い合わせ</Link>
            </li>
          </ul>
        </article>
      </div>
    </div>
  );
}
