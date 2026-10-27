import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { siteConfig, type StoryStep } from "../config/siteConfig";
import SmartLink from "../components/SmartLink";
import { pad } from "../lib/content";
import { usePageTitle } from "../lib/usePageTitle";

const ease = [0.22, 1, 0.36, 1] as const;

// Un capítulo por etapa: foto con su número y el texto completo. Se alternan de lado.
function Chapter({ step, index, total }: { step: StoryStep; index: number; total: number }) {
  const { stageLabel, ofLabel } = siteConfig.story.page;
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 60, reduce ? 0 : -60]);
  const imageFirst = index % 2 === 0;

  return (
    <article ref={ref} className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:gap-24 lg:px-10 lg:py-24">
      <motion.div
        initial={{ opacity: 0, x: imageFirst ? -60 : 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease }}
        className={`relative ${imageFirst ? "" : "lg:order-2"}`}
      >
        <div className="absolute -inset-4 border border-(--color-secondary)/30" />
        <div className="relative aspect-[4/5] overflow-hidden">
          <motion.img
            src={step.image}
            alt={step.title}
            loading="lazy"
            style={{ y: imageY, scale: 1.15 }}
            className="h-full w-full object-cover"
          />
        </div>
        <span
          className={`font-heading pointer-events-none absolute -top-12 text-[7rem] leading-none text-(--color-secondary)/40 select-none sm:text-[9rem] ${
            imageFirst ? "-right-4 lg:-right-10" : "-left-4 lg:-left-10"
          }`}
        >
          {pad(index + 1)}
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease, delay: 0.15 }}
      >
        <span className="text-xs font-medium tracking-[0.35em] text-(--color-secondary) uppercase">
          {stageLabel} {pad(index + 1)} {ofLabel} {pad(total)}
        </span>
        <h2 className="font-heading mt-4 text-4xl text-(--color-primary) sm:text-5xl">{step.title}</h2>
        <div className="my-6 h-px w-24 bg-(--color-secondary)" />
        <div className="space-y-5 text-lg leading-relaxed text-(--color-text)/75">
          {step.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        {step.fact && (
          <p className="font-heading mt-8 border-l-2 border-(--color-secondary) pl-5 text-xl text-(--color-accent) italic">
            {step.fact}
          </p>
        )}
      </motion.div>
    </article>
  );
}

export default function StoryPage() {
  const { story } = siteConfig;
  const { page } = story;
  usePageTitle(page.metaTitle);
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.15]);
  const heroTextY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 120]);

  return (
    <>
      {/* Portada: foto a todo lo ancho con el título encima */}
      <section ref={heroRef} className="relative mt-20 flex min-h-[80vh] items-end overflow-hidden bg-(--color-accent)">
        <motion.img
          src={page.heroImage}
          alt=""
          style={{ scale: heroScale }}
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-(--color-accent) via-(--color-accent)/50 to-transparent" />
        <motion.div
          style={{ y: heroTextY }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease }}
          className="relative mx-auto w-full max-w-7xl px-6 pb-20 text-(--color-background) lg:px-10"
        >
          <span className="inline-flex items-center gap-3 text-xs font-medium tracking-[0.35em] text-(--color-secondary)">
            <span className="h-px w-10 bg-(--color-secondary)" />
            {page.eyebrow}
          </span>
          <h1 className="font-heading mt-6 max-w-3xl text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">{page.title}</h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-(--color-background)/75">{page.intro}</p>
        </motion.div>
      </section>

      {/* Índice de etapas: salta a cada capítulo */}
      <nav aria-label={siteConfig.labels.stages} className="border-b border-(--color-text)/10">
        <ol className="mx-auto flex max-w-7xl gap-8 overflow-x-auto px-6 py-6 lg:px-10">
          {story.steps.map((step, i) => (
            <li key={step.title} className="shrink-0">
              <a
                href={`#etapa-${i + 1}`}
                className="text-xs tracking-[0.2em] text-(--color-text)/60 uppercase transition-colors hover:text-(--color-secondary)"
              >
                <span className="text-(--color-secondary)">{pad(i + 1)}</span> {step.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* overflow-x-clip: las etapas entran desde los lados sin generar scroll horizontal */}
      <div className="overflow-x-clip py-8">
        {story.steps.map((step, i) => (
          <div key={step.title} id={`etapa-${i + 1}`} className="scroll-mt-20">
            <Chapter step={step} index={i} total={story.steps.length} />
          </div>
        ))}
      </div>

      {/* Cita */}
      <section className="bg-(--color-accent) px-6 py-24 text-center text-(--color-background) lg:py-32">
        <motion.blockquote
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.2, ease }}
          className="mx-auto max-w-3xl"
        >
          <p className="font-heading text-4xl leading-tight italic sm:text-5xl">“{page.quote}”</p>
          <footer className="mt-8 text-xs tracking-[0.35em] text-(--color-secondary) uppercase">
            {page.quoteAuthor}
          </footer>
        </motion.blockquote>
      </section>

      {/* Cierre: de vuelta al catálogo */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center lg:py-32">
        <h2 className="font-heading text-4xl text-(--color-primary) sm:text-5xl">{page.closingTitle}</h2>
        <SmartLink
          href={page.closingHref}
          className="group mt-10 inline-flex items-center gap-4 bg-(--color-accent) px-8 py-4 text-xs font-medium tracking-[0.25em] text-(--color-background) transition-colors duration-300 hover:bg-(--color-primary)"
        >
          {page.closingCta}
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </SmartLink>
      </section>
    </>
  );
}
