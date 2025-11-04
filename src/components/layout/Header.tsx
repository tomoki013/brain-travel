import Link from 'next/link';

const Header = () => {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4">
        <Link
          href="/"
          className="text-2xl font-bold text-white drop-shadow-lg transition-opacity hover:opacity-80"
        >
          脳内世界旅行
        </Link>
      </div>
    </header>
  );
};

export default Header;
