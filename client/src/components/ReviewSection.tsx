import { useState } from "react";
import { Star, User, MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface ReviewSectionProps {
  productId: string;
}

const ReviewSection = ({ productId }: ReviewSectionProps) => {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => api.reviews.getByProduct(productId),
  });

  if (isLoading) {
    return <div className="py-10 text-center animate-pulse">Loading reviews...</div>;
  }

  const approvedReviews = (reviews || []).filter((r: any) => r.status === 'Approved' || !r.status);

  const averageRating = approvedReviews.length > 0
    ? approvedReviews.reduce((acc: number, rev: any) => acc + rev.rating, 0) / approvedReviews.length
    : 0;

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
      </div>

      <div className="space-y-10">
        {approvedReviews.length > 0 ? (
          approvedReviews.map((review: any) => (
            <div key={review.id} className="pb-10 border-b border-border last:border-0 animate-fade-in">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <User size={20} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-body font-bold text-sm">{review.userName || "Verified Customer"}</p>
                    <p className="text-[10px] font-body text-muted-foreground uppercase tracking-wider">
                      {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "Recently"}
                    </p>
                  </div>
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      className={star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted/30"}
                    />
                  ))}
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
          ))
        ) : (
          <div className="text-center py-20 bg-muted/30 border border-dashed border-border flex flex-col items-center gap-4">
            <MessageSquare size={40} className="text-muted-foreground/30" />
            <div className="space-y-1">
              <p className="text-sm font-body font-bold">No reviews yet</p>
              <p className="text-xs font-body text-muted-foreground">Be the first to review this product after your purchase!</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewSection;
