export interface Product {
  id: string;
  name: string;
  category?: string;
  categoryId?: string;
  categoryName?: string;
  brand: string;
  price: number;
  basePrice?: number;
  discountPrice?: number;
  description: string;
  images: string[];
  sizes: string[];
  colors?: string[];
  rating: number;
  stock: number;
  salesCount?: number;
  isNew?: boolean;
  isSale?: boolean;
  createdAt?: string;
}
