import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "react-router";
import { siteConfig } from "../config/siteConfig";
import { normalize, unique } from "../lib/content";
import { usePageTitle } from "../lib/usePageTitle";

const ease = [0.22, 1, 0.36, 1] as const;

const mapUrl = (address: string, city: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address}, ${city}`)}`;

export default function LocationsPage() {
  const { locations, labels } = siteConfig;
  const { page } = locations;
  usePageTitle(page.metaTitle);
  // La búsqueda y la ciudad viven en la URL: se pueden compartir y vienen desde la landing
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const city = params.get("ciudad");
  const cities = unique(locations.items.map((place) => place.city));

  const update = (key: "q" | "ciudad", value: string | null) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true }
    );

  const q = normalize(query);
  const results = locations.items.filter(
    (place) =>
      (!city || place.city === city) &&
      (!q || normalize(place.city).includes(q) || normalize(place.name).includes(q) || place.zip.startsWith(q))
  );

  return (
    <section className="mx-auto max-w-6xl px-6 pt-36 pb-24 lg:px-10 lg:pb-32">
      <motion.header
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease }}
        className="text-center"
      >
        <span className="text-xs font-medium tracking-[0.35em] text-(--color-secondary)">{page.eyebrow}</span>
        <h1 className="font-heading mt-4 text-5xl text-(--color-primary) sm:text-6xl">{page.title}</h1>
        <p className="mt-6 text-lg text-(--color-text)/70">{page.intro}</p>

        <input
          type="search"
          value={query}
          onChange={(e) => update("q", e.target.value)}
          placeholder={locations.searchPlaceholder}
          aria-label={locations.searchPlaceholder}
          className="mx-auto mt-12 block w-full max-w-lg border-b border-(--color-primary)/30 bg-transparent py-3 text-center text-lg text-(--color-primary) outline-none placeholder:text-(--color-text)/40 focus:border-(--color-secondary)"
        />

        <div className="mt-8 flex flex-wrap justify-center gap-3" role="group" aria-label={labels.filterByCity}>
          {[null, ...cities].map((c) => {
            const active = city === c;
            return (
              <button
                key={c ?? "all"}
                type="button"
                aria-pressed={active}
                onClick={() => update("ciudad", c)}
                className={`border px-5 py-2 text-xs tracking-[0.2em] uppercase transition-colors duration-300 ${
                  active
                    ? "border-(--color-primary) bg-(--color-primary) text-(--color-background)"
                    : "border-(--color-primary)/20 text-(--color-primary) hover:border-(--color-primary)"
                }`}
              >
                {c ?? page.allLabel}
              </button>
            );
          })}
        </div>
      </motion.header>

      <div className="mt-16 grid gap-px bg-(--color-text)/10 sm:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {results.map((place) => (
            <motion.div
              key={place.name}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col bg-(--color-background) p-8"
            >
              <p className="text-xs tracking-[0.2em] text-(--color-secondary) uppercase">
                {place.city} · {labels.zipPrefix} {place.zip}
              </p>
              <h2 className="font-heading mt-2 text-2xl text-(--color-primary)">{place.name}</h2>
              <p className="mt-2 text-sm text-(--color-text)/70">{place.address}</p>
              {place.hours && <p className="mt-1 text-sm text-(--color-text)/50">{place.hours}</p>}
              <a
                href={mapUrl(place.address, place.city)}
                target="_blank"
                rel="noreferrer"
                className="group mt-6 inline-flex items-center gap-2 self-start text-xs font-medium tracking-[0.2em] text-(--color-primary) uppercase"
              >
                {page.mapText}
                <span className="transition-transform duration-300 group-hover:translate-x-1">↗</span>
              </a>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {results.length === 0 && <p className="mt-10 text-center text-(--color-text)/60">{page.emptyMessage}</p>}
    </section>
  );
}
