import React, { useState, useMemo } from 'react';
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
  RefreshCw,
  FolderTree,
  MoreVertical
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { CategoryModal } from './CategoryModal';

const CategoriesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => api.categories.getAll(),
  });

  // Fetch products to count items per category dynamically
  const { data: productsData } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => api.products.getAll(),
  });

  // Pre-calculate product counts per category for performance
  const categoryStats = useMemo(() => {
    if (!productsData || !categoriesData) return {};
    const stats: Record<string, number> = {};
    
    categoriesData.forEach((cat: any) => {
      stats[cat.id] = productsData.filter((p: any) => 
        p.categoryId === cat.id || 
        p.categoryName === cat.name || 
        p.category === cat.name
      ).length;
    });
    
    return stats;
  }, [productsData, categoriesData]);

  const getProductCount = (categoryId: string) => categoryStats[categoryId] || 0;

  const createMutation = useMutation({
    mutationFn: (data: any) => api.categories.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success("Category created successfully");
      setIsModalOpen(false);
    },
    onError: (error) => {
      toast.error("Failed to create category");
      console.error(error);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => api.categories.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success("Category updated successfully");
      setIsModalOpen(false);
    },
    onError: (error) => {
      toast.error("Failed to update category");
      console.error(error);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.categories.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success("Category deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete category. Check if it has items.");
      console.error(error);
    }
  });

  const handleEdit = (category: any) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteMutation.mutate(id);
    }
  };

  const onModalSubmit = (data: any) => {
    if (selectedCategory) {
      updateMutation.mutate({ id: selectedCategory.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const filteredCategories = (categoriesData || []).filter((c: any) => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.slug?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getParentName = (parentId: string) => {
    if (!parentId) return "None";
    const parent = categoriesData?.find((c: any) => c.id === parentId);
    return parent ? parent.name : "Unknown";
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground mt-1">Organize your shop structure and product flow.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="h-10 gap-2 border-primary/20 hover:bg-primary/5"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-categories'] })}
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </Button>
          <Button 
            className="h-10 gap-2 bg-foreground text-background hover:bg-muted-foreground shadow-lg shadow-black/5"
            onClick={handleAdd}
          >
            <Plus size={18} />
            Add Category
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <Input 
          placeholder="Search categories by name or slug..." 
          className="pl-10 h-11 bg-background/50 border-muted-foreground/20 focus-visible:ring-primary/20 transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <Card key={i} className="h-40 animate-pulse bg-muted/20 border-none shadow-sm"></Card>
          ))
        ) : filteredCategories.map((category: any) => (
          <Card key={category.id} className="group border-none shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden bg-card/80 backdrop-blur-sm">
            <CardContent className="p-0 flex h-40">
              <div className="w-1/3 relative overflow-hidden">
                <img 
                  src={(category.images && category.images[0]) || `https://source.unsplash.com/featured/?${category.name},fashion`} 
                  alt={category.name} 
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  onError={(ev: any) => {
                    ev.target.src = 'https://placehold.co/200x200?text=Fashion';
                  }}
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                {category.parentId && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-background/80 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider border border-white/20">
                    Sub
                  </div>
                )}
              </div>
              <div className="w-2/3 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-lg leading-tight truncate pr-2">{category.name}</h3>
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-none text-[10px]">
                      LIVE
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs text-muted-foreground font-mono">/{category.slug}</p>
                    {category.description && (
                      <p className="text-[10px] text-muted-foreground line-clamp-1 italic mt-1 bg-muted/30 px-2 py-0.5 rounded italic">
                        "{category.description}"
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      {category.parentId && (
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <FolderTree size={10} />
                          {getParentName(category.parentId)}
                        </p>
                      )}
                      <Badge variant="outline" className="text-[8px] h-4 px-1 border-primary/20 text-primary">
                        P: {category.priority || 0}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-muted">
                  <div className="text-xs font-semibold text-muted-foreground">
                    <span className="text-foreground text-sm mr-1">{getProductCount(category.id)}</span> Items
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full hover:bg-muted"
                      onClick={() => handleEdit(category)}
                    >
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
        
        <Card 
          className="border-2 border-dashed border-muted bg-transparent hover:bg-muted/10 transition-all duration-300 flex flex-col items-center justify-center p-8 group cursor-pointer h-40 hover:border-primary/50"
          onClick={handleAdd}
        >
          <div className="p-4 rounded-full bg-muted group-hover:bg-foreground group-hover:text-background transition-all duration-500 group-hover:scale-110 shadow-sm group-hover:shadow-lg">
            <Plus size={24} />
          </div>
          <p className="mt-4 font-bold text-muted-foreground group-hover:text-foreground transition-colors">Add New Category</p>
        </Card>
      </div>

      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold tracking-tight">Hierarchical View</h3>
          <Badge variant="outline" className="px-3 py-1 bg-muted/30">Organization Graph</Badge>
        </div>
        <Card className="border-none shadow-lg overflow-hidden bg-card/60 backdrop-blur-md">
          <CardHeader className="bg-muted/30 border-b px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-foreground text-background">
                <FolderTree size={20} />
              </div>
              <div>
                <h4 className="font-bold text-lg">Inventory Taxonomy</h4>
                <p className="text-xs text-muted-foreground">Detailed view of your category structure</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
             <div className="p-4 bg-muted/10">
                {!isLoading && (categoriesData || []).filter((c: any) => !c.parentId).map((mainCat: any) => (
                  <div key={mainCat.id} className="mb-4 last:mb-0">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-background/80 border border-muted-foreground/5 hover:border-primary/20 hover:shadow-md transition-all group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-lg text-primary overflow-hidden">
                          {(mainCat.images && mainCat.images[0]) ? <img src={mainCat.images[0]} className="w-full h-full object-cover" /> : mainCat.name?.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-base">{mainCat.name}</div>
                          <div className="text-xs text-muted-foreground font-medium">/{mainCat.slug} • Main Collection</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                          <div className="text-xs font-bold text-foreground">{getProductCount(mainCat.id)} Items total</div>
                          <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">Structure</div>
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => handleEdit(mainCat)}>
                          <MoreVertical size={18} className="text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                    {/* Subcategories Rendering */}
                    {(categoriesData || []).filter((c: any) => c.parentId === mainCat.id).map((subCat: any) => (
                      <div key={subCat.id} className="ml-12 mt-2 flex items-center justify-between p-3 rounded-lg border-l-2 border-primary/20 bg-muted/5 hover:bg-muted/10 transition-colors cursor-pointer" onClick={() => handleEdit(subCat)}>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary/40 shrink-0"></div>
                          <span className="font-medium text-sm">{subCat.name}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">/{subCat.slug}</span>
                        </div>
                        <ChevronRight size={14} className="text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>
      </div>

      <CategoryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={onModalSubmit}
        category={selectedCategory}
        categories={categoriesData}
      />
    </div>
  );
};

export default CategoriesPage;
