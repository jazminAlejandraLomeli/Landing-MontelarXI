import type { Recipe } from "../config/siteConfig";

/** Las mejor calificadas primero; a igual calificación, la que tiene más reseñas. */
export const byRating = (a: Recipe, b: Recipe) => b.rating - a.rating || b.reviews - a.reviews;

/** Para buscar sin importar acentos ni mayúsculas. */
export const normalize = (value: string): string =>
  value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

/** Valores únicos en el orden en que aparecen (para los filtros). */
export const unique = (values: string[]): string[] => [...new Set(values)];

export const pad = (n: number): string => String(n).padStart(2, "0");
