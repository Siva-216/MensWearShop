import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Loader2, Upload, Link as LinkIcon, Image as ImageIcon, Plus, Minus, X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  product?: any;
  categories?: any[];
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  product,
  categories = [],
}) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const [isUploading, setIsUploading] = useState(false);
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('upload');
  
  const imageList = watch('images') || [''];
  const variants = watch('variants') || [];
  const tags = watch('tags') || [];
  const attributes = watch('attributes') || {};

  useEffect(() => {
    if (product) {
      reset({
        ...product,
        basePrice: product.basePrice || product.price || 0,
        images: product.images && product.images.length > 0 ? product.images : [''],
        variants: product.variants || [],
        tags: product.tags || [],
        attributes: product.attributes || {},
      });
      setImageMode('upload');
    } else {
      reset({
        name: '',
        description: '',
        basePrice: 0,
        categoryId: '',
        categoryName: '',
        images: [''],
        brand: '',
        variants: [],
        isNew: true,
        isSale: false,
        priority: 0,
        gender: 'Men',
        sizeSystem: 'ALPHA',
        tags: [],
        attributes: {},
      });
      setImageMode('upload');
    }
  }, [product, reset]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    try {
      setIsUploading(true);
      const response = await api.upload.image(file);
      const newImages = [...imageList];
      newImages[index] = response.url;
      setValue('images', newImages);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const addImageField = () => {
    setValue('images', [...imageList, '']);
  };

  const removeImageField = (index: number) => {
    const newImages = imageList.filter((_: any, i: number) => i !== index);
    setValue('images', newImages.length > 0 ? newImages : ['']);
  };

  const addVariantField = () => {
    setValue('variants', [
      ...variants,
      { sku: '', size: '', color: '', stock: 0, price: null },
    ]);
  };

  const removeVariantField = (index: number) => {
    setValue('variants', variants.filter((_: any, i: number) => i !== index));
  };

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setValue('tags', [...tags, tag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue('tags', tags.filter((t: string) => t !== tagToRemove));
  };

  const setAttribute = (key: string, value: string) => {
    setValue('attributes', { ...attributes, [key]: value });
  };

  const removeAttribute = (key: string) => {
    const newAttrs = { ...attributes };
    delete newAttrs[key];
    setValue('attributes', newAttrs);
  };

  const onFormSubmit = (data: any) => {
    const cleanImages = data.images.filter((img: string) => img && img.trim() !== '');
    
    // Ensure variants have correct types
    const formattedVariants = (data.variants || []).map((v: any) => ({
      ...v,
      stock: Number(v.stock) || 0,
      price: v.price ? Number(v.price) : null
    }));

    const { id, ...rest } = data;

    const formattedData = {
      ...rest,
      basePrice: Number(data.basePrice) || 0,
      discountPrice: Number(data.discountPrice) || 0,
      rating: Number(data.rating) || 0,
      numReviews: Number(data.numReviews) || 0,
      images: cleanImages,
      variants: formattedVariants,
    };

    // Remove legacy fields if present
    delete (formattedData as any).price;
    delete (formattedData as any).stock;
    delete (formattedData as any).sizes;
    delete (formattedData as any).colors;

    if (id && typeof id === 'string' && id.trim() !== '') {
      (formattedData as any).id = id;
    }

    onSubmit(formattedData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[750px] max-h-[95vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-2xl font-display font-bold">{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 custom-scrollbar bg-background">
          <form id="product-form" onSubmit={handleSubmit(onFormSubmit)} className="space-y-10">
            {/* Core Info */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary border-b pb-2">Core Information</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Product Name</Label>
                  <Input id="name" {...register('name', { required: true })} placeholder="e.g. Classic Cotton T-Shirt" className="h-11 bg-muted/20 border-none focus-visible:ring-1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Brand</Label>
                  <Input id="brand" {...register('brand')} placeholder="e.g. FashionWorld" className="h-11 bg-muted/20 border-none focus-visible:ring-1" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description</Label>
                <Textarea id="description" {...register('description')} placeholder="Describe your product details..." className="min-h-[100px] bg-muted/20 border-none resize-none focus-visible:ring-1" />
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="basePrice" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Base Price ($)</Label>
                  <Input id="basePrice" type="number" step="0.01" {...register('basePrice', { required: true })} className="h-11 bg-muted/20 border-none" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discountPrice" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Discount Price ($)</Label>
                  <Input id="discountPrice" type="number" step="0.01" {...register('discountPrice')} className="h-11 bg-muted/20 border-none" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</Label>
                  <Select 
                    onValueChange={(val) => {
                      const selectedCategory = categories.find(c => c.id === val);
                      if (selectedCategory) {
                        setValue('categoryId', selectedCategory.id);
                        setValue('categoryName', selectedCategory.name);
                      }
                    }}
                    defaultValue={product?.categoryId || ''}
                  >
                    <SelectTrigger className="h-11 bg-muted/20 border-none">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat: any) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Categorization & System */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary border-b pb-2">Categorization & Sizing</h3>
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Target Gender</Label>
                  <Select onValueChange={(val) => setValue('gender', val)} defaultValue={product?.gender || 'Men'}>
                    <SelectTrigger className="h-11 bg-muted/20 border-none">
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Men">Men</SelectItem>
                      <SelectItem value="Women">Women</SelectItem>
                      <SelectItem value="Unisex">Unisex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sizeSystem" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Size System</Label>
                  <Select onValueChange={(val) => setValue('sizeSystem', val)} defaultValue={product?.sizeSystem || 'ALPHA'}>
                    <SelectTrigger className="h-11 bg-muted/20 border-none">
                      <SelectValue placeholder="Size System" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALPHA">Alpha (S, M, L)</SelectItem>
                      <SelectItem value="NUMERIC_WAIST">Numeric Waist (28, 30, 32)</SelectItem>
                      <SelectItem value="CM">Centimeters (Shoes/Accessories)</SelectItem>
                      <SelectItem value="FRAGRANCE">Volume (ml/oz)</SelectItem>
                      <SelectItem value="ONE_SIZE">One Size</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-4 pt-8">
                   <div className="flex items-center gap-6">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="isNew" 
                          checked={watch('isNew')} 
                          onCheckedChange={(val) => setValue('isNew', val)} 
                        />
                        <Label htmlFor="isNew" className="text-[10px] font-bold uppercase tracking-widest cursor-pointer">New Arrival</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="isSale" 
                          checked={watch('isSale')} 
                          onCheckedChange={(val) => setValue('isSale', val)} 
                        />
                        <Label htmlFor="isSale" className="text-[10px] font-bold uppercase tracking-widest cursor-pointer text-red-500">On Sale</Label>
                      </div>
                   </div>
                </div>
              </div>
            </div>

            {/* Product Variants */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Inventory & Variants</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5">
                    Total Stock: {variants.reduce((acc: number, v: any) => acc + (Number(v.stock) || 0), 0)}
                  </Badge>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addVariantField}
                    className="h-7 px-3 text-[9px] font-bold uppercase tracking-widest gap-1.5"
                  >
                    <Plus size={12} /> Add Variant
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                {variants.map((_: any, index: number) => (
                  <div key={index} className="grid grid-cols-12 gap-3 items-end bg-muted/5 p-3 rounded-xl border border-muted/20 group">
                    <div className="col-span-3 space-y-1.5">
                      <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">SKU</Label>
                      <Input {...register(`variants.${index}.sku`)} placeholder="TS-BLK-M" className="h-9 bg-background border-none text-xs" />
                    </div>
                    <div className="col-span-2 space-y-1.5">
                      <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Size</Label>
                      <Input {...register(`variants.${index}.size`)} placeholder="M" className="h-9 bg-background border-none text-xs" />
                    </div>
                    <div className="col-span-2 space-y-1.5">
                      <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Color</Label>
                      <Input {...register(`variants.${index}.color`)} placeholder="Black" className="h-9 bg-background border-none text-xs" />
                    </div>
                    <div className="col-span-2 space-y-1.5">
                      <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Stock</Label>
                      <Input type="number" {...register(`variants.${index}.stock`)} className="h-9 bg-background border-none text-xs" />
                    </div>
                    <div className="col-span-2 space-y-1.5">
                      <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Price</Label>
                      <Input type="number" step="0.01" {...register(`variants.${index}.price`)} placeholder="Overrd" className="h-9 bg-background border-none text-xs" />
                    </div>
                    <div className="col-span-1 flex justify-center pb-0.5">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeVariantField(index)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
                {variants.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed rounded-2xl bg-muted/5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">No variants added yet</p>
                    <Button 
                      type="button" 
                      variant="link" 
                      onClick={addVariantField}
                      className="text-[10px] font-bold uppercase tracking-widest mt-1"
                    >
                      Click to add the first variant
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Tags & Attributes */}
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary border-b pb-2">Search Tags</h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Add tag and press Enter" 
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag((e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                      className="h-10 bg-muted/20 border-none"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-muted/10 rounded-lg">
                    {tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="gap-1 pl-3 pr-1 py-1 uppercase text-[9px] font-bold tracking-widest bg-background border shadow-sm">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive p-0.5 rounded-full hover:bg-muted transition-colors">
                          <X size={10} />
                        </button>
                      </Badge>
                    ))}
                    {tags.length === 0 && <p className="text-[10px] text-muted-foreground italic px-2">No tags added yet...</p>}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary border-b pb-2">Custom Attributes</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                     <Input id="attr-key" placeholder="Key (e.g. Fabric)" className="h-10 bg-muted/20 border-none text-xs" />
                     <div className="flex gap-2">
                        <Input id="attr-val" placeholder="Value" className="h-10 bg-muted/20 border-none text-xs" />
                        <Button 
                          type="button" 
                          size="icon" 
                          className="shrink-0 h-10 w-10"
                          onClick={() => {
                            const k = (document.getElementById('attr-key') as HTMLInputElement).value;
                            const v = (document.getElementById('attr-val') as HTMLInputElement).value;
                            if (k && v) {
                              setAttribute(k, v);
                              (document.getElementById('attr-key') as HTMLInputElement).value = '';
                              (document.getElementById('attr-val') as HTMLInputElement).value = '';
                            }
                          }}
                        >
                          <Plus size={16} />
                        </Button>
                     </div>
                  </div>
                  <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                    {Object.entries(attributes).map(([key, value]: [string, any]) => (
                      <div key={key} className="flex items-center justify-between p-2 bg-background border rounded-lg text-xs shadow-sm group">
                        <div className="flex gap-2">
                          <span className="font-bold uppercase tracking-widest text-[9px] text-primary">{key}:</span>
                          <span className="text-muted-foreground">{value}</span>
                        </div>
                        <button type="button" onClick={() => removeAttribute(key)} className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                          <Minus size={14} />
                        </button>
                      </div>
                    ))}
                    {Object.keys(attributes).length === 0 && <p className="text-[10px] text-muted-foreground italic p-2">Specify fit, material, fragrance notes, etc.</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Media Gallery */}
            <div className="space-y-6 bg-muted/10 p-6 rounded-2xl border border-dashed">
              <div className="flex items-center justify-between border-b border-primary/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary"><ImageIcon size={18} /></div>
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em]">Product Gallery</h3>
                </div>
                <div className="flex bg-background border rounded-xl p-1 shadow-sm">
                  <button 
                    type="button"
                    onClick={() => setImageMode('upload')}
                    className={`px-4 py-2 text-[10px] uppercase font-bold tracking-[0.15em] rounded-lg transition-all flex items-center gap-2 ${imageMode === 'upload' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-muted'}`}
                  >
                    <Upload size={14} /> Local File
                  </button>
                  <button 
                    type="button"
                    onClick={() => setImageMode('url')}
                    className={`px-4 py-2 text-[10px] uppercase font-bold tracking-[0.15em] rounded-lg transition-all flex items-center gap-2 ${imageMode === 'url' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-muted'}`}
                  >
                    <LinkIcon size={14} /> Remote URL
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {imageList.map((url: string, index: number) => (
                  <div key={index} className="relative group border border-muted-foreground/10 rounded-2xl p-6 bg-background transition-all hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20">
                    <div className="flex items-center gap-6">
                      <div className="flex-1">
                        <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block ml-1">Image Asset {index + 1}</Label>
                        {imageMode === 'upload' ? (
                          <div className="space-y-2">
                             <Input 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, index)}
                                className="bg-muted/10 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer w-full h-12 border-none rounded-xl"
                                disabled={isUploading}
                              />
                              <input type="hidden" {...register(`images.${index}`)} />
                          </div>
                        ) : (
                          <Input 
                            {...register(`images.${index}`)}
                            placeholder="https://images.unsplash.com/..." 
                            className="h-12 bg-muted/10 border-none rounded-xl text-sm"
                          />
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-2">
                         {imageList.length > 1 && (
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => removeImageField(index)}
                              className="h-12 w-12 rounded-xl text-destructive hover:bg-destructive/10"
                            >
                              <Minus size={20} />
                            </Button>
                         )}
                      </div>
                    </div>

                    {url && (
                      <div className="mt-6 flex items-start gap-6 p-4 bg-muted/5 rounded-xl animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="h-32 w-28 rounded-xl overflow-hidden border-2 border-background shadow-lg shrink-0 group-hover:scale-105 transition-transform duration-500">
                          <img src={url} alt="Preview" className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1 pt-2 space-y-2 overflow-hidden">
                          <div className="flex items-center gap-2">
                             <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                             <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Resource Linked Successfully</p>
                          </div>
                          <p className="text-[10px] font-mono text-muted-foreground break-all line-clamp-3 bg-background/50 p-3 rounded-lg border border-muted/20">{url}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addImageField}
                  className="w-full h-16 border-dashed border-2 rounded-2xl hover:border-primary hover:bg-primary/5 group transition-all duration-300"
                >
                  <Plus size={20} className="mr-3 text-primary group-hover:scale-125 transition-transform" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">Expand Product Gallery</span>
                </Button>
              </div>
            </div>
          </form>
        </div>

        <DialogFooter className="px-8 py-6 border-t bg-muted/5 flex justify-between sm:justify-between items-center">
          <Button type="button" variant="ghost" onClick={onClose} className="text-[10px] font-bold uppercase tracking-widest hover:bg-destructive/10 hover:text-destructive px-6 h-12 rounded-xl transition-all">Discard Changes</Button>
          <div className="flex gap-4">
            <Button 
              type="submit" 
              form="product-form"
              disabled={isUploading}
              className="px-12 h-12 rounded-xl shadow-xl shadow-primary/20 bg-primary text-primary-foreground font-bold text-[10px] tracking-[0.25em] h-12 hover:scale-[1.02] active:scale-95 transition-all"
            >
              {isUploading ? <Loader2 className="animate-spin mr-3" size={18} /> : null}
              {product ? 'COMMIT UPDATES' : 'PUBLISH CATALOG ITEM'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

