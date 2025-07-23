export interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  image: string;
  pricePerDay: number;
  category: string;
  size: string;
  color: string;
  status: 'available' | 'delivered' | 'reserved' | 'washing';
  washingDays?: number; // Number of days needed for washing
}

export interface Booking {
  id: string;
  productId?: string; // For backward compatibility
  products?: BookingProduct[]; // For multiple products
  startDate: string;
  endDate: string;
  deliveryDate?: string;
  returnDate?: string;
  washingStartDate?: string;
  washingEndDate?: string;
  totalPrice: number;
  userDetails: UserDetails;
  status: 'confirmed' | 'delivered' | 'active' | 'returned' | 'washing' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface BookingProduct {
  productId: string;
  quantity: number;
  pricePerDay: number;
  subtotal: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  startDate: string;
  endDate: string;
}

export interface UserDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface DateRange {
  start: string;
  end: string;
}