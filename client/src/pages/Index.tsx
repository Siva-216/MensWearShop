import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Plus, Minus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import Layout from "@/components/Layout";

const collectionLinks = [
  {
    id: "shirts",
    title: "Shirts",
    tagline: "CURATED SERIES",
    description: "Our most personal expression of craftsmanship yet.",
    image: "/images/collections/shirts.png",
    category: "Shirts"
  },
  {
    id: "pants",
    title: "Pants",
    tagline: "TAILORED",
    description: "Perfect fit for every occasion.",
    image: "/images/collections/pants.png",
    category: "Pants"
  },
  {
    id: "tshirts",
    title: "T-Shirts",
    tagline: "ESSENTIALS",
    description: "Premium basics for the modern man.",
    image: "/images/collections/tshirts.png",
    category: "T-Shirts"
  },
  {
    id: "blazers",
    title: "Blazers",
    tagline: "SMART TAILORING",
    description: "Sharp and sophisticated blazers for a polished look.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80",
    category: "Blazers"
  },
  {
    id: "shoes",
    title: "Shoes",
    tagline: "FOOTWEAR",
    description: "Step into excellence.",
    image: "/images/collections/shoes.png",
    category: "Shoes"
  },
  {
    id: "watches",
    title: "Watches",
    tagline: "TIMELESS",
    description: "Precision meeting style.",
    image: "/images/collections/watches.png",
    category: "Watches"
  },
  {
    id: "accessories",
    title: "Accessories",
    tagline: "THE FINISH",
    description: "Complete your look with curated pieces.",
    image: "/images/collections/accessories.png",
    category: "Accessories"
  },
  {
    id: "inners",
    title: "Inners",
    tagline: "COMFORT FIRST",
    description: "Premium underwear for all-day comfort.",
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80",
    category: "Inners"
  },
  {
    id: "perfume",
    title: "Perfume",
    tagline: "THE FRAGRANCE",
    description: "A scent for every personality.",
    image: "/images/collections/perfumes.png",
    category: "Perfume"
  },
];

const CollectionBentoCard = ({ item, isLarge }: { item: typeof collectionLinks[0], isLarge?: boolean }) => (
  <Link to={`/collection?category=${item.category}`} className="block w-full h-full group relative overflow-hidden">
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

const Home = () => {
  const { data: allProducts, isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.products.getAll(),
  });

  const { data: dbCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.categories.getAll(),
  });

  // Merge hardcoded links with dynamic category images
  const dynamicCollections = useMemo(() => {
    return collectionLinks.map(link => {
      const match = dbCategories?.find((cat: any) => 
        cat.name.toLowerCase() === link.category.toLowerCase()
      );
      
      return {
        ...link,
        image: (match && match.images && match.images[0]) ? match.images[0] : link.image
      };
    });
  }, [dbCategories]);

  const newArrivals = (allProducts || []).slice(0, 8);
  const isLoading = productsLoading;

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-foreground">
        <img
          src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1600&q=80"
          alt="Men's fashion hero"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-10 text-center px-4">
          <p className="text-xs font-body font-medium tracking-[0.3em] uppercase text-primary-foreground/70 mb-4 animate-fade-in">New Season Collection</p>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Redefine Your<br />Style
          </h1>
          <Link to="/collection" className="inline-flex items-center gap-3 btn-hero animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Shop New Arrivals
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* The Collections - Full Section from TheCollections.tsx */}
      <section className="container mx-auto px-4 lg:px-8 py-20 md:py-32 overflow-hidden animate-fade-in">
        <header className="mb-16 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">The Collections</h2>
          <p className="text-sm md:text-base font-body text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Explore our curated series of essentials, from tailored blazers to exquisite fragrances.
            Each piece is selected for its timeless design and exceptional quality.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 lg:gap-8 overflow-hidden">
          {/* Row 1: Shirts & Basics */}
          <div className="md:col-span-8 md:row-span-2 group relative aspect-[16/10] md:aspect-auto overflow-hidden bg-muted">
            <CollectionBentoCard item={dynamicCollections[0]} isLarge />
          </div>
          <div className="md:col-span-4 md:row-span-1 group relative aspect-square md:aspect-auto overflow-hidden bg-muted">
            <CollectionBentoCard item={dynamicCollections[1]} />
          </div>
          <div className="md:col-span-4 md:row-span-1 group relative aspect-square md:aspect-auto overflow-hidden bg-muted">
            <CollectionBentoCard item={dynamicCollections[2]} />
          </div>

          {/* Row 2: Formal & Footwear (Mirrored) */}
          <div className="md:col-span-4 md:row-span-1 group relative aspect-square md:aspect-auto overflow-hidden bg-muted">
            <CollectionBentoCard item={dynamicCollections[4]} />
          </div>
          <div className="md:col-span-8 md:row-span-2 group relative aspect-[16/10] md:aspect-auto overflow-hidden bg-muted">
            <CollectionBentoCard item={dynamicCollections[3]} isLarge />
          </div>
          <div className="md:col-span-4 md:row-span-1 group relative aspect-square md:aspect-auto overflow-hidden bg-muted">
            <CollectionBentoCard item={dynamicCollections[5]} />
          </div>

          {/* Row 3: Lifestyle & Fragrance */}
          <div className="md:col-span-8 md:row-span-2 group relative aspect-[16/10] md:aspect-auto overflow-hidden bg-muted">
            <CollectionBentoCard item={dynamicCollections[6]} isLarge />
          </div>
          <div className="md:col-span-4 md:row-span-1 group relative aspect-square md:aspect-auto overflow-hidden bg-muted">
            <CollectionBentoCard item={dynamicCollections[7]} />
          </div>
          <div className="md:col-span-4 md:row-span-1 group relative aspect-square md:aspect-auto overflow-hidden bg-muted">
            <CollectionBentoCard item={dynamicCollections[8]} />
          </div>
        </div>
      </section>

      {/* New Arrivals grid */}
      <section className="container mx-auto px-4 lg:px-8 py-10 pb-20">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">New Arrivals</h2>
          <p className="font-body text-muted-foreground text-sm uppercase tracking-widest">The latest pieces from our studio</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 lg:gap-8">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse bg-muted aspect-square rounded-xl h-64 w-full"></div>
            ))
          ) : (
            newArrivals.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
        <div className="mt-16 text-center">
            <Link to="/collection" className="inline-flex items-center gap-3 btn-hero">
                View All Products
                <ArrowRight size={16} />
            </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 lg:px-8 py-24 md:py-32 border-t border-border bg-muted/20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-4 uppercase">Got Questions?</h2>
            <p className="font-body text-muted-foreground text-sm uppercase tracking-[0.2em]">Frequently Asked Questions</p>
          </div>
          
          <div className="space-y-4">
            <FAQItem 
              question="What is your return policy?" 
              answer="We offer a 30-day return policy for all unworn and unwashed items with original tags attached. Returns are completely free of charge." 
            />
            <FAQItem 
              question="Do you offer international shipping?" 
              answer="Yes, Fashion World ships to over 50 countries worldwide. Shipping costs and delivery times vary by location but usually take 7-14 business days." 
            />
            <FAQItem 
              question="How can I track my order?" 
              answer="Once your order ships, you will receive an email with a tracking number. You can also view live tracking status in your Profile dashboard." 
            />
            <FAQItem 
              question="Are your materials sustainable?" 
              answer="Sustainability is core to our brand. We use organic cotton, recycled polyester, and follow ethical manufacturing processes to minimize our environmental impact." 
            />
            <FAQItem 
              question="What payment methods do you accept?" 
              answer="We accept all major credit cards, PayPal, Apple Pay, Google Pay, and Cash on Delivery in selected regions." 
            />
          </div>
        </div>
      </section>
    </Layout>
  );
};

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`border border-border transition-all duration-300 ${isOpen ? "bg-background shadow-md" : "bg-card hover:bg-background"}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 px-6 flex items-center justify-between text-left group"
      >
        <span className="font-display font-bold text-sm md:text-base tracking-wide uppercase">{question}</span>
        <div className={`w-8 h-8 rounded-full border border-border flex items-center justify-center transition-all duration-300 ${isOpen ? "bg-foreground text-background rotate-180" : "group-hover:border-foreground"}`}>
          <Plus size={16} className={isOpen ? "hidden" : "block"} />
          <Minus size={16} className={isOpen ? "block" : "hidden"} />
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-6 pb-8 text-sm md:text-base font-body text-muted-foreground leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
};


export default Home;
