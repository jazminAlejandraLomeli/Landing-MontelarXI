import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { siteConfig } from "../config/siteConfig";

const ease = [0.22, 1, 0.36, 1] as const;

// Logotipo de WhatsApp (trazo oficial simplificado)
function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.04 21.5h-.01a9.43 9.43 0 0 1-4.8-1.31l-.35-.2-3.57.93.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.24-9.44 9.45-9.44 2.52 0 4.89.98 6.67 2.77a9.37 9.37 0 0 1 2.76 6.68c0 5.2-4.24 9.43-9.44 9.43zm8.03-17.47A11.28 11.28 0 0 0 12.04.7C5.78.7.69 5.79.69 12.04c0 2 .52 3.95 1.52 5.67L.6 23.6l6.02-1.58a11.3 11.3 0 0 0 5.42 1.38h.01c6.25 0 11.34-5.09 11.34-11.34 0-3.03-1.18-5.88-3.32-8.02z" />
    </svg>
  );
}

/** Abre WhatsApp con el mensaje ya escrito. Sin número, WhatsApp deja elegir el contacto. */
function openChat(phone: string, message: string) {
  const digits = phone.replace(/\D/g, "");
  window.open(`https://wa.me/${digits}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
}

// Botón flotante, siempre visible. Al tocarlo muestra los mensajes predefinidos del JSON
// y un campo para escribir uno propio.
export default function WhatsAppButton() {
  const { whatsapp, brandName, logo } = siteConfig;
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Se cierra con Escape o al tocar fuera del panel
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!panelRef.current?.contains(target) && !buttonRef.current?.contains(target)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const send = (message: string) => {
    openChat(whatsapp.phone, message);
    setOpen(false);
    setCustom("");
  };

  const sendCustom = (e: FormEvent) => {
    e.preventDefault();
    if (custom.trim()) send(custom.trim());
  };

  return (
    <div className="fixed right-5 bottom-5 z-[90] flex flex-col items-end gap-4 sm:right-8 sm:bottom-8">
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-label={whatsapp.title}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.35, ease }}
            className="flex max-h-[calc(100dvh-8rem)] w-[min(22rem,calc(100vw-2.5rem))] origin-bottom-right flex-col overflow-hidden bg-(--color-background) shadow-[0_30px_70px_-20px_rgba(0,0,0,0.45)]"
          >
            {/* Encabezado con la marca */}
            <div className="flex shrink-0 items-center gap-3 bg-(--color-primary) px-5 py-4 text-(--color-background)">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-(--color-background)">
                <img src={logo} alt="" className="h-7 w-7" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-heading text-lg leading-tight">{brandName}</p>
                <p className="flex items-center gap-1.5 text-[11px] text-(--color-background)/60">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#25D366]" />
                  {whatsapp.status}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={whatsapp.closeLabel}
                className="flex h-8 w-8 items-center justify-center text-xl text-(--color-background)/60 transition-colors hover:text-(--color-secondary)"
              >
                ×
              </button>
            </div>

            {/* Si la pantalla es baja, el contenido se desplaza dentro del panel */}
            <div className="overflow-y-auto px-5 pt-5 pb-5">
              <p className="font-heading text-2xl text-(--color-primary)">{whatsapp.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-(--color-text)/60">{whatsapp.intro}</p>

              <ul className="mt-5 grid gap-2">
                {whatsapp.options.map((option, i) => (
                  <motion.li
                    key={option.label}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, ease, delay: 0.05 + i * 0.05 }}
                  >
                    <button
                      type="button"
                      onClick={() => send(option.message)}
                      className="group flex w-full items-center justify-between gap-3 border border-(--color-primary)/15 px-4 py-3 text-left text-sm text-(--color-primary) transition-colors duration-300 hover:border-(--color-accent) hover:bg-(--color-accent) hover:text-(--color-background)"
                    >
                      {option.label}
                      <span className="text-(--color-secondary) transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </button>
                  </motion.li>
                ))}
              </ul>

              <form onSubmit={sendCustom} className="mt-5 border-t border-(--color-text)/10 pt-4">
                <label htmlFor="wa-custom" className="text-[10px] tracking-[0.25em] text-(--color-secondary) uppercase">
                  {whatsapp.customLabel}
                </label>
                <div className="mt-2 flex items-end gap-2 border-b border-(--color-primary)/25 focus-within:border-(--color-secondary)">
                  <textarea
                    id="wa-custom"
                    rows={1}
                    value={custom}
                    onChange={(e) => setCustom(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) sendCustom(e);
                    }}
                    placeholder={whatsapp.customPlaceholder}
                    className="max-h-28 min-w-0 flex-1 resize-none bg-transparent py-2 text-sm text-(--color-primary) outline-none placeholder:text-(--color-text)/40"
                  />
                  <button
                    type="submit"
                    disabled={!custom.trim()}
                    className="pb-2 text-xs font-medium tracking-[0.2em] text-(--color-accent) uppercase transition-opacity disabled:opacity-30"
                  >
                    {whatsapp.sendLabel}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={whatsapp.buttonLabel}
        aria-expanded={open}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 1.2 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_14px_30px_-10px_rgba(0,0,0,0.5)] ring-2 ring-(--color-secondary)/70 ring-offset-2 ring-offset-(--color-background)"
      >
        {/* Pulso suave para que se note sin estorbar */}
        {!open && <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/40 [animation-duration:2.5s]" aria-hidden="true" />}
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "close" : "open"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            {open ? <span className="text-3xl leading-none">×</span> : <WhatsAppIcon className="h-7 w-7" />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
