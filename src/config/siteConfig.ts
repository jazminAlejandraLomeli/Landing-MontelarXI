// src/config/siteConfig.ts
// Reúne el contenido del sitio. Los textos, imágenes, productos, recetas, pasos de la
// historia y puntos de venta viven en src/data/*.json: para agregar uno nuevo solo se
// edita el JSON y las vistas lo recorren solas. Estos tipos validan ese JSON al compilar.
import type { Transition } from "framer-motion";
import site from "../data/site.json";
import footer from "../data/footer.json";
import products from "../data/products.json";
import story from "../data/story.json";
import recipes from "../data/recipes.json";
import locations from "../data/locations.json";
import whatsapp from "../data/whatsapp.json";

export interface NavLink {
  label: string;
  href: string;
}

export interface ProductDetail {
  /** Frase corta bajo el nombre. */
  tagline: string;
  /** Párrafos de "Sobre este tequila". */
  story: string[];
  /** Notas de cata: Aroma, Sabor, Final… (se pueden agregar o quitar). */
  tasting: { label: string; text: string }[];
  /** Ficha técnica: Agave, Región, Reposo, Graduación… */
  specs: { label: string; value: string }[];
  /** Con qué marida. */
  pairing: string[];
  /** Cómo disfrutarlo. */
  serve: string;
}

export interface Product {
  id: string;
  /** Parte de la URL de su página: /productos/{slug}. Debe ser único. */
  slug: string;
  /** Color de fondo del catálogo al llegar a este producto. */
  tint?: string;
  name: string;
  category: string;
  description: string;
  image: string;
  cta: string;
  detail: ProductDetail;
}

export interface StoryStep {
  title: string;
  /** Texto corto de la tarjeta en la landing. */
  summary: string;
  /** Párrafos de la página de detalle. */
  body: string[];
  /** Dato destacado del paso. */
  fact?: string;
  image: string;
}

export interface Story {
  id: string;
  eyebrow: string;
  title: string;
  intro: string;
  hint: string;
  ctaText: string;
  ctaHref: string;
  /** Cuántos pasos se muestran en la landing (el resto, en la página completa). */
  landingCount: number;
  /** "+3 etapas más…" en la tarjeta final de la landing. */
  moreLabel: string;
  page: {
    /** Título de la pestaña del navegador. */
    metaTitle: string;
    eyebrow: string;
    title: string;
    intro: string;
    heroImage: string;
    stageLabel: string;
    ofLabel: string;
    quote: string;
    quoteAuthor: string;
    closingTitle: string;
    closingCta: string;
    closingHref: string;
  };
  steps: StoryStep[];
}

export interface Recipe {
  /** Parte de la URL: /recetas/{slug}. Debe ser único. */
  slug: string;
  name: string;
  tequila: string;
  difficulty: string;
  time: string;
  servings: number;
  /** De 0 a 5; las mejor calificadas salen primero. */
  rating: number;
  reviews: number;
  image: string;
  description: string;
  ingredients: string[];
  steps: string[];
  tip?: string;
}

export interface Recipes {
  id: string;
  eyebrow: string;
  title: string;
  ctaText: string;
  ctaHref: string;
  cardCta: string;
  /** Cuántas recetas (las mejor calificadas) se muestran en la landing. */
  landingCount: number;
  page: {
    /** Título de la pestaña del navegador. */
    metaTitle: string;
    eyebrow: string;
    title: string;
    intro: string;
    allLabel: string;
    emptyMessage: string;
    ingredientsTitle: string;
    stepsTitle: string;
    tipTitle: string;
    timeLabel: string;
    servingsLabel: string;
    difficultyLabel: string;
    moreTitle: string;
    backText: string;
    notFound: string;
  };
  items: Recipe[];
}

export interface Location {
  name: string;
  city: string;
  zip: string;
  address: string;
  hours?: string;
}

export interface Locations {
  id: string;
  eyebrow: string;
  title: string;
  searchPlaceholder: string;
  ctaText: string;
  ctaHref: string;
  countLabel: string;
  citiesLabel: string;
  page: {
    /** Título de la pestaña del navegador. */
    metaTitle: string;
    eyebrow: string;
    title: string;
    intro: string;
    allLabel: string;
    emptyMessage: string;
    mapText: string;
  };
  items: Location[];
}

export interface WhatsApp {
  /** Número con lada de país, solo dígitos: 52 + 10 dígitos (ej. 523312345678). Vacío: WhatsApp pide elegir el contacto. */
  phone: string;
  buttonLabel: string;
  title: string;
  intro: string;
  status: string;
  /** Mensajes predefinidos: el botón muestra "label" y WhatsApp abre con "message" escrito. */
  options: { label: string; message: string }[];
  customLabel: string;
  customPlaceholder: string;
  sendLabel: string;
  closeLabel: string;
}

export interface SiteConfig {
  brandName: string;
  logo: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    accent: string;
    text: string;
    cardBg: string;
  };
  fonts: {
    heading: string;
    body: string;
    googleFontsUrl: string;
  };
  nav: {
    links: NavLink[];
    searchPlaceholder: string;
    countries: string[];
    ctaText: string;
    ctaHref: string;
  };
  hero: {
    tagline: string;
    title: string;
    subtitle: string;
    ctaText: string;
    ctaHref: string;
    mediaUrl: string;
    mediaAlt: string;
  };
  catalog: {
    eyebrow: string;
    scrollHint: string;
    title: string;
  };
  products: Product[];
  ageGate: {
    title: string;
    question: string;
    note: string;
    confirmText: string;
    denyText: string;
    deniedMessage: string;
    storageKey: string;
  };
  story: Story;
  recipes: Recipes;
  locations: Locations;
  whatsapp: WhatsApp;
  footer: {
    tagline: string;
    columns: { title: string; links: NavLink[] }[];
    social: NavLink[];
    responsible: string;
    copyrightSymbol: string;
    copyright: string;
  };
  /** Textos para lectores de pantalla y etiquetas pequeñas. */
  labels: {
    search: string;
    openMenu: string;
    closeMenu: string;
    selectCountry: string;
    filterByCity: string;
    filterByTequila: string;
    stages: string;
    zipPrefix: string;
    starsOf: string;
  };
  productPage: {
    backText: string;
    tastingTitle: string;
    storyTitle: string;
    specsTitle: string;
    pairingTitle: string;
    serveTitle: string;
    recipesTitle: string;
    othersTitle: string;
    buyCta: string;
    buyHref: string;
    notFound: string;
  };
  notFound: {
    title: string;
    text: string;
    ctaText: string;
  };
  motion: {
    transition: Transition;
    /** Cuándo se dispara una animación al entrar en pantalla. */
    viewport: { once?: boolean; amount?: number | "some" | "all" };
    offset: number;
    /** Intensidad de los efectos ligados al scroll (parallax, rotación). */
    parallax: number;
    tilt: number;
  };
}

export const siteConfig: SiteConfig = {
  ...site,
  footer,
  products,
  story,
  recipes,
  locations,
  whatsapp,

  // Transición compartida por las animaciones de scroll (comportamiento, no contenido)
  motion: {
    transition: { type: "spring", duration: 0.8, bounce: 0.2 },
    viewport: { once: true, amount: 0.3 },
    offset: 100,
    parallax: 120,
    tilt: 8,
  },
};
