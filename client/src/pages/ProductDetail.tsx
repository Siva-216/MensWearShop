import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Heart, ShoppingBag, ArrowLeft } from "lucide-react";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import ProductCard from "@/components/ProductCard";
import SizeGuideModal from "@/components/SizeGuideModal";
import Layout from "@/components/Layout";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);

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
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
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
            <div className="aspect-[3/4] bg-muted overflow-hidden">
              <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)} className={`w-20 h-24 overflow-hidden border-2 transition-colors ${selectedImage === i ? "border-foreground" : "border-transparent hover:border-border"}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="lg:py-4">
            <p className="text-xs font-body font-medium tracking-[0.15em] uppercase text-muted-foreground mb-2">{product.category}</p>
            <h1 className="font-display text-3xl lg:text-4xl font-bold mb-3">{product.name}</h1>
            <p className="text-xl font-body font-semibold mb-6">${product.price}</p>
            <p className="text-sm font-body text-muted-foreground leading-relaxed mb-8">{product.description}</p>

            {/* Size selector */}
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

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <button onClick={handleAddToCart} className="flex-1 btn-hero flex items-center justify-center gap-2">
                <ShoppingBag size={16} /> Add to Cart
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
