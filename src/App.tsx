import { useEffect, type CSSProperties } from "react";
import { siteConfig } from "./config/siteConfig";
import { Route, Routes } from "react-router";
import Navbar from "./components/Navbar";
import AgeGate from "./components/AgeGate";
import Footer from "./components/Footer";
import ScrollProgress from "./components/ScrollProgress";
import ScrollManager from "./components/ScrollManager";
import WhatsAppButton from "./components/WhatsAppButton";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import StoryPage from "./pages/StoryPage";
import RecipesPage from "./pages/RecipesPage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import LocationsPage from "./pages/LocationsPage";
import NotFoundPage from "./pages/NotFoundPage";

// Convierte la paleta y tipografías de siteConfig en variables CSS
// que consumen las clases de Tailwind (p. ej. bg-(--color-primary)).
const themeVars: Record<`--${string}`, string> = {
  "--color-primary": siteConfig.colors.primary,
  "--color-secondary": siteConfig.colors.secondary,
  "--color-background": siteConfig.colors.background,
  "--color-accent": siteConfig.colors.accent,
  "--color-text": siteConfig.colors.text,
  "--color-card": siteConfig.colors.cardBg,
  "--font-heading": siteConfig.fonts.heading,
  "--font-body": siteConfig.fonts.body,
};

export default function App() {
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(themeVars).forEach(([key, value]) => root.style.setProperty(key, value));

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = siteConfig.fonts.googleFontsUrl;
    document.head.appendChild(link);
    return () => link.remove();
  }, []);

  return (
    <div style={themeVars as CSSProperties} className="min-h-screen bg-(--color-background) text-(--color-text)">
      <AgeGate />
      <ScrollProgress />
      <Navbar />
      <ScrollManager />
      <main>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="productos/:slug" element={<ProductPage />} />
          <Route path="nuestra-historia" element={<StoryPage />} />
          <Route path="recetas" element={<RecipesPage />} />
          <Route path="recetas/:slug" element={<RecipeDetailPage />} />
          <Route path="donde-encontrar" element={<LocationsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
