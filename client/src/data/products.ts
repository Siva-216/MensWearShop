export interface Product {
  id: string;
  name: string;
  category?: string;
  categoryId?: string;
  categoryName?: string;
  brand: string;
  price: number;
  discountPrice?: number;
  description: string;
  images: string[];
  sizes: string[];
  colors?: string[];
  rating: number;
  stock: number;
  isNew?: boolean;
  isSale?: boolean;
}
