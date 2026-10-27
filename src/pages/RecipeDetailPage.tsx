import { motion } from "framer-motion";
import { Link, useParams } from "react-router";
import { siteConfig } from "../config/siteConfig";
import RecipeCard from "../components/RecipeCard";
import Stars from "../components/Stars";
import { byRating, pad } from "../lib/content";
import { usePageTitle } from "../lib/usePageTitle";

const ease = [0.22, 1, 0.36, 1] as const;

function BackLink() {
  return (
    <Link
      to="/recetas"
      className="group inline-flex items-center gap-3 text-xs font-medium tracking-[0.25em] text-(--color-primary) uppercase"
    >
      <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
      {siteConfig.recipes.page.backText}
    </Link>
  );
}

export default function RecipeDetailPage() {
  const { slug } = useParams();
  const { recipes } = siteConfig;
  const { page } = recipes;
  const recipe = recipes.items.find((r) => r.slug === slug);
  usePageTitle(recipe?.name ?? page.notFound);

  if (!recipe) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-8 px-6 pt-32 text-center">
        <p className="font-heading text-3xl text-(--color-primary)">{page.notFound}</p>
        <BackLink />
      </section>
    );
  }

  const more = recipes.items.filter((r) => r.slug !== recipe.slug).sort(byRating).slice(0, 3);
  const facts = [
    { label: page.timeLabel, value: recipe.time },
    { label: page.servingsLabel, value: String(recipe.servings) },
    { label: page.difficultyLabel, value: recipe.difficulty },
  ];

  return (
    <>
      <article className="mx-auto max-w-7xl px-6 pt-32 pb-24 lg:px-10">
        <BackLink />

        <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* La foto acompaña mientras se lee la receta */}
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease }}
            className="relative self-start lg:sticky lg:top-28"
          >
            <div className="absolute -inset-4 border border-(--color-secondary)/40" />
            <img src={recipe.image} alt={recipe.name} className="relative aspect-[4/5] w-full object-cover" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.15 }}>
            <span className="text-xs font-medium tracking-[0.35em] text-(--color-secondary) uppercase">{recipe.tequila}</span>
            <h1 className="font-heading mt-4 text-5xl leading-[1.05] text-(--color-primary) sm:text-6xl">{recipe.name}</h1>
            <Stars rating={recipe.rating} reviews={recipe.reviews} className="mt-5" />
            <p className="mt-6 text-lg leading-relaxed text-(--color-text)/75">{recipe.description}</p>

            <dl className="mt-10 grid grid-cols-3 border-y border-(--color-text)/10">
              {facts.map((fact) => (
                <div key={fact.label} className="py-5 text-center not-first:border-l not-first:border-(--color-text)/10">
                  <dt className="text-[10px] tracking-[0.3em] text-(--color-text)/50 uppercase">{fact.label}</dt>
                  <dd className="font-heading mt-2 text-xl text-(--color-primary)">{fact.value}</dd>
                </div>
              ))}
            </dl>

            <h2 className="font-heading mt-12 text-3xl text-(--color-primary)">{page.ingredientsTitle}</h2>
            <ul className="mt-6 space-y-3">
              {recipe.ingredients.map((ingredient) => (
                <li key={ingredient} className="flex items-baseline gap-4 text-(--color-text)/80">
                  <span className="h-1.5 w-1.5 shrink-0 translate-y-[-2px] rotate-45 bg-(--color-secondary)" />
                  {ingredient}
                </li>
              ))}
            </ul>

            <h2 className="font-heading mt-12 text-3xl text-(--color-primary)">{page.stepsTitle}</h2>
            <ol className="mt-6 space-y-6">
              {recipe.steps.map((step, i) => (
                <li key={step} className="flex gap-5">
                  <span className="font-heading text-2xl leading-none text-(--color-secondary)">{pad(i + 1)}</span>
                  <p className="leading-relaxed text-(--color-text)/80">{step}</p>
                </li>
              ))}
            </ol>

            {recipe.tip && (
              <aside className="mt-12 bg-(--color-accent) p-8 text-(--color-background)">
                <p className="text-xs tracking-[0.35em] text-(--color-secondary) uppercase">{page.tipTitle}</p>
                <p className="font-heading mt-4 text-xl leading-relaxed italic">{recipe.tip}</p>
              </aside>
            )}
          </motion.div>
        </div>
      </article>

      {more.length > 0 && (
        <section className="bg-(--color-card) py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <h2 className="font-heading mb-14 text-4xl text-(--color-primary)">{page.moreTitle}</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((r, index) => (
                <RecipeCard key={r.slug} recipe={r} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
