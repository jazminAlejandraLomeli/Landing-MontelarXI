import { useEffect } from "react";
import { useLocation } from "react-router";

// Al cambiar de página vuelve arriba; si la URL trae un ancla (/#productos) baja hasta ella.
export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }
    // La sección puede tardar un instante en montarse al venir de otra página
    let tries = 0;
    const id = window.setInterval(() => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target || ++tries > 20) {
        window.clearInterval(id);
        target?.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);
    return () => window.clearInterval(id);
  }, [pathname, hash]);

  return null;
}
