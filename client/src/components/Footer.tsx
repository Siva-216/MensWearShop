import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Send, MapPin, Phone, Mail } from "lucide-react";

const Footer = () => (
  <footer className="bg-foreground text-background border-t border-border mt-32">
    <div className="container mx-auto px-4 lg:px-8 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        
        {/* Brand & Newsletter */}
        <div className="lg:col-span-1">
          <h3 className="font-display text-2xl font-bold tracking-tighter mb-6 uppercase">Fashion World</h3>
          <p className="text-sm font-body text-muted-foreground leading-relaxed mb-8 max-w-xs">
            Redefining modern style through curated craftsmanship and sustainable practices since 2025.
          </p>
          <div className="space-y-4">
            <h4 className="text-[10px] font-body font-bold tracking-[0.2em] uppercase text-muted-foreground">Subscribe to our world</h4>
            <div className="flex border-b border-muted-foreground/30 focus-within:border-background transition-colors pb-2">
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                className="bg-transparent border-none outline-none text-xs font-body w-full tracking-widest lowercase focus:ring-0"
              />
              <button className="px-2 hover:opacity-50 transition-opacity">
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation - Shop */}
        <div>
          <h4 className="text-[10px] font-body font-bold tracking-[0.2em] uppercase mb-8 text-muted-foreground">The Shop</h4>
          <nav className="flex flex-col gap-4">
            {[
              { label: "New Arrivals", to: "/collection" },
              { label: "Our Story", to: "/about" },
              { label: "Best Sellers", to: "/collection" },
              { label: "Exclusives", to: "/collection" }
            ].map((link) => (
              <Link key={link.label} to={link.to} className="text-xs font-body font-medium tracking-widest uppercase hover:underline underline-offset-4 decoration-muted-foreground transition-all">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Navigation - Help */}
        <div>
          <h4 className="text-[10px] font-body font-bold tracking-[0.2em] uppercase mb-8 text-muted-foreground">Assistance</h4>
          <nav className="flex flex-col gap-4">
            {[
              { label: "Contact Us", to: "/contact" },
              { label: "Profile", to: "/profile" },
              { label: "Size Guide", to: "#" },
              { label: "Wishlist", to: "/wishlist" }
            ].map((link) => (
              <Link key={link.label} to={link.to} className="text-xs font-body font-medium tracking-widest uppercase hover:underline underline-offset-4 decoration-muted-foreground transition-all">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Contact Info & Social */}
        <div>
          <h4 className="text-[10px] font-body font-bold tracking-[0.2em] uppercase mb-8 text-muted-foreground">Our Locations</h4>
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <MapPin size={16} className="shrink-0 mt-0.5 text-muted-foreground" />
              <p className="text-[11px] font-body text-muted-foreground leading-relaxed uppercase tracking-wider">
                NYC FLAGSHIP STORE<br />
                42 EAST 12TH STREET, NY
              </p>
            </div>
            <div className="flex items-center gap-6 pt-4 border-t border-muted-foreground/10">
              <a href="#" className="hover:text-muted-foreground transition-colors"><Instagram size={18} /></a>
              <a href="#" className="hover:text-muted-foreground transition-colors"><Facebook size={18} /></a>
              <a href="#" className="hover:text-muted-foreground transition-colors"><Twitter size={18} /></a>
            </div>
          </div>
        </div>

      </div>

      <div className="border-t border-muted-foreground/10 mt-20 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-[10px] font-body font-medium tracking-[0.2em] uppercase text-muted-foreground">© 2026 FASHION WORLD. ALL RIGHTS RESERVED.</p>
        <div className="flex items-center gap-8 text-[10px] font-body font-medium tracking-[0.2em] uppercase text-muted-foreground">
          <Link to="#" className="hover:text-background transition-colors">Privacy Policy</Link>
          <Link to="#" className="hover:text-background transition-colors">Terms of Service</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;

