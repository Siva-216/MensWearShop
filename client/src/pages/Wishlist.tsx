import { X } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { toast } from "sonner";

const Wishlist = () => {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-3xl font-bold mb-4">Your Wishlist is Empty</h1>
          <p className="text-sm font-body text-muted-foreground mb-8">Save items you love for later.</p>
          <Link to="/collection" className="btn-hero inline-block">Browse Collection</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 lg:px-8 py-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-10">Wishlist</h1>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {items.map((product) => {
            const isOutOfStock = product.stock <= 0;
            return (
              <div key={product.id} className="group">
                <Link to={`/product/${product.id}`} className="block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-muted mb-4">
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className={`w-full h-full object-cover transition-all duration-500 ${isOutOfStock ? 'grayscale opacity-60' : ''}`} 
                      loading="lazy" 
                    />
                    <button onClick={(e) => { e.preventDefault(); removeFromWishlist(product.id); }} className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur-sm hover:bg-background transition-colors z-10">
                      <X size={14} />
                    </button>
                    {isOutOfStock && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/5 pointer-events-none">
                        <span className="bg-destructive text-destructive-foreground text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1 shadow-lg">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-body font-medium tracking-[0.1em] uppercase text-muted-foreground mb-1">{product.category}</p>
                  <h3 className="font-display text-base font-medium mb-1">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-body font-semibold">₹{product.price.toLocaleString()}</p>
                    {isOutOfStock && <span className="text-[10px] font-bold text-destructive uppercase tracking-widest">Sold Out</span>}
                  </div>
                </Link>
                <button 
                  onClick={() => { 
                    if (isOutOfStock) {
                      toast.error("Sorry, this item is out of stock");
                      return;
                    }
                    addToCart(product, "M"); 
                    toast.success(`${product.name} added to cart`); 
                  }} 
                  disabled={isOutOfStock}
                  className={`w-full mt-3 border text-xs font-body font-semibold tracking-[0.15em] uppercase py-3 transition-colors ${
                    isOutOfStock 
                    ? 'border-border bg-muted text-muted-foreground cursor-not-allowed' 
                    : 'border-border hover:bg-foreground hover:text-background'
                  }`}
                >
                  {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Wishlist;
