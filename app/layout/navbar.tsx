import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { useTheme } from "~/context/ThemeContext";
import logoDark from "../welcome/logo-dark.svg";
import logoLight from "../welcome/logo-light.svg";
import Logout from "~/routes/logout";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm
        hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900
        dark:text-gray-100 dark:hover:bg-gray-800"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? "🌞" : "🌙"}
    </button>
  );
}

interface Page {
  name: string;
  to: string;
}

const Navbar: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const location = useLocation();

  const pages: Page[] = [
    { name: "About", to: "/about" },
    { name: "Contact", to: "/contact" },
    { name: "Blog", to: "/blog" },
  ];

  /** Close menu when a link is clicked on small screens only */
  const handleMenuItemClick = useCallback((): void => {
    if (window.innerWidth < 480) {
      setIsMenuOpen(false);
    }
  }, []);

  /** Close menu on resize when screen >= 480 */
  useEffect(() => {
    const handleResize = (): void => {
      if (window.innerWidth >= 480) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /** Prevent body scroll when menu is open on mobile */
  useEffect(() => {
    if (isMenuOpen && window.innerWidth < 480) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY) * -1);
      }
    }

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const handleNavClick = useCallback(
    (path: string): void => {
      navigate(path);
      handleMenuItemClick();
    },
    [handleMenuItemClick, navigate]
  );

  return (
    <>
      {/* Header */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between
        bg-bg px-4 py-3 text-text shadow-sm backdrop-blur-sm
        transition-all duration-300 dark:bg-bg/50 dark:border-b dark:border-gray-200"
      >
        {/* Logo */}
        <div className="flex w-[100px] max-w-[80vw] items-center">
          <img
            src={theme === "light" ? logoLight : logoDark}
            alt="Logo"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
            className="w-full cursor-pointer"
          />
        </div>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-6">
          {pages.map((item) => (
            <Link
              key={item.name}
              to={item.to}
              className="hover:text-gold1 transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="sm:flex hidden">
            <Logout />
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="sm:hidden"
        >
          {isMenuOpen ? (
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <X className="size-6" />
            </div>
          ) : (
            <Menu className="size-6" />
          )}
        </button>
      </header>

      {/* Mobile nav */}
      <nav
        className={`
          fixed top-[64px] right-0 z-40
          h-screen w-full
          bg-bg dark:bg-bg
          flex flex-col gap-6
          px-6 py-6
          transition-transform duration-300 ease-in-out
          sm:hidden
          ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {pages.map(({ name, to }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={name}
              to={to}
              onClick={(event) => {
                event.preventDefault();
                handleNavClick(to);
              }}
              className={`text-lg ${isActive ? "text-green-600" : "text-black1"}`}
            >
              {name}
            </Link>
          );
        })}

        {/* Mobile logout + theme toggle */}
        <div className="flex gap-4 mt-6" onClick={() => setIsMenuOpen(false)}>
          <Logout />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
