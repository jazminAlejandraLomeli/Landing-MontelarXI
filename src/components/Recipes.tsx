import { motion } from "framer-motion";
import { siteConfig } from "../config/siteConfig";
import { byRating } from "../lib/content";
import RecipeCard from "./RecipeCard";
import SmartLink from "./SmartLink";

// Adelanto en la landing: solo las mejor calificadas. Todas viven en /recetas.
export default function Recipes() {
  const { recipes, motion: m } = siteConfig;
  const featured = [...recipes.items].sort(byRating).slice(0, recipes.landingCount);

  return (
    <section id={recipes.id} className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={m.viewport}
        transition={m.transition}
        className="mb-16 flex flex-col justify-between gap-6 sm:flex-row sm:items-end"
      >
        <div>
          <span className="text-xs font-medium tracking-[0.35em] text-(--color-secondary)">
            {recipes.eyebrow}
          </span>
          <h2 className="font-heading mt-4 text-4xl text-(--color-primary) sm:text-5xl">
            {recipes.title}
          </h2>
        </div>
        <SmartLink
          href={recipes.ctaHref}
          className="group inline-flex items-center gap-3 self-start text-xs font-medium tracking-[0.25em] text-(--color-primary) sm:self-auto"
        >
          {recipes.ctaText}
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </SmartLink>
      </motion.div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((recipe, index) => (
          <RecipeCard key={recipe.slug} recipe={recipe} index={index} />
        ))}
      </div>
    </section>
  );
}
