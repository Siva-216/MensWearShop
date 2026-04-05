import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Package,
  PlusCircle,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Box,
  Tag,
  DollarSign
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const ProductsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => api.products.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.products.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success("Product deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete product");
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(id);
    }
  };
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">Products Management</h2>
          <p className="text-muted-foreground mt-1">Total items in inventory: 1,429</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10 gap-2 border-dashed">
            <Upload size={18} />
            Import
          </Button>
          <Button className="h-10 gap-2 shadow-lg shadow-primary/20 bg-foreground text-background hover:bg-muted-foreground">
            <PlusCircle size={18} />
            Add New Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm bg-card hover:bg-secondary/50 transition-colors cursor-pointer">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Box size={20} /></div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Units</p>
              <p className="text-xl font-bold">12,450</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-card hover:bg-secondary/50 transition-colors cursor-pointer">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-xl"><Tag size={20} /></div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Categories</p>
              <p className="text-xl font-bold">24</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-card hover:bg-secondary/50 transition-colors cursor-pointer">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-xl"><RefreshCw size={20} /></div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
              <p className="text-xl font-bold">12 Items</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-card hover:bg-secondary/50 transition-colors cursor-pointer">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-xl"><DollarSign size={20} /></div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Inventory Value</p>
              <p className="text-xl font-bold">$1.2M</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/10 border-b pb-6 pt-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                placeholder="Search products..." 
                className="pl-10 bg-card border-muted focus-visible:ring-1 focus-visible:ring-primary h-10 rounded-lg"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
              <Button variant="outline" size="sm" className="h-9 gap-2"><Filter size={16} /> Filter</Button>
              <Button variant="outline" size="sm" className="h-9 gap-2"><Download size={16} /> Export CSV</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-muted/30">
                <TableHead className="w-[80px] pl-6">Image</TableHead>
                <TableHead className="font-bold text-foreground">Product Name</TableHead>
                <TableHead className="font-bold text-foreground">Category</TableHead>
                <TableHead className="font-bold text-foreground">Price</TableHead>
                <TableHead className="font-bold text-foreground">Stock</TableHead>
                <TableHead className="font-bold text-foreground">Status</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground animate-pulse">
                      <RefreshCw className="animate-spin" size={16} />
                      Loading products...
                    </div>
                  </TableCell>
                </TableRow>
              ) : (productsData || []).map((product: any) => (
                <TableRow key={product.id} className="group border-muted/20 hover:bg-muted/5 transition-colors">
                  <TableCell className="pl-6">
                    <div className="h-12 w-12 rounded-lg overflow-hidden border bg-muted group-hover:scale-105 transition-transform">
                      <img 
                        src={product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/200x200?text=No+Image'} 
                        alt={product.name} 
                        className="h-full w-full object-cover" 
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-foreground">{product.name}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold">PID-{product.id?.substring(0, 8)}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-medium bg-muted/30 border-transparent text-muted-foreground capitalize">
                      {product.categoryName || 'Uncategorized'}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold text-foreground">${product.price?.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1.5 w-32">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>{product.stock} units</span>
                        <span className="text-muted-foreground">{Math.min(100, (product.stock / 150) * 100).toFixed(0)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            product.stock === 0 ? 'bg-red-500 w-0' :
                            product.stock < 15 ? 'bg-amber-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(100, (product.stock / 150) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={`${
                        product.stock > 15 ? 'bg-green-100 text-green-700' :
                        product.stock > 0 ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      } border-none font-bold px-2 py-0.5 rounded text-[10px] uppercase`}
                    >
                      {product.stock > 15 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" title="Update Stock" className="h-8 w-8 rounded-full hover:bg-blue-50 text-blue-600">
                        <RefreshCw size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" title="Edit" className="h-8 w-8 rounded-full hover:bg-amber-50 text-amber-600">
                        <Edit2 size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        title="Delete" 
                        className="h-8 w-8 rounded-full hover:bg-red-50 text-red-600"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-center p-4">
        <Button variant="outline" className="w-full max-w-sm rounded-xl py-6 text-muted-foreground group">
          <Plus className="mr-2 group-hover:rotate-90 transition-transform" />
          Load More Products
        </Button>
      </div>
    </div>
  );
};

export default ProductsPage;
