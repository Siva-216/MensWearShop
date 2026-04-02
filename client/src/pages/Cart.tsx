import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { toast } from "sonner";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, subtotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error("Please login to proceed to checkout");
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }
    // Proceed to checkout page
    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-sm font-body text-muted-foreground mb-8">Looks like you haven't added anything yet.</p>
          <Link to="/collection" className="btn-hero inline-block">Continue Shopping</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 lg:px-8 py-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-10">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-0">
            {/* Header */}
            <div className="hidden lg:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 pb-4 border-b border-border text-xs font-body font-semibold tracking-[0.15em] uppercase text-muted-foreground">
              <span>Product</span><span>Size</span><span>Quantity</span><span>Total</span><span></span>
            </div>
            {items.map((item) => (
              <div key={`${item.product.id}-${item.size}`} className="grid grid-cols-[80px_1fr] lg:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 py-6 border-b border-border items-center">
                <div className="flex items-center gap-4 col-span-1 lg:col-span-1">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-20 h-24 object-cover bg-muted" />
                  <div className="hidden lg:block">
                    <p className="font-display text-sm font-medium">{item.product.name}</p>
                    <p className="text-xs font-body text-muted-foreground">${item.product.price}</p>
                  </div>
                </div>
                <div className="lg:hidden">
                  <p className="font-display text-sm font-medium">{item.product.name}</p>
                  <p className="text-xs font-body text-muted-foreground mb-1">${item.product.price} · Size {item.size}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)} className="w-7 h-7 border border-border flex items-center justify-center hover:bg-muted transition-colors"><Minus size={12} /></button>
                    <span className="text-sm font-body w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)} className="w-7 h-7 border border-border flex items-center justify-center hover:bg-muted transition-colors"><Plus size={12} /></button>
                  </div>
                  <p className="text-sm font-body font-semibold mt-2">${item.product.price * item.quantity}</p>
                </div>
                <span className="hidden lg:block text-sm font-body">{item.size}</span>
                <div className="hidden lg:flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)} className="w-8 h-8 border border-border flex items-center justify-center hover:bg-muted transition-colors"><Minus size={12} /></button>
                  <span className="text-sm font-body w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)} className="w-8 h-8 border border-border flex items-center justify-center hover:bg-muted transition-colors"><Plus size={12} /></button>
                </div>
                <span className="hidden lg:block text-sm font-body font-semibold">${item.product.price * item.quantity}</span>
                <button onClick={() => removeFromCart(item.product.id, item.size)} className="hidden lg:flex p-1 text-muted-foreground hover:text-foreground transition-colors"><X size={16} /></button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:sticky lg:top-28 h-fit">
            <div className="bg-muted p-6 lg:p-8">
              <h2 className="font-display text-lg font-bold mb-6">Order Summary</h2>
              <div className="space-y-3 text-sm font-body">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>Free</span></div>
                <div className="border-t border-border pt-3 flex justify-between font-semibold text-base">
                  <span>Total</span><span>${subtotal}</span>
                </div>
              </div>
              <button 
                onClick={handleCheckout}
                className="w-full btn-hero mt-6"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
