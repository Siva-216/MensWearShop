import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, Star } from "lucide-react";
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
  const { data: productsData } = useQuery({
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
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>("random");
  const [columns, setColumns] = useState(4);
  const [activeTab, setActiveTab] = useState<string>("Category");

  const categories = useMemo(() => {
    if (categoriesData && Array.isArray(categoriesData)) {
      return categoriesData.map((c: any) => c.name).sort();
    }
    return Array.from(new Set((productsData || []).map((p: any) => (p.categoryName || p.category) as string))).filter(Boolean).sort();
  }, [categoriesData, productsData]);

  const brands = useMemo(() => Array.from(new Set((productsData || []).map((p: any) => p.brand as string))).sort(), [productsData]);
  const colors = useMemo(() => {
    const allColors = (productsData || []).flatMap((p: any) => p.colors || []);
    return Array.from(new Set(allColors)).filter(Boolean).sort();
  }, [productsData]);

  const toggleFilter = (list: string[], setList: (val: string[]) => void, item: string) => {
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };

  const clearAll = () => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedBrands([]);
    setSelectedColors([]);
    setSelectedRating(null);
    setSelectedPriceRange(null);
    setSortBy("random");
  };

  const filteredAndSorted = useMemo(() => {
    if (!productsData) return [];

    let result = productsData.filter((p: any) => {
      const pCat = p.categoryName || p.category;
      if (selectedCategories.length && !selectedCategories.includes(pCat)) return false;
      if (selectedSizes.length && !p.sizes?.some((s: string) => selectedSizes.includes(s))) return false;
      if (selectedBrands.length && !selectedBrands.includes(p.brand)) return false;
      if (selectedColors.length && !p.colors?.some((c: string) => selectedColors.includes(c))) return false;
      if (selectedRating !== null && (p.rating || 0) < selectedRating) return false;

      if (selectedPriceRange !== null) {
        const range = priceRanges[selectedPriceRange];
        const variantPrices = p.variants?.map((v: any) => v.price).filter((pr: number) => pr > 0) || [];
        const effectivePrice = p.discountPrice && p.discountPrice > 0 ? p.discountPrice : (variantPrices.length > 0 ? Math.min(...variantPrices) : p.price);
        if (effectivePrice < range.min || effectivePrice >= range.max) return false;
      }
      return true;
    });

    const sorted = [...result];
    if (sortBy === "random") {
      return sorted.sort(() => 0.5 - Math.random());
    } else if (sortBy === "price-low-high") {
      sorted.sort((a, b) => {
        const priceA = a.discountPrice && a.discountPrice > 0 ? a.discountPrice : a.price;
        const priceB = b.discountPrice && b.discountPrice > 0 ? b.discountPrice : b.price;
        return priceA - priceB;
      });
    } else if (sortBy === "price-high-low") {
      sorted.sort((a, b) => {
        const priceA = a.discountPrice && a.discountPrice > 0 ? a.discountPrice : a.price;
        const priceB = b.discountPrice && b.discountPrice > 0 ? b.discountPrice : b.price;
        return priceB - priceA;
      });
    } else if (sortBy === "latest") {
      sorted.reverse();
    } else if (sortBy === "on-sale") {
      sorted.sort((a, b) => {
        if (a.isSale !== b.isSale) return (b.isSale ? 1 : 0) - (a.isSale ? 1 : 0);
        return (b.salesCount || 0) - (a.salesCount || 0);
      });
    }
    return sorted;
  }, [productsData, selectedCategories, selectedSizes, selectedBrands, selectedColors, selectedRating, selectedPriceRange, sortBy]);

  const tabs = ["Category", "Brand", "Price", "Size", "Color", "Rating"];

  // Column steps for the slider
  const colSteps = [1, 2, 3, 4, 6, 8];
  const currentStepIndex = colSteps.indexOf(columns);

  return (
    <Layout>
      <div className="container mx-auto px-4 lg:px-8 py-12 md:py-20 animate-fade-in max-w-[1920px]">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-6">
          <div>
            <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-3">
              {selectedCategories.length === 1 ? selectedCategories[0] : "Collection"}
            </h1>
            <p className="text-[10px] md:text-sm font-body text-muted-foreground uppercase tracking-widest">
              Showing {filteredAndSorted.length} items
            </p>
          </div>

          <div className="flex items-center gap-6 md:gap-12">
            <div className="flex items-center gap-6 md:gap-10">
              <div className="flex items-center gap-2 md:gap-3">
                <span className="text-[10px] md:text-xs font-body font-bold tracking-[0.2em] uppercase text-muted-foreground whitespace-nowrap">Sort By:</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent border-none text-[10px] md:text-[13px] font-body font-medium focus:ring-0 cursor-pointer appearance-none pr-5 md:pr-6" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right center', backgroundSize: '12px' }}>
                  <option value="random">Default</option>
                  <option value="price-low-high">Price, low to high</option>
                  <option value="price-high-low">Price, high to low</option>
                  <option value="latest">Latest products</option>
                  <option value="on-sale">On sale</option>
                </select>
              </div>

              <button onClick={() => setFiltersOpen(true)} className="flex items-center gap-2 md:gap-3 group">
                 <SlidersHorizontal size={16} className="text-foreground group-hover:text-primary transition-colors" />
                 <span className="text-[10px] md:text-xs font-body font-bold tracking-[0.2em] uppercase">Filter</span>
              </button>
            </div>

            {/* Premium Grid Slider (Desktop Only) */}
            <div className="hidden lg:flex items-center gap-4 border-l pl-10 border-border">
              <div className="grid grid-cols-2 gap-0.5 opacity-60">
                {[1, 2, 3, 4].map(i => <div key={i} className="w-1.5 h-1.5 border-[1px] border-foreground"></div>)}
              </div>
              
              <div className="relative flex items-center w-32 h-6 group">
                {/* Track */}
                <div className="absolute w-full h-[1px] bg-foreground/20"></div>
                {/* Active Track (Optional, but looks good) */}
                <div 
                  className="absolute h-[1px] bg-foreground transition-all duration-300"
                  style={{ width: `${(currentStepIndex / (colSteps.length - 1)) * 100}%` }}
                ></div>
                
                {/* Range Input (Invisible, but handles interaction) */}
                <input 
                  type="range"
                  min="0"
                  max={colSteps.length - 1}
                  step="1"
                  value={currentStepIndex}
                  onChange={(e) => setColumns(colSteps[parseInt(e.target.value)])}
                  className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                />
                
                {/* Custom Thumb (Solid Black Circle) */}
                <div 
                  className="absolute w-5 h-5 bg-foreground rounded-full shadow-lg transition-all duration-300 transform -translate-x-1/2 pointer-events-none"
                  style={{ left: `${(currentStepIndex / (colSteps.length - 1)) * 100}%` }}
                ></div>

              </div>
            </div>
          </div>
        </div>

        {/* Product grid area */}
        <div className="flex-1">
          {filteredAndSorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 md:py-32 text-center">
              <div className="w-16 h-16 bg-muted flex items-center justify-center rounded-full mb-6">
                <X size={24} className="text-muted-foreground" />
              </div>
              <p className="text-lg font-display font-medium mb-2">No products found</p>
              <p className="text-sm font-body text-muted-foreground max-w-xs mb-8">
                We couldn't find any products matching your selection.
              </p>
              <button onClick={clearAll} className="px-8 py-3 bg-foreground text-background text-[10px] font-bold tracking-[0.2em] uppercase">
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className={`grid gap-x-3 gap-y-8 md:gap-x-4 md:gap-y-10 lg:gap-8 transition-all duration-500 ${
              columns === 1 ? 'grid-cols-1 max-w-2xl mx-auto' : 
              columns === 2 ? 'grid-cols-2' : 
              columns === 3 ? 'grid-cols-2 md:grid-cols-3' : 
              columns === 4 ? 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4' :
              columns === 6 ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6' :
              'grid-cols-2 md:grid-cols-4 lg:grid-cols-8'
            }`}>
              {filteredAndSorted.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filter Popup - Inlined to prevent re-opening animation when switching tabs */}
      {filtersOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setFiltersOpen(false)} />
          <div className="relative w-full max-w-2xl bg-background shadow-2xl h-full flex flex-col animate-slide-left">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-display font-bold tracking-tight">Filter</h2>
              <button onClick={() => setFiltersOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Nav */}
              <div className="w-1/3 border-r overflow-y-auto bg-muted/10">
                {tabs.map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full text-left px-8 py-5 text-[13px] font-body font-medium transition-all border-l-4 ${activeTab === tab ? "bg-background border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/20"}`}>
                    {tab}
                  </button>
                ))}
              </div>
              {/* Right Content */}
              <div className="flex-1 p-8 overflow-y-auto">
                {activeTab === "Category" && (
                  <div className="space-y-3">
                    {categories.map((cat: any) => (
                      <label key={cat} className="flex items-center gap-4 cursor-pointer group">
                        <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => toggleFilter(selectedCategories, setSelectedCategories, cat)} className="w-5 h-5 border-border rounded-none text-foreground focus:ring-0" />
                        <span className="text-[13px] font-body text-muted-foreground group-hover:text-foreground">{cat}</span>
                      </label>
                    ))}
                  </div>
                )}
                {activeTab === "Brand" && (
                  <div className="space-y-3">
                    {brands.map((brand: any) => (
                      <label key={brand} className="flex items-center gap-4 cursor-pointer group">
                        <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => toggleFilter(selectedBrands, setSelectedBrands, brand)} className="w-5 h-5 border-border rounded-none text-foreground focus:ring-0" />
                        <span className="text-[13px] font-body text-muted-foreground group-hover:text-foreground">{brand}</span>
                      </label>
                    ))}
                  </div>
                )}
                {activeTab === "Price" && (
                  <div className="space-y-3">
                    {priceRanges.map((range, i) => (
                      <label key={range.label} className="flex items-center gap-4 cursor-pointer group">
                        <input type="radio" name="price" checked={selectedPriceRange === i} onClick={() => setSelectedPriceRange(selectedPriceRange === i ? null : i)} onChange={() => { }} className="w-5 h-5 border-border rounded-full text-foreground focus:ring-0" />
                        <span className="text-[13px] font-body text-muted-foreground group-hover:text-foreground">{range.label}</span>
                      </label>
                    ))}
                  </div>
                )}
                {activeTab === "Size" && (
                  <div className="grid grid-cols-3 gap-3">
                    {sizes.map((size) => (
                      <button key={size} onClick={() => toggleFilter(selectedSizes, setSelectedSizes, size)} className={`h-11 border text-[11px] font-bold uppercase transition-all ${selectedSizes.includes(size) ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"}`}>
                        {size}
                      </button>
                    ))}
                  </div>
                )}
                {activeTab === "Color" && (
                  <div className="space-y-3">
                    {colors.map((color: any) => (
                      <label key={color} className="flex items-center gap-4 cursor-pointer group">
                        <input type="checkbox" checked={selectedColors.includes(color)} onChange={() => toggleFilter(selectedColors, setSelectedColors, color)} className="w-5 h-5 border-border rounded-none text-foreground focus:ring-0" />
                        <span className="text-[13px] font-body text-muted-foreground group-hover:text-foreground">{color}</span>
                      </label>
                    ))}
                  </div>
                )}
                {activeTab === "Rating" && (
                  <div className="space-y-3">
                    {[4, 3, 2, 1].map((rating) => (
                      <button key={rating} onClick={() => setSelectedRating(selectedRating === rating ? null : rating)} className={`w-full h-12 flex items-center justify-between px-4 border transition-all ${selectedRating === rating ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:border-foreground"}`}>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < rating ? "currentColor" : "none"} />)}
                        </div>
                        <span className="text-[11px] font-bold">& Up</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t grid grid-cols-2 gap-4 bg-background">
              <button onClick={clearAll} className="h-14 border border-foreground text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-foreground hover:text-background transition-all">
                Clear
              </button>
              <button onClick={() => setFiltersOpen(false)} className="h-14 bg-foreground text-background text-[11px] font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-all">
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Collection;
