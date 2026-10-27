import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { siteConfig } from "../config/siteConfig";
import RecipeCard from "../components/RecipeCard";
import { byRating, unique } from "../lib/content";
import { usePageTitle } from "../lib/usePageTitle";

const ease = [0.22, 1, 0.36, 1] as const;

export default function RecipesPage() {
  const { recipes } = siteConfig;
  const { page } = recipes;
  usePageTitle(page.metaTitle);
  // Los filtros salen de los propios datos: un tequila nuevo en el JSON aparece aquí solo
  const tequilas = unique(recipes.items.map((r) => r.tequila));
  const [filter, setFilter] = useState<string | null>(null);
  const shown = recipes.items.filter((r) => !filter || r.tequila === filter).sort(byRating);

  return (
    <section className="mx-auto max-w-7xl px-6 pt-36 pb-24 lg:px-10 lg:pb-32">
      <motion.header
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease }}
        className="max-w-2xl"
      >
        <span className="inline-flex items-center gap-3 text-xs font-medium tracking-[0.35em] text-(--color-secondary)">
          <span className="h-px w-10 bg-(--color-secondary)" />
          {page.eyebrow}
        </span>
        <h1 className="font-heading mt-6 text-5xl text-(--color-primary) sm:text-6xl">{page.title}</h1>
        <p className="mt-6 text-lg leading-relaxed text-(--color-text)/70">{page.intro}</p>
      </motion.header>

      <div className="mt-12 flex flex-wrap gap-3" role="group" aria-label={siteConfig.labels.filterByTequila}>
        {[null, ...tequilas].map((tequila) => {
          const active = filter === tequila;
          return (
            <button
              key={tequila ?? "all"}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(tequila)}
              className={`border px-5 py-2 text-xs tracking-[0.2em] uppercase transition-colors duration-300 ${
                active
                  ? "border-(--color-primary) bg-(--color-primary) text-(--color-background)"
                  : "border-(--color-primary)/20 text-(--color-primary) hover:border-(--color-primary)"
              }`}
            >
              {tequila ?? page.allLabel}
            </button>
          );
        })}
      </div>

      <motion.div layout className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((recipe, index) => (
            <motion.div key={recipe.slug} layout exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4, ease }}>
              <RecipeCard recipe={recipe} index={index} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {shown.length === 0 && <p className="mt-10 text-(--color-text)/60">{page.emptyMessage}</p>}
    </section>
  );
}
