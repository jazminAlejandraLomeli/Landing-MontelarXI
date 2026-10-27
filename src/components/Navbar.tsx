import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router";
import { siteConfig } from "../config/siteConfig";
import SmartLink from "./SmartLink";

const ease = [0.22, 1, 0.36, 1] as const;

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function CountrySelect({ className = "" }: { className?: string }) {
  const { countries } = siteConfig.nav;
  const { labels } = siteConfig;
  return (
    <select
      aria-label={labels.selectCountry}
      defaultValue={countries[0]}
      className={`cursor-pointer bg-transparent text-xs tracking-wide text-(--color-text) outline-none ${className}`}
    >
      {countries.map((country) => (
        <option key={country}>{country}</option>
      ))}
    </select>
  );
}

export default function Navbar() {
  const { brandName, logo, nav, labels } = siteConfig;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open || searchOpen
          ? "bg-(--color-background)/90 shadow-[0_1px_0_rgba(0,0,0,0.06)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link to="/" className="flex items-center gap-3" aria-label={brandName}>
          <img src={logo} alt="" className="h-9 w-9" />
          <span className="font-heading text-lg tracking-wide text-(--color-primary)">
            {brandName}
          </span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {nav.links.map((link) => (
            <SmartLink
              key={link.href}
              href={link.href}
              className="group relative text-sm tracking-wide text-(--color-text)"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-(--color-secondary) transition-all duration-300 group-hover:w-full" />
            </SmartLink>
          ))}
          <span className="h-5 w-px bg-(--color-text)/15" />
          <button
            type="button"
            aria-label={labels.search}
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((v) => !v)}
            className="text-(--color-text) transition-colors hover:text-(--color-secondary)"
          >
            <SearchIcon />
          </button>
          {/* <CountrySelect /> */}
          {/* <a
            href={nav.ctaHref}
            className="border border-(--color-primary) px-6 py-2 text-xs font-medium tracking-[0.2em] text-(--color-primary) uppercase transition-colors duration-300 hover:bg-(--color-primary) hover:text-(--color-background)"
          >
            {nav.ctaText}
          </a> */}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            aria-label={labels.search}
            onClick={() => {
              setSearchOpen((v) => !v);
              setOpen(false);
            }}
            className="flex h-10 w-10 items-center justify-center text-(--color-primary)"
          >
            <SearchIcon />
          </button>
          <button
            type="button"
            className="relative h-10 w-10"
            aria-label={open ? labels.closeMenu : labels.openMenu}
            aria-expanded={open}
            onClick={() => {
              setOpen((v) => !v);
              setSearchOpen(false);
            }}
          >
            <span
              className={`absolute left-2 h-px w-6 bg-(--color-primary) transition-all duration-300 ${
                open ? "top-1/2 rotate-45" : "top-[14px]"
              }`}
            />
            <span
              className={`absolute left-2 h-px w-6 bg-(--color-primary) transition-all duration-300 ${
                open ? "top-1/2 -rotate-45" : "top-[24px]"
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Barra de búsqueda */}
      <AnimatePresence>
        {searchOpen && (
          <motion.form
            role="search"
            onSubmit={(e) => e.preventDefault()}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease }}
            className="overflow-hidden"
          >
            <div className="mx-auto max-w-7xl px-6 pb-6 lg:px-10">
              <input
                ref={searchRef}
                type="search"
                placeholder={nav.searchPlaceholder}
                className="font-heading w-full border-b border-(--color-primary)/30 bg-transparent py-3 text-2xl text-(--color-primary) outline-none placeholder:text-(--color-text)/40 focus:border-(--color-secondary)"
              />
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Menú mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease }}
            className="overflow-hidden lg:hidden"
          >
            <div className="flex flex-col gap-6 px-6 pt-2 pb-8">
              {nav.links.map((link) => (
                <SmartLink
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="font-heading text-2xl text-(--color-primary)"
                >
                  {link.label}
                </SmartLink>
              ))}
              <CountrySelect className="self-start text-sm" />
              <SmartLink
                href={nav.ctaHref}
                onClick={() => setOpen(false)}
                className="mt-2 bg-(--color-primary) py-3 text-center text-xs tracking-[0.2em] text-(--color-background) uppercase"
              >
                {nav.ctaText}
              </SmartLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
