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
          {items.map((product) => (
            <div key={product.id} className="group">
              <Link to={`/product/${product.id}`} className="block">
                <div className="relative aspect-[3/4] overflow-hidden bg-muted mb-4">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                  <button onClick={(e) => { e.preventDefault(); removeFromWishlist(product.id); }} className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur-sm hover:bg-background transition-colors">
                    <X size={14} />
                  </button>
                </div>
                <p className="text-xs font-body font-medium tracking-[0.1em] uppercase text-muted-foreground mb-1">{product.category}</p>
                <h3 className="font-display text-base font-medium mb-1">{product.name}</h3>
                <p className="text-sm font-body font-semibold">${product.price}</p>
              </Link>
              <button onClick={() => { addToCart(product, "M"); toast.success("Added to cart (size M)"); }} className="w-full mt-3 border border-border text-xs font-body font-semibold tracking-[0.15em] uppercase py-3 hover:bg-foreground hover:text-background transition-colors">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Wishlist;
