export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
  joinedAt: string;
  loyaltyStatus: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  totalSpent: number;
}

export interface Perfume {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  category: 'floral' | 'woody' | 'citrus' | 'fresh' | 'oriental';
  rating: number;
  volume: string;
  description: string;
  notes: {
    top: string;
    heart: string;
    base: string;
  };
}

export interface CartItem {
  perfume: Perfume;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  shippingName: string;
  shippingPhone: string;
  paymentMethod: string;
}

export interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
}
