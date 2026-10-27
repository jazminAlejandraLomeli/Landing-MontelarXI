import { useEffect } from "react";
import { siteConfig } from "../config/siteConfig";

/** "Recetas · MontelarXI"; sin título, solo la marca. */
export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${siteConfig.brandName}` : siteConfig.brandName;
  }, [title]);
}
