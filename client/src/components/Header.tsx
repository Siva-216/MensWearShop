import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Heart, User, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const Header = () => {
  const { totalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { user, isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isAdmin = user?.role === 'admin';
  const isStaff = user?.role === 'staff';

  const navLinks = isAdmin
    ? [
      { to: "/admin", label: "Admin Dashboard" },
      { to: "/admin/products", label: "Products" },
      { to: "/admin/orders", label: "Orders" },
      { to: "/admin/users", label: "Users" },
    ]
    : [
      { to: "/", label: "Home" },
      { to: "/collection", label: "Shop" },
      { to: "/about", label: "About" },
      { to: "/contact", label: "Contact" },
      ...(isStaff ? [{ to: "/admin", label: "Admin Panel" }] : []),
    ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname !== "/") return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full flex flex-col shadow-sm">
      {/* Announcement Bar */}
      <div className="bg-foreground text-background py-2 text-center text-[10px] md:text-[11px] font-body font-bold tracking-[0.2em] uppercase">
        Free Shipping on all orders over ₹2500 · Shop New Arrivals
      </div>

      {/* Main Navbar */}
      <div className="bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile menu */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 -ml-2 text-foreground hover:text-muted-foreground transition-colors">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Logo */}
            <Link to="/" className="font-display text-lg md:text-xl lg:text-2xl font-bold tracking-wider uppercase truncate max-w-[150px] md:max-w-none">
              Fashion World
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative text-[13px] font-body font-bold tracking-[0.15em] uppercase transition-all duration-300 py-2 ${isActive(link.to) ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {link.label}
                  {isActive(link.to) && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-foreground animate-fade-in"></span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3 lg:gap-4">
              {isAuthenticated ? (
                <>
                  {!isAdmin && (
                    <>
                      <Link to="/wishlist" className="relative p-2 text-foreground hover:text-muted-foreground transition-colors">
                        <Heart size={20} />
                        {wishlistItems.length > 0 && (
                          <span className="absolute top-1 right-1 w-4 h-4 bg-foreground text-background text-[10px] font-body font-bold rounded-full flex items-center justify-center">
                            {wishlistItems.length}
                          </span>
                        )}
                      </Link>
                      <Link to="/cart" className="relative p-2 text-foreground hover:text-muted-foreground transition-colors">
                        <ShoppingBag size={20} />
                        {totalItems > 0 && (
                          <span className="absolute top-1 right-1 w-4 h-4 bg-foreground text-background text-[10px] font-body font-bold rounded-full flex items-center justify-center">
                            {totalItems}
                          </span>
                        )}
                      </Link>
                    </>
                  )}
                  <Link to="/profile" className="p-2 text-foreground hover:text-muted-foreground transition-colors">
                    <User size={20} />
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/cart" className="relative p-2 text-foreground hover:text-muted-foreground transition-colors">
                    <ShoppingBag size={20} />
                    {totalItems > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-foreground text-background text-[10px] font-body font-bold rounded-full flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                  <Link to="/login" className="text-[11px] font-body font-bold tracking-widest uppercase hover:underline underline-offset-4 hidden lg:block">
                    Login / Signup
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-background animate-slide-down">
            <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`text-[14px] font-body font-medium tracking-[0.1em] uppercase py-3 flex items-center justify-between ${isActive(link.to) ? "text-foreground font-bold" : "text-muted-foreground"
                    }`}
                >
                  {link.label}
                  {isActive(link.to) && <span className="w-1.5 h-1.5 bg-foreground rounded-full"></span>}
                </Link>
              ))}
              {isAuthenticated ? (
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="text-[14px] font-body font-medium tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground transition-colors py-3">
                  Profile
                </Link>
              ) : (
                <Link to="/login" onClick={() => setMobileOpen(false)} className="text-[14px] font-body font-bold tracking-[0.1em] uppercase text-foreground py-3 border-t border-border mt-3">
                  Login / Signup
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
