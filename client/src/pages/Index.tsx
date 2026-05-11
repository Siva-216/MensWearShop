import { useState, useMemo, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Plus, Minus, ChevronLeft, ChevronRight } from "lucide-react";
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

const CollectionBentoCard = ({ item, isLarge }: { item: any, isLarge?: boolean }) => (
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

const carouselImages = [
  {
    id: 1,
    url: "/images/hero/slide_1.png",
    title: "Redefine Your\nStyle",
    subtitle: "New Season Collection",
    cta: "Shop New Arrivals"
  },
  {
    id: 2,
    url: "/images/hero/slide_2.png",
    title: "Elevated\nEssentials",
    subtitle: "Premium Quality",
    cta: "Discover Collection"
  },
  {
    id: 3,
    url: "/images/hero/slide_3.png",
    title: "Modern\nTailoring",
    subtitle: "The Perfect Fit",
    cta: "Explore Suits"
  },
  {
    id: 4,
    url: "/images/hero/slide_4.png",
    title: "Urban\nStreetwear",
    subtitle: "Contemporary Fits",
    cta: "Shop The Look"
  },
  {
    id: 5,
    url: "/images/hero/slide_5.png",
    title: "Luxury\nAccessories",
    subtitle: "The Finishing Touch",
    cta: "View Accessories"
  }
];

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
    }, 30000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <section className="relative h-[85vh] w-full overflow-hidden bg-foreground">
      <div 
        className="flex h-full w-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {carouselImages.map((image) => (
          <div key={image.id} className="h-full w-full flex-shrink-0 relative">
            <img
              src={image.url}
              alt={image.title.replace('\n', ' ')}
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative z-10 text-center px-4">
                <p className="text-xs font-body font-medium tracking-[0.3em] uppercase text-primary-foreground/70 mb-4 animate-fade-in">
                  {image.subtitle}
                </p>
                <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 animate-fade-in whitespace-pre-line" style={{ animationDelay: "0.1s" }}>
                  {image.title}
                </h1>
                <Link to="/collection" className="inline-flex items-center gap-3 btn-hero animate-fade-in" style={{ animationDelay: "0.2s" }}>
                  {image.cta}
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex flex-col items-center gap-4">
        {/* Arrows */}
        <div className="flex items-center gap-4">
          <button 
            onClick={prevSlide}
            className="p-3 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm transition-all border border-white/20"
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={nextSlide}
            className="p-3 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm transition-all border border-white/20"
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>
        </div>
        
        {/* Dot Indicators */}
        <div className="flex items-center gap-2">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                currentIndex === index 
                  ? "w-8 h-1.5 bg-white" 
                  : "w-2 h-1.5 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

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

  const newArrivals = useMemo(() => {
    return (allProducts || [])
      .sort((a: any, b: any) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 4);
  }, [allProducts]);
  const isLoading = productsLoading;

  return (
    <Layout>
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* The Collections - Dynamic Bento Grid */}
      <section className="container max-w-7xl mx-auto px-4 lg:px-8 py-20 md:py-32 overflow-hidden animate-fade-in">
        <header className="mb-16 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">The Collections</h2>
          <p className="text-sm md:text-base font-body text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover our curated selections. From signature tailored pieces to premium essentials, 
            explore collections designed for the modern lifestyle.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 lg:gap-8 overflow-hidden">
          {dbCategories && Array.isArray(dbCategories) && dbCategories.length > 0 ? (
            dbCategories.slice(0, 9).map((cat: any, index: number) => {
              if (!cat) return null;
              
              // Determine grid span based on bento pattern
              const spans = [
                "md:col-span-8 md:row-span-2", // 1 (Large)
                "md:col-span-4 md:row-span-1", // 2
                "md:col-span-4 md:row-span-1", // 3
                "md:col-span-4 md:row-span-1", // 4
                "md:col-span-8 md:row-span-2", // 5 (Large - Mirror)
                "md:col-span-4 md:row-span-1", // 6
                "md:col-span-8 md:row-span-2", // 7 (Large)
                "md:col-span-4 md:row-span-1", // 8
                "md:col-span-4 md:row-span-1", // 9
              ];
              
              const isLarge = index === 0 || index === 4 || index === 6;
              const currentSpan = spans[index] || "md:col-span-4 md:row-span-1";
              
              const collectionItem = {
                category: cat.name || "Category",
                title: cat.name || "New Collection",
                tagline: cat.description ? cat.description.substring(0, 20).toUpperCase() : "CURATED",
                description: cat.description || `Exquisite pieces curated for you.`,
                image: (cat.images && cat.images.length > 0) ? cat.images[0] : "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80"
              };

              return (
                <div key={cat.id || `cat-${index}`} className={`${currentSpan} group relative aspect-square md:aspect-auto overflow-hidden bg-muted animate-fade-in`}>
                  <CollectionBentoCard item={collectionItem} isLarge={isLarge} />
                </div>
              );
            })
          ) : (
            // Fallback to static if no categories
            dynamicCollections.map((item, index) => {
              const spans = [
                "md:col-span-8 md:row-span-2", "md:col-span-4 md:row-span-1", "md:col-span-4 md:row-span-1",
                "md:col-span-4 md:row-span-1", "md:col-span-8 md:row-span-2", "md:col-span-4 md:row-span-1",
                "md:col-span-8 md:row-span-2", "md:col-span-4 md:row-span-1", "md:col-span-4 md:row-span-1"
              ];
              return (
                <div key={index} className={`${spans[index]} group relative aspect-square md:aspect-auto overflow-hidden bg-muted`}>
                  <CollectionBentoCard item={item} isLarge={index === 0 || index === 4 || index === 6} />
                </div>
              );
            })
          )}
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
