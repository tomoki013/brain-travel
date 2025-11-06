import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-black/30 text-white backdrop-blur-sm">
      <div className="container mx-auto px-6 py-8 text-center">
        <div className="mb-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          <Link href="/" className="transition-opacity hover:opacity-80">
            トップ
          </Link>
          <Link href="/terms" className="transition-opacity hover:opacity-80">
            利用規約
          </Link>
          <Link
            href="/privacy"
            className="transition-opacity hover:opacity-80"
          >
            プライバシーポリシー
          </Link>
          <Link
            href="/contact"
            className="transition-opacity hover:opacity-80"
          >
            お問い合わせ
          </Link>
          <Link
            href="/sitemap"
            className="transition-opacity hover:opacity-80"
          >
            サイトマップ
          </Link>
          <a
            href="https://github.com/riku-shiru/brain-world-trip"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-80"
          >
            GitHub
          </a>
        </div>
        <p className="text-xs text-white/60">&copy; 2025 脳内世界旅行</p>
      </div>
    </footer>
  );
};

export default Footer;
