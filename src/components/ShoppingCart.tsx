import React, { useState } from 'react';
import { ShoppingCart as CartIcon, X, Plus, Minus, Calendar, Trash2 } from 'lucide-react';
import { CartItem, DateRange } from '../types';
import { formatDate, calculateDays } from '../utils/dateUtils';

interface ShoppingCartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onUpdateDates: (productId: string, dateRange: DateRange) => void;
  onProceedToCheckout: () => void;
  onClose: () => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onUpdateDates,
  onProceedToCheckout,
  onClose
}) => {
  const [editingDates, setEditingDates] = useState<string | null>(null);
  const [tempStartDate, setTempStartDate] = useState('');
  const [tempEndDate, setTempEndDate] = useState('');

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const days = calculateDays(item.startDate, item.endDate);
      return total + (item.product.pricePerDay * days * item.quantity);
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleEditDates = (item: CartItem) => {
    setEditingDates(item.product.id);
    setTempStartDate(item.startDate);
    setTempEndDate(item.endDate);
  };

  const handleSaveDates = (productId: string) => {
    if (tempStartDate && tempEndDate) {
      onUpdateDates(productId, { start: tempStartDate, end: tempEndDate });
      setEditingDates(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingDates(null);
    setTempStartDate('');
    setTempEndDate('');
  };

  if (cartItems.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <CartIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">Add some products to your cart to get started.</p>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <CartIcon className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">
                Shopping Cart ({getTotalItems()} items)
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4 mb-6">
            {cartItems.map((item) => {
              const days = calculateDays(item.startDate, item.endDate);
              const subtotal = item.product.pricePerDay * days * item.quantity;

              return (
                <div key={item.product.id} className="border rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                      <p className="text-sm text-gray-600">{item.product.category} • {item.product.size} • {item.product.color}</p>
                      <p className="text-sm text-gray-600">Code: {item.product.code}</p>
                      
                      {editingDates === item.product.id ? (
                        <div className="mt-3 space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="date"
                              value={tempStartDate}
                              onChange={(e) => setTempStartDate(e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                            <input
                              type="date"
                              value={tempEndDate}
                              onChange={(e) => setTempEndDate(e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleSaveDates(item.product.id)}
                              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-2 flex items-center space-x-4">
                          <div className="text-sm">
                            <span className="text-gray-600">Dates: </span>
                            <span className="font-medium">
                              {formatDate(item.startDate)} - {formatDate(item.endDate)} ({days} days)
                            </span>
                          </div>
                          <button
                            onClick={() => handleEditDates(item)}
                            className="text-blue-600 hover:text-blue-700 text-sm"
                          >
                            <Calendar className="w-4 h-4 inline mr-1" />
                            Edit Dates
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">${subtotal}</div>
                      <div className="text-sm text-gray-600">${item.product.pricePerDay}/day</div>
                      
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-3 py-1 border border-gray-300 rounded bg-gray-50 min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="mt-2 text-red-600 hover:text-red-700 text-sm flex items-center"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-blue-600">${getTotalPrice()}</span>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>
              <button
                onClick={onProceedToCheckout}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;</parameter>