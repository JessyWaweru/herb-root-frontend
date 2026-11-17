import { Hero } from '../components/home/Hero';
import { HerbMarquee } from '../components/home/HerbMarquee';
import { TrustStrip } from '../components/home/TrustStrip';
import { SymptomGrid } from '../components/home/SymptomGrid';
import { ProductSection } from '../components/home/ProductSection';
import { GardenStory } from '../components/home/GardenStory';
import { MindBodyTransition } from '../components/home/MindBodyTransition';
import { ExpertCta } from '../components/home/ExpertCta';
import { useBestsellers, useFeaturedProducts } from '../hooks/useProducts';

export function Home() {
  const featured = useFeaturedProducts();
  const bestsellers = useBestsellers();

  return (
    <div>
      <Hero />
      <HerbMarquee />
      <TrustStrip />
      <SymptomGrid />
      <MindBodyTransition />
      <ProductSection
        eyebrow="Editor's picks"
        title={
          <>
            Featured <em>remedies</em>
          </>
        }
        subtitle="A few of our favorites this season."
        products={featured.data}
        isLoading={featured.isLoading}
        viewAllHref="/shop?is_featured=true"
      />
      <GardenStory />
      <ProductSection
        eyebrow="Loved by customers"
        title={
          <>
            The <em>bestsellers</em>
          </>
        }
        subtitle="What everyone keeps coming back for."
        products={bestsellers.data}
        isLoading={bestsellers.isLoading}
        viewAllHref="/shop?is_bestseller=true"
      />
      <ExpertCta />
    </div>
  );
}
