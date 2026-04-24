import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, Star, RefreshCw } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import ProductCard from "@/components/ProductCard";
import Layout from "@/components/Layout";

const sizes = ["S", "M", "L", "XL", "XXL", "7", "8", "9", "10", "OS"];
const priceRanges = [
  { label: "Under ₹1,000", min: 0, max: 1000 },
  { label: "₹1,000 - ₹2,000", min: 1000, max: 2000 },
  { label: "₹2,000 - ₹5,000", min: 2000, max: 5000 },
  { label: "Over ₹5,000", min: 5000, max: Infinity },
];

const Collection = () => {
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.products.getAll(),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.categories.getAll(),
  });

  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";

  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? [initialCategory] : []);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Use all categories from backend if available, otherwise fallback to products
  const categories = useMemo(() => {
    if (categoriesData && Array.isArray(categoriesData)) {
      return categoriesData.map((c: any) => c.name).sort();
    }
    return Array.from(new Set((productsData || []).map((p: any) => (p.categoryName || p.category) as string))).filter(Boolean).sort();
  }, [categoriesData, productsData]);
  const brands = useMemo(() => Array.from(new Set((productsData || []).map((p: any) => p.brand as string))).sort(), [productsData]);

  const toggleFilter = (list: string[], setList: (val: string[]) => void, item: string) => {
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };

  const filtered = useMemo(() => {
    return (productsData || []).filter((p: any) => {
      const pCat = p.categoryName || p.category;
      if (selectedCategories.length && !selectedCategories.includes(pCat)) return false;
      if (selectedSizes.length && !p.sizes?.some((s: string) => selectedSizes.includes(s))) return false;
      if (selectedBrands.length && !selectedBrands.includes(p.brand)) return false;
      if (selectedRating !== null && (p.rating || 0) < selectedRating) return false;

      if (selectedPriceRange !== null) {
        const range = priceRanges[selectedPriceRange];
        const variantPrices = p.variants?.map((v: any) => v.price).filter((pr: number) => pr > 0) || [];
        const effectivePrice = variantPrices.length > 0 ? Math.min(...variantPrices) : p.price;

        if (effectivePrice < range.min || effectivePrice >= range.max) return false;
      }
      return true;
    });
  }, [productsData, selectedCategories, selectedSizes, selectedBrands, selectedRating, selectedPriceRange]);

  const clearAll = () => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedBrands([]);
    setSelectedRating(null);
    setSelectedPriceRange(null);
  };

  const hasFilters =
    selectedCategories.length > 0 ||
    selectedSizes.length > 0 ||
    selectedBrands.length > 0 ||
    selectedRating !== null ||
    selectedPriceRange !== null;

  const FilterSidebar = () => (
    <div className="space-y-10 pb-10">
      {hasFilters && (
        <button
          onClick={clearAll}
          className="w-full py-4 text-[10px] font-body font-bold tracking-[0.2em] uppercase border border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background transition-all duration-300"
        >
          Clear All Filters
        </button>
      )}
      {/* Category Filter */}
      <div>
        <h3 className="text-[11px] font-body font-bold tracking-[0.2em] uppercase mb-4 text-foreground/90">Category</h3>
        <div className="space-y-2.5">
          {(categories as string[]).map((cat: string) => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleFilter(selectedCategories, setSelectedCategories, cat)}
                className="w-4 h-4 rounded-none border-border text-foreground focus:ring-0 focus:ring-offset-0 transition-all checked:bg-foreground"
              />
              <span className="text-sm font-body text-muted-foreground group-hover:text-foreground transition-colors">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div>
        <h3 className="text-[11px] font-body font-bold tracking-[0.2em] uppercase mb-4 text-foreground/90">Brand</h3>
        <div className="max-h-48 overflow-y-auto space-y-2.5 custom-scrollbar pr-2">
          {(brands as string[]).map((brand: string) => (
            <label key={brand} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleFilter(selectedBrands, setSelectedBrands, brand)}
                className="w-4 h-4 rounded-none border-border text-foreground focus:ring-0 focus:ring-offset-0 transition-all checked:bg-foreground"
              />
              <span className="text-sm font-body text-muted-foreground group-hover:text-foreground transition-colors">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div>
        <h3 className="text-[11px] font-body font-bold tracking-[0.2em] uppercase mb-4 text-foreground/90">Price Range</h3>
        <div className="space-y-2.5">
          {priceRanges.map((range, i) => (
            <label key={range.label} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="price"
                checked={selectedPriceRange === i}
                onClick={() => setSelectedPriceRange(selectedPriceRange === i ? null : i)}
                onChange={() => { }}
                className="w-4 h-4 border-border text-foreground focus:ring-0 focus:ring-offset-0 transition-all checked:bg-foreground appearance-none rounded-full border bg-transparent checked:border-[5px]"
              />
              <span className="text-sm font-body text-muted-foreground group-hover:text-foreground transition-colors">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div>
        <h3 className="text-[11px] font-body font-bold tracking-[0.2em] uppercase mb-4 text-foreground/90">Size</h3>
        <div className="flex gap-2 flex-wrap">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => toggleFilter(selectedSizes, setSelectedSizes, size)}
              className={`min-w-[40px] h-10 px-2 text-[10px] font-body font-bold border transition-all duration-300 ${selectedSizes.includes(size) ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"}`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <h3 className="text-[11px] font-body font-bold tracking-[0.2em] uppercase mb-4 text-foreground/90">Minimum Rating</h3>
        <div className="flex gap-2">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
              className={`flex-1 h-10 flex items-center justify-center gap-1 border transition-all duration-300 ${selectedRating === rating ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:border-foreground"}`}
            >
              <span className="text-[10px] font-bold">{rating}</span>
              <Star size={10} fill={selectedRating === rating ? "currentColor" : "none"} />
            </button>
          ))}
        </div>
      </div>


    </div>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 lg:px-8 py-12 md:py-20 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-6">
          <div>
            <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-3">
              {selectedCategories.length === 1 ? selectedCategories[0] : "Collection"}
            </h1>
            <p className="text-[10px] md:text-sm font-body text-muted-foreground uppercase tracking-widest">
              Showing {filtered.length} items
            </p>
          </div>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="lg:hidden flex items-center justify-center gap-3 text-[10px] font-body font-bold tracking-[0.2em] uppercase border border-border px-6 py-4 hover:bg-muted transition-all active:scale-95 bg-card sticky top-20 z-30 shadow-sm"
          >
            <SlidersHorizontal size={14} />
            Filters & Sorting
          </button>
        </div>

        <div className="flex gap-16">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar />
          </aside>

          {/* Mobile filter overlay */}
          {filtersOpen && (
            <div className="fixed inset-0 z-[100] lg:hidden">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setFiltersOpen(false)} />
              <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-background p-6 md:p-8 overflow-y-auto shadow-2xl transition-all duration-500 ease-out">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-display text-lg font-bold tracking-tight uppercase">Filters</h2>
                  <button onClick={() => setFiltersOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                    <X size={20} />
                  </button>
                </div>
                <FilterSidebar />
              </div>
            </div>
          )}

          {/* Product grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 md:py-32 text-center">
                <div className="w-16 h-16 bg-muted flex items-center justify-center rounded-full mb-6">
                  <X size={24} className="text-muted-foreground" />
                </div>
                <p className="text-lg font-display font-medium mb-2">No products found</p>
                <p className="text-sm font-body text-muted-foreground max-w-xs mb-8">
                  We couldn't find any products matching your current selection.
                </p>
                <button
                  onClick={clearAll}
                  className="px-8 py-3 bg-foreground text-background text-[10px] font-bold tracking-[0.2em] uppercase hover:opacity-90 transition-opacity"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-8 md:gap-x-4 md:gap-y-10 lg:gap-8">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Collection;
