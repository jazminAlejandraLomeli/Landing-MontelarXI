import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Link } from "react-router";
import { siteConfig, type Product } from "../config/siteConfig";

function ProductRow({ product, index }: { product: Product; index: number }) {
  const { transition, viewport, offset, parallax, tilt } = siteConfig.motion;
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // Producto 1 y 3: texto a la izquierda; producto 2: imagen a la izquierda
  const imageFirst = index % 2 === 1;
  const dir = imageFirst ? -1 : 1;
  const number = String(index + 1).padStart(2, "0");
  const amp = reduce ? 0 : parallax;
  const angle = reduce ? 0 : tilt;

  // Progreso de esta fila: 0 cuando asoma por abajo, 1 cuando sale por arriba
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  // Botella: parallax vertical, giro que se "endereza" al centro y zoom suave
  const bottleY = useTransform(p, [0, 1], [amp, -amp]);
  const bottleRotate = useTransform(p, [0, 0.5, 1], [dir * angle, 0, -dir * angle]);
  const bottleScale = useTransform(p, [0, 0.5, 1], [0.85, 1, 0.92]);
  // Revelado tipo cortina de abajo hacia arriba
  const reveal = useTransform(
    p,
    [0.08, 0.38],
    ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"]
  );
  // Halo detrás de la botella
  const haloScale = useTransform(p, [0.1, 0.5, 0.9], [0.6, 1.1, 0.8]);

  // Texto gigante que cruza la pantalla en sentido contrario a la botella
  const marqueeX = useTransform(p, [0, 1], imageFirst ? ["-30%", "10%"] : ["10%", "-30%"]);
  // El texto sube más lento que la botella (profundidad)
  const textY = useTransform(p, [0, 1], [amp * 0.4, -amp * 0.4]);
  const numberY = useTransform(p, [0, 1], [amp * 1.2, -amp * 1.2]);
  const lineScale = useTransform(p, [0.2, 0.5], [0, 1]);

  const text = (
    <motion.div
      initial={{ opacity: 0, x: imageFirst ? offset : -offset }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={viewport}
      transition={transition}
      className={`relative ${imageFirst ? "lg:text-right" : ""}`}
    >
      <motion.div style={{ y: textY }}>
        <span className="text-xs font-medium tracking-[0.35em] text-(--color-secondary) uppercase">
          {number} · {product.category}
        </span>
        <h3 className="font-heading mt-4 text-4xl text-(--color-primary) sm:text-5xl lg:text-6xl">
          {product.name}
        </h3>
        <motion.div
          style={{ scaleX: lineScale }}
          className={`my-6 h-px w-24 bg-(--color-secondary) ${
            imageFirst ? "origin-right lg:ml-auto" : "origin-left"
          }`}
        />
        <p
          className={`max-w-md text-base leading-relaxed text-(--color-text)/75 ${
            imageFirst ? "lg:ml-auto" : ""
          }`}
        >
          {product.description}
        </p>
        <Link
          to={`/productos/${product.slug}`}
          className="group mt-8 inline-flex items-center gap-3 border border-(--color-primary) px-8 py-3 text-xs font-medium tracking-[0.25em] text-(--color-primary) transition-colors duration-300 hover:bg-(--color-primary) hover:text-(--color-background)"
        >
          {product.cta}
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </Link>
      </motion.div>
    </motion.div>
  );

  const image = (
    <motion.div
      initial={{ opacity: 0, x: imageFirst ? -offset : offset }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={viewport}
      transition={transition}
      className="relative flex justify-center"
    >
      <motion.span
        style={{ y: numberY }}
        className={`font-heading pointer-events-none absolute -top-16 z-10 text-[8rem] leading-none text-(--color-secondary)/30 select-none sm:text-[11rem] ${
          imageFirst ? "-right-2 lg:-right-8" : "-left-2 lg:-left-8"
        }`}
      >
        {number}
      </motion.span>

      <motion.div
        style={{ scale: haloScale }}
        className="absolute top-1/2 left-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--color-secondary)/15 blur-3xl"
      />

      <motion.div
        style={{ y: bottleY, rotate: bottleRotate, scale: bottleScale, clipPath: reveal }}
        className="relative w-full max-w-sm"
      >
        <motion.img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="aspect-[3/4] w-full object-cover shadow-[0_40px_80px_-30px_rgba(0,0,0,0.35)]"
          whileHover={{ scale: 1.04 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        />
      </motion.div>
    </motion.div>
  );

  return (
    <article ref={ref} id={product.id} className="relative py-16 lg:py-24">
      {/* Nombre gigante en contorno que se desliza con el scroll */}
      <motion.div
        aria-hidden="true"
        style={{ x: marqueeX, WebkitTextStroke: "1px var(--color-primary)" }}
        className="font-heading pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 text-[18vw] leading-none whitespace-nowrap text-transparent opacity-[0.07] select-none"
      >
        {product.name} · {product.name}
      </motion.div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:gap-24 lg:px-10">
        {/* En mobile la imagen siempre va primero */}
        <div className={imageFirst ? "order-1" : "order-2 lg:order-1"}>
          {imageFirst ? image : text}
        </div>
        <div className={imageFirst ? "order-2" : "order-1 lg:order-2"}>
          {imageFirst ? text : image}
        </div>
      </div>
    </article>
  );
}

function ScrollIndicator({ progress, products }: { progress: MotionValue<number>; products: Product[] }) {
  const [active, setActive] = useState(0);
  const scaleY = useSpring(progress, { stiffness: 120, damping: 30 });

  useMotionValueEvent(progress, "change", (v) => {
    setActive(Math.min(products.length - 1, Math.max(0, Math.floor(v * products.length))));
  });

  return (
    <div className="pointer-events-none absolute inset-y-0 left-6 hidden xl:block 2xl:left-12">
      <div className="sticky top-[35vh] flex flex-col items-center gap-4">
        <span className="font-heading text-2xl text-(--color-primary)">
          {String(active + 1).padStart(2, "0")}
        </span>
        <div className="relative h-40 w-px bg-(--color-primary)/15">
          <motion.div
            style={{ scaleY }}
            className="absolute inset-0 origin-top bg-(--color-secondary)"
          />
        </div>
        <span className="text-xs text-(--color-text)/50">
          {String(products.length).padStart(2, "0")}
        </span>
        <span className="mt-4 text-[10px] tracking-[0.3em] text-(--color-text)/50 uppercase [writing-mode:vertical-rl]">
          {products[active].name}
        </span>
      </div>
    </div>
  );
}

export default function ProductCatalog() {
  const { catalog, products, colors, motion: m } = siteConfig;
  const sectionRef = useRef<HTMLElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);

  // Fondo que cambia de tono según el producto en pantalla
  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const stops = [0, ...products.map((_, i) => 0.2 + (0.6 * i) / Math.max(1, products.length - 1)), 1];
  const tints = [colors.background, ...products.map((pr) => pr.tint ?? colors.background), colors.background];
  const backgroundColor = useTransform(sectionProgress, stops, tints);

  // Progreso dentro de las filas de producto, para el indicador lateral
  const { scrollYProgress: rowsProgress } = useScroll({
    target: rowsRef,
    offset: ["start center", "end center"],
  });

  return (
    // overflow-x-clip: los elementos entran desde fuera de la pantalla sin generar scroll horizontal
    <motion.section
      ref={sectionRef}
      id="productos"
      style={{ backgroundColor }}
      className="relative overflow-x-clip py-24 lg:py-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={m.viewport}
        transition={m.transition}
        className="mb-12 px-6 text-center"
      >
        <span className="text-xs font-medium tracking-[0.35em] text-(--color-secondary)">
          {catalog.eyebrow}
        </span>
        <h2 className="font-heading mt-4 text-4xl text-(--color-primary) sm:text-5xl">
          {catalog.title}
        </h2>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="mt-10 flex flex-col items-center gap-2 text-[10px] tracking-[0.3em] text-(--color-text)/50 uppercase"
        >
          {catalog.scrollHint}
          <span className="h-8 w-px bg-(--color-text)/30" />
        </motion.div>
      </motion.div>

      <div ref={rowsRef} className="relative">
        <ScrollIndicator progress={rowsProgress} products={products} />
        <div className="flex flex-col gap-12 lg:gap-24">
          {products.map((product, index) => (
            <ProductRow key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
