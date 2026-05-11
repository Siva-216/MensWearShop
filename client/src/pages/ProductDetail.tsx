import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Heart, ShoppingBag, ArrowLeft, RefreshCw } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import ProductCard from "@/components/ProductCard";
import SizeGuideModal from "@/components/SizeGuideModal";
import Layout from "@/components/Layout";
import ReviewSection from "@/components/ReviewSection";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: product, isLoading: productLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.products.getById(id!),
    enabled: !!id,
    retry: false,
  });

  const { data: allProducts } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.products.getAll(),
  });

  // Auto-deselect size if it becomes unavailable for the selected color
  useEffect(() => {
    if (selectedColor && selectedSize && product?.variants) {
      const variant = product.variants.find(
        (v: any) => v.color === selectedColor && v.size === selectedSize
      );
      if (!variant || variant.stock <= 0) {
        setSelectedSize("");
      }
    }
  }, [selectedColor, product?.variants]);

  // Auto-deselect color if it becomes unavailable for the selected size
  useEffect(() => {
    if (selectedSize && selectedColor && product?.variants) {
      const variant = product.variants.find(
        (v: any) => v.size === selectedSize && v.color === selectedColor
      );
      if (!variant || variant.stock <= 0) {
        setSelectedColor("");
      }
    }
  }, [selectedSize, product?.variants]);


  if (productLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center animate-pulse flex flex-col items-center justify-center gap-4">
          <RefreshCw className="animate-spin text-muted-foreground" size={32} />
          <p className="text-muted-foreground font-body">Loading product details...</p>
        </div>
      </Layout>
    );
  }

  if (isError || !product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground font-body">{isError ? "Error loading product details." : "Product not found."}</p>
          <Link to="/collection" className="mt-4 inline-block text-sm font-body underline underline-offset-4">Back to Collection</Link>
        </div>
      </Layout>
    );
  }


  const isPerfume = (product.categoryName || product.category || "").toLowerCase() === "perfume";

  // Find selected variant
  const selectedVariant = product.variants?.find((v: any) =>
    isPerfume ? v.size === selectedSize : (v.size === selectedSize && v.color === selectedColor)
  );

  const currentPrice = product.discountPrice && product.discountPrice > 0 ? product.discountPrice : (selectedVariant?.price || product.price);

  // Calculate price range for products with variants
  const variantPrices = product.variants?.map((v: any) => v.price).filter((p: number) => p > 0) || [];
  const minPrice = variantPrices.length > 0 ? Math.min(...variantPrices) : product.price;
  const maxPrice = variantPrices.length > 0 ? Math.max(...variantPrices) : product.price;

  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
  const isOutOfStock = currentStock <= 0;

  // Derive available colors and sizes from variants if not present on product
  const availableColors = isPerfume ? [] : (product.colors && product.colors.length > 0 ? product.colors : Array.from(new Set(product.variants?.map((v: any) => v.color))).filter(Boolean));
  const availableSizes = product.sizes && product.sizes.length > 0 ? product.sizes : Array.from(new Set(product.variants?.map((v: any) => v.size))).filter(Boolean);

  const wishlisted = isInWishlist(product.id);
  const related = (allProducts || []).filter((p: any) => {
    const pCat = p.categoryName || p.category;
    const prodCat = product.categoryName || product.category;
    return pCat === prodCat && p.id !== product.id;
  }).slice(0, 4);

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error("Sorry, this item is out of stock");
      return;
    }
    if (!selectedSize || (!isPerfume && !selectedColor)) {
      toast.error(isPerfume ? "Please select ml" : "Please select both size and color");
      return;
    }

    addToCart(
      product,
      selectedSize,
      isPerfume ? (selectedColor || "Standard") : selectedColor,
      selectedVariant?.sku,
      currentPrice
    );
    toast.success(`${product.name} Added to cart`);
  };

  const handleWishlist = () => {
    if (!isAuthenticated) {
      toast.error("Please login to manage your wishlist");
      navigate("/login");
      return;
    }

    if (wishlisted) {
      removeFromWishlist(product.id);
      toast.info("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <Link to="/collection" className="inline-flex items-center gap-2 text-xs font-body font-medium tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft size={14} /> Back to Collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Images */}
          <div className="space-y-4 animate-fade-in group">
            <div className="aspect-[3/4] bg-muted overflow-hidden relative premium-shadow group-hover:shadow-2xl transition-all duration-700">
              <img
                src={product.images && product.images.length > 0 ? product.images[selectedImage] : '/images/collections/shirts.png'}
                alt={product.name}
                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${isOutOfStock ? 'grayscale opacity-60' : ''}`}
              />

              {isOutOfStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[2px]">
                  <span className="bg-destructive text-destructive-foreground text-[10px] font-bold tracking-[0.2em] uppercase px-5 py-2 shadow-2xl animate-fade-in">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {product.images.map((img: string, i: number) => (
                  <button key={i} onClick={() => setSelectedImage(i)} className={`flex-shrink-0 w-20 h-24 overflow-hidden border-2 transition-all duration-300 ${selectedImage === i ? "border-foreground scale-95 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"}`}>
                    <img src={img} alt="" className={`w-full h-full object-cover ${isOutOfStock ? 'grayscale opacity-60' : ''}`} />
                  </button>
                ))}
              </div>
            )}

          </div>

          {/* Info */}
          <div className="lg:py-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-body font-medium tracking-[0.15em] uppercase text-muted-foreground">{product.categoryName || product.category}</p>
              <div className={`text-[10px] font-bold tracking-[0.1em] uppercase px-2 py-0.5 rounded-sm ${isOutOfStock ? 'bg-destructive/10 text-destructive' :
                  currentStock < 10 ? 'bg-orange-100 text-orange-600' : 'bg-green-50 text-green-600'
                }`}>
                {isOutOfStock ? 'Sold Out' : currentStock < 10 ? `Only ${currentStock} Left` : 'In Stock'}
              </div>
            </div>
            <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold mb-3 break-words leading-tight">{product.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              {product.discountPrice && product.discountPrice > 0 ? (
                <>
                  <p className="font-display text-3xl font-bold tracking-tight text-foreground transition-all duration-300">
                    ₹{product.discountPrice.toLocaleString()}
                  </p>
                  <p className="text-base font-body text-muted-foreground line-through decoration-red-500/50">
                    {currentPrice > 0 ?
                      `₹${currentPrice.toLocaleString()}` :
                      minPrice === maxPrice ?
                        `₹${minPrice.toLocaleString()}` :
                        `₹${minPrice.toLocaleString()} - ₹${maxPrice.toLocaleString()}`
                    }
                  </p>
                </>
              ) : (
                <p className="font-display text-3xl font-bold tracking-tight text-foreground transition-all duration-300">
                  {currentPrice > 0 ?
                    `₹${currentPrice.toLocaleString()}` :
                    minPrice === maxPrice ?
                      `₹${minPrice.toLocaleString()}` :
                      `₹${minPrice.toLocaleString()} - ₹${maxPrice.toLocaleString()}`
                  }
                </p>
              )}
            </div>

            {/* Description */}
            <div className="mb-10 text-sm font-body text-muted-foreground leading-relaxed">
              {product.description ? (
                <p className="whitespace-pre-line">{product.description}</p>
              ) : (
                <p>No description available for this product. Craftsmanship and quality are guaranteed in every piece of the Fashion World collection.</p>
              )}
            </div>

            {/* Color selector */}
            {!isPerfume && availableColors && availableColors.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-body font-bold tracking-[0.2em] uppercase text-muted-foreground">Color</span>
                  <span className="text-[10px] font-body font-bold text-foreground uppercase">{selectedColor || 'Choose a color'}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {availableColors.map((color: string) => {
                    const isColorUnavailable = selectedSize
                      ? !product.variants?.some((v: any) => v.size === selectedSize && v.color === color && v.stock > 0)
                      : !product.variants?.some((v: any) => v.color === color && v.stock > 0);

                    return (
                      <button
                        key={color}
                        disabled={isColorUnavailable}
                        onClick={() => setSelectedColor(color)}
                        className={`px-5 py-2.5 text-[10px] font-body font-bold border transition-all duration-300 tracking-widest uppercase ${selectedColor === color
                            ? "bg-foreground text-background border-foreground shadow-lg scale-95"
                            : isColorUnavailable
                              ? "border-dashed border-border text-muted-foreground opacity-40 cursor-not-allowed"
                              : "border-border text-muted-foreground hover:border-foreground"
                          }`}
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>

              </div>
            )}

            {/* Size selector */}
            {availableSizes && availableSizes.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-body font-bold tracking-[0.2em] uppercase text-muted-foreground">{isPerfume ? "ML" : "Size"}</span>
                    {!isPerfume && <SizeGuideModal />}
                  </div>
                  <span className="text-[10px] font-body font-bold text-foreground uppercase">{selectedSize || (isPerfume ? 'Choose ml' : 'Choose a size')}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {availableSizes.map((size: string) => {
                    const isSizeUnavailable = selectedColor
                      ? !product.variants?.some((v: any) => v.color === selectedColor && v.size === size && v.stock > 0)
                      : !product.variants?.some((v: any) => v.size === size && v.stock > 0);

                    return (
                      <button
                        key={size}
                        disabled={isSizeUnavailable}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 text-xs font-body font-bold border transition-all duration-300 rounded-none ${selectedSize === size
                            ? "bg-foreground text-background border-foreground shadow-lg scale-95"
                            : isSizeUnavailable
                              ? "border-dashed border-border text-muted-foreground opacity-40 cursor-not-allowed"
                              : "border-border text-foreground hover:border-foreground"
                          }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>

              </div>
            )}

            {/* Actions - Desktop */}
            <div className="hidden lg:flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 ${isOutOfStock || !selectedSize || (!isPerfume && !selectedColor)
                    ? 'bg-muted text-muted-foreground cursor-not-allowed border border-border'
                    : 'btn-hero'
                  }`}
              >
                {isOutOfStock ? (
                  "Out of Stock"
                ) : !selectedSize || (!isPerfume && !selectedColor) ? (
                  "Select Options"
                ) : (
                  <>
                    <ShoppingBag size={16} /> Add to Cart
                  </>
                )}
              </button>
              <button onClick={handleWishlist} className={`w-14 h-14 border flex items-center justify-center transition-colors ${wishlisted ? "bg-foreground text-background border-foreground" : "border-border hover:border-foreground"}`}>
                <Heart size={18} className={wishlisted ? "fill-current" : ""} />
              </button>
            </div>

            {/* Actions - Mobile Sticky Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 glass-card z-40 flex gap-3 animate-fade-in shadow-[0_-4px_30px_rgba(0,0,0,0.1)]">
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 py-4 btn-hero-primary ${isOutOfStock || !selectedSize || (!isPerfume && !selectedColor)
                    ? 'bg-muted text-muted-foreground cursor-not-allowed border-none'
                    : ''
                  }`}
              >
                {isOutOfStock ? "Sold Out" : !selectedSize || (!isPerfume && !selectedColor) ? "Select Options" : "Add to Cart"}
              </button>
              <button onClick={handleWishlist} className={`w-12 h-12 border flex items-center justify-center transition-all bg-background active:scale-90 ${wishlisted ? "bg-foreground text-background border-foreground shadow-lg" : "border-border"}`}>
                <Heart size={18} className={wishlisted ? "fill-current" : ""} />
              </button>
            </div>

            {/* Details */}
            <div className="border-t border-border pt-6 space-y-3 mb-24 lg:mb-0">
              <p className="text-xs font-body text-muted-foreground">Free shipping on orders over ₹2500</p>
              <p className="text-xs font-body text-muted-foreground">Easy 30-day returns</p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewSection 
          productId={product.id} 
          productName={product.name}
          productImage={product.images && product.images.length > 0 ? product.images[0] : ""}
        />

        {/* Complete the Look */}
        {related.length > 0 && (
          <section className="mt-20 mb-28 lg:mb-12">
            <h2 className="font-display text-2xl font-bold mb-10">Complete the Look</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
              {related.map((p: any) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetail;
