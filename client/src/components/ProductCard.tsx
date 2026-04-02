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

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.sizes[0] || "M");
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
          src={hovered && product.images[1] ? product.images[1] : product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
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
        </div>

        {/* Quick actions overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
        
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-10">
          <button 
            onClick={handleQuickAdd} 
            className="w-full bg-background text-foreground text-[10px] font-body font-bold tracking-[0.2em] uppercase py-4 hover:bg-foreground hover:text-background transition-all duration-300 flex items-center justify-center gap-3 shadow-lg active:scale-95"
          >
            <ShoppingBag size={14} />
            Quick Add
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
          <div className="flex items-center gap-1">
            <Star size={10} className="fill-yellow-400 text-yellow-400" />
            <span className="text-[10px] font-bold font-body">{product.rating}</span>
          </div>
        </div>
        
        <h3 className="font-display text-sm md:text-base font-semibold group-hover:text-muted-foreground transition-colors line-clamp-1">{product.name}</h3>
        
        <div className="flex items-center gap-3">
          <p className="text-sm font-body font-bold text-foreground">
            ${product.price}
          </p>
          {product.discountPrice && (
            <p className="text-xs font-body font-medium text-muted-foreground line-through decoration-red-500/50">
              ${product.discountPrice}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
