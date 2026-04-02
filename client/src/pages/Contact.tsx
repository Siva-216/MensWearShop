import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import Layout from "@/components/Layout";
import { toast } from "sonner";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you shortly.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 lg:px-8 py-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-center mb-4">Contact Us</h1>
        <p className="text-sm font-body text-muted-foreground text-center mb-12">We'd love to hear from you</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-body font-semibold tracking-[0.15em] uppercase block mb-2">Name</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-border bg-background px-4 py-3 text-sm font-body focus:outline-none focus:border-foreground transition-colors" />
            </div>
            <div>
              <label className="text-xs font-body font-semibold tracking-[0.15em] uppercase block mb-2">Email</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-border bg-background px-4 py-3 text-sm font-body focus:outline-none focus:border-foreground transition-colors" />
            </div>
            <div>
              <label className="text-xs font-body font-semibold tracking-[0.15em] uppercase block mb-2">Message</label>
              <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full border border-border bg-background px-4 py-3 text-sm font-body focus:outline-none focus:border-foreground transition-colors resize-none" />
            </div>
            <button type="submit" className="btn-hero w-full">Send Message</button>
          </form>

          {/* Info */}
          <div className="space-y-8 lg:pl-8">
            <div>
              <h3 className="font-display text-lg font-bold mb-4">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail size={16} className="mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-body font-medium">support@fashionworld.com</p>
                    <p className="text-xs font-body text-muted-foreground">We reply within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={16} className="mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-body font-medium">+1 5464 546 4564434</p>
                    <p className="text-xs font-body text-muted-foreground">Mon-Fri, 9am-10pm EST</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-display text-lg font-bold mb-4">Store Locator</h3>
              <div className="space-y-3">
                {[
                  { city: "Sivakasi", address: "520 Fifth Avenue, Manhattan" },
                  { city: "Madurai", address: "8500 Beverly Blvd, Suite 200" },
                  { city: "Chennai", address: "25 Savile Row, Mayfair" },
                ].map((store) => (
                  <div key={store.city} className="flex items-start gap-3">
                    <MapPin size={16} className="mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-body font-medium">{store.city}</p>
                      <p className="text-xs font-body text-muted-foreground">{store.address}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
