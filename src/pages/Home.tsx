import { Hero } from '../components/home/Hero';
import { TrustStrip } from '../components/home/TrustStrip';
import { SymptomGrid } from '../components/home/SymptomGrid';
import { ProductSection } from '../components/home/ProductSection';
import { GardenStory } from '../components/home/GardenStory';
import { useBestsellers, useFeaturedProducts } from '../hooks/useProducts';

export function Home() {
  const featured = useFeaturedProducts();
  const bestsellers = useBestsellers();

  return (
    <div>
      <Hero />
      <TrustStrip />
      <SymptomGrid />
      <ProductSection
        eyebrow="Editor's picks"
        title="Featured remedies"
        subtitle="A few of our favorites this season."
        products={featured.data}
        isLoading={featured.isLoading}
        viewAllHref="/shop?is_featured=true"
      />
      <GardenStory />
      <ProductSection
        eyebrow="Loved by customers"
        title="Bestsellers"
        subtitle="What everyone keeps coming back for."
        products={bestsellers.data}
        isLoading={bestsellers.isLoading}
        viewAllHref="/shop?is_bestseller=true"
      />
    </div>
  );
}
