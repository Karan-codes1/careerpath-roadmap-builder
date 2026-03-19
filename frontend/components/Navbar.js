'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

export default function Navbar() {
  //  ALL hooks at the top (no conditions)
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const isLoggedIn = !!session;

  //  Hide navbar on auth pages
  const hideNavbar =
    pathname === '/login' || pathname === '/signup';

  //  Auto-close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  if (hideNavbar) return null;

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-wide bg-[#339999] text-transparent bg-clip-text"
          >
            CareerPath
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link href="/" className="text-gray-700 hover:text-[#008080] font-medium">
              Home
            </Link>

            {isLoggedIn ? (
              <>
                <Link href="/about" className="text-gray-700 hover:text-[#008080] font-medium">
                  About
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-[#008080] text-white hover:bg-[#006666] px-4 py-2 rounded-md text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push('/login')}
                  className="bg-[#008080] text-white hover:bg-[#006666] px-4 py-2 rounded-md text-sm"
                >
                  Login
                </button>
                <button
                  onClick={() => router.push('/signup')}
                  className="bg-[#008080] hover:bg-[#006666] text-white px-4 py-2 rounded-md text-sm"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMenu}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden fixed top-16 left-0 w-full bg-white border-b shadow-md z-50">
          <div className="px-4 py-4 space-y-2">
            <Link href="/" className="block py-2 text-gray-700">
              Home
            </Link>

            {isLoggedIn ? (
              <>
                <Link href="/about" className="block py-2 text-gray-700">
                  About
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left py-2 text-gray-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block py-2 text-gray-700">
                  Login
                </Link>
                <Link href="/signup" className="block py-2 text-gray-700">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
