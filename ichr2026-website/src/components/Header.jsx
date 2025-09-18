import React, { useState, useEffect } from 'react';
import { Menu, X, Lock } from 'lucide-react';
import logo from '../assets/ichr2026_logo_placeholder.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Call for Papers', href: '#call-for-papers' },
    { name: 'Submit Paper', href: '#paper-submission' },
    { name: 'Registration', href: '#registration' },
    { name: 'Programme', href: '#programme' },
    { name: 'Tour', href: '#conference-tour' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg transition-all duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img src={logo} alt="ICHR2026 Logo" className="h-12 w-auto" />
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-[var(--brand-navy)]">ICHR2026</h1>
              <p className="text-sm text-gray-600">Harmony & Reconciliation</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-[var(--brand-blue)] transition-colors duration-200 font-medium"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* CTA Button and Admin Link */}
          <div className="hidden md:flex items-center space-x-4">
            <a 
              href="#registration"
              className="bg-[var(--brand-blue)] text-white px-6 py-2 rounded-lg hover:bg-[var(--brand-navy)] transition-colors duration-200 font-medium"
            >
              Register Now
            </a>
            <a 
              href="/admin"
              className="flex items-center text-gray-600 hover:text-[var(--brand-blue)] transition-colors duration-200"
              title="Admin Panel"
            >
              <Lock size={18} className="mr-1" />
              <span className="text-sm">Admin</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4 pt-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-[var(--brand-blue)] transition-colors duration-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="flex flex-col space-y-3 mt-4">
                <a 
                  href="#registration"
                  className="bg-[var(--brand-blue)] text-white px-6 py-2 rounded-lg hover:bg-[var(--brand-navy)] transition-colors duration-200 font-medium self-start"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register Now
                </a>
                <a 
                  href="/admin"
                  className="flex items-center text-gray-600 hover:text-[var(--brand-blue)] transition-colors duration-200 self-start"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Lock size={18} className="mr-1" />
                  <span>Admin Panel</span>
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;