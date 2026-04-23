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
import { Loader2, Upload, Link as LinkIcon, Image as ImageIcon, Plus, Minus, Tag, ListOrdered, FileText } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  category?: any;
  categories?: any[];
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  category,
  categories = [],
}) => {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
  const [isUploading, setIsUploading] = useState(false);
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('upload');
  
  const imageList = watch('images') || [''];

  useEffect(() => {
    if (category) {
      reset({
        ...category,
        images: category.images && category.images.length > 0 ? category.images : [''],
        parentId: category.parentId || 'none',
        priority: category.priority || 0
      });
      setImageMode('upload');
    } else {
      reset({
        name: '',
        slug: '',
        description: '',
        images: [''],
        parentId: 'none',
        priority: 0
      });
      setImageMode('upload');
    }
  }, [category, reset]);

  // Auto-generate slug from name
  const name = watch('name');
  useEffect(() => {
    if (!category && name) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setValue('slug', slug);
    }
  }, [name, category, setValue]);

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
      toast.success('Category image uploaded');
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

  const onFormSubmit = (data: any) => {
    const cleanImages = data.images.filter((img: string) => img && img.trim() !== '');
    const formattedData = {
      ...data,
      images: cleanImages,
      priority: Number(data.priority) || 0,
      parentId: data.parentId === 'none' ? null : data.parentId,
    };
    onSubmit(formattedData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[92vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-8 pt-8 pb-4 border-b">
          <DialogTitle className="text-2xl font-display font-bold">{category ? 'Refine Category' : 'Architect New Collection'}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-10 custom-scrollbar bg-background">
          <form id="category-form" onSubmit={handleSubmit(onFormSubmit)} className="space-y-10">
            {/* Essential Metadata */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b pb-2">
                <Tag size={16} className="text-primary" />
                <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-foreground">Taxonomy & Meta</h3>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category Identity</Label>
                  <Input 
                    id="name" 
                    {...register('name', { required: 'Name is required' })} 
                    placeholder="e.g. Vintage Denim" 
                    className={`h-12 border-none bg-muted/20 focus-visible:ring-1 ${errors.name ? 'ring-1 ring-destructive' : ''}`}
                  />
                  {errors.name && <p className="text-[9px] text-destructive font-bold uppercase tracking-widest ml-1">{(errors.name as any).message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Permalink Segment</Label>
                  <Input 
                    id="slug" 
                    {...register('slug', { required: 'Slug is required' })} 
                    placeholder="e.g. vintage-denim" 
                    className="h-12 border-none bg-muted/20 focus-visible:ring-1 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="parentId" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Parent Level</Label>
                  <Select 
                    onValueChange={(val) => setValue('parentId', val)}
                    value={watch('parentId') || 'none'}
                  >
                    <SelectTrigger className="h-12 border-none bg-muted/20 focus-visible:ring-1 shadow-none">
                      <SelectValue placeholder="Select Parent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none" className="font-bold">Primary Catalog Item</SelectItem>
                      {categories
                        .filter(c => !category || c.id !== category.id) 
                        .map(c => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <ListOrdered size={14} className="text-muted-foreground" />
                    <Label htmlFor="priority" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Order Priority</Label>
                  </div>
                  <Input 
                    id="priority" 
                    type="number"
                    {...register('priority')} 
                    className="h-12 border-none bg-muted/20 focus-visible:ring-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={14} className="text-muted-foreground" />
                  <Label htmlFor="description" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Market Description</Label>
                </div>
                <Textarea 
                  id="description" 
                  {...register('description')} 
                  placeholder="Summary of this collection (Used for SEO and display headers)..." 
                  className="min-h-[100px] border-none bg-muted/20 focus-visible:ring-1 resize-none text-sm p-4"
                />
              </div>
            </div>

            {/* Visual Media Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary"><ImageIcon size={18} /></div>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-foreground">Collection Highlights</h3>
                </div>
                <div className="flex bg-background border rounded-xl p-1 shadow-sm">
                  <button 
                    type="button"
                    onClick={() => setImageMode('upload')}
                    className={`px-5 py-2 text-[10px] uppercase font-bold tracking-[0.15em] rounded-lg transition-all flex items-center gap-2 ${imageMode === 'upload' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-muted'}`}
                  >
                    <Upload size={14} /> Upload
                  </button>
                  <button 
                    type="button"
                    onClick={() => setImageMode('url')}
                    className={`px-5 py-2 text-[10px] uppercase font-bold tracking-[0.15em] rounded-lg transition-all flex items-center gap-2 ${imageMode === 'url' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-muted'}`}
                  >
                    <LinkIcon size={14} /> Source
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {imageList.map((url: string, index: number) => (
                  <div key={index} className="relative group border border-muted-foreground/10 rounded-2xl p-6 bg-muted/5 transition-all hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20">
                    <div className="flex items-center gap-6">
                      <div className="flex-1">
                        <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-3 block ml-1">Asset Pipeline {index + 1}</Label>
                        {imageMode === 'upload' ? (
                          <div className="space-y-2">
                            <Input 
                              type="file" 
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, index)}
                              className="bg-background file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer w-full h-12 border-none shadow-inner rounded-xl"
                              disabled={isUploading}
                            />
                            {url && (
                              <p className="text-[9px] text-muted-foreground truncate px-2 italic">
                                Current Asset: {url.split('/').pop()}
                              </p>
                            )}
                            {/* Keep the value registered even when in upload mode */}
                            <input type="hidden" {...register(`images.${index}`)} />
                          </div>
                        ) : (
                          <Input 
                            {...register(`images.${index}`)}
                            placeholder="https://images.unsplash.com/..." 
                            className="h-12 bg-background border-none shadow-inner rounded-xl text-xs"
                          />
                        )}
                      </div>
                      
                      {imageList.length > 1 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeImageField(index)}
                          className="h-12 w-12 rounded-xl text-destructive hover:bg-destructive/10 shrink-0 mt-6"
                        >
                          <Minus size={20} />
                        </Button>
                      )}
                    </div>

                    {url && (
                      <div className="mt-6 flex items-start gap-6 p-4 bg-background rounded-xl shadow-sm border animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="w-full h-48 rounded-xl overflow-hidden shadow-lg shrink-0 relative group-hover:scale-[1.01] transition-transform duration-500">
                           <img src={url} alt="Preview" className="w-full h-full object-cover" />
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
                  <Plus size={22} className="mr-3 text-primary group-hover:scale-125 transition-transform" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-primary">Add More Media Content</span>
                </Button>
              </div>
            </div>
          </form>
        </div>

        <DialogFooter className="px-8 py-6 border-t bg-muted/5 flex justify-between items-center">
          <Button type="button" variant="ghost" onClick={onClose} className="text-[10px] font-bold uppercase tracking-widest hover:bg-destructive/10 hover:text-destructive px-8 h-12 rounded-xl transition-all">Discard</Button>
          <Button 
            type="submit" 
            form="category-form"
            disabled={isUploading}
            className="px-14 h-12 rounded-xl shadow-2xl shadow-primary/25 bg-primary text-primary-foreground font-bold text-[10px] uppercase tracking-[0.25em] hover:scale-[1.02] active:scale-95 transition-all"
          >
            {isUploading ? <Loader2 className="animate-spin mr-3" size={18} /> : null}
            {category ? 'Sync Collection' : 'Architect Category'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
