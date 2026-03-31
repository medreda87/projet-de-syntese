import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import  Button  from "../Components/Button";
import { useTheme } from "../contexts/ThemeContext";
import {
    FaBars,
    FaTimes,
    FaMagic,
    FaSun,
    FaMoon,
  } from "react-icons/fa";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shops", label: "Find Shops" },
  { href: "/services", label: "Services" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/become-provider", label: "Become a Provider" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setIsMenuOpen(false)}>
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl gradient-bg flex items-center justify-center shadow-soft group-hover:shadow-hover transition-shadow duration-300">
              <FaMagic className="w-4 h-4 md:w-5 md:h-5 text-primary-foreground" />
            </div>
            <span className="text-lg md:text-xl font-bold gradient-text">FreshFold</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors duration-200 hover:text-primary ${
                  location.pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <FaSun className="w-5 h-5 text-foreground" />
              ) : (
                <FaMoon className="w-5 h-5 text-foreground" />
              )}
            </button>
            <Link to="/login">
              <Button variant="pill" className="text-sm px-4 py-2">
                Sign In
              </Button>
            </Link>
            <Link to="/become-provider">
              <Button variant="primary" className="text-sm px-4 py-2">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <FaSun className="w-5 h-5 text-foreground" />
              ) : (
                <FaMoon className="w-5 h-5 text-foreground" />
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-foreground hover:bg-muted rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-16 md:hidden left-0 right-0 bottom-0 bg-background z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto shadow-xl ${
          isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
        }`}
      >
        <nav className="container mx-auto px-4 py-6 flex flex-col gap-1">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setIsMenuOpen(false)}
              className={`py-4 px-4 rounded-lg text-base font-medium transition-all duration-200 ${
                location.pathname === link.href
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-foreground hover:bg-muted active:bg-muted/80"
              }`}
            >
              {link.label}
            </Link>
          ))}
          
          {/* Mobile CTA Section */}
          <div className="flex flex-col gap-3 pt-6 mt-4 border-t border-border">
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="w-full"
            >
              <Button variant="pill" className="w-full py-3 text-base font-medium">
                Sign In
              </Button>
            </Link>
            <Link
              to="/become-provider"
              onClick={() => setIsMenuOpen(false)}
              className="w-full"
            >
              <Button variant="primary" className="w-full py-3 text-base font-medium">
                Get Started
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
