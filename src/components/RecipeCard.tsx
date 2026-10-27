import { motion } from "framer-motion";
import { Link } from "react-router";
import { siteConfig, type Recipe } from "../config/siteConfig";
import Stars from "./Stars";

const MotionLink = motion.create(Link);

// Tarjeta de receta compartida por la landing y la página de recetas.
export default function RecipeCard({ recipe, index }: { recipe: Recipe; index: number }) {
  const { recipes, motion: m } = siteConfig;

  return (
    <MotionLink
      to={`/recetas/${recipe.slug}`}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ ...m.transition, delay: (index % 4) * 0.1 }}
      className="group block"
    >
      <div className="relative overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.name}
          loading="lazy"
          className="aspect-[3/4] w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
        />
        {/* Sello con la calificación, sobre la foto */}
        <span className="absolute top-4 left-4 flex items-center gap-1 bg-(--color-primary)/80 px-2.5 py-1 text-[11px] font-medium tracking-wider text-(--color-secondary) backdrop-blur-sm">
          ★ {recipe.rating.toFixed(1)}
        </span>
        <span className="absolute inset-x-0 bottom-0 translate-y-full bg-(--color-primary)/85 py-3 text-center text-[11px] tracking-[0.25em] text-(--color-background) transition-transform duration-500 group-hover:translate-y-0">
          {recipes.cardCta} →
        </span>
      </div>
      <p className="mt-5 text-xs tracking-[0.2em] text-(--color-secondary) uppercase">
        {recipe.tequila} · {recipe.difficulty}
      </p>
      <h3 className="font-heading mt-2 text-2xl text-(--color-primary)">{recipe.name}</h3>
      <Stars rating={recipe.rating} reviews={recipe.reviews} className="mt-3" />
    </MotionLink>
  );
}
