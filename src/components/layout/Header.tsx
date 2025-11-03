import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white py-4">
      <div className="container mx-auto px-4">
        <Link href="/" className="text-xl font-bold hover:underline">
          脳内世界旅行
        </Link>
      </div>
    </header>
  );
};

export default Header;
