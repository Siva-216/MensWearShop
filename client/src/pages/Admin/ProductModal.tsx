import React, { useEffect } from 'react';
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

  useEffect(() => {
    if (product) {
      reset({
        ...product,
        images: product.images && product.images.length > 0 ? product.images : [''],
      });
    } else {
      reset({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        categoryId: '',
        categoryName: '',
        images: [''],
        brand: '',
        sizes: [],
        colors: [],
      });
    }
  }, [product, reset]);

  const onFormSubmit = (data: any) => {
    // Ensure images is a clean array of strings
    const imageList = Array.isArray(data.images) 
      ? data.images.filter((img: string) => typeof img === 'string' && img.trim() !== '')
      : Object.values(data.images || {}).filter((img: any) => typeof img === 'string' && img.trim() !== '');

    // Destructure to separate ID from properties
    const { id, ...rest } = data;

    const formattedData = {
      ...rest,
      price: Number(data.price) || 0,
      stock: Number(data.stock) || 0,
      discountPrice: Number(data.discountPrice) || 0,
      rating: Number(data.rating) || 0,
      numReviews: Number(data.numReviews) || 0,
      images: imageList,
      sizes: Array.isArray(data.sizes) ? data.sizes : [],
      colors: Array.isArray(data.colors) ? data.colors : [],
    };

    // Only include ID if it is a non-empty string (important for PUT requests)
    // Omit it for new product creations (POST)
    if (id && typeof id === 'string' && id.trim() !== '') {
      (formattedData as any).id = id;
    }

    console.log("Submitting perfectly formatted data to backend:", formattedData);
    onSubmit(formattedData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" {...register('name', { required: true })} placeholder="e.g. Classic Cotton T-Shirt" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" {...register('brand')} placeholder="e.g. FashionWorld" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description')} placeholder="Describe your product..." className="min-h-[100px]" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input id="price" type="number" step="0.01" {...register('price', { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input id="stock" type="number" {...register('stock', { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
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
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat: any) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                  {categories.length === 0 && (
                    <SelectItem value="none" disabled>No categories available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input id="image" {...register('images.0')} placeholder="https://..." />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{product ? 'Update Product' : 'Create Product'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
