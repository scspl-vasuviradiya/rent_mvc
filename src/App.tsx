import React, { useState } from 'react';
import { Product, Booking, DateRange, CartItem } from './types';
import { mockProducts, mockBookings } from './data/mockData';
import { useLocalStorage } from './hooks/useLocalStorage';
import { getNextAvailableDate, isProductAvailableForDates } from './utils/availabilityUtils';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import AvailabilityCalendar from './components/AvailabilityCalendar';
import BookingForm from './components/BookingForm';
import MultipleBookingForm from './components/MultipleBookingForm';
import BookingConfirmation from './components/BookingConfirmation';
import BookingsList from './components/BookingsList';
import CustomerManagement from './components/CustomerManagement';
import AdminPanel from './components/AdminPanel';
import UnifiedAvailabilityChecker from './components/UnifiedAvailabilityChecker';
import ShoppingCart from './components/ShoppingCart';
import AddToCartModal from './components/AddToCartModal';
import { Search, Filter } from 'lucide-react';

function App() {
  const [products, setProducts] = useLocalStorage<Product[]>('products', mockProducts);
  const [bookings, setBookings] = useLocalStorage<Booking[]>('bookings', mockBookings);
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>('cartItems', []);
  const [activeTab, setActiveTab] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Modal states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | null>(null);
  const [preSelectedDate, setPreSelectedDate] = useState<string>('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showMultipleBookingForm, setShowMultipleBookingForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [lastBooking, setLastBooking] = useState<Booking | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [selectedProductForCart, setSelectedProductForCart] = useState<Product | null>(null);

  const categories = ['all', ...new Set(products.map(p => p.category))];
  const statuses = ['all', 'available', 'reserved', 'washing'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleProductSelect = (product: Product, preSelectedStartDate?: string) => {
    setSelectedProduct(product);
    setPreSelectedDate(preSelectedStartDate || '');
  };

  const handleDateSelect = (range: DateRange) => {
    setSelectedDateRange(range);
    setShowBookingForm(true);
  };

  const handleBookingComplete = (booking: Booking) => {
    setBookings(prev => [...prev, booking]);
    
    // Handle both single and multiple product bookings
    if (booking.productId) {
      // Single product booking
      setProducts(prev => prev.map(p => 
        p.id === booking.productId 
          ? { ...p, status: 'delivered' as const }
          : p
      ));
    } else if (booking.products) {
      // Multiple product booking
      const productIds = booking.products.map(bp => bp.productId);
      setProducts(prev => prev.map(p => 
        productIds.includes(p.id)
          ? { ...p, status: 'delivered' as const }
          : p
      ));
      // Clear cart after successful booking
      setCartItems([]);
    }
    
    setLastBooking(booking);
    setShowBookingForm(false);
    setShowMultipleBookingForm(false);
    setShowConfirmation(true);
  };

  const handleCloseAllModals = () => {
    setSelectedProduct(null);
    setSelectedDateRange(null);
    setPreSelectedDate('');
    setShowBookingForm(false);
    setShowConfirmation(false);
    setShowMultipleBookingForm(false);
    setLastBooking(null);
  };

  const handleBookingUpdate = (updatedBooking: Booking) => {
    setBookings(prev => prev.map(b => 
      b.id === updatedBooking.id ? updatedBooking : b
    ));
    
    // Update product status based on booking status
    if (updatedBooking.status === 'completed') {
      setProducts(prev => prev.map(p => 
        p.id === updatedBooking.productId 
          ? { ...p, status: 'available' as const }
          : p
      ));
    } else if (updatedBooking.status === 'washing') {
      setProducts(prev => prev.map(p => 
        p.id === updatedBooking.productId 
          ? { ...p, status: 'washing' as const }
          : p
      ));
    } else if (updatedBooking.status === 'delivered') {
      setProducts(prev => prev.map(p => 
        p.id === updatedBooking.productId 
          ? { ...p, status: 'delivered' as const }
          : p
      ));
    }
  };

  const handleAddToCart = (product: Product) => {
    setSelectedProductForCart(product);
    setShowAddToCartModal(true);
  };

  const handleAddToCartConfirm = (product: Product, quantity: number, dateRange: DateRange) => {
    const newCartItem: CartItem = {
      product,
      quantity,
      startDate: dateRange.start,
      endDate: dateRange.end
    };
    
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      if (existingIndex >= 0) {
        // Update existing item
        const updated = [...prev];
        updated[existingIndex] = newCartItem;
        return updated;
      } else {
        // Add new item
        return [...prev, newCartItem];
      }
    });
    
    setShowAddToCartModal(false);
    setSelectedProductForCart(null);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    setCartItems(prev => prev.map(item => 
      item.product.id === productId 
        ? { ...item, quantity }
        : item
    ));
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleUpdateCartDates = (productId: string, dateRange: DateRange) => {
    setCartItems(prev => prev.map(item => 
      item.product.id === productId 
        ? { ...item, startDate: dateRange.start, endDate: dateRange.end }
        : item
    ));
  };

  const handleProceedToCheckout = () => {
    setShowCart(false);
    setShowMultipleBookingForm(true);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const renderProductsTab = () => (
    <div className="space-y-6">
      {/* Product Availability & Status */}
      <UnifiedAvailabilityChecker 
        products={products} 
        bookings={bookings} 
        onProductSelect={handleProductSelect}
      />
      
      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by product code or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            nextAvailableDate={getNextAvailableDate(product.id, bookings)}
            onSelect={handleProductSelect}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );

  const renderBookingsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">All Bookings</h2>
        <BookingsList 
          bookings={bookings} 
          products={products} 
          onBookingUpdate={handleBookingUpdate}
        />
      </div>
    </div>
  );

  const renderCustomersTab = () => (
    <CustomerManagement bookings={bookings} products={products} />
  );

  const renderAdminTab = () => (
    <AdminPanel 
      products={products} 
      bookings={bookings} 
      onProductUpdate={setProducts}
    />
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'products':
        return renderProductsTab();
      case 'bookings':
        return renderBookingsTab();
      case 'customers':
        return renderCustomersTab();
      case 'admin':
        return renderAdminTab();
      default:
        return renderProductsTab();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        cartItemCount={getCartItemCount()}
        onCartClick={() => setShowCart(true)}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActiveTab()}
      </main>

      {/* Modals */}
      {selectedProduct && !selectedDateRange && (
        <AvailabilityCalendar
          product={selectedProduct}
          bookings={bookings}
          preSelectedDate={preSelectedDate}
          onDateSelect={handleDateSelect}
          onClose={handleCloseAllModals}
        />
      )}

      {showBookingForm && selectedProduct && selectedDateRange && (
        <BookingForm
          product={selectedProduct}
          dateRange={selectedDateRange}
          existingBookings={bookings}
          onBookingComplete={handleBookingComplete}
          onClose={handleCloseAllModals}
        />
      )}

      {showMultipleBookingForm && cartItems.length > 0 && (
        <MultipleBookingForm
          cartItems={cartItems}
          onBookingComplete={handleBookingComplete}
          onClose={handleCloseAllModals}
        />
      )}

      {showConfirmation && lastBooking && selectedProduct && (
        <BookingConfirmation
          booking={lastBooking}
          product={selectedProduct}
          onClose={handleCloseAllModals}
        />
      )}

      {showCart && (
        <ShoppingCart
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveFromCart}
          onUpdateDates={handleUpdateCartDates}
          onProceedToCheckout={handleProceedToCheckout}
          onClose={() => setShowCart(false)}
        />
      )}

      {showAddToCartModal && selectedProductForCart && (
        <AddToCartModal
          product={selectedProductForCart}
          onAddToCart={handleAddToCartConfirm}
          onClose={() => {
            setShowAddToCartModal(false);
            setSelectedProductForCart(null);
          }}
        />
      )}
    </div>
  );
}

export default App;