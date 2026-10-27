import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Link, useParams } from "react-router";
import { siteConfig } from "../config/siteConfig";
import RecipeCard from "../components/RecipeCard";
import SmartLink from "../components/SmartLink";
import { byRating, normalize, pad } from "../lib/content";
import { usePageTitle } from "../lib/usePageTitle";

const ease = [0.22, 1, 0.36, 1] as const;

function BackLink() {
  return (
    <Link
      to="/#productos"
      className="group inline-flex items-center gap-3 text-xs font-medium tracking-[0.25em] text-(--color-primary) uppercase"
    >
      <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
      {siteConfig.productPage.backText}
    </Link>
  );
}

// Encabezado de cada bloque de la página, con el mismo estilo de la landing.
function Heading({ children }: { children: string }) {
  return (
    <h2 className="flex items-center gap-4 text-xs font-medium tracking-[0.35em] text-(--color-secondary) uppercase">
      <span className="h-px w-10 bg-(--color-secondary)" />
      {children}
    </h2>
  );
}

export default function ProductPage() {
  const { slug } = useParams();
  const { products, productPage: t, colors, recipes, motion: m } = siteConfig;
  const index = products.findIndex((p) => p.slug === slug);
  const product = products[index];
  usePageTitle(product ? product.name.charAt(0) + product.name.slice(1).toLowerCase() : t.notFound);

  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bottleY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -80]);
  const marqueeX = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-20%"]);

  if (!product) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-8 px-6 pt-32 text-center">
        <p className="font-heading text-3xl text-(--color-primary)">{t.notFound}</p>
        <BackLink />
      </section>
    );
  }

  const { detail } = product;
  // Las recetas se ligan solas: su campo "tequila" coincide con el nombre del producto
  const related = recipes.items.filter((r) => normalize(r.tequila) === normalize(product.name)).sort(byRating).slice(0, 3);
  const others = products.filter((p) => p.slug !== product.slug);

  return (
    <>
      {/* Portada con el color del producto, como en el catálogo */}
      <section ref={heroRef} className="relative overflow-hidden pt-20" style={{ backgroundColor: product.tint ?? colors.background }}>
        <motion.div
          aria-hidden="true"
          style={{ x: marqueeX, WebkitTextStroke: "1px var(--color-primary)" }}
          className="font-heading pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 text-[18vw] leading-none whitespace-nowrap text-transparent opacity-[0.07] select-none"
        >
          {product.name} · {product.name}
        </motion.div>

        <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-16 px-6 py-16 lg:grid-cols-2 lg:gap-24 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }}>
            <BackLink />
            <span className="mt-12 block text-xs font-medium tracking-[0.35em] text-(--color-secondary) uppercase">
              {pad(index + 1)} · {product.category}
            </span>
            <h1 className="font-heading mt-4 text-5xl leading-[1.05] text-(--color-primary) sm:text-6xl lg:text-7xl">{product.name}</h1>
            <p className="font-heading mt-6 text-2xl text-(--color-accent) italic">{detail.tagline}</p>
            <div className="my-8 h-px w-24 bg-(--color-secondary)" />
            <p className="max-w-md text-lg leading-relaxed text-(--color-text)/75">{product.description}</p>
            <SmartLink
              href={t.buyHref}
              className="group mt-10 inline-flex items-center gap-4 bg-(--color-accent) px-8 py-4 text-xs font-medium tracking-[0.25em] text-(--color-background) transition-colors duration-300 hover:bg-(--color-primary)"
            >
              {t.buyCta}
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </SmartLink>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.3, ease }}
            style={{ y: bottleY }}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="absolute top-1/2 left-1/2 h-[90%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--color-secondary)/20 blur-3xl" />
            <div className="absolute -inset-4 border border-(--color-secondary)/40" />
            <img
              src={product.image}
              alt={product.name}
              className="relative aspect-[3/4] w-full object-cover shadow-[0_40px_80px_-30px_rgba(0,0,0,0.35)]"
            />
          </motion.div>
        </div>
      </section>

      {/* Notas de cata */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <Heading>{t.tastingTitle}</Heading>
        <div className="mt-12 grid gap-px bg-(--color-text)/10 md:grid-cols-3">
          {detail.tasting.map((note, i) => (
            <motion.div
              key={note.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={m.viewport}
              transition={{ ...m.transition, delay: i * 0.12 }}
              className="bg-(--color-background) p-10"
            >
              <span className="font-heading text-5xl text-(--color-secondary)/50">{pad(i + 1)}</span>
              <h3 className="font-heading mt-6 text-3xl text-(--color-primary)">{note.label}</h3>
              <p className="mt-4 leading-relaxed text-(--color-text)/70">{note.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Historia del tequila + ficha técnica */}
      <section className="bg-(--color-card) py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[1.2fr_1fr] lg:gap-24 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={m.viewport} transition={m.transition}>
            <Heading>{t.storyTitle}</Heading>
            <div className="mt-8 space-y-6">
              {detail.story.map((paragraph) => (
                <p key={paragraph} className="font-heading text-2xl leading-relaxed text-(--color-primary)">
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={m.viewport} transition={{ ...m.transition, delay: 0.15 }}>
            <Heading>{t.specsTitle}</Heading>
            <dl className="mt-8 border-t border-(--color-text)/10">
              {detail.specs.map((spec) => (
                <div key={spec.label} className="flex items-baseline justify-between gap-6 border-b border-(--color-text)/10 py-4">
                  <dt className="text-xs tracking-[0.2em] text-(--color-text)/50 uppercase">{spec.label}</dt>
                  <dd className="text-right text-(--color-primary)">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </div>
      </section>

      {/* Maridaje y servicio */}
      <section className="mx-auto grid max-w-7xl gap-px px-6 py-24 lg:grid-cols-2 lg:px-10 lg:py-32">
        <div className="pr-0 lg:pr-16">
          <Heading>{t.pairingTitle}</Heading>
          <ul className="mt-8 flex flex-wrap gap-3">
            {detail.pairing.map((item) => (
              <li key={item} className="border border-(--color-primary)/20 px-5 py-2.5 text-sm text-(--color-primary)">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <aside className="mt-12 bg-(--color-accent) p-10 text-(--color-background) lg:mt-0">
          <p className="text-xs tracking-[0.35em] text-(--color-secondary) uppercase">{t.serveTitle}</p>
          <p className="font-heading mt-5 text-2xl leading-relaxed italic">{detail.serve}</p>
        </aside>
      </section>

      {/* Recetas que usan este tequila */}
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10 lg:pb-32">
          <div className="mb-14 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <h2 className="font-heading text-4xl text-(--color-primary) sm:text-5xl">{t.recipesTitle}</h2>
            <SmartLink href={recipes.ctaHref} className="group inline-flex items-center gap-3 text-xs font-medium tracking-[0.25em] text-(--color-primary)">
              {recipes.ctaText}
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </SmartLink>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((recipe, i) => (
              <RecipeCard key={recipe.slug} recipe={recipe} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* El resto de la colección */}
      {others.length > 0 && (
        <section className="bg-(--color-primary) py-24 text-(--color-background) lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <h2 className="font-heading text-4xl sm:text-5xl">{t.othersTitle}</h2>
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((other) => (
                <Link key={other.slug} to={`/productos/${other.slug}`} className="group block">
                  <div className="overflow-hidden">
                    <img
                      src={other.image}
                      alt={other.name}
                      loading="lazy"
                      className="aspect-[3/4] w-full object-cover opacity-90 transition duration-[1.2s] ease-out group-hover:scale-105 group-hover:opacity-100"
                    />
                  </div>
                  <p className="mt-5 text-xs tracking-[0.2em] text-(--color-secondary) uppercase">{other.category}</p>
                  <h3 className="font-heading mt-2 flex items-center justify-between text-2xl">
                    {other.name}
                    <span className="text-(--color-secondary) transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
