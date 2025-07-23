import React from 'react';
import { Product } from '../types';
import { Calendar, Tag, Palette, Ruler, AlertCircle, ShoppingCart } from 'lucide-react';
import { getStatusColor, getStatusText } from '../utils/statusUtils';

interface ProductCardProps {
  product: Product;
  isFullyBooked?: boolean;
  nextAvailableDate?: string;
  onSelect: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  isFullyBooked = false,
  nextAvailableDate,
  onSelect,
  onAddToCart
}) => {

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(product.status)}`}>
            {getStatusText(product.status)}
          </span>
        </div>
        {isFullyBooked && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              Fully Booked
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-1">Code: {product.code}</p>
        <p className="text-gray-600 mb-4 text-sm">{product.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Tag className="w-4 h-4 mr-1" />
              {product.category}
            </div>
            <div className="flex items-center">
              <Ruler className="w-4 h-4 mr-1" />
              {product.size}
            </div>
            <div className="flex items-center">
              <Palette className="w-4 h-4 mr-1" />
              {product.color}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">
            ${product.pricePerDay}
            <span className="text-sm font-normal text-gray-500">/day</span>
            {product.washingDays && (
              <div className="text-xs text-gray-500 mt-1">
                Washing: {product.washingDays} days
              </div>
            )}
          </div>
          <div className="text-right">
            {nextAvailableDate && isFullyBooked && (
              <p className="text-xs text-gray-500 mb-1">
                Next available: {new Date(nextAvailableDate).toLocaleDateString()}
              </p>
            )}
            <button
          <div className="space-y-2">
            <button
              onClick={() => onSelect(product)}
              disabled={product.status !== 'available'}
              className={`w-full px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                product.status === 'available'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              {product.status === 'available' ? 'Check Dates' : 'Unavailable'}
            </button>
            
            {onAddToCart && product.status === 'available' && (
              <button
                onClick={() => onAddToCart(product)}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm"
              >
                <ShoppingCart className="w-4 h-4 inline mr-2" />
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;