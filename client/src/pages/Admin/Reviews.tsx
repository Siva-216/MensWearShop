import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Trash2, 
  Star, 
  MessageSquare, 
  Filter, 
  MoreVertical, 
  User, 
  Package, 
  CheckCircle2, 
  XSquare, 
  ThumbsUp, 
  Flag, 
  Reply, 
  Heart, 
  Calendar, 
  ShieldCheck, 
  Verified,
  RefreshCw
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

const ReviewsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: () => api.reviews.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.reviews.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      toast.success("Review deleted successfully");
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      deleteMutation.mutate(id);
    }
  };
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">Product Reviews</h2>
          <p className="text-muted-foreground mt-1">Found {reviewsData?.length || 0} reviews from your customers.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="h-10 gap-2 border-dashed">
            <Filter size={18} />
            Filter by Rating
          </Button>
          <Button variant="outline" className="h-10 gap-2 border-dashed">
            <Reply size={18} />
            Bulk Reply
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         <Card className="border-none shadow-sm bg-card hover:bg-secondary/20 cursor-pointer">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-4 bg-amber-100 text-amber-600 rounded-2xl"><Star size={24} /></div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Average Rating</p>
                <p className="text-2xl font-black">4.8 <span className="text-sm font-medium text-muted-foreground">/ 5</span></p>
              </div>
            </CardContent>
         </Card>
         <Card className="border-none shadow-sm bg-card hover:bg-secondary/20 cursor-pointer">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-4 bg-blue-100 text-blue-600 rounded-2xl"><MessageSquare size={24} /></div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Total Comments</p>
                <p className="text-2xl font-black">1,420</p>
              </div>
            </CardContent>
         </Card>
         <Card className="border-none shadow-sm bg-card hover:bg-secondary/20 cursor-pointer">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-4 bg-green-100 text-green-600 rounded-2xl"><ThumbsUp size={24} /></div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Top Reviewers</p>
                <p className="text-2xl font-black">240</p>
              </div>
            </CardContent>
         </Card>
         <Card className="border-none shadow-sm bg-card hover:bg-secondary/20 cursor-pointer">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-4 bg-red-100 text-red-600 rounded-2xl"><Flag size={24} /></div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Reports</p>
                <p className="text-2xl font-black">2</p>
              </div>
            </CardContent>
         </Card>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          Array(2).fill(0).map((_, i) => (
            <Card key={i} className="h-48 animate-pulse bg-muted/20 border-none shadow-sm"></Card>
          ))
        ) : (reviewsData || []).map((review: any) => (
          <Card key={review.id} className="border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-card overflow-hidden group">
            <CardContent className="p-0 flex flex-col md:flex-row">
               <div className="md:w-64 bg-muted/20 border-r md:p-6 p-4 flex flex-col items-center justify-center text-center">
                  <Avatar className="h-16 w-16 mb-3 ring-4 ring-card hover:scale-110 transition-transform shadow-lg cursor-pointer">
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${review.userId}`} />
                    <AvatarFallback className="font-bold text-xl">{(review.userName || 'U').split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="font-bold text-foreground mb-1 flex items-center gap-1">
                    {review.userName}
                    <Verified size={14} className="text-blue-500" />
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-none font-bold uppercase text-[9px] tracking-widest px-2 py-0.5 rounded-full mb-3">
                    Approved
                  </Badge>
                  <div className="flex flex-col gap-1 w-full bg-card p-3 rounded-xl border border-muted-foreground/10 text-[11px] font-semibold text-muted-foreground">
                    <div className="flex items-center gap-2 capitalize truncate"><Package size={12} className="text-foreground/40 shrink-0"/> ID: {review.productId?.substring(0, 8)}</div>
                    <div className="flex items-center gap-2"><Calendar size={12} className="text-foreground/40 shrink-0"/> {review.createdAt ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(review.createdAt)) : 'N/A'}</div>
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
                      <Button variant="ghost" size="sm" className="h-8 gap-2 text-muted-foreground hover:text-green-600 hover:bg-green-50 text-xs font-bold uppercase tracking-widest">
                        <CheckCircle2 size={16} /> Approve
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 gap-2 text-muted-foreground hover:text-amber-600 hover:bg-amber-50 text-xs font-bold uppercase tracking-widest">
                        <Reply size={16} /> Reply
                      </Button>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 gap-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 text-xs font-bold uppercase tracking-widest rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDelete(review.id)}
                    >
                      <Trash2 size={16} /> Delete Review
                    </Button>
                  </div>
               </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center mt-12 mb-8">
        <Button variant="ghost" className="h-14 px-12 text-muted-foreground hover:text-foreground font-bold uppercase tracking-[0.2em] group border-b-2 border-transparent hover:border-foreground transition-all">
          Load More Experiences
        </Button>
      </div>
    </div>
  );
};

export default ReviewsPage;
