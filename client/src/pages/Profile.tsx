import { useState, useEffect } from "react";
import { User, Package, Settings as SettingsIcon, Heart, FileText, LogOut, Edit2, AlertCircle, MapPin, Phone, ShoppingBag, Cpu, Truck, CheckCircle, ChevronLeft, CreditCard, Plus } from "lucide-react";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { UserData } from "@/data/users";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { items: wishlist } = useWishlist();
  
  const isAdmin = user?.role === 'admin';
  const [activeTab, setActiveTab] = useState(isAdmin ? "info" : "overview");

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to access your profile");
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const menuItems = [
    ...(!isAdmin ? [{ id: "overview", label: "Overview", icon: User }] : []),
    ...(!isAdmin ? [{ id: "orders", label: "Orders", icon: Package }] : []),
    { id: "info", label: "User Info", icon: FileText },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 lg:px-8 py-12 md:py-20">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Sidebar Navigation */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="sticky top-28 bg-card border border-border shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border bg-muted/30">
                <p className="text-[10px] font-body font-bold tracking-[0.2em] uppercase text-muted-foreground mb-1">Account</p>
                <p className="font-display font-bold text-lg truncate">{user.fullName}</p>
              </div>
              <nav className="p-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-body transition-all duration-200 ${
                        activeTab === item.id 
                          ? "bg-foreground text-background font-bold shadow-md" 
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon size={18} />
                      {item.label}
                    </button>
                  );
                })}
                <hr className="my-4 border-border" />
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-body text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={18} />
                  Log Out
                </button>
              </nav>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 min-w-0">
            {activeTab === "overview" && <OverviewTab user={user} wishlistCount={wishlist?.length || 0} />}
            {activeTab === "orders" && <OrdersTab orders={user.orders} />}
            {activeTab === "info" && <UserInfoTab storedUser={user} />}
            {activeTab === "settings" && <SettingsTab />}
          </div>

        </div>
      </div>
    </Layout>
  );
};

// --- TABS ---

const OverviewTab = ({ user, wishlistCount }: { user: UserData; wishlistCount: number }) => {
  const isAdmin = user.role === 'admin';
  return (
    <div className="animate-fade-in space-y-12">
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
      {/* Profile Card */}
      <div className="lg:col-span-2 bg-muted p-6 lg:p-8 rounded-sm flex flex-col h-full">
        <div className="w-16 h-16 bg-foreground text-background rounded-full flex items-center justify-center mb-6 shrink-0">
          <User size={24} />
        </div>
        <h2 className="font-display text-xl font-bold">{user.fullName}</h2>
        <p className="text-sm font-body text-muted-foreground mt-1 mb-6">{user.email}</p>
        <div className="pt-4 border-t border-border/50 mt-auto">
          <p className="text-xs font-body text-muted-foreground">Member since {user.memberSince}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
        <div className="bg-card border border-border p-8 text-center shadow-sm flex flex-col items-center justify-center h-full min-h-[200px]">
          <Package className="mb-4 text-foreground" size={28} />
          <p className="font-display text-4xl font-bold">{user.orders.length}</p>
          <p className="text-xs font-body text-muted-foreground uppercase tracking-widest mt-2">Total Orders</p>
        </div>
        <div className="bg-card border border-border p-8 text-center shadow-sm flex flex-col items-center justify-center h-full min-h-[200px]">
          <Heart className="mb-4 text-foreground" size={28} />
          <p className="font-display text-4xl font-bold">{wishlistCount}</p>
          <p className="text-xs font-body text-muted-foreground uppercase tracking-widest mt-2">Wishlist Items</p>
        </div>
      </div>
    </div>

    {!isAdmin && (
      <>
        {/* Recent Orders */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-bold flex items-center gap-2">
              <Package size={20} /> Recent Orders
            </h2>
            {user.orders.length > 3 && (
              <button className="text-xs font-body font-bold underline underline-offset-4">View All</button>
            )}
          </div>
          <div className="space-y-0 border-t border-border">
            {user.orders.length > 0 ? (
              user.orders.slice(0, 3).map((order) => (
                <div key={order.id} className="flex flex-row items-center justify-between py-5 border-b border-border">
                  <div>
                    <p className="font-body font-bold text-sm mb-1">Order #{order.id}</p>
                    <p className="text-xs font-body text-muted-foreground">{order.date} · {typeof order.items === 'number' ? order.items : order.items.length} items</p>
                  </div>
                  <div className="text-right">
                    <p className="font-body font-bold text-sm mb-1">${order.total}</p>
                    <p className={`text-[10px] font-body font-bold tracking-widest uppercase ${
                      order.status === 'Delivered' ? 'text-green-600' : 'text-foreground'
                    }`}>{order.status}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center border-b border-border border-dashed">
                <p className="text-sm font-body text-muted-foreground">No orders placed yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Saved Addresses */}
        <div>
          <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
            <MapPin size={20} /> Saved Addresses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.addresses.length > 0 ? (
              user.addresses.map((addr) => (
                <div key={addr.id} className="border border-border p-6 bg-card shadow-sm">
                  <p className="text-xs font-body font-bold tracking-[0.15em] uppercase mb-3">{addr.label || addr.name}</p>
                  <div className="space-y-1">
                    {addr.addressLines.map((line, i) => (
                      <p key={i} className="text-sm font-body text-muted-foreground leading-relaxed">{line}</p>
                    ))}
                    <p className="text-sm font-body text-muted-foreground leading-relaxed">
                      {addr.city}, {addr.state} {addr.zip}
                    </p>
                    {addr.phone && (
                      <p className="text-xs font-body text-muted-foreground leading-relaxed mt-2 flex items-center gap-1">
                        <Phone size={10} /> {addr.phone}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-10 text-center border border-dashed border-border">
                <p className="text-sm font-body text-muted-foreground">No addresses saved yet.</p>
              </div>
            )}
          </div>
        </div>
      </>
    )}
    </div>
  );
};

const OrdersTab = ({ orders }: { orders: any[] }) => {
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  if (selectedOrder) {
    const steps = [
      { id: 1, label: "Order Placed", icon: ShoppingBag },
      { id: 2, label: "Processing", icon: Cpu },
      { id: 3, label: "On the way", icon: Truck },
      { id: 4, label: "Delivered", icon: CheckCircle },
    ];

    const currentStep = selectedOrder.trackingStep || (selectedOrder.status === 'Delivered' ? 4 : 1);

    return (
      <div className="animate-fade-in space-y-8">
        <button 
          onClick={() => setSelectedOrder(null)}
          className="flex items-center gap-2 text-xs font-body font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft size={14} /> Back to History
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/30 p-6 border border-border">
          <div>
            <p className="text-[10px] font-body font-bold tracking-[0.2em] uppercase text-muted-foreground mb-1">Order ID</p>
            <h2 className="font-display text-xl font-bold">{selectedOrder.id}</h2>
          </div>
          <div className="md:text-right">
            <p className="text-[10px] font-body font-bold tracking-[0.2em] uppercase text-muted-foreground mb-1">Estimated Delivery Date</p>
            <p className="font-body font-bold text-sm">March 25, 2026</p>
          </div>
        </div>

        {/* Tracking Progress */}
        <div className="bg-card border border-border p-8 lg:p-12">
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-0">
            {/* Progress line (desktop) */}
            <div className="absolute top-[24px] left-0 w-full h-[1px] bg-border hidden md:block" />
            
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = step.id <= currentStep;
              
              return (
                <div key={step.id} className="relative z-10 flex flex-row md:flex-col items-center gap-4 md:gap-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-500 ${
                    isActive ? "bg-foreground border-foreground text-background scale-110 shadow-lg" : "bg-background border-border text-muted-foreground"
                  }`}>
                    <Icon size={20} />
                  </div>
                  <div className="md:absolute md:top-16 md:left-1/2 md:-translate-x-1/2 md:w-32 md:text-center text-left">
                    <p className={`text-[10px] font-body font-bold tracking-widest uppercase transition-colors duration-500 ${
                      isActive ? "text-foreground" : "text-muted-foreground"
                    }`}>{step.label}</p>
                    {isActive && <p className="text-[9px] font-body text-muted-foreground mt-1 hidden md:block">{selectedOrder.date}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="space-y-6">
            <h3 className="font-display text-lg font-bold border-b border-border pb-3">Order Items</h3>
            <div className="space-y-4">
              {Array.isArray(selectedOrder.items) ? (
                selectedOrder.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-4 p-4 border border-border/50 bg-card/50">
                    <img src={item.image} alt={item.name} className="w-16 h-20 object-cover bg-muted" />
                    <div className="flex-1">
                      <p className="font-display font-medium text-sm">{item.name}</p>
                      <p className="text-[10px] font-body text-muted-foreground uppercase tracking-wider mt-1">Qty: {item.quantity}</p>
                      <p className="font-body font-bold text-sm mt-1">${item.price}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 border border-border/50 bg-card/50">
                  <p className="text-sm font-body text-muted-foreground italic">Order contains {selectedOrder.items} items.</p>
                </div>
              )}
            </div>
            
            <div className="pt-6 border-t border-border flex justify-between items-center">
              <span className="font-display font-bold uppercase tracking-widest text-xs text-muted-foreground">Amount Paid</span>
              <span className="font-display font-bold text-2xl">${selectedOrder.total}</span>
            </div>
          </div>

          {/* Delivery & Payment Info */}
          <div className="space-y-10">
            <section>
              <h3 className="font-display text-lg font-bold border-b border-border pb-3 mb-6 flex items-center gap-2">
                <MapPin size={18} /> Shipping Address
              </h3>
              {selectedOrder.address ? (
                <div className="space-y-1">
                  <p className="font-body font-bold text-base mb-2">{selectedOrder.address.name}</p>
                  {selectedOrder.address.addressLines.map((line: string, i: number) => (
                    <p key={i} className="text-sm font-body text-muted-foreground leading-relaxed">{line}</p>
                  ))}
                  <p className="text-sm font-body text-muted-foreground leading-relaxed">
                    {selectedOrder.address.city}, {selectedOrder.address.state} {selectedOrder.address.zip}
                  </p>
                  <p className="text-sm font-body text-foreground font-medium flex items-center gap-2 mt-4 pt-4 border-t border-border/10">
                    <Phone size={14} /> {selectedOrder.address.phone}
                  </p>
                </div>
              ) : (
                <p className="text-sm font-body text-muted-foreground italic">Shipping information not available for this legacy order.</p>
              )}
            </section>

            <section>
              <h3 className="font-display text-lg font-bold border-b border-border pb-3 mb-6 flex items-center gap-2">
                <CreditCard size={18} /> Payment & Billing
              </h3>
              <div className="bg-muted p-6 border border-border space-y-4">
                <div>
                  <p className="text-[10px] font-body font-bold tracking-widest uppercase text-muted-foreground mb-1">Payment Method</p>
                  <p className="font-body font-bold text-sm tracking-wide">{selectedOrder.paymentMethod || "Cash on Delivery"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-body font-bold tracking-widest uppercase text-muted-foreground mb-1">Payment Status</p>
                  <p className="font-body font-bold text-sm tracking-wide text-orange-600">Pending on Delivery</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h2 className="font-display text-2xl font-bold mb-6">Order History</h2>
      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="border border-border bg-card p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-foreground transition-all duration-300">
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs font-body text-muted-foreground uppercase tracking-wider mb-1">Order ID</p>
                  <p className="font-body font-bold text-sm">{order.id}</p>
                </div>
                <div>
                  <p className="text-xs font-body text-muted-foreground uppercase tracking-wider mb-1">Date</p>
                  <p className="font-body font-medium text-sm">{order.date}</p>
                </div>
                <div>
                  <p className="text-xs font-body text-muted-foreground uppercase tracking-wider mb-1">Total</p>
                  <p className="font-body font-medium text-sm">${order.total}</p>
                </div>
                <div>
                  <p className="text-xs font-body text-muted-foreground uppercase tracking-wider mb-1">Status</p>
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-sm ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                    order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedOrder(order)}
                className="shrink-0 btn-hero py-2 px-6 text-xs w-full md:w-auto text-center"
              >
                View Details
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-20 border border-dashed border-border">
            <p className="text-muted-foreground font-body">You haven't placed any orders yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const UserInfoTab = ({ storedUser }: { storedUser: UserData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { updateUser } = useAuth();
  const isAdmin = storedUser.role === 'admin';
  const [formData, setFormData] = useState({
    fullName: storedUser.fullName,
    email: storedUser.email,
    phone: storedUser.phone
  });

  const [addresses, setAddresses] = useState(storedUser.addresses);

  useEffect(() => {
    setAddresses(storedUser.addresses);
  }, [storedUser.addresses]);

  const [showAddressForm, setShowAddressForm] = useState(false);

  const handleSaveInfo = async () => {
    const updatedUser = {
      ...storedUser,
      ...formData,
      addresses: addresses
    };
    const success = await updateUser(updatedUser);
    if (success) {
      setIsEditing(false);
      toast.success("Profile information updated successfully!");
    } else {
      toast.error("Failed to update profile information.");
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements[0] as HTMLInputElement).value;
    const street1 = (form.elements[1] as HTMLInputElement).value;
    const street2 = (form.elements[2] as HTMLInputElement).value;
    const city = (form.querySelector('#city') as HTMLInputElement).value;
    const state = (form.querySelector('#state') as HTMLInputElement).value;
    const zip = (form.querySelector('#zip') as HTMLInputElement).value;
    const country = (form.querySelector('#country') as HTMLInputElement).value;
    const phone = (form.querySelector('#phone') as HTMLInputElement).value;
    
    const newAddress: any = {
      id: `addr-${Date.now()}`,
      name,
      addressLines: [street1, street2].filter(Boolean),
      city,
      state,
      zip,
      country,
      phone,
      isDefault: addresses.length === 0,
      label: addresses.length === 0 ? "Default" : "New Address"
    };

    const newAddresses = [...addresses, newAddress];
    setAddresses(newAddresses);
    const success = await updateUser({
      ...storedUser,
      addresses: newAddresses
    });
    
    if (success) {
      setShowAddressForm(false);
      toast.success("Address added successfully!");
    } else {
      toast.error("Failed to add address.");
    }
  };

  const handleSetDefault = async (id: string) => {
    const newAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    }));
    setAddresses(newAddresses);
    
    const success = await updateUser({
      ...storedUser,
      addresses: newAddresses
    });
    
    if (success) {
      toast.success("Default address updated!");
    } else {
      toast.error("Failed to update default address.");
    }
  };

  const handleRemoveAddress = async (id: string) => {
    const newAddresses = addresses.filter(addr => addr.id !== id);
    setAddresses(newAddresses);
    const success = await updateUser({
      ...storedUser,
      addresses: newAddresses
    });
    if (success) {
      toast.info("Address removed.");
    } else {
      toast.error("Failed to remove address.");
    }
  }

  return (
    <div className="animate-fade-in space-y-12 max-w-4xl">
      {/* Personal Information Section */}
      <div>
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/50">
          <h2 className="font-display text-3xl font-bold">Personal Information</h2>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-sm font-body font-bold hover:underline transition-all">
              <Edit2 size={16} /> Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
          <div>
            <label className="block text-xs font-body font-bold tracking-widest uppercase mb-2 text-muted-foreground">Full Name</label>
            <input 
              type="text" 
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              disabled={!isEditing}
              className="w-full h-12 px-4 border border-border bg-background focus:outline-none focus:border-foreground transition-all duration-300 font-body text-sm disabled:bg-muted/50 disabled:text-muted-foreground"
            />
          </div>
          <div>
            <label className="block text-xs font-body font-bold tracking-widest uppercase mb-2 text-muted-foreground">Email Address</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              disabled={!isEditing}
              className="w-full h-12 px-4 border border-border bg-background focus:outline-none focus:border-foreground transition-all duration-300 font-body text-sm disabled:bg-muted/50 disabled:text-muted-foreground"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-body font-bold tracking-widest uppercase mb-2 text-muted-foreground">Phone Number</label>
            <input 
              type="tel" 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              disabled={!isEditing}
              className="w-full h-12 px-4 border border-border bg-background focus:outline-none focus:border-foreground transition-all duration-300 font-body text-sm disabled:bg-muted/50 disabled:text-muted-foreground"
            />
          </div>

          {isEditing && (
            <div className="flex gap-4 pt-4 md:col-span-2">
              <button onClick={handleSaveInfo} className="btn-hero py-3 px-8 text-xs font-bold uppercase tracking-widest">Save Changes</button>
              <button onClick={() => setIsEditing(false)} className="px-8 py-3 text-xs font-bold border border-border hover:bg-muted transition-colors uppercase tracking-widest">Cancel</button>
            </div>
          )}
        </div>
      </div>

      {/* Saved Addresses Section - Hide for Admin */}
      {!isAdmin && (
        <div className="pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-border/50">
            <h2 className="font-display text-3xl font-bold">Saved Addresses</h2>
            {!showAddressForm && (
              <button 
                onClick={() => setShowAddressForm(true)} 
                className="text-[11px] font-body font-bold uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 mt-4 sm:mt-0"
              >
                <Plus size={14} /> ADD NEW
              </button>
            )}
          </div>

          {showAddressForm ? (
            <form onSubmit={handleAddAddress} className="max-w-2xl border border-border p-8 bg-card space-y-6 shadow-sm animate-fade-in relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-foreground" />
              <h3 className="font-display text-xl font-bold mb-6">Add New Address</h3>
              
              <div>
                <label className="block text-xs font-body font-bold tracking-widest uppercase mb-2 text-muted-foreground">Recipient Name</label>
                <input type="text" required className="w-full h-12 px-4 border border-border bg-background focus:outline-none focus:border-foreground transition-colors font-body text-sm" placeholder="Full Name" />
              </div>

              <div>
                <label className="block text-xs font-body font-bold tracking-widest uppercase mb-2 text-muted-foreground">Street Address</label>
                <input type="text" required className="w-full h-12 px-4 border border-border bg-background focus:outline-none focus:border-foreground transition-colors font-body text-sm mb-3" placeholder="Line 1" />
                <input type="text" className="w-full h-12 px-4 border border-border bg-background focus:outline-none focus:border-foreground transition-colors font-body text-sm" placeholder="Line 2 (Optional)" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-body font-bold tracking-widest uppercase mb-2 text-muted-foreground">City</label>
                  <input type="text" required id="city" className="w-full h-12 px-4 border border-border bg-background focus:outline-none focus:border-foreground transition-colors font-body text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-body font-bold tracking-widest uppercase mb-2 text-muted-foreground">State</label>
                  <input type="text" required id="state" className="w-full h-12 px-4 border border-border bg-background focus:outline-none focus:border-foreground transition-colors font-body text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-body font-bold tracking-widest uppercase mb-2 text-muted-foreground">Zip Code</label>
                  <input type="text" required id="zip" className="w-full h-12 px-4 border border-border bg-background focus:outline-none focus:border-foreground transition-colors font-body text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-body font-bold tracking-widest uppercase mb-2 text-muted-foreground">Country</label>
                  <input type="text" required id="country" className="w-full h-12 px-4 border border-border bg-background focus:outline-none focus:border-foreground transition-colors font-body text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-body font-bold tracking-widest uppercase mb-2 text-muted-foreground">Contact Number</label>
                  <input type="tel" required id="phone" className="w-full h-12 px-4 border border-border bg-background focus:outline-none focus:border-foreground transition-colors font-body text-sm" />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button type="submit" className="btn-hero py-3 flex-1 text-xs font-bold uppercase tracking-widest">Save Address</button>
                <button type="button" onClick={() => setShowAddressForm(false)} className="py-3 flex-1 text-xs font-bold border border-border hover:bg-muted transition-colors text-center uppercase tracking-widest">Cancel</button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addresses.map((addr) => (
                <div key={addr.id} className={`p-6 border transition-all duration-300 relative ${addr.isDefault ? 'border-foreground bg-muted outline outline-1 outline-foreground/10' : 'border-border bg-card'}`}>
                  {addr.isDefault && (
                    <div className="absolute -top-3 left-4 bg-foreground text-background text-[9px] font-bold tracking-widest uppercase px-2 py-1">DEFAULT</div>
                  )}
                  
                  <p className="text-[10px] font-body font-bold tracking-[0.2em] uppercase text-muted-foreground mb-4">{addr.label || 'Address'}</p>
                  <p className="font-display font-bold text-base mb-3">{addr.name}</p>
                  
                  <div className="space-y-1 mb-6">
                    {addr.addressLines.map((line, idx) => (
                      <p key={idx} className="text-sm font-body text-muted-foreground leading-relaxed">{line}</p>
                    ))}
                    <p className="text-sm font-body text-muted-foreground leading-relaxed">
                      {addr.city}, {addr.state} {addr.zip}
                    </p>
                    {addr.phone && (
                      <p className="text-xs font-body text-muted-foreground flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                        <Phone size={12} className="text-foreground" /> {addr.phone}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-auto">
                    {!addr.isDefault && (
                      <button onClick={() => handleSetDefault(addr.id)} className="text-[10px] font-bold font-body uppercase tracking-[0.15em] text-foreground hover:underline underline-offset-4">SET DEFAULT</button>
                    )}
                    <button onClick={() => handleRemoveAddress(addr.id)} className="text-[10px] font-bold font-body uppercase tracking-[0.15em] text-red-500 hover:bg-red-50 px-2 py-1 transition-colors border border-transparent hover:border-red-100">REMOVE</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SettingsTab = () => {
  const { deleteAccount } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      const success = await deleteAccount();
      if (success) {
        toast.success("Account deleted successfully.");
        navigate("/");
      } else {
        toast.error("Failed to delete account.");
      }
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Password updated successfully!");
  };

  return (
    <div className="animate-fade-in space-y-12 max-w-2xl">
      <div>
        <h2 className="font-display text-2xl font-bold mb-6">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4 p-8 border border-border bg-card shadow-sm relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-foreground" />
          <div className="grid grid-cols-1 gap-5">
            <div>
              <label className="block text-xs font-body font-bold tracking-widest uppercase mb-2 text-muted-foreground">Current Password</label>
              <input type="password" required className="w-full h-12 px-4 border border-border bg-background focus:outline-none focus:border-foreground transition-colors font-body text-sm" />
            </div>
            <div>
              <label className="block text-xs font-body font-bold tracking-widest uppercase mb-2 text-muted-foreground">New Password</label>
              <input type="password" required className="w-full h-12 px-4 border border-border bg-background focus:outline-none focus:border-foreground transition-colors font-body text-sm" />
            </div>
            <div>
              <label className="block text-xs font-body font-bold tracking-widest uppercase mb-2 text-muted-foreground">Confirm New Password</label>
              <input type="password" required className="w-full h-12 px-4 border border-border bg-background focus:outline-none focus:border-foreground transition-colors font-body text-sm" />
            </div>
          </div>
          <button type="submit" className="btn-hero py-4 px-10 text-xs font-bold uppercase tracking-widest mt-4">Update Password</button>
        </form>
      </div>

      <div>
        <h2 className="font-display text-2xl font-bold mb-6 text-red-600 flex items-center gap-2">
          <AlertCircle size={24} /> Danger Zone
        </h2>
        <div className="p-8 border border-red-200 bg-red-50/30">
          <h3 className="font-bold text-lg mb-2">Delete Account</h3>
          <p className="text-sm font-body text-secondary-foreground/70 mb-8 leading-relaxed">
            Once you delete your account, there is no going back. Please be certain. All your data, order history, and saved items will be permanently removed.
          </p>
          <button onClick={handleDelete} className="bg-red-600 text-white font-bold tracking-widest uppercase text-xs px-8 py-4 hover:bg-red-700 transition-all duration-300 shadow-md active:scale-95">
            Delete My Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
