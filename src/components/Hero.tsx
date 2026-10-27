import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type Variants } from "framer-motion";
import { siteConfig } from "../config/siteConfig";

const ease = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
};

export default function Hero() {
  const { hero } = siteConfig;
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // Al hacer scroll el texto sube y se desvanece; la imagen va más lento (parallax)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 160]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const mediaY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.15]);

  return (
    <section ref={ref} className="relative overflow-hidden pt-20">
      {/* Halo dorado sutil de fondo */}
      <div className="pointer-events-none absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-(--color-secondary)/10 blur-3xl" />

      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:px-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          style={{ y: textY, opacity: textOpacity }}
        >
          <motion.span
            variants={item}
            className="mb-6 inline-flex items-center gap-3 text-xs font-medium tracking-[0.35em] text-(--color-secondary)"
          >
            <span className="h-px w-10 bg-(--color-secondary)" />
            {hero.tagline}
          </motion.span>

          <motion.h1
            variants={item}
            className="font-heading text-5xl leading-[1.05] text-(--color-primary) sm:text-6xl lg:text-7xl"
          >
            {hero.title}
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-8 max-w-md text-lg leading-relaxed text-(--color-text)/75"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div variants={item} className="mt-10">
            <a
              href={hero.ctaHref}
              className="group inline-flex items-center gap-4 bg-(--color-accent) px-8 py-4 text-xs font-medium tracking-[0.25em] text-(--color-background) transition-colors duration-300 hover:bg-(--color-primary)"
            >
              {hero.ctaText}
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </motion.div>
        </motion.div>

        {/* Espacio para GIF / imagen destacada en alta resolución */}
        <motion.div
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease }}
          style={{ y: mediaY }}
          className="relative"
        >
          <div className="absolute -inset-4 border border-(--color-secondary)/40" />
          <div className="relative aspect-[4/5] overflow-hidden bg-(--color-card)">
            <motion.img
              style={{ scale: mediaScale }}
              src={hero.mediaUrl}
              alt={hero.mediaAlt}
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
