import Hero from "../components/Hero";
import ProductCatalog from "../components/ProductCatalog";
import Story from "../components/Story";
import Recipes from "../components/Recipes";
import WhereToFind from "../components/WhereToFind";
import { usePageTitle } from "../lib/usePageTitle";

// La landing: el catálogo es el protagonista; historia, recetas y puntos de venta son un adelanto.
export default function HomePage() {
  usePageTitle();
  return (
    <>
      <Hero />
      <ProductCatalog />
      <Story />
      <Recipes />
      <WhereToFind />
    </>
  );
}
