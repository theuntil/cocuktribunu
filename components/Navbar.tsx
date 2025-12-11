"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "../providers/ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { theme, toggleTheme } = useTheme();

  const navigation = [
    { name: "Anasayfa", href: "/" },
    { name: "Proje Hakkında", href: "/cocuk-tribunu" },
    { name: "Hakkımızda", href: "/hakkimizda" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const isDesktop = window.innerWidth >= 768;

      if (isDesktop) {
        setIsScrolled(window.scrollY > 50);
      } else {
        setIsScrolled(false);
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <div className="fixed top-0 left-0 w-full z-9999 pointer-events-none">
        <header
          className={`transition-all duration-300 ${
            isScrolled ? "py-4" : "py-7"
          }`}
        >
          <div
            className={`transition-all duration-300 ${
              isScrolled ? "max-w-5xl mx-auto px-8" : "max-w-7xl mx-auto px-6"
            }`}
          >
            <nav
              className="pointer-events-auto border border-white/10 dark:border-black/10 
                         rounded-full bg-black/30 
                         backdrop-blur-md px-4 md:px-5 py-4
                         flex items-center justify-between gap-4"
            >
              {/* LOGO */}
              <Link href="/" className="flex items-center">
                <Image
                  src="/cocuk.png"
                  alt="Logo"
                  width={130}
                  height={24}
                  className="h-12 ml-5 w-auto object-contain cursor-pointer"
                />
              </Link>

              {/* DESKTOP LINKS */}
              <ul className="hidden md:flex items-center gap-8">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-white/80 hover:text-white transition"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* DESKTOP: CONTACT + THEME BUTTON */}
              <div className="hidden md:flex items-center gap-3">

                <Link
                  href="/iletisim"
                  className="rounded-full bg-white text-black
                             hover:bg-white/90 px-4 py-1.5 text-sm shadow"
                >
                  İletişime Geç
                </Link>

                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full bg-white/10 dark:bg-black/10
                             hover:bg-white/20 dark:hover:bg-black/20 transition"
                >
                  {theme === "light" ? (
                    <Moon className="w-5 h-5 text-white" />
                  ) : (
                    <Sun className="w-5 h-5 text-yellow-300" />
                  )}
                </button>

              </div>

              {/* MOBILE MENU BUTTON (Animated) */}
             <button
  onClick={() => setIsMenuOpen(!isMenuOpen)}
  className="md:hidden p-2 hover:bg-white/10 dark:hover:bg-black/20 rounded-xl transition"
>
  <AnimatePresence mode="wait">
    {!isMenuOpen ? (
      <motion.div
        key="menu"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        <Menu className="h-5 w-5 text-white" />
      </motion.div>
    ) : (
      <motion.div
        key="close"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        <X className="h-5 w-5 text-white" />
      </motion.div>
    )}
  </AnimatePresence>
</button>


            </nav>
          </div>
        </header>
      </div>

      {/* MOBILE MENU (Soft Motion) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed top-[125px] left-0 right-0 z-9998 px-8 md:hidden"
          >
            <div
              className="rounded-2xl bg-black/40 dark:bg-white/10 backdrop-blur-xl shadow-xl
                       max-w-xs w-full ml-auto border border-white/10 dark:border-black/10"
            >
              <div className="p-6">

                {/* MOBILE LINKS */}
                <nav className="flex flex-col gap-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="px-4 py-2.5 rounded-lg text-xs font-medium 
                                 text-white/80 hover:text-white 
                                 hover:bg-white/10"
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>

                <hr className="my-4 border-white/10 dark:border-black/10" />

                {/* MOBILE CONTACT */}
                <Link
                  href="/iletisim"
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-xl bg-white text-black hover:bg-white/90 
                             px-4 py-2.5 text-xs font-semibold w-full block text-center shadow"
                >
                  İletişime Geç
                </Link>

                {/* MOBILE THEME ICON (Smaller) */}
                <div className="flex justify-center mt-5">
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full bg-white/10 dark:bg-black/10
                               hover:bg-white/20 dark:hover:bg-black/20 transition"
                  >
                    {theme === "light" ? (
                      <Moon className="w-5 h-5 text-white" />
                    ) : (
                      <Sun className="w-5 h-5 text-yellow-300" />
                    )}
                  </button>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
