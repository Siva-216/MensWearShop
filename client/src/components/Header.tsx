import { Link } from "react-router-dom";
import { ShoppingBag, Heart, User, Menu, X, Search } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const Header = () => {
  const { totalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { user, isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = user?.role === 'admin';
  const isStaff = user?.role === 'staff';
  const hasAdminPanelAccess = isAdmin || isStaff;

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

  return (
    <>
      <div className="bg-foreground text-background py-2 text-center text-[10px] font-body font-bold tracking-[0.2em] uppercase">
        Free Shipping on all orders over ₹2500 · Shop New Arrivals
      </div>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Mobile menu */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 -ml-2 text-foreground hover:text-muted-foreground transition-colors">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo */}
          <Link to="/" className="font-display text-xl lg:text-2xl font-bold tracking-wider uppercase">
            Fashion World
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="text-sm font-body font-medium tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground transition-colors">
                {link.label}
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
                        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-foreground text-background text-[10px] font-body font-bold rounded-full flex items-center justify-center">
                          {wishlistItems.length}
                        </span>
                      )}
                    </Link>
                    <Link to="/cart" className="relative p-2 text-foreground hover:text-muted-foreground transition-colors">
                      <ShoppingBag size={20} />
                      {totalItems > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-foreground text-background text-[10px] font-body font-bold rounded-full flex items-center justify-center">
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
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-foreground text-background text-[10px] font-body font-bold rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
                <Link to="/login" className="text-sm font-body font-bold tracking-widest uppercase hover:underline underline-offset-4 hidden lg:block">
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
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className="text-sm font-body font-medium tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground transition-colors py-2">
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <Link to="/profile" onClick={() => setMobileOpen(false)} className="text-sm font-body font-medium tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground transition-colors py-2">
                Profile
              </Link>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm font-body font-bold tracking-[0.1em] uppercase text-foreground py-2 border-t border-border mt-2">
                Login / Signup
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
    </>
  );
};

export default Header;
