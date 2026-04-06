import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { ProductModal } from './ProductModal';
import { 
  ChevronLeft, 
  ChevronRight,
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
  DollarSign,
  FileSpreadsheet,
  FileDown
} from 'lucide-react';

const ProductsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => api.products.getAll(),
  });

  // Reset to first page when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, priceFilter, stockFilter]);

  // Filtering Logic
  const filteredProducts = (productsData || []).filter((product: any) => {
    // ... filtering code (stays same) ...
    const matchesSearch = 
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.categoryId === categoryFilter || product.categoryName === categoryFilter;
    let matchesPrice = true;
    if (priceFilter === "low") matchesPrice = product.price < 50;
    else if (priceFilter === "mid") matchesPrice = product.price >= 50 && product.price <= 200;
    else if (priceFilter === "high") matchesPrice = product.price > 200;
    let matchesStock = true;
    if (stockFilter === "instock") matchesStock = product.stock > 15;
    else if (stockFilter === "lowstock") matchesStock = product.stock > 0 && product.stock <= 15;
    else if (stockFilter === "outofstock") matchesStock = product.stock === 0;

    return matchesSearch && matchesCategory && matchesPrice && matchesStock;
  });

  // Pagination Calculation
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const createMutation = useMutation({
    mutationFn: (data: any) => {
      console.log("Creating product with data:", data);
      return api.products.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success("Product created successfully");
      setIsModalOpen(false);
    },
    onError: (error) => {
      console.error("Create Product Error:", error);
      toast.error("Failed to create product. Check console for details.");
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => {
      console.log(`Updating product ${id} with data:`, data);
      return api.products.update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success("Product updated successfully");
      setIsModalOpen(false);
    },
    onError: (error) => {
      console.error("Update Product Error:", error);
      toast.error("Failed to update product");
    }
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

  const { data: categoriesData } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => api.categories.getAll(),
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDownloadTemplate = () => {
    const template = [
      {
        Name: "Classic Linen Shirt",
        Description: "Premium breathable linen shirt for summer",
        Brand: "FashionWorld",
        Price: 45.00,
        Stock: 100,
        Category: "Shirts",
        ImageURL: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80"
      }
    ];
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products Template");
    XLSX.writeFile(wb, "products_import_template.xlsx");
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data: any[] = XLSX.utils.sheet_to_json(ws);

        if (data.length === 0) {
          toast.error("The Excel file is empty!");
          return;
        }

        toast.info(`Importing ${data.length} products... Please wait.`);

        let successCount = 0;
        let failCount = 0;
        
        for (const row of data) {
          try {
            // Find category ID by name
            const categoryName = (row.Category || row.categoryName || row.category)?.toString();
            const category = (categoriesData || []).find((c: any) => 
              c.name.toLowerCase() === categoryName?.toLowerCase()
            );

            // Create payload matching the logic in ProductModal format
            const productData = {
              name: (row.Name || row.name || "").toString(),
              description: (row.Description || row.description || "").toString(),
              brand: (row.Brand || row.brand || "").toString(),
              price: Number(row.Price || row.price) || 0,
              stock: Number(row.Stock || row.stock) || 0,
              discountPrice: Number(row.DiscountPrice || row.discountPrice) || 0,
              rating: Number(row.Rating || row.rating) || 0,
              numReviews: Number(row.NumReviews || row.numReviews) || 0,
              categoryName: category?.name || categoryName || 'Uncategorized',
              categoryId: category?.id || '',
              images: row.ImageURL ? [row.ImageURL.toString()] : (row.images ? (Array.isArray(row.images) ? row.images : [row.images.toString()]) : []),
              sizes: [],
              colors: []
            };

            console.log("Importing row formatted as:", productData);
            await api.products.create(productData);
            successCount++;
          } catch (err) {
            console.error("Error importing row:", row, err);
            failCount++;
          }
        }

        queryClient.invalidateQueries({ queryKey: ['admin-products'] });
        
        if (failCount === 0) {
          toast.success(`Successfully imported all ${successCount} products!`);
        } else {
          toast.warning(`Import partial: ${successCount} succeeded, ${failCount} failed. Check console for details.`);
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (err) {
        console.error("Import error:", err);
        toast.error("Failed to parse Excel file.");
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleSaveProduct = (data: any) => {
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(id);
    }
  };
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImport} 
        accept=".xlsx, .xls, .csv" 
        className="hidden" 
      />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">Products Management</h2>
          <p className="text-muted-foreground mt-1">Found {filteredProducts.length} items out of {productsData?.length || 0}</p>
        </div>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 gap-2 border-dashed">
                <Upload size={18} />
                Import
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Product Import</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="cursor-pointer">
                <Upload className="mr-2 h-4 w-4" />
                Upload Excel File
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownloadTemplate} className="cursor-pointer">
                <FileDown className="mr-2 h-4 w-4" />
                Download Template
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button 
            className="h-10 gap-2 shadow-lg shadow-primary/20 bg-foreground text-background hover:bg-muted-foreground"
            onClick={handleCreate}
          >
            <PlusCircle size={18} />
            Add New Product
          </Button>
        </div>
      </div>
      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleSaveProduct} 
        product={editingProduct} 
        categories={categoriesData || []}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm bg-card hover:bg-secondary/50 transition-colors cursor-pointer">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Box size={20} /></div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Units</p>
              <p className="text-xl font-bold">{filteredProducts.reduce((acc: number, p: any) => acc + (p.stock || 0), 0).toLocaleString() || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-card hover:bg-secondary/50 transition-colors cursor-pointer">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-xl"><Tag size={20} /></div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Products</p>
              <p className="text-xl font-bold">{filteredProducts.length || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-card hover:bg-secondary/50 transition-colors cursor-pointer">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-xl"><RefreshCw size={20} /></div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Filtered</p>
              <p className="text-xl font-bold">{filteredProducts.filter((p: any) => p.stock < 15 && p.stock > 0).length || 0} Low Stock</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-card hover:bg-secondary/50 transition-colors cursor-pointer">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-xl"><DollarSign size={20} /></div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Inventory Value</p>
              <p className="text-xl font-bold">${filteredProducts.reduce((acc: number, p: any) => acc + ((p.price || 0) * (p.stock || 0)), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
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
                placeholder="Search name, brand, or id..." 
                className="pl-10 bg-card border-muted focus-visible:ring-1 focus-visible:ring-primary h-10 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={categoryFilter !== 'all' ? 'default' : 'outline'} size="sm" className="h-9 gap-2">
                    <Tag size={16} /> Category
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setCategoryFilter('all')}>All Categories</DropdownMenuItem>
                  {(categoriesData || []).map((cat: any) => (
                    <DropdownMenuItem key={cat.id} onClick={() => setCategoryFilter(cat.id)}>
                      {cat.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={priceFilter !== 'all' ? 'default' : 'outline'} size="sm" className="h-9 gap-2">
                    <DollarSign size={16} /> Price
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>Price Range</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setPriceFilter('all')}>Any Price</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPriceFilter('low')}>Under $50</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPriceFilter('mid')}>$50 - $200</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPriceFilter('high')}>Over $200</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={stockFilter !== 'all' ? 'default' : 'outline'} size="sm" className="h-9 gap-2">
                    <Package size={16} /> Stock
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>Stock Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setStockFilter('all')}>All Items</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStockFilter('instock')}>In Stock</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStockFilter('lowstock')}>Low Stock</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStockFilter('outofstock')}>Out of Stock</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {(searchTerm || categoryFilter !== 'all' || priceFilter !== 'all' || stockFilter !== 'all') && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-9 text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => {
                    setSearchTerm("");
                    setCategoryFilter("all");
                    setPriceFilter("all");
                    setStockFilter("all");
                  }}
                >
                  Clear All
                </Button>
              )}
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
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                      <Box size={40} className="opacity-20" />
                      <p>No products found matching your filters</p>
                      <Button variant="link" onClick={() => {
                        setSearchTerm("");
                        setCategoryFilter("all");
                        setPriceFilter("all");
                        setStockFilter("all");
                      }}>Clear all filters</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredProducts.map((product: any) => (
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
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        title="Edit" 
                        className="h-8 w-8 rounded-full hover:bg-amber-50 text-amber-600"
                        onClick={() => handleEdit(product)}
                      >
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

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2">
          <div className="text-sm text-muted-foreground font-medium">
            Showing <span className="text-foreground">{startIndex + 1}</span> to{' '}
            <span className="text-foreground">{Math.min(startIndex + itemsPerPage, filteredProducts.length)}</span> of{' '}
            <span className="text-foreground">{filteredProducts.length}</span> products
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-9 w-9 p-0 rounded-lg"
            >
              <ChevronLeft size={18} />
            </Button>
            
            <div className="flex items-center gap-1 mx-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={`h-9 w-9 p-0 rounded-lg ${currentPage === page ? 'shadow-md shadow-primary/20' : ''}`}
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-9 w-9 p-0 rounded-lg"
            >
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
