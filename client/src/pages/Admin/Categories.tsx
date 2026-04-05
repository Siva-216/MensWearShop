import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Layers,
  LayoutGrid,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const CategoriesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => api.categories.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.categories.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success("Category deleted successfully");
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteMutation.mutate(id);
    }
  };
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground mt-1">Organize your product catalog.</p>
        </div>
        <Button className="h-10 gap-2 bg-foreground text-background hover:bg-muted-foreground shadow-lg shadow-black/5">
          <Plus size={18} />
          Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <Card key={i} className="h-40 animate-pulse bg-muted/20 border-none shadow-sm"></Card>
          ))
        ) : (categoriesData || []).map((category: any) => (
          <Card key={category.id} className="group border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden bg-card">
            <CardContent className="p-0 flex h-40">
              <div className="w-1/3 relative overflow-hidden">
                <img src={category.image || 'https://placehold.co/200x200?text=Category'} alt={category.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
              </div>
              <div className="w-2/3 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-lg">{category.name}</h3>
                    <Badge variant="secondary" className="bg-green-50 text-green-700 border-none">
                      Active
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">/{category.slug || category.name?.toLowerCase().replace(/ /g, '-')}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-muted-foreground">
                    <span className="text-foreground text-sm mr-1">{category.itemsCount || 0}</span> Items
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted">
                      <Edit2 size={14} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full hover:bg-red-50 hover:text-red-600"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        <Card className="border-2 border-dashed border-muted bg-transparent hover:bg-muted/10 transition-colors flex flex-col items-center justify-center p-8 group cursor-pointer h-40">
          <div className="p-4 rounded-full bg-muted group-hover:bg-foreground group-hover:text-background transition-all duration-300 group-hover:scale-110">
            <Plus size={24} />
          </div>
          <p className="mt-4 font-bold text-muted-foreground">Add New Collection</p>
        </Card>
      </div>

      <div className="mt-12">
        <h3 className="text-xl font-bold mb-4">Hierarchical View</h3>
        <Card className="border-none shadow-sm">
          <CardContent className="p-0">
             <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <LayoutGrid size={16} />
                  Main Categories
                </div>
                <div className="text-xs font-medium text-muted-foreground">Showing 10 hierarchies</div>
             </div>
             <div className="p-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center font-bold text-lg">M</div>
                      <div>
                        <div className="font-semibold">Main Collection {i}</div>
                        <div className="text-xs text-muted-foreground">5 sub-categories • 248 products</div>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0" />
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CategoriesPage;
