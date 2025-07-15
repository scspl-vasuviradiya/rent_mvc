import React, { useState } from 'react';
import { Search, Plus, Mail, Phone, MapPin, Calendar, DollarSign, Edit, Trash2, User, Filter } from 'lucide-react';
import { Booking, Product } from '../types';
import { formatDate } from '../utils/dateUtils';

interface CustomerManagementProps {
  bookings: Booking[];
  products: Product[];
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalBookings: number;
  totalSpent: number;
  lastBooking: string;
  status: 'active' | 'inactive';
}

const CustomerManagement: React.FC<CustomerManagementProps> = ({ bookings, products }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);

  // Generate customers from bookings
  const customers: Customer[] = React.useMemo(() => {
    const customerMap = new Map<string, Customer>();
    
    bookings.forEach(booking => {
      const key = booking.userDetails.email;
      if (customerMap.has(key)) {
        const customer = customerMap.get(key)!;
        customer.totalBookings += 1;
        customer.totalSpent += booking.totalPrice;
        if (new Date(booking.createdAt) > new Date(customer.lastBooking)) {
          customer.lastBooking = booking.createdAt;
        }
      } else {
        customerMap.set(key, {
          id: key,
          name: booking.userDetails.name,
          email: booking.userDetails.email,
          phone: booking.userDetails.phone,
          address: booking.userDetails.address,
          totalBookings: 1,
          totalSpent: booking.totalPrice,
          lastBooking: booking.createdAt,
          status: 'active'
        });
      }
    });

    return Array.from(customerMap.values()).sort((a, b) => 
      new Date(b.lastBooking).getTime() - new Date(a.lastBooking).getTime()
    );
  }, [bookings]);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getCustomerBookings = (customerEmail: string) => {
    return bookings.filter(booking => booking.userDetails.email === customerEmail);
  };

  const CustomerCard: React.FC<{ customer: Customer }> = ({ customer }) => (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
            {customer.name.charAt(0).toUpperCase()}
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
            <p className="text-sm text-gray-600">{customer.email}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          customer.status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center">
          <Phone className="w-4 h-4 text-gray-400 mr-2" />
          <span className="text-sm text-gray-600">{customer.phone}</span>
        </div>
        <div className="flex items-center">
          <MapPin className="w-4 h-4 text-gray-400 mr-2" />
          <span className="text-sm text-gray-600 truncate">{customer.address}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{customer.totalBookings}</div>
          <div className="text-xs text-gray-600">Bookings</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">${customer.totalSpent}</div>
          <div className="text-xs text-gray-600">Total Spent</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium text-gray-900">
            {formatDate(customer.lastBooking.split('T')[0])}
          </div>
          <div className="text-xs text-gray-600">Last Booking</div>
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => setSelectedCustomer(customer)}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          View Details
        </button>
        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          <Edit className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const CustomerDetailsModal: React.FC<{ customer: Customer; onClose: () => void }> = ({ customer, onClose }) => {
    const customerBookings = getCustomerBookings(customer.email);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                  {customer.name.charAt(0).toUpperCase()}
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold text-gray-900">{customer.name}</h2>
                  <p className="text-gray-600">{customer.email}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-gray-400 mr-3" />
                    <span>{customer.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-gray-400 mr-3" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                    <span>{customer.address}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{customer.totalBookings}</div>
                    <div className="text-sm text-blue-800">Total Bookings</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">${customer.totalSpent}</div>
                    <div className="text-sm text-green-800">Total Spent</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking History</h3>
              <div className="space-y-3">
                {customerBookings.map(booking => {
                  const product = products.find(p => p.id === booking.productId);
                  return (
                    <div key={booking.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {product && (
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover mr-4"
                            />
                          )}
                          <div>
                            <h4 className="font-medium">{product?.name}</h4>
                            <p className="text-sm text-gray-600">
                              {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-blue-600">${booking.totalPrice}</div>
                          <div className={`text-sm px-2 py-1 rounded ${
                            booking.status === 'active' ? 'bg-green-100 text-green-800' :
                            booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {booking.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Customer Management</h2>
            <p className="text-gray-600">Manage your customers and view their booking history</p>
          </div>
          <button
            onClick={() => setShowAddCustomer(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <User className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{customers.length}</div>
              <div className="text-sm text-gray-600">Total Customers</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{bookings.length}</div>
              <div className="text-sm text-gray-600">Total Bookings</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                ${bookings.reduce((sum, booking) => sum + booking.totalPrice, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <User className="w-8 h-8 text-orange-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {customers.filter(c => c.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">Active Customers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Customers Grid */}
      {filteredCustomers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map(customer => (
            <CustomerCard key={customer.id} customer={customer} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
          <p className="text-gray-500">
            {customers.length === 0 
              ? "Customers will appear here once bookings are made."
              : "No customers match your search criteria."
            }
          </p>
        </div>
      )}

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <CustomerDetailsModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
};

export default CustomerManagement;