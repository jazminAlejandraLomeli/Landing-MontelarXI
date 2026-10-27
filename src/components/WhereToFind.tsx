import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router";
import { siteConfig } from "../config/siteConfig";
import { unique } from "../lib/content";

// Versión compacta para la landing: no compite con el catálogo. Buscar o tocar una ciudad
// lleva a /donde-encontrar con el filtro ya aplicado.
export default function WhereToFind() {
  const { locations, motion: m } = siteConfig;
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const cities = unique(locations.items.map((place) => place.city));

  const search = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `${locations.ctaHref}?q=${encodeURIComponent(q)}` : locations.ctaHref);
  };

  return (
    <section id={locations.id} className="bg-(--color-card) py-20 lg:py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={m.viewport}
        transition={m.transition}
        className="mx-auto grid max-w-7xl items-end gap-10 px-6 lg:grid-cols-[1fr_1.2fr] lg:gap-20 lg:px-10"
      >
        <div>
          <span className="text-xs font-medium tracking-[0.35em] text-(--color-secondary)">
            {locations.eyebrow}
          </span>
          <h2 className="font-heading mt-4 text-4xl text-(--color-primary) sm:text-5xl">
            {locations.title}
          </h2>
          <p className="mt-4 text-(--color-text)/60">
            <span className="font-heading text-2xl text-(--color-primary)">{locations.items.length}</span>{" "}
            {locations.countLabel}{" "}
            <span className="font-heading text-2xl text-(--color-primary)">{cities.length}</span>{" "}
            {locations.citiesLabel}
          </p>
        </div>

        <div>
          <form role="search" onSubmit={search} className="flex items-center gap-4 border-b border-(--color-primary)/30 focus-within:border-(--color-secondary)">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={locations.searchPlaceholder}
              aria-label={locations.searchPlaceholder}
              className="min-w-0 flex-1 bg-transparent py-3 text-lg text-(--color-primary) outline-none placeholder:text-(--color-text)/40"
            />
            <button type="submit" aria-label={siteConfig.labels.search} className="text-2xl text-(--color-secondary) transition-transform hover:translate-x-1">
              →
            </button>
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {cities.map((city) => (
              <Link
                key={city}
                to={`${locations.ctaHref}?ciudad=${encodeURIComponent(city)}`}
                className="border border-(--color-primary)/15 px-4 py-1.5 text-xs tracking-[0.15em] text-(--color-primary) uppercase transition-colors hover:border-(--color-secondary) hover:text-(--color-secondary)"
              >
                {city}
              </Link>
            ))}
            <Link
              to={locations.ctaHref}
              className="group ml-auto inline-flex items-center gap-3 text-xs font-medium tracking-[0.25em] text-(--color-primary)"
            >
              {locations.ctaText}
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
