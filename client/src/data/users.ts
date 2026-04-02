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
  trackingStep?: number; // 1: Placed, 2: Processing, 3: Out for Delivery, 4: Delivered
}

export interface UserData {
  id: string;
  fullName: string;
  email: string;
  password?: string; // In a real app, never store passwords like this
  phone: string;
  memberSince: string;
  avatar?: string;
  orders: UserOrder[];
  addresses: UserAddress[];
  wishlistCount: number;
}

export const users: UserData[] = [
  {
    id: "user-1",
    fullName: "Alexander Pierce",
    email: "alex.pierce@email.com",
    password: "password123",
    phone: "+1 (555) 123-4567",
    memberSince: "January 2025",
    wishlistCount: 5,
    orders: [
      { id: "ORD-784521", date: "Mar 15, 2026", total: 384, status: "Delivered", items: 2 },
      { id: "ORD-639102", date: "Mar 02, 2026", total: 195, status: "Pending", items: 1 },
      { id: "ORD-521847", date: "Feb 20, 2026", total: 510, status: "Cancelled", items: 3 },
      { id: "492100", date: "Jan 15, 2026", total: 120, status: "Delivered", items: 1 },
    ],
    addresses: [
      {
        id: "addr-1",
        name: "Alexander Pierce",
        addressLines: ["42 East 12th Street, Apt 4B"],
        city: "New York",
        state: "NY",
        zip: "10003",
        isDefault: true,
        label: "Home",
        phone: "+1 (555) 123-4567"
      },
      {
        id: "addr-2",
        name: "Alexander Pierce",
        addressLines: ["350 Park Avenue, 20th Floor"],
        city: "New York",
        state: "NY",
        zip: "10022",
        isDefault: false,
        label: "Office",
        phone: "+1 (555) 123-4567"
      }
    ]
  },
  {
    id: "user-2",
    fullName: "John Doe",
    email: "john@example.com",
    password: "password123",
    phone: "+1 (555) 987-6543",
    memberSince: "November 2025",
    wishlistCount: 2,
    orders: [],
    addresses: []
  }
];
