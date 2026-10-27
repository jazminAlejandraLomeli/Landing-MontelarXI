import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { siteConfig } from "../config/siteConfig";

function readVerified(key: string): boolean {
  try {
    return localStorage.getItem(key) === "true";
  } catch {
    return false;
  }
}

export default function AgeGate() {
  const { ageGate, brandName, logo } = siteConfig;
  const [verified, setVerified] = useState(() => readVerified(ageGate.storageKey));
  const [denied, setDenied] = useState(false);

  // Bloquea el scroll del sitio mientras el modal está abierto
  useEffect(() => {
    document.body.style.overflow = verified ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [verified]);

  const confirm = () => {
    try {
      localStorage.setItem(ageGate.storageKey, "true");
    } catch {
      // Sin almacenamiento disponible: se vuelve a preguntar en la próxima visita
    }
    setVerified(true);
  };

  return (
    <AnimatePresence>
      {!verified && (
        <motion.div
          key="age-gate"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-(--color-primary) px-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="age-gate-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="w-full max-w-md text-center text-(--color-background)"
          >
            <img src={logo} alt="" className="mx-auto h-14 w-14 brightness-0 invert" />
            <p className="mt-4 text-xs tracking-[0.35em] text-(--color-secondary) uppercase">
              {brandName}
            </p>
            <h2 id="age-gate-title" className="font-heading mt-8 text-4xl sm:text-5xl">
              {denied ? ageGate.title : ageGate.question}
            </h2>

            {denied ? (
              <p className="mt-6 leading-relaxed text-(--color-background)/70">
                {ageGate.deniedMessage}
              </p>
            ) : (
              <>
                <p className="mt-6 text-sm leading-relaxed text-(--color-background)/60">
                  {ageGate.note}
                </p>
                <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <button
                    type="button"
                    onClick={confirm}
                    className="bg-(--color-secondary) px-8 py-3 text-xs font-medium tracking-[0.2em] text-(--color-primary) uppercase transition-opacity hover:opacity-90"
                  >
                    {ageGate.confirmText}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDenied(true)}
                    className="border border-(--color-background)/30 px-8 py-3 text-xs font-medium tracking-[0.2em] uppercase transition-colors hover:border-(--color-background)"
                  >
                    {ageGate.denyText}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
