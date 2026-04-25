import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const wishlisted = isInWishlist(product.id);

  const isOutOfStock = product.stock <= 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isOutOfStock) {
      toast.error("Sorry, this item is out of stock");
      return;
    }
    
    const firstVariant = product.variants?.[0];
    const targetSize = firstVariant?.size || product.sizes?.[0] || "M";
    const targetColor = firstVariant?.color || product.colors?.[0] || "None";
    const targetSku = firstVariant?.sku || "";
    const targetPrice = product.discountPrice && product.discountPrice > 0 ? product.discountPrice : (firstVariant?.price || product.price);

    addToCart(product, targetSize, targetColor, targetSku, targetPrice);
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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
    <Link to={`/product/${product.id}`} className="group block">
      <div
        className="relative aspect-[4/5] overflow-hidden bg-muted mb-5 shadow-sm group-hover:shadow-md transition-shadow duration-500"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <img
          src={
            (hovered && product.images && product.images[1]) 
              ? product.images[1] 
              : (product.images && product.images[0]) 
                ? product.images[0] 
                : '/images/collections/shirts.png'
          }
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ${isOutOfStock ? 'grayscale opacity-60' : ''}`}
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {isOutOfStock ? (
            <span className="bg-destructive text-destructive-foreground text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1 animate-fade-in">
              Out of Stock
            </span>
          ) : (
            <>
              {product.isNew && (
                <span className="bg-foreground text-background text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1 animate-fade-in">
                  New
                </span>
              )}
              {product.isSale && (
                <span className="bg-red-600 text-white text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1 animate-fade-in">
                  Sale
                </span>
              )}
            </>
          )}
        </div>

        {/* Quick actions overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
        
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-10">
          <button 
            onClick={handleQuickAdd} 
            disabled={isOutOfStock}
            className={`w-full text-[10px] font-body font-bold tracking-[0.2em] uppercase py-4 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg active:scale-95 ${
              isOutOfStock 
              ? 'bg-muted text-muted-foreground cursor-not-allowed' 
              : 'bg-background text-foreground hover:bg-foreground hover:text-background'
            }`}
          >
            {isOutOfStock ? (
              "Out of Stock"
            ) : (
              <>
                <ShoppingBag size={14} />
                Quick Add
              </>
            )}
          </button>
        </div>

        {/* Wishlist button */}
        <button 
          onClick={handleWishlist} 
          className="absolute top-4 right-4 p-2.5 bg-background/90 backdrop-blur-md rounded-full shadow-sm hover:bg-background transition-all duration-300 active:scale-90 z-10"
        >
          <Heart size={16} className={wishlisted ? "fill-red-500 text-red-500" : "text-foreground"} />
        </button>
      </div>

      <div className="space-y-1.5 animate-slide-up">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-body font-bold tracking-[0.15em] uppercase text-muted-foreground">{product.brand}</p>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              <Star size={10} className="fill-yellow-400 text-yellow-400" />
              <span className="text-[10px] font-bold font-body">{product.rating ? product.rating.toFixed(1) : "0.0"}</span>
            </div>
            <span className="text-[9px] font-body text-muted-foreground">({product.numReviews || 0})</span>
          </div>
        </div>
        
        <h3 className="font-display text-sm md:text-base font-semibold group-hover:text-muted-foreground transition-colors line-clamp-1">{product.name}</h3>
        
        <div className="flex items-center gap-3">
          {product.discountPrice && product.discountPrice > 0 ? (
            <>
              <p className="text-sm font-body font-bold text-foreground">
                ₹{product.discountPrice.toLocaleString()}
              </p>
              <p className="text-xs font-body font-medium text-muted-foreground line-through decoration-red-500/50">
                {(() => {
                  const prices = product.variants?.map((v: any) => v.price).filter((p: number) => p > 0) || [];
                  const min = prices.length > 0 ? Math.min(...prices) : (product.basePrice || product.price);
                  const max = prices.length > 0 ? Math.max(...prices) : (product.basePrice || product.price);
                  
                  if (min === max) {
                    return `₹${min.toLocaleString()}`;
                  }
                  return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
                })()}
              </p>
            </>
          ) : (
            <p className="text-sm font-body font-bold text-foreground">
              {(() => {
                const prices = product.variants?.map((v: any) => v.price).filter((p: number) => p > 0) || [];
                const min = prices.length > 0 ? Math.min(...prices) : (product.basePrice || product.price);
                const max = prices.length > 0 ? Math.max(...prices) : (product.basePrice || product.price);
                
                if (min === max) {
                  return `₹${min.toLocaleString()}`;
                }
                return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
              })()}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
