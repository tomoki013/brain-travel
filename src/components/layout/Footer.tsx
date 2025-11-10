import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-neutral-950 text-neutral-100">
      <div className="container mx-auto px-6 py-8 text-center">
        <div className="mb-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-neutral-300">
          <Link
            href="/"
            className="transition-colors duration-300 hover:text-white"
          >
            ホーム
          </Link>
          <Link
            href="/terms"
            className="transition-colors duration-300 hover:text-white"
          >
            利用規約
          </Link>
          <Link
            href="/privacy"
            className="transition-colors duration-300 hover:text-white"
          >
            プライバシーポリシー
          </Link>
          <Link
            href="/contact"
            className="transition-colors duration-300 hover:text-white"
          >
            お問い合わせ
          </Link>
          <Link
            href="/sitemap"
            className="transition-colors duration-300 hover:text-white"
          >
            サイトマップ
          </Link>
          <a
            href="https://github.com/tomoki013/geo-linker"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-300 hover:text-white"
          >
            GitHub
          </a>
        </div>
        <p className="text-xs text-neutral-500">
          &copy; 2025
          {new Date().getFullYear() > 2025
            ? `-${new Date().getFullYear()} `
            : " "}
          Geo Linker. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
