import { useState } from 'react';
import { Link } from "react-router-dom";
import { Menu, X } from 'lucide-react';

export default function PublicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navLinks = [
    { name: 'Home', href: '#home', active: true },
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Communities', href: '#communities' },
    { name: 'About', href: '#about' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
        {/* Logo Section */}
        <a href='#home'>
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <svg
                className="w-5 h-5 text-white stroke-current"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              SkillBridge
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={
                link.active
                  ? 'text-indigo-600 font-semibold'
                  : 'text-slate-500 hover:text-slate-900 transition-colors'
              }
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <Link to="/login" className="font-semibold text-blue-600 transition hover:text-blue-700">
            <button className="px-5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer">
              Login
            </button>
          </Link>
          <Link
            to="/signup"
            className="font-semibold text-blue-600 transition hover:text-blue-700"
          >
            <button className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition-all cursor-pointer">

              Sign in
            </button>
          </Link>
        </div>

        {/* Mobile Menu Icon Toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-lg md:hidden z-50 px-6 py-6 transition-all">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-base font-medium py-1 ${link.active
                    ? 'text-indigo-600 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 border-t border-slate-100 flex flex-col space-y-3">
                <Link to="/login" className="font-semibold text-blue-600 transition hover:text-blue-700">
                  <button className="w-full py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all cursor-pointer">
                    Login
                  </button>
                </Link>
                <Link to="/login" className="font-semibold text-blue-600 transition hover:text-blue-700">
                  <button className="w-full py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition-all cursor-pointer">
                    Sign Up
                  </button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}