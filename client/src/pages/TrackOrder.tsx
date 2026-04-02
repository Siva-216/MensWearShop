import { useState } from "react";
import { Package, Truck, CheckCircle2, Clock, Search } from "lucide-react";
import Layout from "@/components/Layout";

const steps = [
  { label: "Order Placed", icon: Package, description: "Your order has been confirmed" },
  { label: "Processing", icon: Clock, description: "Preparing your items" },
  { label: "Shipped", icon: Truck, description: "On its way to you" },
  { label: "Delivered", icon: CheckCircle2, description: "Enjoy your purchase!" },
];

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [currentStep, setCurrentStep] = useState<number | null>(null);

  const handleTrack = () => {
    if (/^\d{6}$/.test(orderId)) {
      setCurrentStep(2); // "Shipped" status
    } else {
      setCurrentStep(null);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 lg:px-8 py-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-center mb-4">Track Your Order</h1>
        <p className="text-sm font-body text-muted-foreground text-center mb-10">Enter your 6-digit order ID to check status</p>

        <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 mb-12 sm:mb-16">
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="e.g. 123456"
            maxLength={6}
            className="w-full sm:flex-1 border border-border bg-background px-4 py-3 text-sm font-body focus:outline-none focus:border-foreground transition-colors"
          />
          <button onClick={handleTrack} className="btn-hero flex items-center justify-center gap-2 px-6 py-3 sm:py-4">
            <Search size={14} /> Track Order
          </button>
        </div>

        {currentStep !== null && (
          <div className="max-w-lg mx-auto animate-fade-in px-2 sm:px-0">
            <div className="bg-muted p-6 lg:p-8 mb-8 text-center rounded-lg">
              <p className="text-[10px] sm:text-xs font-body font-semibold tracking-[0.15em] uppercase text-muted-foreground">Order ID</p>
              <p className="font-display text-lg sm:text-xl font-bold mt-1">#{orderId}</p>
            </div>
            <div className="relative ml-4 sm:ml-8 pl-8 border-l border-border space-y-8 pb-4">
              {steps.map((step, i) => {
                const active = i <= currentStep;
                const Icon = step.icon;
                return (
                  <div key={step.label} className="relative flex items-start gap-4">
                    <div className={`absolute -left-[49px] w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors z-10 ${active ? "bg-foreground border-foreground text-background" : "bg-background border-border text-muted-foreground"}`}>
                      <Icon size={14} />
                    </div>
                    <div>
                      <p className={`text-sm font-body font-semibold ${active ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</p>
                      <p className="text-xs font-body text-muted-foreground mt-1 max-w-[200px] sm:max-w-none">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TrackOrder;
