'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';

export default function Navbar() {
  //  ALL hooks at the top (no conditions)
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { status, logout } = useAuth();

  const isLoggedIn = status === 'authenticated';

  //  Hide navbar on auth pages
  const hideNavbar =
    pathname === '/login' || pathname === '/signup';

  //  Auto-close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  if (hideNavbar) return null;

  const handleLogout = () => {
    logout();
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const desktopLink = (href) =>
    `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      pathname === href
        ? 'text-[#008080] dark:text-[#5fc9c9]'
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[#008080] dark:hover:text-[#5fc9c9]'
    }`;

  const mobileLink = (href) =>
    `block rounded-md px-3 py-2 text-sm font-medium ${
      pathname === href ? 'bg-gray-100 dark:bg-gray-800 text-[#008080] dark:text-[#5fc9c9]' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 shadow-sm backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-wide bg-[#339999] text-transparent bg-clip-text"
          >
            CareerPath
          </Link>

          <div className="flex items-center gap-1 md:gap-2">
          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/" className={desktopLink('/')}>
              Home
            </Link>

            {isLoggedIn ? (
              <>
                <Link href="/about" className={desktopLink('/about')}>
                  About
                </Link>
                <button
                  onClick={handleLogout}
                  className="ml-2 rounded-md bg-[#008080] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#006666]"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push('/login')}
                  className="ml-2 rounded-md border border-[#008080] px-4 py-2 text-sm font-medium text-[#008080] dark:text-[#5fc9c9] transition-colors hover:bg-[#008080]/10"
                >
                  Login
                </button>
                <button
                  onClick={() => router.push('/signup')}
                  className="rounded-md bg-[#008080] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#006666]"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          <ThemeToggle />

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              className="rounded-md p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden fixed top-16 left-0 w-full bg-white dark:bg-gray-900 border-b shadow-md z-50">
          <div className="px-4 py-3 space-y-1">
            <Link href="/" className={mobileLink('/')}>
              Home
            </Link>

            {isLoggedIn ? (
              <>
                <Link href="/about" className={mobileLink('/about')}>
                  About
                </Link>
                <button
                  onClick={handleLogout}
                  className="mt-2 w-full rounded-md bg-[#008080] px-3 py-2 text-sm font-medium text-white hover:bg-[#006666]"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/login"
                  className="rounded-md border border-[#008080] px-3 py-2 text-center text-sm font-medium text-[#008080] dark:text-[#5fc9c9]"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="rounded-md bg-[#008080] px-3 py-2 text-center text-sm font-medium text-white"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
