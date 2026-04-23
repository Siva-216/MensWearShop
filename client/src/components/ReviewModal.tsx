import { useState } from "react";
import { Star, X, Camera, Send, Loader2, ShoppingBag } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    image: string;
  };
  orderId: string;
  userId: string;
  userName: string;
  onSuccess: () => void;
}

const ReviewModal = ({ isOpen, onClose, product, orderId, userId, userName, onSuccess }: ReviewModalProps) => {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (comment.length < 5) {
      toast.error("Please write a bit more in your comment");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.reviews.create({
        productId: product.id,
        orderId: orderId,
        userId: userId,
        userName: userName,
        rating: rating,
        comment: comment,
        createdAt: new Date().toISOString()
      });
      toast.success("Thank you! Your review has been submitted.");
      
      // Invalidate queries to refresh data across the app
      queryClient.invalidateQueries({ queryKey: ["reviews", product.id] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", product.id] });

      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-card border border-border shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="absolute top-0 left-0 w-full h-1 bg-foreground" />
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={20} />
        </button>

        <form onSubmit={handleSubmit} className="p-8">
          <h2 className="font-display text-2xl font-bold mb-6">Write a Review</h2>
          
          <div className="flex gap-4 mb-8 p-3 bg-muted/30 border border-border/50">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-16 h-20 object-cover bg-muted" />
            ) : (
              <div className="w-16 h-20 bg-muted flex items-center justify-center">
                <ShoppingBag size={20} className="text-muted-foreground/30" />
              </div>
            )}
            <div>
              <p className="text-[10px] font-body font-bold tracking-widest uppercase text-muted-foreground mb-1">Product</p>
              <p className="font-body font-bold text-sm leading-tight">{product.name || "Product"}</p>
            </div>
          </div>

          <div className="mb-8 text-center">
            <p className="text-xs font-body font-bold tracking-widest uppercase text-muted-foreground mb-4">Your Rating</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="transition-all duration-200 hover:scale-125"
                >
                  <Star
                    size={32}
                    className={`${
                      star <= (hoverRating || rating) 
                        ? "fill-yellow-400 text-yellow-400" 
                        : "text-muted-foreground/30"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-xs font-body font-bold tracking-widest uppercase mb-2 text-muted-foreground">Your Thoughts</label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like or dislike? How was the fit?"
              className="w-full px-4 py-3 border border-border bg-background focus:outline-none focus:border-foreground transition-all duration-300 font-body text-sm resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-hero py-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Send size={16} />
            )}
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
