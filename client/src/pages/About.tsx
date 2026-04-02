import Layout from "@/components/Layout";
import { MapPin, Phone, Mail, Clock, ShieldCheck, Globe, Users } from "lucide-react";

const About = () => {
  const branches = [
    {
      city: "New York (Main)",
      address: "42 East 12th Street, Manhattan, NY 10003",
      phone: "+1 (555) 123-4567",
      email: "ny-store@fashionworld.com",
      hours: "10am - 9pm daily"
    },
    {
      city: "Los Angeles",
      address: "8522 Beverly Blvd, West Hollywood, CA 90048",
      phone: "+1 (555) 987-6543",
      email: "la-store@fashionworld.com",
      hours: "11am - 8pm daily"
    },
    {
      city: "London",
      address: "214 Oxford St, Marylebone, London W1B 3AL",
      phone: "+44 20 7123 4567",
      email: "london@fashionworld.com",
      hours: "9am - 10pm daily"
    }
  ];

  return (
    <Layout>
      <div className="pt-12 pb-24">
        {/* Hero Section */}
        <div className="container mx-auto px-4 lg:px-8 mb-20 text-center animate-fade-in">
          <h1 className="font-display text-4xl lg:text-6xl font-bold mb-6 tracking-tight">Our Story</h1>
          <p className="max-w-2xl mx-auto text-muted-foreground font-body leading-relaxed">
            Founded in 2025, Fashion World started with a simple vision: to make high-end fashion accessible to everyone without compromising on quality or sustainability.
          </p>
        </div>

        {/* Content & Values */}
        <div className="container mx-auto px-4 lg:px-8 mb-24 grid grid-cols-1 md:grid-cols-3 gap-12 animate-slide-up">
          <div className="bg-muted p-8 rounded-sm">
            <div className="w-12 h-12 bg-foreground text-background flex items-center justify-center rounded-full mb-6">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-display text-xl font-bold mb-4">Quality First</h3>
            <p className="text-sm font-body text-muted-foreground leading-loose">
              Every piece in our collection is hand-picked and verified for durability, comfort, and premium materials.
            </p>
          </div>
          <div className="bg-muted p-8 rounded-sm">
            <div className="w-12 h-12 bg-foreground text-background flex items-center justify-center rounded-full mb-6">
              <Globe size={24} />
            </div>
            <h3 className="font-display text-xl font-bold mb-4">Sustainability</h3>
            <p className="text-sm font-body text-muted-foreground leading-loose">
              We collaborate with ethical factories and focus on eco-friendly packaging to minimize our carbon footprint.
            </p>
          </div>
          <div className="bg-muted p-8 rounded-sm">
            <div className="w-12 h-12 bg-foreground text-background flex items-center justify-center rounded-full mb-6">
              <Users size={24} />
            </div>
            <h3 className="font-display text-xl font-bold mb-4">Community</h3>
            <p className="text-sm font-body text-muted-foreground leading-loose">
              We believe fashion is a language that brings people together from all walks of life globally.
            </p>
          </div>
        </div>

        {/* Branch Locations */}
        <div className="bg-foreground text-background py-24 mb-24 lg:mx-8">
          <div className="container mx-auto px-4 lg:px-8 text-center mb-16">
            <h2 className="font-display text-3xl font-bold uppercase tracking-[0.2em]">Our Global Presence</h2>
            <p className="text-muted-foreground mt-4 font-body tracking-widest text-xs uppercase">Visit our flagship stores worldwide</p>
          </div>
          
          <div className="container mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            {branches.map((branch, idx) => (
              <div key={idx} className="border border-white/10 p-8 hover:bg-white/5 transition-all group">
                <h3 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
                  <MapPin size={20} className="text-muted-foreground group-hover:text-white transition-colors" />
                  {branch.city}
                </h3>
                <div className="space-y-4 text-sm font-body text-muted-foreground leading-relaxed">
                  <p>{branch.address}</p>
                  <div className="flex items-center gap-2 pt-2">
                    <Phone size={14} /> {branch.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={14} /> {branch.email}
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-white/5 mt-4 italic text-[10px] tracking-widest">
                    <Clock size={12} /> {branch.hours}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Map Wrapper */}
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <h2 className="font-display text-3xl font-bold tracking-tight">Locate Us</h2>
              <p className="text-muted-foreground font-body leading-relaxed">
                Our main flagship store is located in the heart of NYC. Come by to experience our full collection and enjoy personalized styling sessions with our fashion experts.
              </p>
              <div className="space-y-4 pt-8 border-t border-border">
                <div>
                  <p className="text-[10px] font-body font-bold text-muted-foreground uppercase tracking-widest mb-1">Flagship Address</p>
                  <p className="font-body font-bold text-sm flex items-center gap-3"><MapPin size={16} /> 42 East 12th Street, NY, 10003</p>
                </div>
                <div>
                  <p className="text-[10px] font-body font-bold text-muted-foreground uppercase tracking-widest mb-1">Customer Care</p>
                  <p className="font-body font-bold text-sm flex items-center gap-3"><Phone size={16} /> +1 (555) 123-4567</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 w-full h-[450px] bg-muted grayscale hover:grayscale-0 transition-all duration-1000 rounded-sm overflow-hidden shadow-2xl border border-border">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.252808218!2d-74.119763739957!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1709425420315!5m2!1sen!2sus" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Fashion World NYC Location"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
