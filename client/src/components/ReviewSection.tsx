import { useState } from "react";
import { Star, User, MessageSquare, Edit2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import ReviewModal from "@/components/ReviewModal";

interface ReviewSectionProps {
  productId: string;
}

const ReviewSection = ({ productId, productName, productImage }: ReviewSectionProps & { productName?: string, productImage?: string }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id || user?._id;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<any | null>(null);

  const [sortBy, setSortBy] = useState<"recent" | "highest" | "lowest">("recent");

  const { data: reviews, isLoading, refetch } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => api.reviews.getByProduct(productId),
  });

  if (isLoading) {
    return <div className="py-10 text-center animate-pulse">Loading reviews...</div>;
  }

  const approvedReviews = (reviews || []).filter((r: any) => r.status === 'Approved' || !r.status);

  if (approvedReviews.length === 0) {
    return null;
  }

  // Sort reviews: current user's review first, then by selected sortBy
  const sortedReviews = [...approvedReviews].sort((a, b) => {
    const aUserId = a.userId || a.user?.id || a.user?._id;
    const bUserId = b.userId || b.user?.id || b.user?._id;
    
    if (aUserId === userId) return -1;
    if (bUserId === userId) return 1;

    if (sortBy === "highest") return b.rating - a.rating;
    if (sortBy === "lowest") return a.rating - b.rating;
    
    // Default: recent
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();
    return dateB - dateA;
  });

  const averageRating = approvedReviews.reduce((acc: number, rev: any) => acc + rev.rating, 0) / approvedReviews.length;

  return (
    <section className="mt-20 border-t border-border pt-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h2 className="font-display text-2xl font-bold mb-2">Customer Reviews</h2>
          <div className="flex items-center gap-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={18}
                  className={star <= Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}
                />
              ))}
            </div>
            <p className="text-sm font-body font-medium">
              {averageRating.toFixed(1)} out of 5 based on {reviews?.length || 0} reviews
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-body font-bold tracking-widest uppercase text-muted-foreground">Sort By</span>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-background border border-border text-[11px] font-body font-bold uppercase tracking-wider px-3 py-2 focus:outline-none focus:border-foreground transition-colors"
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </div>

      <div className="space-y-10">
        {sortedReviews.map((review: any) => {
          const isOwnReview = (review.userId || review.user?.id || review.user?._id) === userId;
          
          return (
            <div key={review.id} className={`pb-10 border-b border-border last:border-0 animate-fade-in ${isOwnReview ? 'bg-muted/10 -mx-4 px-4 pt-4' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <User size={20} className="text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-body font-bold text-sm">{review.userName || "Verified Customer"}</p>
                      {isOwnReview && <span className="text-[9px] bg-foreground text-background px-1.5 py-0.5 font-bold uppercase tracking-wider">Your Review</span>}
                    </div>
                    <p className="text-[10px] font-body text-muted-foreground uppercase tracking-wider">
                      {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "Recently"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        className={star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted/30"}
                      />
                    ))}
                  </div>
                  {isOwnReview && (
                    <button 
                      onClick={() => {
                        setEditingReview(review);
                        setIsModalOpen(true);
                      }}
                      className="flex items-center gap-1 text-[10px] font-bold text-foreground hover:underline underline-offset-4"
                    >
                      <Edit2 size={12} /> Edit
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm font-body text-muted-foreground leading-relaxed">
                "{review.comment}"
              </p>
              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 mt-4">
                  {review.images.map((img: string, i: number) => (
                    <img key={i} src={img} alt="Review" className="w-20 h-20 object-cover border border-border" />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {editingReview && (
        <ReviewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={{
            id: productId,
            name: productName || "Product",
            image: productImage || ""
          }}
          orderId={editingReview.orderId}
          userId={userId!}
          userName={user?.fullName || user?.name || "User"}
          initialData={{
            id: editingReview.id,
            rating: editingReview.rating,
            comment: editingReview.comment
          }}
          onSuccess={() => {
            refetch();
            queryClient.invalidateQueries({ queryKey: ["product", productId] });
            setIsModalOpen(false);
          }}
        />
      )}
    </section>
  );
};

export default ReviewSection;
