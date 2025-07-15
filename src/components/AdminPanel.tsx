import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, Upload, Package, TrendingUp, Users, Calendar } from 'lucide-react';
import { Product, Booking } from '../types';

interface AdminPanelProps {
  products: Product[];
  bookings: Booking[];
  onProductUpdate: (products: Product[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ products, bookings, onProductUpdate }) => {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    code: '',
    name: '',
    description: '',
    image: '',
    pricePerDay: 0,
    category: '',
    size: '',
    color: '',
    status: 'available'
  });

  const categories = ['Formal', 'Cocktail', 'Wedding', 'Business', 'Casual', 'Party'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Purple', 'Pink', 'Yellow', 'Gray', 'Brown'];
  const statuses: Product['status'][] = ['available', 'reserved', 'washing'];

  const handleAddProduct = () => {
    if (newProduct.code && newProduct.name && newProduct.pricePerDay && newProduct.category) {
      const product: Product = {
        id: Date.now().toString(),
        code: newProduct.code,
        name: newProduct.name,
        description: newProduct.description || '',
        image: newProduct.image || 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400',
        pricePerDay: newProduct.pricePerDay,
        category: newProduct.category,
        size: newProduct.size || 'M',
        color: newProduct.color || 'Black',
        status: 'available'
      };
      
      onProductUpdate([...products, product]);
      setNewProduct({
        code: '',
        name: '',
        description: '',
        image: '',
        pricePerDay: 0,
        category: '',
        size: '',
        color: '',
        status: 'available'
      });
      setShowAddProduct(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct(product);
    setShowAddProduct(true);
  };

  const handleUpdateProduct = () => {
    if (editingProduct && newProduct.code && newProduct.name && newProduct.pricePerDay && newProduct.category) {
      const updatedProducts = products.map(p => 
        p.id === editingProduct.id 
          ? { ...editingProduct, ...newProduct } as Product
          : p
      );
      onProductUpdate(updatedProducts);
      setEditingProduct(null);
      setNewProduct({
        code: '',
        name: '',
        description: '',
        image: '',
        pricePerDay: 0,
        category: '',
        size: '',
        color: '',
        status: 'available'
      });
      setShowAddProduct(false);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = products.filter(p => p.id !== productId);
      onProductUpdate(updatedProducts);
    }
  };

  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
  const activeBookings = bookings.filter(b => b.status === 'active').length;
  const availableProducts = products.filter(p => p.status === 'available').length;

  const ProductForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button
              onClick={() => {
                setShowAddProduct(false);
                setEditingProduct(null);
                setNewProduct({
                  code: '',
                  name: '',
                  description: '',
                  image: '',
                  pricePerDay: 0,
                  category: '',
                  size: '',
                  color: '',
                  status: 'available'
                });
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            editingProduct ? handleUpdateProduct() : handleAddProduct();
          }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Code *
                </label>
                <input
                  type="text"
                  value={newProduct.code}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, code: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., ED-001"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Day ($) *
                </label>
                <input
                  type="number"
                  value={newProduct.pricePerDay}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, pricePerDay: Number(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={newProduct.image}
                onChange={(e) => setNewProduct(prev => ({ ...prev, image: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size
                </label>
                <select
                  value={newProduct.size}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, size: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {sizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <select
                  value={newProduct.color}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, color: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {colors.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
            </div>

            {editingProduct && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={newProduct.status}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, status: e.target.value as Product['status'] }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex space-x-3 pt-6">
              <button
                type="button"
                onClick={() => {
                  setShowAddProduct(false);
                  setEditingProduct(null);
                  setNewProduct({
                    name: '',
                    description: '',
                    image: '',
                    pricePerDay: 0,
                    category: '',
                    size: '',
                    color: '',
                    status: 'available'
                  });
                }}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-5 h-5 inline mr-2" />
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
            <p className="text-gray-600">Manage your products and monitor business performance</p>
          </div>
          <button
            onClick={() => setShowAddProduct(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </button>
        </div>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{products.length}</div>
              <div className="text-sm text-gray-600">Total Products</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">${totalRevenue}</div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{activeBookings}</div>
              <div className="text-sm text-gray-600">Active Bookings</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-orange-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{availableProducts}</div>
              <div className="text-sm text-gray-600">Available Items</div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Management */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Product Management</h3>
          <p className="text-gray-600">Add, edit, or remove products from your inventory</p>
        </div>
        
        <div className="p-6">
          {products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Product</th>
                    <th className="text-left py-3 px-4">Category</th>
                    <th className="text-left py-3 px-4">Size</th>
                    <th className="text-left py-3 px-4">Price/Day</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover mr-4"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-600">Code: {product.code}</div>
                            <div className="text-sm text-gray-600">Color: {product.color}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-900">{product.code}</td>
                      <td className="py-4 px-4 text-gray-900">{product.category}</td>
                      <td className="py-4 px-4 text-gray-900">{product.size}</td>
                      <td className="py-4 px-4 text-gray-900">${product.pricePerDay}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          product.status === 'available' ? 'bg-green-100 text-green-800' :
                          product.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
              <p className="text-gray-500 mb-4">Start by adding your first product to the inventory.</p>
              <button
                onClick={() => setShowAddProduct(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Add First Product
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Product Form Modal */}
      {showAddProduct && <ProductForm />}
    </div>
  );
};

export default AdminPanel;