import type { CSSProperties } from "react";
import { siteConfig } from "../config/siteConfig";
import SmartLink from "./SmartLink";

export default function Footer() {
  const { brandName, logo, footer } = siteConfig;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-(--color-primary) text-(--color-background)">
      {/* Una columna por cada grupo de enlaces del JSON, junto al bloque de la marca */}
      <div
        style={{ "--footer-cols": footer.columns.length } as CSSProperties}
        className="mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:grid-cols-2 lg:grid-cols-[2fr_repeat(var(--footer-cols),1fr)] lg:px-10"
      >
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <img src={logo} alt="" className="h-9 w-9 brightness-0 invert" />
            <span className="font-heading text-xl">{brandName}</span>
          </div>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-(--color-background)/60">
            {footer.tagline}
          </p>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            {footer.social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="text-xs tracking-[0.2em] text-(--color-background)/70 uppercase transition-colors hover:text-(--color-secondary)"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {footer.columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-xs tracking-[0.3em] text-(--color-secondary) uppercase">
              {col.title}
            </h4>
            <ul className="mt-6 space-y-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <SmartLink
                    href={link.href}
                    className="text-sm text-(--color-background)/70 transition-colors hover:text-(--color-background)"
                  >
                    {link.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-(--color-background)/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 pt-6 pb-24 text-xs text-(--color-background)/50 sm:flex-row sm:justify-between lg:px-10">
          <p className="tracking-wide uppercase">{footer.responsible}</p>
          <p>
            {footer.copyrightSymbol} {year} {brandName}. {footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
