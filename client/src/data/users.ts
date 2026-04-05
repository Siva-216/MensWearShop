export interface UserAddress {
  id: string;
  name: string;
  addressLines: string[];
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
  label?: string;
  phone?: string;
  altPhone?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface UserOrder {
  id: string;
  date: string;
  total: number;
  status: 'Delivered' | 'Pending' | 'Cancelled' | 'Processing';
  items: OrderItem[] | number;
  address?: UserAddress;
  paymentMethod?: string;
  trackingStep?: number;
}

export interface UserData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  memberSince: string;
  role: 'admin' | 'staff' | 'user';
  orders: UserOrder[];
  addresses: UserAddress[];
  wishlistCount: number;
}
