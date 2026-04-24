import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Trash2, 
  Star, 
  MessageSquare, 
  Filter, 
  Package, 
  CheckCircle2, 
  ThumbsUp, 
  Flag, 
  Reply, 
  Calendar, 
  Verified,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

const ReviewsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

  const { data: reviewsData, isLoading, isError, error } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: () => api.reviews.getAll(),
  });

  // Handle query error
  React.useEffect(() => {
    if (isError) {
      toast.error(`Failed to fetch reviews: ${(error as Error)?.message || 'Unknown error'}`);
    }
  }, [isError, error]);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.reviews.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      toast.success("Review deleted successfully");
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => api.reviews.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      toast.success("Review updated successfully");
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleStatus = (review: any) => {
    const newStatus = review.status === 'Approved' ? 'Hidden' : 'Approved';
    updateMutation.mutate({ 
      id: review.id, 
      data: { ...review, status: newStatus } 
    });
  };

  // Safe data handling
  const safeReviews = Array.isArray(reviewsData) ? reviewsData : [];

  const filteredReviews = safeReviews.filter((review: any) => {
    const matchesSearch = 
      (review.userName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (review.comment?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (review.productId?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRating = ratingFilter === null || review.rating === ratingFilter;
    
    return matchesSearch && matchesRating;
  });

  // Calculate Stats
  const totalReviews = safeReviews.length;
  const avgRating = totalReviews > 0 
    ? (safeReviews.reduce((acc: number, r: any) => acc + (r.rating || 0), 0) / totalReviews).toFixed(1) 
    : "0.0";
  const pendingCount = safeReviews.filter((r: any) => r.status === 'Pending' || !r.status).length;
  const highRatedCount = safeReviews.filter((r: any) => r.rating >= 4).length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">Product Reviews</h2>
          <p className="text-muted-foreground mt-1">
            Found {filteredReviews.length} reviews {searchTerm ? `matching "${searchTerm}"` : ''} 
            {ratingFilter ? `with ${ratingFilter} stars` : ''}.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input 
              placeholder="Search reviews..." 
              className="pl-9 h-10 bg-card border-none shadow-sm focus-visible:ring-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="h-10 px-3 bg-card border-none shadow-sm rounded-md text-sm focus:ring-1 outline-none"
            value={ratingFilter || ''}
            onChange={(e) => setRatingFilter(e.target.value ? parseInt(e.target.value) : null)}
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         <Card className="border-none shadow-sm bg-card hover:bg-secondary/20 transition-all">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-4 bg-amber-100 text-amber-600 rounded-2xl"><Star size={24} /></div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Average Rating</p>
                <p className="text-2xl font-black">{avgRating} <span className="text-sm font-medium text-muted-foreground">/ 5</span></p>
              </div>
            </CardContent>
         </Card>
         <Card className="border-none shadow-sm bg-card hover:bg-secondary/20 transition-all">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-4 bg-blue-100 text-blue-600 rounded-2xl"><MessageSquare size={24} /></div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Total Reviews</p>
                <p className="text-2xl font-black">{totalReviews}</p>
              </div>
            </CardContent>
         </Card>
         <Card className="border-none shadow-sm bg-card hover:bg-secondary/20 transition-all">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-4 bg-green-100 text-green-600 rounded-2xl"><ThumbsUp size={24} /></div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">High Rated</p>
                <p className="text-2xl font-black">{highRatedCount}</p>
              </div>
            </CardContent>
         </Card>
         <Card className="border-none shadow-sm bg-card hover:bg-secondary/20 transition-all">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-4 bg-red-100 text-red-600 rounded-2xl"><AlertCircle size={24} /></div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Needs Moderation</p>
                <p className="text-2xl font-black">{pendingCount}</p>
              </div>
            </CardContent>
         </Card>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <Card key={i} className="h-48 animate-pulse bg-muted/20 border-none shadow-sm"></Card>
          ))
        ) : filteredReviews.length > 0 ? (
          filteredReviews.map((review: any) => (
            <Card key={review.id} className="border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-card overflow-hidden group">
              <CardContent className="p-0 flex flex-col md:flex-row">
                 <div className="md:w-64 bg-muted/20 border-r md:p-6 p-4 flex flex-col items-center justify-center text-center">
                    <Avatar className="h-16 w-16 mb-3 ring-4 ring-card hover:scale-110 transition-transform shadow-lg cursor-pointer">
                      <AvatarImage src={`https://i.pravatar.cc/150?u=${review.userId}`} />
                      <AvatarFallback className="font-bold text-xl">{String(review.userName || 'U').split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="font-bold text-foreground mb-1 flex items-center gap-1">
                      {review.userName}
                      <Verified size={14} className="text-blue-500" />
                    </div>
                    <Badge variant="outline" className={`${
                      review.status === 'Approved' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    } border-none font-bold uppercase text-[9px] tracking-widest px-2 py-0.5 rounded-full mb-3`}>
                      {review.status || 'Pending'}
                    </Badge>
                    <div className="flex flex-col gap-1 w-full bg-card p-3 rounded-xl border border-muted-foreground/10 text-[11px] font-semibold text-muted-foreground">
                      <div className="flex items-center gap-2 capitalize truncate"><Package size={12} className="text-foreground/40 shrink-0"/> ID: {review.productId?.substring(0, 8) || 'N/A'}</div>
                      <div className="flex items-center gap-2"><Calendar size={12} className="text-foreground/40 shrink-0"/> {(() => {
                        if (!review.createdAt) return 'N/A';
                        const date = new Date(review.createdAt);
                        if (isNaN(date.getTime())) return 'Invalid Date';
                        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
                      })()}</div>
                    </div>
                 </div>
                 
                 <div className="flex-1 p-6 flex flex-col relative">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={18} className={`${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />
                      ))}
                      <span className="ml-3 font-black text-xl text-foreground/80">{review.rating}.0</span>
                    </div>
                    <p className="text-foreground/80 text-lg leading-relaxed font-medium mb-8">
                      "{review.comment}"
                    </p>
                    
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-muted/50">
                      <div className="flex gap-4">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`h-8 gap-2 ${review.status === 'Approved' ? 'text-amber-600 hover:bg-amber-50' : 'text-green-600 hover:bg-green-50'} text-xs font-bold uppercase tracking-widest`}
                          onClick={() => handleToggleStatus(review)}
                          disabled={updateMutation.isPending}
                        >
                          {review.status === 'Approved' ? <><EyeOff size={16} /> Hide</> : <><CheckCircle2 size={16} /> Approve</>}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 gap-2 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 text-xs font-bold uppercase tracking-widest">
                          <Reply size={16} /> Reply
                        </Button>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 gap-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 text-xs font-bold uppercase tracking-widest rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDelete(review.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 size={16} /> Delete Review
                      </Button>
                    </div>
                 </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="py-20 text-center bg-card rounded-xl border border-dashed border-border">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No reviews found</p>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;
