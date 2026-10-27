import { useLayoutEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { siteConfig, type Story as StoryContent, type StoryStep } from "../config/siteConfig";
import { pad } from "../lib/content";
import SmartLink from "./SmartLink";

const ease = [0.22, 1, 0.36, 1] as const;

interface StoryCardProps {
  step: StoryStep;
  index: number;
  open: boolean;
  onToggle: () => void;
}

function StoryCard({ step, index, open, onToggle }: StoryCardProps) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease, delay: Math.min(index, 3) * 0.08 }}
      className="group w-[78vw] shrink-0 text-left sm:w-[340px] lg:w-[380px]"
    >
      {/* Al abrir, la imagen se compacta y deja espacio al texto que sube desde abajo */}
      <motion.div
        animate={{ height: open ? "min(26vh, 240px)" : "min(46vh, 440px)" }}
        transition={{ duration: 0.7, ease }}
        className="relative overflow-hidden"
      >
        <motion.img
          src={step.image}
          alt={step.title}
          loading="lazy"
          draggable="false"
          animate={{ scale: open ? 1.12 : 1 }}
          transition={{ duration: 1, ease }}
          className="h-full w-full object-cover transition-[filter] duration-700 group-hover:brightness-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <span className="font-heading absolute top-4 left-5 text-5xl text-(--color-secondary)/80">
          {number}
        </span>
        <span
          className={`absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full border border-(--color-background)/50 text-lg text-(--color-background) transition-transform duration-500 ${
            open ? "rotate-45 bg-(--color-secondary) text-(--color-primary)" : ""
          }`}
          aria-hidden="true"
        >
          +
        </span>
        <h3 className="font-heading absolute bottom-5 left-5 text-3xl text-(--color-background)">
          {step.title}
        </h3>
      </motion.div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="summary"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.7, ease }}
            className="overflow-hidden"
          >
            <motion.div
              initial={{ y: 24 }}
              animate={{ y: 0 }}
              exit={{ y: 24 }}
              transition={{ duration: 0.7, ease }}
              className="border-b border-(--color-secondary)/40 pt-6 pb-6"
            >
              <div className="mb-4 h-px w-12 bg-(--color-secondary)" />
              <p className="leading-relaxed text-(--color-background)/80">{step.summary}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// Última tarjeta: invita a la historia completa y dice cuántas etapas faltan por ver.
function ClosingCard({ story, remaining }: { story: StoryContent; remaining: number }) {
  return (
    <SmartLink
      href={story.ctaHref}
      className="group flex h-[min(46vh,440px)] w-[78vw] shrink-0 flex-col justify-between border border-(--color-secondary)/40 p-8 transition-colors duration-500 hover:bg-(--color-secondary) sm:w-[340px] lg:w-[380px]"
    >
      <span className="text-xs tracking-[0.35em] text-(--color-secondary) transition-colors group-hover:text-(--color-primary)">
        {story.eyebrow}
      </span>
      <div>
        {remaining > 0 && (
          <p className="mb-4 text-sm text-(--color-background)/60 transition-colors group-hover:text-(--color-primary)/70">
            +{remaining} {story.moreLabel}
          </p>
        )}
        <p className="font-heading text-3xl text-(--color-background) transition-colors group-hover:text-(--color-primary)">
          {story.ctaText}
        </p>
        <span className="mt-6 inline-block text-3xl text-(--color-secondary) transition-all duration-500 group-hover:translate-x-2 group-hover:text-(--color-primary)">
          →
        </span>
      </div>
    </SmartLink>
  );
}

export default function Story() {
  const { story } = siteConfig;
  // En la landing solo un adelanto; la historia completa vive en /nuestra-historia
  const steps = story.steps.slice(0, story.landingCount);
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [distance, setDistance] = useState(0);

  // Cuánto debe desplazarse el carrusel: ancho del riel menos el ancho visible
  const distanceMV = useMotionValue(0);
  useLayoutEffect(() => {
    if (!trackRef.current) return;
    const measure = () => {
      if (!trackRef.current) return;
      const d = Math.max(0, trackRef.current.scrollWidth - window.innerWidth);
      setDistance(d);
      distanceMV.set(d);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [distanceMV, reduce]);

  // El scroll vertical de la sección se traduce en desplazamiento horizontal
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  const x = useTransform([progress, distanceMV], ([p, d]: number[]) => -p * d);
  const counter = useTransform(progress, (p) => pad(Math.min(steps.length, Math.floor(p * steps.length) + 1)));

  const toggle = (i: number) => setOpenIndex((current) => (current === i ? null : i));

  const header = (
    <div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-6 px-6 lg:flex-row lg:items-end lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease }}
        className="max-w-xl"
      >
        <span className="text-xs font-medium tracking-[0.35em] text-(--color-secondary)">
          {story.eyebrow}
        </span>
        <h2 className="font-heading mt-3 text-3xl sm:mt-4 sm:text-5xl">{story.title}</h2>
        <p className="mt-4 hidden leading-relaxed sm:block text-(--color-background)/70">{story.intro}</p>
      </motion.div>

      <div className="flex items-center gap-6">
        <span className="hidden text-[10px] tracking-[0.3em] text-(--color-background)/50 uppercase sm:inline">
          {story.hint}
        </span>
        <SmartLink
          href={story.ctaHref}
          className="hidden shrink-0 border border-(--color-secondary) px-6 py-3 text-xs font-medium tracking-[0.25em] text-(--color-secondary) transition-colors duration-300 hover:bg-(--color-secondary) hover:text-(--color-primary) sm:inline-block"
        >
          {story.ctaText}
        </SmartLink>
      </div>
    </div>
  );

  const cards = (
    <>
      {steps.map((step, i) => (
        <StoryCard
          key={step.title}
          step={step}
          index={i}
          open={openIndex === i}
          onToggle={() => toggle(i)}
        />
      ))}
      <ClosingCard story={story} remaining={story.steps.length - steps.length} />
    </>
  );

  // Con "reducir movimiento" activo: carrusel nativo con scroll horizontal
  if (reduce) {
    return (
      <section id={story.id} className="bg-(--color-accent) py-24 text-(--color-background)">
        {header}
        <div className="mt-12 flex snap-x snap-mandatory items-start gap-6 overflow-x-auto px-6 pb-6 lg:px-10 [&>*]:snap-start">
          {cards}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id={story.id}
      style={{ height: `calc(100vh + ${distance}px)` }}
      className="relative bg-(--color-accent) text-(--color-background)"
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center gap-6 overflow-hidden pt-20 sm:gap-10">
        {header}

        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex w-max items-start gap-6 px-6 lg:gap-8 lg:px-10"
        >
          {cards}
        </motion.div>

        {/* Barra de avance del carrusel */}
        <div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-6 lg:px-10">
          <motion.span className="font-heading w-8 text-lg text-(--color-secondary)">
            {counter}
          </motion.span>
          <div className="relative h-px flex-1 bg-(--color-background)/15">
            <motion.div
              style={{ scaleX: progress }}
              className="absolute inset-0 origin-left bg-(--color-secondary)"
            />
          </div>
          <span className="w-8 text-right text-xs text-(--color-background)/50">
            {pad(steps.length)}
          </span>
        </div>
      </div>
    </section>
  );
}
