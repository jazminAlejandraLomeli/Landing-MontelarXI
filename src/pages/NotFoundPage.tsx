import { Link } from "react-router";
import { siteConfig } from "../config/siteConfig";
import { usePageTitle } from "../lib/usePageTitle";

export default function NotFoundPage() {
  const { notFound } = siteConfig;
  usePageTitle(notFound.title);

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 pt-32 pb-24 text-center">
      <span className="font-heading text-8xl text-(--color-secondary)/40">404</span>
      <h1 className="font-heading mt-6 text-4xl text-(--color-primary)">{notFound.title}</h1>
      <p className="mt-4 leading-relaxed text-(--color-text)/70">{notFound.text}</p>
      <Link
        to="/"
        className="mt-10 border border-(--color-primary) px-8 py-3 text-xs font-medium tracking-[0.25em] text-(--color-primary) transition-colors duration-300 hover:bg-(--color-primary) hover:text-(--color-background)"
      >
        {notFound.ctaText}
      </Link>
    </section>
  );
}
