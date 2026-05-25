import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Package,
  RefreshCw,
  Star,
  X,
  CreditCard,
  Wallet,
  Banknote,
  ArrowLeft,
  SlidersHorizontal,
  Mail,
  Phone,
  User,
  CheckCircle2,
  Trash
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

const sizes = ["S", "M", "L", "XL", "XXL", "7", "8", "9", "10", "OS"];
const priceRanges = [
  { label: "Under ₹1,000", min: 0, max: 1000 },
  { label: "₹1,000 - ₹2,000", min: 1000, max: 2000 },
  { label: "₹2,000 - ₹5,000", min: 2000, max: 5000 },
  { label: "Over ₹5,000", min: 5000, max: Infinity },
];

const POSPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();
  const { items, addToCart, removeFromCart, updateQuantity, subtotal, clearCart, totalItems } = useCart();
  
  // States from Collection.tsx
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // POS specific navigation states
  const [showCart, setShowCart] = useState(false);
  const [isCheckout, setIsCheckout] = useState(false);
  
  // Customer Details for Checkout
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'UPI' | 'Card'>('Cash');
  const [cashReceived, setCashReceived] = useState<number>(0);
  const [discountPercent, setDiscountPercent] = useState(0);

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['pos-products'],
    queryFn: () => api.products.getAll(),
  });

  const categories = useMemo(() => Array.from(new Set((productsData || []).map((p: any) => p.category as string))).sort(), [productsData]);
  const brands = useMemo(() => Array.from(new Set((productsData || []).map((p: any) => p.brand as string))).sort(), [productsData]);

  const toggleFilter = (list: string[], setList: (val: string[]) => void, item: string) => {
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedBrands([]);
    setSelectedRating(null);
    setSelectedPriceRange(null);
    setSearchTerm('');
  };

  const filteredItems = useMemo(() => {
    return (productsData || []).filter((p: any) => {
      if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase()) && !p.brand.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (selectedCategories.length && !selectedCategories.includes(p.category)) return false;
      if (selectedSizes.length && !p.sizes?.some((s: string) => selectedSizes.includes(s))) return false;
      if (selectedBrands.length && !selectedBrands.includes(p.brand)) return false;
      if (selectedRating !== null && (p.rating || 0) < selectedRating) return false;
      if (selectedPriceRange !== null) {
        const range = priceRanges[selectedPriceRange];
        const variantPrices = p.variants?.map((v: any) => v.price).filter((pr: number) => pr > 0) || [];
        const effectivePrice = variantPrices.length > 0 ? Math.min(...variantPrices) : p.price;
        
        if (effectivePrice < range.min || effectivePrice >= range.max) return false;
      }
      return true;
    });
  }, [productsData, searchTerm, selectedCategories, selectedSizes, selectedBrands, selectedRating, selectedPriceRange]);

  const tax = subtotal * 0.05;
  const finalTotal = subtotal + tax - (subtotal * discountPercent / 100);

  const checkoutMutation = useMutation({
    mutationFn: (orderData: any) => api.orders.create(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success("Transaction Completed Successfully!");
      clearCart();
      setShowCart(false);
      setIsCheckout(false);
      setCustomerName('');
      setCustomerPhone('');
      setCustomerEmail('');
      setCashReceived(0);
    },
    onError: () => {
      toast.error("Failed to process transaction.");
    }
  });

  const handleCheckout = () => {
    if (!customerName || !customerPhone) {
      toast.error("Name and Phone are mandatory.");
      return;
    }
    if (paymentMethod === 'Cash' && cashReceived < finalTotal) {
      toast.error("Insufficient Cash Received.");
      return;
    }

    const orderData = {
      orderId: `POS-${Date.now()}`,
      isOffline: true,
      offline: true,
      staffId: currentUser?.id,
      customerName,
      customerPhone,
      customerEmail,
      items: items.map(item => ({
        id: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        size: item.size,
        image: item.product.images?.[0] || ''
      })),
      subTotal: subtotal,
      tax: tax,
      discount: (subtotal * discountPercent / 100),
      totalAmount: finalTotal,
      paymentMethod: paymentMethod,
      cashReceived: paymentMethod === 'Cash' ? cashReceived : finalTotal,
      balanceReturned: paymentMethod === 'Cash' ? (cashReceived - finalTotal) : 0,
      status: 'Completed',
      trackingStep: 4
    };

    checkoutMutation.mutate(orderData);
  };

  const FilterSidebar = () => (
    <div className="space-y-10 pb-10">
      <div className="space-y-2">
        <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase mb-4 text-foreground/90">Search</h3>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary" size={16} />
          <Input 
            placeholder="Search items..." 
            className="pl-10 h-10 bg-card rounded-none border-border"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div>
        <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase mb-4 text-foreground/90">Category</h3>
        <div className="space-y-2.5">
          {categories.map((cat: string) => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={selectedCategories.includes(cat)} 
                onChange={() => toggleFilter(selectedCategories, setSelectedCategories, cat)} 
                className="w-4 h-4 rounded-none border-border" 
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground">{cat}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase mb-4 text-foreground/90">Brand</h3>
        <div className="max-h-48 overflow-y-auto space-y-2.5 custom-scrollbar pr-2">
          {brands.map((brand: string) => (
            <label key={brand} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={selectedBrands.includes(brand)} 
                onChange={() => toggleFilter(selectedBrands, setSelectedBrands, brand)} 
                className="w-4 h-4 rounded-none border-border" 
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground">{brand}</span>
            </label>
          ))}
        </div>
      </div>
      {(selectedCategories.length > 0 || selectedBrands.length > 0 || selectedPriceRange !== null || searchTerm) && (
        <button onClick={clearAllFilters} className="w-full py-4 text-[10px] font-bold tracking-[0.2em] uppercase border border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-white transition-all">
          Clear All Filters
        </button>
      )}
    </div>
  );

  if (showCart) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#f8f9fb] flex flex-col h-screen animate-in fade-in duration-500 overflow-y-auto lg:overflow-hidden font-body">
        {/* Header */}
        <div className="h-16 bg-white border-b px-4 md:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
             <ShoppingCart size={20} className="text-primary" />
             <h1 className="text-base md:text-lg font-black">{isCheckout ? 'Checkout Confirmation' : 'Staff Sales Cart'}</h1>
          </div>
          <button onClick={() => { if (isCheckout) setIsCheckout(false); else setShowCart(false); }} className="flex items-center gap-2 text-xs md:text-sm font-bold opacity-60 hover:opacity-100 uppercase tracking-widest transition-all">
            <ArrowLeft size={16} /> {isCheckout ? 'Edit Cart' : 'Back to Store'}
          </button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row gap-6 md:gap-8 p-4 md:p-10 overflow-y-auto lg:overflow-hidden container mx-auto">
          {/* Main Content Area */}
          <div className="flex-[2] flex flex-col overflow-visible lg:overflow-hidden bg-white rounded-2xl md:rounded-3xl shadow-sm border border-black/5 p-4 md:p-8 relative">
            {!isCheckout ? (
              /* THE CART VIEW */
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6 md:mb-8">
                  <h2 className="text-xl md:text-2xl font-black">Shopping Items</h2>
                  <Badge className="bg-primary/10 text-primary border-none px-3 md:px-4 py-1 font-bold">{totalItems} Items</Badge>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar md:pr-4">
                  {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-30 gap-4 py-10">
                      <Package className="w-12 h-12 md:w-16 md:h-16" />
                      <p className="font-bold text-lg md:text-xl uppercase tracking-widest">Cart is Empty</p>
                    </div>
                  ) : (
                    <div className="space-y-4 md:space-y-0">
                      {/* Desktop Header */}
                      <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 pb-4 border-b text-[10px] uppercase font-black tracking-widest text-[#94a3b8]">
                        <span>Product</span><span>Size</span><span>Quantity</span><span>Total</span><span></span>
                      </div>
                      
                      {items.map((item) => (
                        <div key={`${item.product.id}-${item.size}`} className="flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 py-4 md:py-6 border-b border-[#f1f5f9] items-start md:items-center group bg-[#f8f9fb]/30 md:bg-transparent p-4 md:p-0 rounded-xl md:rounded-none">
                          <div className="flex gap-4 items-center w-full min-w-0">
                            <img src={item.product.images?.[0]} alt={item.product.name} className="w-16 h-20 md:w-16 md:h-20 object-cover bg-muted rounded-xl shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-sm truncate">{item.product.name}</p>
                              <p className="text-xs text-muted-foreground">₹{item.product.price.toLocaleString('en-IN')}</p>
                              <div className="md:hidden mt-1 inline-flex items-center px-2 py-0.5 rounded bg-muted text-[10px] font-bold uppercase tracking-wider">Size {item.size}</div>
                            </div>
                          </div>
                          
                          <div className="hidden md:block">
                            <span className="text-sm font-bold">{item.size}</span>
                          </div>

                          <div className="flex items-center justify-between md:justify-start w-full md:w-auto gap-3">
                            <span className="md:hidden text-xs font-bold text-muted-foreground uppercase opacity-50">Quantity</span>
                            <div className="flex items-center gap-3">
                              <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)} className="w-8 h-8 border flex items-center justify-center rounded-lg bg-white hover:bg-[#f1f5f9] transition-all"><Minus size={12} /></button>
                              <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)} className="w-8 h-8 border flex items-center justify-center rounded-lg bg-white hover:bg-[#f1f5f9] transition-all"><Plus size={12} /></button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between md:justify-start w-full md:w-auto mt-2 md:mt-0">
                            <span className="md:hidden text-xs font-bold text-muted-foreground uppercase opacity-50">Subtotal</span>
                            <span className="text-sm font-black text-primary">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                          </div>

                          <div className="w-full md:w-auto flex justify-end md:block mt-2 md:mt-0 border-t md:border-none pt-2 md:pt-0">
                            <button onClick={() => removeFromCart(item.product.id, item.size)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all md:opacity-0 md:group-hover:opacity-100 flex items-center gap-2 md:gap-0">
                              <Trash2 size={16} /><span className="md:hidden text-xs font-bold uppercase tracking-widest">Remove</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* THE CHECKOUT FORM VIEW */
              <div className="flex flex-col h-full animate-in slide-in-from-right-8 duration-500">
                <div className="mb-8 md:mb-10">
                  <h2 className="text-xl md:text-2xl font-black">Checkout Information</h2>
                  <p className="text-muted-foreground text-[10px] md:text-sm font-medium mt-1 uppercase tracking-widest">Customer & Payment Data</p>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar md:pr-4 space-y-8 md:space-y-12">
                   {/* Personal Info & Payment Grid */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                      <div className="space-y-4 md:space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#94a3b8] flex items-center gap-2">
                           <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                           Customer Details
                        </h3>
                        <div className="space-y-4">
                           <div className="space-y-1.5">
                              <label className="text-[10px] font-bold uppercase ml-1 opacity-60">Full Name</label>
                              <div className="relative group">
                                 <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                 <Input 
                                   value={customerName}
                                   onChange={(e) => setCustomerName(e.target.value)}
                                   placeholder="John Doe"
                                   className="pl-10 h-12 md:h-14 rounded-xl md:rounded-2xl bg-[#f8f9fb] border-none"
                                 />
                              </div>
                           </div>
                           <div className="space-y-1.5">
                              <label className="text-[10px] font-bold uppercase ml-1 opacity-60">Mobile No</label>
                              <div className="relative group">
                                 <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                 <Input 
                                   value={customerPhone}
                                   onChange={(e) => setCustomerPhone(e.target.value)}
                                   placeholder="987xxxxxxx"
                                   className="pl-10 h-12 md:h-14 rounded-xl md:rounded-2xl bg-[#f8f9fb] border-none"
                                 />
                              </div>
                           </div>
                           <div className="space-y-1.5">
                              <label className="text-[10px] font-bold uppercase ml-1 opacity-60 flex justify-between">Email Address <span className="text-[8px] italic opacity-40 lowercase">Optional</span></label>
                              <div className="relative group">
                                 <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                 <Input 
                                   value={customerEmail}
                                   onChange={(e) => setCustomerEmail(e.target.value)}
                                   placeholder="customer@email.com"
                                   className="pl-10 h-12 md:h-14 rounded-xl md:rounded-2xl bg-[#f8f9fb] border-none"
                                 />
                              </div>
                           </div>
                        </div>
                      </div>

                      {/* Payment Selection */}
                      <div className="space-y-4 md:space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#94a3b8] flex items-center gap-2">
                           <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                           Mode of Payment
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                           {[
                              { id: 'Cash', icon: Banknote, desc: 'Accept physical cash' },
                              { id: 'UPI', icon: Wallet, desc: 'GPay/PhonePe/Scan QR' },
                              { id: 'Card', icon: CreditCard, desc: 'Debit/Credit Card' }
                           ].map((mode) => (
                              <button 
                                key={mode.id}
                                onClick={() => setPaymentMethod(mode.id as any)}
                                className={`flex items-center gap-4 p-4 md:p-5 rounded-xl md:rounded-2xl border-2 transition-all duration-300 ${paymentMethod === mode.id ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-transparent bg-[#f8f9fb] hover:bg-[#f1f5f9]'}`}
                              >
                                 <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center ${paymentMethod === mode.id ? 'bg-primary text-white' : 'bg-white text-muted-foreground'} shadow-sm`}>
                                    <mode.icon className="w-5 h-5 md:w-6 md:h-6" />
                                 </div>
                                 <div className="text-left">
                                    <p className="font-bold text-xs md:text-sm">{mode.id}</p>
                                    <p className="text-[9px] md:text-[10px] font-medium opacity-50">{mode.desc}</p>
                                 </div>
                                 {paymentMethod === mode.id && <CheckCircle2 size={16} className="ml-auto text-primary" />}
                              </button>
                           ))}
                        </div>
                      </div>
                   </div>

                   {/* Cash Specific View */}
                   {paymentMethod === 'Cash' && (
                     <div className="bg-[#f8f9fb] rounded-2xl md:rounded-3xl p-6 md:p-8 border border-black/5 animate-in slide-in-from-bottom-4 duration-300">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
                           <div className="w-full flex-1 space-y-4">
                              <h4 className="text-sm font-black uppercase tracking-widest opacity-60">Cash Received Amount</h4>
                              <div className="relative">
                                 <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl md:text-3xl font-black opacity-10">₹</span>
                                 <Input 
                                   type="number"
                                   placeholder="0.00"
                                   value={cashReceived || ''}
                                   onChange={(e) => setCashReceived(Number(e.target.value))}
                                   className="h-14 md:h-16 pl-12 text-2xl md:text-3xl font-black bg-white border-2 border-transparent focus-visible:ring-primary/20 rounded-xl md:rounded-2xl shadow-sm"
                                 />
                              </div>
                           </div>
                           {cashReceived >= finalTotal && (
                              <div className="w-full md:flex-1 bg-white p-5 md:p-6 rounded-xl md:rounded-2xl shadow-sm flex flex-col items-center">
                                 <span className="text-[10px] font-black opacity-50 uppercase tracking-widest mb-1">Balance to return</span>
                                 <p className="text-3xl md:text-4xl font-black text-green-600">₹{(cashReceived - finalTotal).toLocaleString('en-IN')}</p>
                              </div>
                           )}
                        </div>
                     </div>
                   )}
                </div>
              </div>
            )}
          </div>

          <div className="w-full lg:w-[400px] flex flex-col gap-4 md:gap-6 shrink-0">
             <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-black/5 p-6 md:p-8">
                <h2 className="text-lg md:text-xl font-black mb-6 md:mb-8">Order Computation</h2>
                <div className="space-y-3 md:space-y-4 font-bold text-sm">
                   <div className="flex justify-between items-center opacity-60">
                      <span>Subtotal</span>
                       <span>₹{subtotal.toLocaleString('en-IN')}</span>
                   </div>
                   <div className="flex justify-between items-center opacity-60">
                      <span>GST (Fixed 5%)</span>
                       <span>+₹{tax.toLocaleString('en-IN')}</span>
                   </div>
                   <div className="pt-4 md:pt-6 border-t border-[#f1f5f9] flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Payable Total</span>
                         <span className="text-3xl md:text-4xl font-black text-primary">₹{finalTotal.toLocaleString('en-IN')}</span>
                      </div>
                   </div>
                </div>

                <Button 
                  className={`w-full h-14 md:h-16 rounded-xl md:rounded-2xl text-base md:text-lg font-black mt-6 md:mt-8 shadow-lg shadow-primary/10 transition-all ${isCheckout ? 'bg-[#111827] text-white hover:bg-black' : 'bg-primary text-primary-foreground hover:scale-[1.02]'}`}
                  disabled={items.length === 0 || (isCheckout && (!customerName || !customerPhone || (paymentMethod === 'Cash' && cashReceived < finalTotal)))}
                  onClick={() => {
                    if (!isCheckout) setIsCheckout(true);
                    else handleCheckout();
                  }}
                >
                  {isCheckout ? (checkoutMutation.isPending ? <RefreshCw className="animate-spin" /> : 'FINALIZE TRANSACTION') : 'Proceed to Checkout'}
                </Button>

                {!isCheckout && (
                  <Button variant="ghost" className="w-full mt-2 text-[10px] font-bold opacity-40 hover:opacity-100 tracking-widest" onClick={clearCart}> <Trash size={12} className="mr-2" /> CLEAR BAG</Button>
                )}
             </div>
             
             <div className="bg-[#111827] p-4 md:p-5 rounded-xl md:rounded-2xl flex items-center justify-between text-white shadow-xl">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white/10 rounded-lg shrink-0">
                      <User size={18} className="text-white/60" />
                   </div>
                   <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">Active Staff</p>
                      <p className="text-xs md:text-sm font-bold truncate max-w-[120px] md:max-w-[150px]">{currentUser?.fullName || 'POS User'}</p>
                   </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[8px] font-black opacity-30 tracking-[0.2em]">ID: {currentUser?.id?.slice(-8) || 'N/A'}</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-6 md:py-8 animate-in fade-in duration-500 font-body">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-6 pt-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-2 md:mb-4">Store Selection</h1>
          <p className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-[0.25em]">
             Authorized Personal Shopping · Terminal 01
          </p>
        </div>
        
        <div className="flex items-center gap-3 md:gap-4">
          <button 
            onClick={() => setFiltersOpen(!filtersOpen)} 
            className="lg:hidden flex-1 flex items-center justify-center gap-3 text-[10px] font-bold tracking-[0.2em] uppercase border border-border px-4 md:px-8 py-3 md:py-4 hover:bg-muted transition-all bg-white shadow-sm"
          >
            <SlidersHorizontal size={14} /> Filters
          </button>
          
          <button 
            onClick={() => setShowCart(true)}
            className="flex-[1.5] md:flex-none flex items-center justify-center gap-3 md:gap-4 text-[10px] font-black tracking-[0.2em] uppercase bg-[#111827] text-white px-6 md:px-8 py-3 md:py-4 hover:bg-black transition-all shadow-xl shadow-black/10 relative"
          >
            <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Bag {totalItems > 0 && `(${totalItems})`}</span>
            <span className="sm:hidden">Bag {totalItems > 0 && `(${totalItems})`}</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-black rounded-full flex items-center justify-center text-[10px] border-4 border-white shadow-lg animate-in zoom-in">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <FilterSidebar />
        </aside>

        {filtersOpen && (
          <div className="fixed inset-0 z-[120] lg:hidden">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setFiltersOpen(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-[90%] max-w-sm bg-background p-8 md:p-10 overflow-y-auto animate-in slide-in-from-right duration-500 shadow-2xl">
              <div className="flex items-center justify-between mb-10">
                <h2 className="font-display text-xl font-bold tracking-tight uppercase">Filters</h2>
                <button onClick={() => setFiltersOpen(false)} className="p-3 hover:bg-muted rounded-full transition-all">
                  <X size={20} />
                </button>
              </div>
              <FilterSidebar />
            </div>
          </div>
        )}

        <div className="flex-1">
          {isLoading ? (
             <div className="flex items-center justify-center py-32"><RefreshCw size={32} className="animate-spin text-primary opacity-30" /></div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 md:py-32 text-center opacity-40">
              <Package className="w-12 h-12 md:w-16 md:h-16 mb-6" />
              <p className="text-base md:text-lg font-medium mb-2 uppercase tracking-widest">No Inventory Found</p>
              <button onClick={clearAllFilters} className="mt-6 text-[10px] md:text-xs font-black underline underline-offset-4 uppercase tracking-widest text-primary">Clear all filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-10 md:gap-y-12">
              {filteredItems.map((product) => (
                <div key={product.id} className="group flex flex-col h-full bg-white border border-black/[0.03] hover:border-black/5 hover:shadow-xl hover:shadow-black/[0.02] transition-all duration-500">
                   <div className="relative aspect-[4/5] overflow-hidden bg-[#f1f5f9]">
                      <img 
                        src={product.images?.[0]} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                      
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-10">
                        <button 
                          onClick={() => addToCart(product, product.sizes?.[0] || 'M')} 
                          className="w-full bg-[#111827] text-white text-[10px] font-bold tracking-[0.2em] uppercase py-5 hover:bg-primary hover:text-black transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl"
                        >
                          <Plus size={14} /> Add to bag
                        </button>
                      </div>
                      
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {product.isNew && <Badge className="bg-primary text-black border-none rounded-none text-[8px] font-black tracking-widest px-2 py-0.5">NEW</Badge>}
                        {product.isSale && <Badge className="bg-red-600 text-white border-none rounded-none text-[8px] font-black tracking-widest px-2 py-0.5">SALE</Badge>}
                      </div>
                   </div>

                   <div className="p-5 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{product.brand}</p>
                        <div className="flex items-center gap-1">
                          <Star size={10} className="fill-primary text-primary" />
                          <span className="text-[10px] font-black">{product.rating}</span>
                        </div>
                      </div>
                      <h3 className="font-bold text-sm mb-3 group-hover:text-primary transition-colors truncate">{product.name}</h3>
                      <div className="mt-auto flex items-center justify-between">
                        <p className="font-black text-base">₹{product.price.toLocaleString('en-IN')}</p>
                        <div className="flex gap-1">
                           {product.sizes?.slice(0, 2).map((s: string) => <span key={s} className="text-[8px] border px-1 opacity-40 font-bold">{s}</span>)}
                           {product.sizes?.length > 2 && <span className="text-[8px] border px-1 opacity-40 font-bold">+{product.sizes.length - 2}</span>}
                        </div>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default POSPage;
