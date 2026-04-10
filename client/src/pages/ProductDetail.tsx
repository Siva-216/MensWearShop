import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Heart, ShoppingBag, ArrowLeft, RefreshCw } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import ProductCard from "@/components/ProductCard";
import SizeGuideModal from "@/components/SizeGuideModal";
import Layout from "@/components/Layout";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.products.getById(id!),
    enabled: !!id,
  });

  const { data: allProducts } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.products.getAll(),
  });

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

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground font-body">Product not found.</p>
          <Link to="/collection" className="mt-4 inline-block text-sm font-body underline underline-offset-4">Back to Collection</Link>
        </div>
      </Layout>
    );
  }

  const wishlisted = isInWishlist(product.id);
  const related = (allProducts || []).filter((p: any) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error("Sorry, this item is out of stock");
      return;
    }
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    addToCart(product, selectedSize);
    toast.success(`${product.name} added to cart`);
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
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-muted overflow-hidden relative">
              <img 
                src={product.images[selectedImage]} 
                alt={product.name} 
                className={`w-full h-full object-cover transition-all duration-500 ${isOutOfStock ? 'grayscale opacity-60' : ''}`} 
              />
              {isOutOfStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                  <span className="bg-destructive text-destructive-foreground text-sm font-bold tracking-[0.2em] uppercase px-4 py-2 shadow-xl">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)} className={`w-20 h-24 overflow-hidden border-2 transition-colors ${selectedImage === i ? "border-foreground" : "border-transparent hover:border-border"}`}>
                    <img src={img} alt="" className={`w-full h-full object-cover ${isOutOfStock ? 'grayscale opacity-60' : ''}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="lg:py-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-body font-medium tracking-[0.15em] uppercase text-muted-foreground">{product.category}</p>
              <div className={`text-[10px] font-bold tracking-[0.1em] uppercase px-2 py-0.5 rounded-sm ${
                isOutOfStock ? 'bg-destructive/10 text-destructive' : 
                product.stock < 10 ? 'bg-orange-100 text-orange-600' : 'bg-green-50 text-green-600'
              }`}>
                {isOutOfStock ? 'Sold Out' : product.stock < 10 ? `Only ${product.stock} Left` : 'In Stock'}
              </div>
            </div>
            <h1 className="font-display text-3xl lg:text-4xl font-bold mb-3">{product.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <p className="text-xl font-body font-semibold">${product.price}</p>
              {product.discountPrice && (
                <p className="text-base font-body text-muted-foreground line-through decoration-red-500/50">${product.discountPrice}</p>
              )}
            </div>
            <p className="text-sm font-body text-muted-foreground leading-relaxed mb-8">{product.description}</p>

            {/* Size selector */}
            {!isOutOfStock && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-body font-semibold tracking-[0.15em] uppercase">Size</span>
                  <SizeGuideModal />
                </div>
                <div className="flex gap-3">
                  {product.sizes.map((size) => (
                    <button key={size} onClick={() => setSelectedSize(size)} className={`w-12 h-12 text-sm font-body font-semibold border transition-all duration-200 ${selectedSize === size ? "bg-foreground text-background border-foreground" : "border-border text-foreground hover:border-foreground"}`}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <button 
                onClick={handleAddToCart} 
                disabled={isOutOfStock}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 ${
                  isOutOfStock 
                  ? 'bg-muted text-muted-foreground cursor-not-allowed border border-border' 
                  : 'btn-hero'
                }`}
              >
                {isOutOfStock ? (
                  "Out of Stock"
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

            {/* Details */}
            <div className="border-t border-border pt-6 space-y-3">
              <p className="text-xs font-body text-muted-foreground">Free shipping on orders over $200</p>
              <p className="text-xs font-body text-muted-foreground">Easy 30-day returns</p>
            </div>
          </div>
        </div>

        {/* Complete the Look */}
        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-2xl font-bold mb-10">Complete the Look</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
              {related.map((p) => (
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
