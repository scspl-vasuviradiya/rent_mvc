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
  productId: string;
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