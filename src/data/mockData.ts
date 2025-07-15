import { Product } from '../types';

export const mockProducts: Product[] = [
  {
    id: '1',
    code: 'ED-001',
    name: 'Elegant Evening Dress',
    description: 'Stunning black evening dress perfect for formal events',
    image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400',
    pricePerDay: 45,
    category: 'Formal',
    size: 'M',
    color: 'Black',
    status: 'available',
    washingDays: 2
  },
  {
    id: '2',
    code: 'CD-002',
    name: 'Designer Cocktail Dress',
    description: 'Chic red cocktail dress for special occasions',
    image: 'https://images.pexels.com/photos/1926620/pexels-photo-1926620.jpeg?auto=compress&cs=tinysrgb&w=400',
    pricePerDay: 35,
    category: 'Cocktail',
    size: 'S',
    color: 'Red',
    status: 'available',
    washingDays: 2
  },
  {
    id: '3',
    code: 'TX-003',
    name: 'Classic Tuxedo',
    description: 'Premium black tuxedo for formal events',
    image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400',
    pricePerDay: 60,
    category: 'Formal',
    size: 'L',
    color: 'Black',
    status: 'available',
    washingDays: 3
  },
  {
    id: '4',
    code: 'WD-004',
    name: 'Summer Wedding Dress',
    description: 'Light blue wedding guest dress',
    image: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=400',
    pricePerDay: 40,
    category: 'Wedding',
    size: 'M',
    color: 'Blue',
    status: 'washing',
    washingDays: 2
  },
  {
    id: '5',
    code: 'BS-005',
    name: 'Business Suit',
    description: 'Professional navy business suit',
    image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400',
    pricePerDay: 50,
    category: 'Business',
    size: 'L',
    color: 'Navy',
    status: 'reserved',
    washingDays: 3
  },
  {
    id: '6',
    code: 'BM-006',
    name: 'Bohemian Maxi Dress',
    description: 'Flowing bohemian dress perfect for outdoor events',
    image: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=400',
    pricePerDay: 30,
    category: 'Casual',
    size: 'S',
    color: 'Floral',
    status: 'available',
    washingDays: 1
  }
];

// Sample bookings to demonstrate the system
import { Booking } from '../types';

export const mockBookings: Booking[] = [
  {
    id: 'booking-1',
    productId: '1',
    startDate: '2025-01-15',
    endDate: '2025-01-17',
    totalPrice: 135,
    userDetails: {
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1-555-0123',
      address: '123 Main St, New York, NY'
    },
    status: 'confirmed',
    createdAt: '2025-01-10T10:00:00Z'
  },
  {
    id: 'booking-2',
    productId: '2',
    startDate: '2025-01-20',
    endDate: '2025-01-22',
    totalPrice: 105,
    userDetails: {
      name: 'Emily Davis',
      email: 'emily@example.com',
      phone: '+1-555-0456',
      address: '456 Oak Ave, Los Angeles, CA'
    },
    status: 'delivered',
    createdAt: '2025-01-12T14:30:00Z'
  },
  {
    id: 'booking-3',
    productId: '3',
    startDate: '2025-01-25',
    endDate: '2025-01-27',
    totalPrice: 180,
    userDetails: {
      name: 'Michael Brown',
      email: 'michael@example.com',
      phone: '+1-555-0789',
      address: '789 Pine St, Chicago, IL'
    },
    status: 'active',
    createdAt: '2025-01-15T09:15:00Z'
  }
];