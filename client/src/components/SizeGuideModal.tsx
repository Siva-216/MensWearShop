import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Ruler } from "lucide-react";

const SizeGuideModal = () => (
  <Dialog>
    <DialogTrigger asChild>
      <button className="text-xs font-body font-medium tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 underline underline-offset-4">
        <Ruler size={14} />
        Size Guide
      </button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle className="font-display text-xl">Size Guide</DialogTitle>
      </DialogHeader>
      <div className="mt-4">
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="border-b border-border">
              <th className="py-3 px-2 text-left text-xs font-semibold tracking-[0.1em] uppercase text-muted-foreground">Size</th>
              <th className="py-3 px-2 text-left text-xs font-semibold tracking-[0.1em] uppercase text-muted-foreground">Chest (in)</th>
              <th className="py-3 px-2 text-left text-xs font-semibold tracking-[0.1em] uppercase text-muted-foreground">Waist (in)</th>
              <th className="py-3 px-2 text-left text-xs font-semibold tracking-[0.1em] uppercase text-muted-foreground">Length (in)</th>
            </tr>
          </thead>
          <tbody>
            {[
              { size: "S", chest: "36-38", waist: "30-32", length: "27" },
              { size: "M", chest: "38-40", waist: "32-34", length: "28" },
              { size: "L", chest: "40-42", waist: "34-36", length: "29" },
              { size: "XL", chest: "42-44", waist: "36-38", length: "30" },
            ].map((row) => (
              <tr key={row.size} className="border-b border-border/50">
                <td className="py-3 px-2 font-semibold">{row.size}</td>
                <td className="py-3 px-2 text-muted-foreground">{row.chest}</td>
                <td className="py-3 px-2 text-muted-foreground">{row.waist}</td>
                <td className="py-3 px-2 text-muted-foreground">{row.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-muted-foreground mt-4 font-body">Measurements are approximate. For the best fit, we recommend measuring your body and comparing with the chart above.</p>
      </div>
    </DialogContent>
  </Dialog>
);

export default SizeGuideModal;
