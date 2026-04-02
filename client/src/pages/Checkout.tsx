import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import { MapPin, Phone, Plus, Check } from "lucide-react";

import { useEffect } from "react";

const Checkout = () => {
  const { user, updateUser, isAuthenticated } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to access checkout");
      navigate("/login", { state: { from: "/checkout" } });
    } else if (items.length === 0) {
      toast.error("Your cart is empty");
      navigate("/cart");
    }
  }, [isAuthenticated, items.length, navigate]);

  const [selectedAddressId, setSelectedAddressId] = useState(
    user?.addresses.find(a => a.isDefault)?.id || user?.addresses[0]?.id || ""
  );
  const [showNewAddressForm, setShowNewAddressForm] = useState(user?.addresses.length === 0);
  
  const [newAddress, setNewAddress] = useState({
    name: "",
    addressLines: ["", ""],
    phone: user?.phone || "",
    altPhone: "",
    city: "",
    state: "",
    zip: "",
    label: "Home"
  });

  if (!user || items.length === 0) {
    return null;
  }

  const handlePlaceOrder = () => {
    if (!selectedAddressId && !showNewAddressForm) {
      toast.error("Please select or add an address");
      return;
    }
    
    // Find selected address
    const selectedAddress = user.addresses.find(a => a.id === selectedAddressId);
    
    // Create new order
    const newOrder = {
      id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      status: "Processing" as const,
      total: subtotal,
      address: selectedAddress,
      paymentMethod: "Cash on Delivery",
      trackingStep: 2, // Processing
      items: items.map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images[0]
      }))
    };

    const updatedUser = {
      ...user,
      orders: [newOrder, ...user.orders]
    };

    updateUser(updatedUser);
    toast.success("Order placed successfully!");
    clearCart();
    navigate("/profile");
  };

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const addressId = `addr-${Date.now()}`;
    const formattedAddress: any = {
      id: addressId,
      name: newAddress.name,
      addressLines: [
        newAddress.addressLines[0],
        newAddress.addressLines[1]
      ].filter(line => line !== ""),
      city: newAddress.city,
      state: newAddress.state,
      zip: newAddress.zip,
      phone: newAddress.phone,
      altPhone: newAddress.altPhone,
      isDefault: user.addresses.length === 0,
      label: newAddress.label
    };

    const updatedUser = {
      ...user,
      addresses: [...user.addresses, formattedAddress]
    };

    updateUser(updatedUser);
    setSelectedAddressId(addressId);
    setShowNewAddressForm(false);
    toast.success("Address added and selected");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 lg:px-8 py-10 md:py-16">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-10">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Side: Address Selection/Form */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Address Selection */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold flex items-center gap-2">
                  <MapPin size={22} /> Delivery Address
                </h2>
                {!showNewAddressForm && (
                  <button 
                    onClick={() => setShowNewAddressForm(true)}
                    className="text-xs font-body font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                  >
                    <Plus size={14} /> Add New Address
                  </button>
                )}
              </div>

              {!showNewAddressForm ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.addresses.map((addr) => (
                    <div 
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`relative p-6 border transition-all cursor-pointer ${
                        selectedAddressId === addr.id 
                          ? "border-foreground bg-muted lg:bg-muted/50" 
                          : "border-border hover:border-foreground/50 bg-card"
                      }`}
                    >
                      {selectedAddressId === addr.id && (
                        <div className="absolute top-4 right-4 text-foreground">
                          <Check size={18} />
                        </div>
                      )}
                      <p className="text-[10px] font-body font-bold tracking-[0.2em] uppercase text-muted-foreground mb-3">{addr.label || "Address"}</p>
                      <p className="font-body font-bold text-sm mb-2">{addr.name}</p>
                      {addr.addressLines.map((line, idx) => (
                        <p key={idx} className="text-xs font-body text-muted-foreground leading-relaxed">{line}</p>
                      ))}
                      <p className="text-xs font-body text-muted-foreground leading-relaxed">
                        {addr.city}, {addr.state} {addr.zip}
                      </p>
                      {addr.phone && (
                        <p className="text-xs font-body text-muted-foreground leading-relaxed mt-2 flex items-center gap-1">
                          <Phone size={10} /> {addr.phone}
                        </p>
                      )}
                      {addr.altPhone && (
                        <p className="text-xs font-body text-muted-foreground leading-relaxed flex items-center gap-1">
                          <Phone size={10} /> {addr.altPhone} (Alt)
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <form onSubmit={handleAddNewAddress} className="bg-card border border-border p-8 space-y-5 animate-fade-in">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-lg font-bold">Add New Delivery Address</h3>
                    <button type="button" onClick={() => setShowNewAddressForm(false)} className="text-xs font-body hover:underline">Cancel</button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-body font-bold tracking-widest uppercase mb-2 text-muted-foreground">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={newAddress.name}
                        onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                        className="w-full h-12 px-4 border border-border bg-background focus:outline-none focus:border-foreground transition-colors font-body text-sm"
                        placeholder="Receiver's name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-body font-bold tracking-widest uppercase mb-2 text-muted-foreground">Address Label</label>
                      <select 
                        value={newAddress.label}
                        onChange={(e) => setNewAddress({...newAddress, label: e.target.value})}
                        className="w-full h-12 px-4 border border-border bg-background focus:outline-none focus:border-foreground transition-colors font-body text-sm"
                      >
                        <option value="Home">Home</option>
                        <option value="Office">Office</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-body font-bold tracking-widest uppercase mb-2 text-muted-foreground">Street Address</label>
                    <input 
                      type="text" 
                      required
                      value={newAddress.addressLines[0]}
                      onChange={(e) => {
                        const lines = [...newAddress.addressLines];
                        lines[0] = e.target.value;
                        setNewAddress({...newAddress, addressLines: lines});
                      }}
                      className="w-full h-12 px-4 border border-border bg-background focus:outline-none focus:border-foreground transition-colors font-body text-sm mb-3"
                      placeholder="Line 1 (Street, Apartment, etc.)"
                    />
                    <input 
                      type="text" 
                      value={newAddress.addressLines[1]}
                      onChange={(e) => {
                        const lines = [...newAddress.addressLines];
                        lines[1] = e.target.value;
                        setNewAddress({...newAddress, addressLines: lines});
                      }}
                      className="w-full h-12 px-4 border border-border bg-background focus:outline-none focus:border-foreground transition-colors font-body text-sm"
                      placeholder="Line 2 (Optional)"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-body font-bold tracking-widest uppercase mb-2 text-muted-foreground">City</label>
                      <input 
                        type="text" 
                        required
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                        className="w-full h-12 px-4 border border-border bg-background focus:outline-none focus:border-foreground transition-colors font-body text-sm"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-body font-bold tracking-widest uppercase mb-2 text-muted-foreground">State</label>
                      <input 
                        type="text" 
                        required
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                        className="w-full h-12 px-4 border border-border bg-background focus:outline-none focus:border-foreground transition-colors font-body text-sm"
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-body font-bold tracking-widest uppercase mb-2 text-muted-foreground">Zip Code</label>
                      <input 
                        type="text" 
                        required
                        value={newAddress.zip}
                        onChange={(e) => setNewAddress({...newAddress, zip: e.target.value})}
                        className="w-full h-12 px-4 border border-border bg-background focus:outline-none focus:border-foreground transition-colors font-body text-sm"
                        placeholder="123456"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-body font-bold tracking-widest uppercase mb-2 text-muted-foreground flex items-center gap-1">
                        <Phone size={10} /> Phone Number
                      </label>
                      <input 
                        type="tel" 
                        required
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                        className="w-full h-12 px-4 border border-border bg-background focus:outline-none focus:border-foreground transition-colors font-body text-sm"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-body font-bold tracking-widest uppercase mb-2 text-muted-foreground">Alternative Phone (Optional)</label>
                      <input 
                        type="tel" 
                        value={newAddress.altPhone}
                        onChange={(e) => setNewAddress({...newAddress, altPhone: e.target.value})}
                        className="w-full h-12 px-4 border border-border bg-background focus:outline-none focus:border-foreground transition-colors font-body text-sm"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full btn-hero py-4 text-xs">
                    Save and Use This Address
                  </button>
                </form>
              )}
            </section>

            {/* Payment Method (Simple for demo) */}
            <section>
              <h2 className="font-display text-xl font-bold mb-6">Payment Method</h2>
              <div className="p-6 border border-border bg-card flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-muted rounded flex items-center justify-center font-bold text-xs uppercase tracking-tighter italic">VISA</div>
                  <span className="text-sm font-body font-medium">Cash on Delivery (Standard)</span>
                </div>
                <div className="text-xs font-body font-bold tracking-widest uppercase text-muted-foreground">Selected</div>
              </div>
            </section>
          </div>

          {/* Right Side: Order Summary */}
          <div className="lg:sticky lg:top-28 h-fit">
            <div className="bg-muted p-6 lg:p-8">
              <h2 className="font-display text-xl font-bold mb-8 pb-4 border-b border-border/30">Order Summary</h2>
              
              <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.size}`} className="flex gap-4">
                    <img src={item.product.images[0]} alt="" className="w-16 h-20 object-cover bg-background" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-display font-medium truncate">{item.product.name}</p>
                      <p className="text-[10px] font-body text-muted-foreground uppercase tracking-widest mt-1">Size: {item.size} · Qty: {item.quantity}</p>
                      <p className="text-sm font-body font-bold mt-2">${item.product.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-border/30">
                <div className="flex justify-between text-sm font-body">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal}</span>
                </div>
                <div className="flex justify-between text-sm font-body">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between font-display text-xl font-bold pt-4">
                  <span>Total</span>
                  <span>${subtotal}</span>
                </div>
              </div>

              <button 
                onClick={handlePlaceOrder}
                disabled={!selectedAddressId && showNewAddressForm}
                className="w-full btn-hero py-4 text-xs mt-8 shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Place Order
              </button>
              <p className="text-[10px] font-body text-center text-muted-foreground mt-4 leading-relaxed">
                By placing your order, you agree to our Terms of Use and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
