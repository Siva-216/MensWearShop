import React, { useEffect, useState, useMemo } from 'react';
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
import { Loader2, Upload, Link as LinkIcon, Image as ImageIcon, Plus, Minus, X, Zap, Info } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  product?: any;
  categories?: any[];
}

// ============================================================
// Category Configuration Map
// ============================================================

const CATEGORY_CONFIG: Record<string, {
  sizes: string[];
  sizeLabel: string;
  sizeSystem: string;
  colors: string[];
  descriptionPlaceholder: string;
  attributeHints: { key: string; placeholder: string }[];
  suggestedTags: string[];
  showColor: boolean;
}> = {
  't shirt': {
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    sizeLabel: 'Alpha Size (XS–XXXL)',
    sizeSystem: 'ALPHA',
    colors: ['Black', 'White', 'Navy Blue', 'Grey', 'Red', 'Green', 'Yellow', 'Maroon', 'Olive'],
    descriptionPlaceholder: 'e.g. Premium round-neck cotton T-shirt with a relaxed fit. Ideal for casual daily wear. Breathable fabric keeps you cool all day...',
    attributeHints: [
      { key: 'Fabric', placeholder: 'e.g. 100% Cotton' },
      { key: 'Fit', placeholder: 'e.g. Regular Fit' },
      { key: 'Neck', placeholder: 'e.g. Round Neck' },
      { key: 'Sleeve', placeholder: 'e.g. Half Sleeve' },
      { key: 'Care', placeholder: 'e.g. Machine Wash Cold' },
    ],
    suggestedTags: ['casual', 't-shirt', 'cotton', 'summer', 'everyday'],
    showColor: true,
  },
  'shirt': {
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    sizeLabel: 'Alpha Size (XS–XXXL)',
    sizeSystem: 'ALPHA',
    colors: ['White', 'Blue', 'Black', 'Grey', 'Light Blue', 'Navy', 'Beige', 'Check'],
    descriptionPlaceholder: 'e.g. Classic formal/casual shirt crafted from premium cotton twill. Features a spread collar, single chest pocket, and a smooth finish perfect for office and outings...',
    attributeHints: [
      { key: 'Fabric', placeholder: 'e.g. Cotton Blend' },
      { key: 'Fit', placeholder: 'e.g. Slim Fit' },
      { key: 'Collar', placeholder: 'e.g. Spread Collar' },
      { key: 'Sleeve', placeholder: 'e.g. Full Sleeve' },
      { key: 'Occasion', placeholder: 'e.g. Formal / Casual' },
    ],
    suggestedTags: ['shirt', 'formal', 'office', 'cotton', 'classic'],
    showColor: true,
  },
  'hoodies': {
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    sizeLabel: 'Alpha Size (XS–XXXL)',
    sizeSystem: 'ALPHA',
    colors: ['Black', 'Grey', 'Navy', 'Maroon', 'White', 'Olive', 'Beige'],
    descriptionPlaceholder: 'e.g. Cozy oversized hoodie crafted from a thick cotton-fleece blend. Features a kangaroo pocket, drawstring hood, and ribbed cuffs for a comfortable warm fit...',
    attributeHints: [
      { key: 'Fabric', placeholder: 'e.g. Fleece / French Terry' },
      { key: 'Fit', placeholder: 'e.g. Oversized / Regular' },
      { key: 'Hood', placeholder: 'e.g. Drawstring Hood' },
      { key: 'Pocket', placeholder: 'e.g. Kangaroo Pocket' },
      { key: 'Weight', placeholder: 'e.g. 320 GSM' },
    ],
    suggestedTags: ['hoodie', 'winter', 'fleece', 'casual', 'streetwear'],
    showColor: true,
  },
  'pant': {
    sizes: ['28', '30', '32', '34', '36', '38', '40', '42'],
    sizeLabel: 'Waist Size (inches)',
    sizeSystem: 'NUMERIC_WAIST',
    colors: ['Black', 'Navy', 'Grey', 'Khaki', 'Olive', 'Beige', 'Dark Blue', 'Brown'],
    descriptionPlaceholder: 'e.g. Premium slim-fit men\'s chino trouser with stretch fabric for freedom of movement. Features a flat-front design and tapered leg, ideal for formal and smart-casual looks...',
    attributeHints: [
      { key: 'Fabric', placeholder: 'e.g. Stretch Cotton' },
      { key: 'Fit', placeholder: 'e.g. Slim Fit / Regular' },
      { key: 'Rise', placeholder: 'e.g. Mid Rise' },
      { key: 'Length', placeholder: 'e.g. Full Length' },
      { key: 'Closure', placeholder: 'e.g. Button & Zipper' },
    ],
    suggestedTags: ['pant', 'trouser', 'bottom', 'formal', 'chino'],
    showColor: true,
  },
  'shorts': {
    sizes: ['28', '30', '32', '34', '36', '38'],
    sizeLabel: 'Waist Size (inches)',
    sizeSystem: 'NUMERIC_WAIST',
    colors: ['Black', 'Navy', 'Grey', 'Khaki', 'Olive', 'White', 'Blue'],
    descriptionPlaceholder: 'e.g. Comfortable all-day shorts made from lightweight breathable fabric. Features an elastic waistband with drawstring and two side pockets...',
    attributeHints: [
      { key: 'Fabric', placeholder: 'e.g. Cotton / Polyester' },
      { key: 'Fit', placeholder: 'e.g. Regular Fit' },
      { key: 'Length', placeholder: 'e.g. Above Knee (7\")' },
      { key: 'Waist', placeholder: 'e.g. Elastic with Drawstring' },
    ],
    suggestedTags: ['shorts', 'summer', 'casual', 'bottom', 'sport'],
    showColor: true,
  },
  'accessories': {
    sizes: ['Free Size', 'S', 'M', 'L', 'XL', '6UK', '7UK', '8UK', '9UK', '10UK', '11UK'],
    sizeLabel: 'Size / UK Size',
    sizeSystem: 'CM',
    colors: ['Black', 'Brown', 'Tan', 'White', 'Silver', 'Gold', 'Grey'],
    descriptionPlaceholder: 'e.g. Premium quality men\'s leather watch with stainless steel case and genuine leather strap. Water resistant up to 50m. Elegant dial face suitable for all occasions...',
    attributeHints: [
      { key: 'Material', placeholder: 'e.g. Genuine Leather / Stainless Steel' },
      { key: 'Style', placeholder: 'e.g. Casual / Formal / Sport' },
      { key: 'Dimensions', placeholder: 'e.g. 42mm case' },
      { key: 'Feature', placeholder: 'e.g. Water Resistant' },
    ],
    suggestedTags: ['accessories', 'watch', 'belt', 'shoes', 'leather'],
    showColor: true,
  },
  'perfume': {
    sizes: ['30ml', '50ml', '75ml', '100ml', '150ml', '200ml', '250ml'],
    sizeLabel: 'Volume / Bottle Size',
    sizeSystem: 'FRAGRANCE',
    colors: [],
    descriptionPlaceholder: 'e.g. A sophisticated blend of top notes (Bergamot, Lemon), heart notes (Jasmine, Rose), and base notes (Sandalwood, Musk). Long-lasting 8–10 hour projection...',
    attributeHints: [
      { key: 'Concentration', placeholder: 'e.g. EDP / EDT / Parfum' },
      { key: 'Top Notes', placeholder: 'e.g. Bergamot, Citrus' },
      { key: 'Heart Notes', placeholder: 'e.g. Jasmine, Oud' },
      { key: 'Base Notes', placeholder: 'e.g. Sandalwood, Musk' },
      { key: 'Longevity', placeholder: 'e.g. 8-10 Hours' },
      { key: 'Occasion', placeholder: 'e.g. Evening / Daily / Office' },
    ],
    suggestedTags: ['perfume', 'fragrance', 'oud', 'luxury', 'scent'],
    showColor: false,
  },
};

const getConfigForCategory = (categoryName: string) => {
  const key = (categoryName || '').toLowerCase().trim();
  // Exact match first
  if (CATEGORY_CONFIG[key]) return CATEGORY_CONFIG[key];
  // Partial match
  for (const k of Object.keys(CATEGORY_CONFIG)) {
    if (key.includes(k) || k.includes(key)) return CATEGORY_CONFIG[k];
  }
  // Default fallback
  return CATEGORY_CONFIG['t shirt'];
};

// ============================================================
// Component
// ============================================================

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
  const selectedCategoryId = watch('categoryId');

  // Find current category object
  const selectedCategory = useMemo(() => {
    return categories.find((c: any) => c.id === selectedCategoryId);
  }, [categories, selectedCategoryId]);

  const catConfig = useMemo(() => {
    return getConfigForCategory(selectedCategory?.name || product?.categoryName || '');
  }, [selectedCategory, product?.categoryName]);

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

  // Auto-update sizeSystem when category changes
  useEffect(() => {
    if (catConfig?.sizeSystem) {
      setValue('sizeSystem', catConfig.sizeSystem);
    }
  }, [catConfig, setValue]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please upload an image file'); return; }
    try {
      setIsUploading(true);
      const response = await api.upload.image(file);
      const newImages = [...imageList];
      newImages[index] = response.url;
      setValue('images', newImages);
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const addImageField = () => setValue('images', [...imageList, '']);
  const removeImageField = (index: number) => {
    const newImages = imageList.filter((_: any, i: number) => i !== index);
    setValue('images', newImages.length > 0 ? newImages : ['']);
  };

  // Quick-fill: add a standard variant for a given size
  const quickAddVariant = (size: string, color?: string) => {
    const existingSizes = variants.map((v: any) => `${v.size}-${v.color}`);
    const key = `${size}-${color || ''}`;
    if (existingSizes.includes(key)) return;
    setValue('variants', [
      ...variants,
      { sku: '', size, color: color || '', stock: 10, price: null },
    ]);
  };

  // Quick-fill: add all standard sizes
  const quickFillAllSizes = () => {
    const existingSizes = new Set(variants.map((v: any) => v.size));
    const newVariants = [...variants];
    catConfig.sizes.forEach((size) => {
      if (!existingSizes.has(size)) {
        newVariants.push({ sku: '', size, color: '', stock: 10, price: null });
      }
    });
    setValue('variants', newVariants);
    toast.success(`Added ${catConfig.sizes.length} size variants`);
  };

  const addVariantField = () => {
    setValue('variants', [...variants, { sku: '', size: '', color: '', stock: 0, price: null }]);
  };

  const removeVariantField = (index: number) => {
    setValue('variants', variants.filter((_: any, i: number) => i !== index));
  };

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) setValue('tags', [...tags, tag]);
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

  // Quick-fill suggested tags
  const addSuggestedTag = (tag: string) => addTag(tag);

  // Quick-fill category attributes
  const quickFillAttributes = () => {
    const newAttrs = { ...attributes };
    catConfig.attributeHints.forEach(({ key }) => {
      if (!newAttrs[key]) newAttrs[key] = '';
    });
    setValue('attributes', newAttrs);
    toast.success('Category attribute keys pre-filled');
  };

  const onFormSubmit = (data: any) => {
    const cleanImages = data.images.filter((img: string) => img && img.trim() !== '');
    const formattedVariants = (data.variants || []).map((v: any) => ({
      ...v,
      stock: Number(v.stock) || 0,
      price: v.price ? Number(v.price) : null,
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
      <DialogContent className="sm:max-w-[800px] max-h-[95vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-2xl font-display font-bold">
            {product ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
          {selectedCategory && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">Category:</span>
              <Badge variant="outline" className="text-xs font-bold px-2 py-0.5 text-primary border-primary/30 bg-primary/5">
                {selectedCategory.name}
              </Badge>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">{catConfig.sizeLabel}</span>
            </div>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 custom-scrollbar bg-background">
          <form id="product-form" onSubmit={handleSubmit(onFormSubmit)} className="space-y-10">

            {/* ── Core Info ── */}
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

              {/* Category + Price */}
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="basePrice" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Base Price (₹)</Label>
                  <Input id="basePrice" type="number" step="0.01" {...register('basePrice', { required: true })} className="h-11 bg-muted/20 border-none" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discountPrice" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Discount Price (₹)</Label>
                  <Input id="discountPrice" type="number" step="0.01" {...register('discountPrice')} className="h-11 bg-muted/20 border-none" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</Label>
                  <Select
                    onValueChange={(val) => {
                      const selectedCategory = categories.find((c: any) => c.id === val);
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

              {/* Description — category-aware placeholder */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="description" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description</Label>
                  {selectedCategory && (
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Info size={10} />
                      Tips for {selectedCategory.name}
                    </span>
                  )}
                </div>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder={catConfig.descriptionPlaceholder}
                  className="min-h-[120px] bg-muted/20 border-none resize-none focus-visible:ring-1 text-sm leading-relaxed"
                />
              </div>
            </div>

            {/* ── Categorization & Sizing ── */}
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
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Size System</Label>
                  <div className="h-11 bg-muted/20 rounded-lg flex items-center px-3 text-sm font-medium text-foreground/80">
                    {catConfig.sizeSystem === 'ALPHA' && 'Alpha — S, M, L, XL…'}
                    {catConfig.sizeSystem === 'NUMERIC_WAIST' && 'Waist — 28, 30, 32…'}
                    {catConfig.sizeSystem === 'FRAGRANCE' && 'Volume — 30ml, 50ml…'}
                    {catConfig.sizeSystem === 'CM' && 'Size / UK — Free, 6UK…'}
                    {catConfig.sizeSystem === 'ONE_SIZE' && 'One Size Fits All'}
                    <input type="hidden" {...register('sizeSystem')} />
                  </div>
                </div>
                <div className="space-y-4 pt-6">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center space-x-2">
                      <Switch id="isNew" checked={watch('isNew')} onCheckedChange={(val) => setValue('isNew', val)} />
                      <Label htmlFor="isNew" className="text-[10px] font-bold uppercase tracking-widest cursor-pointer">New Arrival</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="isSale" checked={watch('isSale')} onCheckedChange={(val) => setValue('isSale', val)} />
                      <Label htmlFor="isSale" className="text-[10px] font-bold uppercase tracking-widest cursor-pointer text-red-500">On Sale</Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Inventory & Variants (Category-Aware) ── */}
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
                    onClick={quickFillAllSizes}
                    className="h-7 px-3 text-[9px] font-bold uppercase tracking-widest gap-1.5 border-primary/30 text-primary hover:bg-primary/5"
                  >
                    <Zap size={11} /> Quick Fill All Sizes
                  </Button>
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

              {/* Quick Size Buttons */}
              {catConfig.sizes.length > 0 && (
                <div className="space-y-2 p-3 bg-muted/10 rounded-xl border border-dashed border-muted/50">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Quick Add Size Variants</p>
                  <div className="flex flex-wrap gap-1.5">
                    {catConfig.sizes.map((size) => {
                      const isAdded = variants.some((v: any) => v.size === size);
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => quickAddVariant(size)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                            isAdded
                              ? 'bg-primary text-primary-foreground border-primary shadow-sm cursor-default'
                              : 'bg-background border-muted hover:border-primary hover:text-primary hover:bg-primary/5'
                          }`}
                        >
                          {size}
                          {isAdded && ' ✓'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {variants.map((_: any, index: number) => (
                  <div key={index} className="grid grid-cols-12 gap-3 items-end bg-muted/5 p-3 rounded-xl border border-muted/20 group">
                    <div className="col-span-3 space-y-1.5">
                      <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">SKU</Label>
                      <Input {...register(`variants.${index}.sku`)} placeholder="TS-BLK-M" className="h-9 bg-background border-none text-xs" />
                    </div>
                    <div className="col-span-2 space-y-1.5">
                      <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                        {catConfig.sizeSystem === 'FRAGRANCE' ? 'Volume' :
                         catConfig.sizeSystem === 'NUMERIC_WAIST' ? 'Waist' :
                         catConfig.sizeSystem === 'CM' ? 'Size' : 'Size'}
                      </Label>
                      <Select
                        value={variants[index]?.size || ''}
                        onValueChange={(val) => {
                          const updated = [...variants];
                          updated[index] = { ...updated[index], size: val };
                          setValue('variants', updated);
                        }}
                      >
                        <SelectTrigger className="h-9 bg-background border-none text-xs font-medium">
                          <SelectValue placeholder={catConfig.sizes[0] || 'Size'} />
                        </SelectTrigger>
                        <SelectContent>
                          {catConfig.sizes.map((s) => (
                            <SelectItem key={s} value={s} className="text-xs font-bold">{s}</SelectItem>
                          ))}
                          <SelectItem value="_custom" className="text-xs italic text-muted-foreground">Custom...</SelectItem>
                        </SelectContent>
                      </Select>
                      {variants[index]?.size === '_custom' && (
                        <Input
                          placeholder="Custom size"
                          className="h-8 bg-background border-none text-xs mt-1"
                          onChange={(e) => {
                            const updated = [...variants];
                            updated[index] = { ...updated[index], size: e.target.value };
                            setValue('variants', updated);
                          }}
                        />
                      )}
                    </div>
                    {catConfig.showColor && (
                      <div className="col-span-2 space-y-1.5">
                        <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Color</Label>
                        <Select
                          value={variants[index]?.color || ''}
                          onValueChange={(val) => {
                            const updated = [...variants];
                            updated[index] = { ...updated[index], color: val };
                            setValue('variants', updated);
                          }}
                        >
                          <SelectTrigger className="h-9 bg-background border-none text-xs font-medium">
                            <SelectValue placeholder="Color" />
                          </SelectTrigger>
                          <SelectContent>
                            {catConfig.colors.map((c) => (
                              <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>
                            ))}
                            <SelectItem value="_custom" className="text-xs italic text-muted-foreground">Custom...</SelectItem>
                          </SelectContent>
                        </Select>
                        {variants[index]?.color === '_custom' && (
                          <Input
                            placeholder="Custom color"
                            className="h-8 bg-background border-none text-xs mt-1"
                            onChange={(e) => {
                              const updated = [...variants];
                              updated[index] = { ...updated[index], color: e.target.value };
                              setValue('variants', updated);
                            }}
                          />
                        )}
                      </div>
                    )}
                    <div className={`${catConfig.showColor ? 'col-span-2' : 'col-span-4'} space-y-1.5`}>
                      <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Stock</Label>
                      <Input type="number" {...register(`variants.${index}.stock`)} className="h-9 bg-background border-none text-xs" />
                    </div>
                    <div className="col-span-2 space-y-1.5">
                      <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Price Ovrd.</Label>
                      <Input type="number" step="0.01" {...register(`variants.${index}.price`)} placeholder="—" className="h-9 bg-background border-none text-xs" />
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
                    <p className="text-[10px] text-muted-foreground/60 mt-1">Use "Quick Fill All Sizes" or click size buttons above</p>
                    <Button type="button" variant="link" onClick={addVariantField} className="text-[10px] font-bold uppercase tracking-widest mt-1">
                      Or add manually
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* ── Tags & Attributes (Category-Aware) ── */}
            <div className="grid grid-cols-2 gap-8">
              {/* Tags */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary border-b pb-2">Search Tags</h3>
                <div className="space-y-3">
                  <Input
                    placeholder="Add tag and press Enter"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag((e.target as HTMLInputElement).value.trim());
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                    className="h-10 bg-muted/20 border-none"
                  />
                  {/* Suggested tags for this category */}
                  <div className="flex flex-wrap gap-1.5">
                    {catConfig.suggestedTags.filter((t) => !tags.includes(t)).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => addSuggestedTag(t)}
                        className="px-2.5 py-1 bg-muted/30 border border-dashed border-muted text-[9px] font-bold uppercase tracking-wider rounded-full hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors"
                      >
                        + {t}
                      </button>
                    ))}
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

              {/* Attributes */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Product Attributes</h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={quickFillAttributes}
                    className="h-6 px-2 text-[9px] font-bold uppercase tracking-wider text-primary hover:bg-primary/5 gap-1"
                  >
                    <Zap size={10} /> Fill Keys
                  </Button>
                </div>

                {/* Category attribute hints */}
                {catConfig.attributeHints.length > 0 && (
                  <div className="space-y-2">
                    {catConfig.attributeHints.map(({ key, placeholder }) => {
                      const currentVal = attributes[key] || '';
                      return (
                        <div key={key} className="grid grid-cols-2 gap-2 items-center">
                          <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{key}</Label>
                          <div className="flex gap-1">
                            <Input
                              value={currentVal}
                              onChange={(e) => setAttribute(key, e.target.value)}
                              placeholder={placeholder}
                              className="h-8 bg-muted/20 border-none text-xs"
                            />
                            {currentVal && (
                              <button type="button" onClick={() => removeAttribute(key)} className="text-muted-foreground hover:text-destructive px-1">
                                <X size={12} />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Extra custom attributes */}
                <div className="space-y-2">
                  <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Custom Attribute</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Input id="attr-key" placeholder="Key (e.g. Pattern)" className="h-9 bg-muted/20 border-none text-xs" />
                    <div className="flex gap-2">
                      <Input id="attr-val" placeholder="Value" className="h-9 bg-muted/20 border-none text-xs" />
                      <Button
                        type="button"
                        size="icon"
                        className="shrink-0 h-9 w-9"
                        onClick={() => {
                          const k = (document.getElementById('attr-key') as HTMLInputElement).value.trim();
                          const v = (document.getElementById('attr-val') as HTMLInputElement).value.trim();
                          if (k && v) {
                            setAttribute(k, v);
                            (document.getElementById('attr-key') as HTMLInputElement).value = '';
                            (document.getElementById('attr-val') as HTMLInputElement).value = '';
                          }
                        }}
                      >
                        <Plus size={15} />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Custom attributes display */}
                <div className="space-y-2 max-h-[100px] overflow-y-auto pr-2 custom-scrollbar">
                  {Object.entries(attributes)
                    .filter(([key]) => !catConfig.attributeHints.some((h) => h.key === key))
                    .map(([key, value]: [string, any]) => (
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
                </div>
              </div>
            </div>

            {/* ── Media Gallery ── */}
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
          <Button type="button" variant="ghost" onClick={onClose} className="text-[10px] font-bold uppercase tracking-widest hover:bg-destructive/10 hover:text-destructive px-6 h-12 rounded-xl transition-all">
            Discard Changes
          </Button>
          <div className="flex gap-4">
            <Button
              type="submit"
              form="product-form"
              disabled={isUploading}
              className="px-12 h-12 rounded-xl shadow-xl shadow-primary/20 bg-primary text-primary-foreground font-bold text-[10px] tracking-[0.25em] hover:scale-[1.02] active:scale-95 transition-all"
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
