import Link from 'next/link';

export default function SitemapPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">サイトマップ</h1>
      <ul className="list-disc list-inside space-y-2">
        <li>
          <Link href="/" className="text-blue-600 hover:underline">
            トップページ
          </Link>
        </li>
        <li>
          <Link href="/terms" className="text-blue-600 hover:underline">
            利用規約
          </Link>
        </li>
        <li>
          <Link href="/privacy" className="text-blue-600 hover:underline">
            プライバシーポリシー
          </Link>
        </li>
        <li>
          <Link href="/contact" className="text-blue-600 hover:underline">
            お問い合わせ
          </Link>
        </li>
      </ul>
    </div>
  );
}
