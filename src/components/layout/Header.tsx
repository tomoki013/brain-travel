import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-900">
          Geo Linker
        </Link>
        <nav className="flex items-center space-x-6">
          <Link href="/game" className="text-gray-600 hover:text-gray-900">
            Game
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-gray-900">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
