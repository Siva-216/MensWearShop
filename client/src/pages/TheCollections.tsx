import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";

const collections = [
  {
    id: "shirts",
    title: "Shirts",
    tagline: "CURATED SERIES",
    description: "Our most personal expression of craftsmanship yet.",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
    size: "large",
    category: "Shirts"
  },
  {
    id: "pants",
    title: "Pants",
    tagline: "TAILORED",
    description: "Perfect fit for every occasion.",
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80",
    size: "small",
    category: "Pants"
  },
  {
    id: "tshirts",
    title: "T-Shirts",
    tagline: "ESSENTIALS",
    description: "Premium basics for the modern man.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    size: "small",
    category: "T-Shirts"
  },
  {
    id: "blazers",
    title: "Blazers",
    tagline: "SMART TAILORING",
    description: "Sharp and sophisticated blazers for a polished look.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80",
    size: "large",
    category: "Blazers"
  },
  {
    id: "shoes",
    title: "Shoes",
    tagline: "FOOTWEAR",
    description: "Step into excellence.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    size: "small",
    category: "Shoes"
  },
  {
    id: "watches",
    title: "Watches",
    tagline: "TIMELESS",
    description: "Precision meeting style.",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80",
    size: "small",
    category: "Watches"
  },
  {
    id: "accessories",
    title: "Accessories",
    tagline: "THE FINISH",
    description: "Complete your look with curated pieces.",
    image: "https://images.unsplash.com/photo-1511499767323-adb16f170fdd?w=800&q=80",
    size: "small",
    category: "Accessories"
  },
  {
    id: "inners",
    title: "Inners",
    tagline: "COMFORT FIRST",
    description: "Premium underwear for all-day comfort.",
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80",
    size: "small",
    category: "Inners"
  },
  {
    id: "perfume",
    title: "Perfume",
    tagline: "THE FRAGRANCE",
    description: "A scent for every personality.",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80",
    size: "large",
    category: "Perfume"
  },
];

const TheCollections = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 lg:px-8 py-16 md:py-24 animate-fade-in">
        <header className="mb-12 md:mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">The Collections</h1>
          <p className="text-sm md:text-base font-body text-muted-foreground max-w-2xl leading-relaxed">
            Explore our curated series of essentials, from tailored blazers to exquisite fragrances.
            Each piece is selected for its timeless design and exceptional quality.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 lg:gap-8 overflow-hidden">
          {/* Row 1: Shirts & Basics */}
          <div className="md:col-span-8 md:row-span-2 group relative aspect-[16/10] md:aspect-auto overflow-hidden bg-muted">
            <CollectionCard item={collections[0]} isLarge />
          </div>
          <div className="md:col-span-4 md:row-span-1 group relative aspect-square md:aspect-auto overflow-hidden bg-muted">
            <CollectionCard item={collections[1]} />
          </div>
          <div className="md:col-span-4 md:row-span-1 group relative aspect-square md:aspect-auto overflow-hidden bg-muted">
            <CollectionCard item={collections[2]} />
          </div>

          {/* Row 2: Formal & Footwear (Mirrored) */}
          <div className="md:col-span-4 md:row-span-1 group relative aspect-square md:aspect-auto overflow-hidden bg-muted">
            <CollectionCard item={collections[4]} />
          </div>
          <div className="md:col-span-8 md:row-span-2 group relative aspect-[16/10] md:aspect-auto overflow-hidden bg-muted">
            <CollectionCard item={collections[3]} isLarge />
          </div>
          <div className="md:col-span-4 md:row-span-1 group relative aspect-square md:aspect-auto overflow-hidden bg-muted">
            <CollectionCard item={collections[5]} />
          </div>

          {/* Row 3: Lifestyle & Fragrance */}
          <div className="md:col-span-8 md:row-span-2 group relative aspect-[16/10] md:aspect-auto overflow-hidden bg-muted">
            <CollectionCard item={collections[6]} isLarge />
          </div>
          <div className="md:col-span-4 md:row-span-1 group relative aspect-square md:aspect-auto overflow-hidden bg-muted">
            <CollectionCard item={collections[7]} />
          </div>
          <div className="md:col-span-4 md:row-span-1 group relative aspect-square md:aspect-auto overflow-hidden bg-muted">
            <CollectionCard item={collections[8]} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

const CollectionCard = ({ item, isLarge }: { item: typeof collections[0], isLarge?: boolean }) => (
  <Link to={`/collection?category=${item.category}`} className="block w-full h-full">
    <img
      src={item.image}
      alt={item.title}
      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />

    <div className={`absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 ${isLarge ? 'md:max-w-md' : ''}`}>
      <p className="text-[10px] md:text-xs font-body font-bold tracking-[0.25em] uppercase text-white/80 mb-2">{item.tagline}</p>
      <h2 className={`font-display font-bold text-white mb-2 ${isLarge ? 'text-2xl md:text-4xl' : 'text-xl md:text-2xl'}`}>
        {item.title}
      </h2>
      {isLarge && (
        <p className="hidden md:block text-sm text-white/70 font-body mb-6 leading-relaxed">
          {item.description}
        </p>
      )}
      <span className="inline-flex items-center gap-2 text-[10px] md:text-xs font-body font-bold tracking-widest uppercase text-white hover:underline transition-all">
        {isLarge ? 'Discover Collection' : 'Explore'}
        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </span>
    </div>
  </Link>
);

export default TheCollections;
