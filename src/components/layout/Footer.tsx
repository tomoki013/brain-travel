import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center space-x-6 mb-4">
          <Link href="/terms" className="hover:underline">
            利用規約
          </Link>
          <Link href="/privacy" className="hover:underline">
            プライバシーポリシー
          </Link>
          <Link href="/contact" className="hover:underline">
            お問い合わせ
          </Link>
          <Link href="/sitemap" className="hover:underline">
            サイトマップ
          </Link>
        </div>
        <p className="text-sm">&copy; 2025 脳内世界旅行</p>
      </div>
    </footer>
  );
};

export default Footer;
