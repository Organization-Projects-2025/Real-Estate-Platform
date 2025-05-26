import React, { useState, useEffect } from 'react';
import { getAllProperties, deleteProperty, updateProperty } from '../../services/adminService';
import { FaEdit, FaTrash, FaHome, FaBed, FaBath, FaCar, FaSwimmingPool, FaWifi, FaSnowflake, FaShieldAlt } from 'react-icons/fa';

function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProperty, setEditingProperty] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    listingType: '',
    propertyType: '',
    subType: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: ''
    },
    area: {
      sqft: '',
      sqm: ''
    },
    price: '',
    buildDate: '',
    status: '',
    features: {
    bedrooms: '',
    bathrooms: '',
      garage: '',
      pool: false,
      yard: false,
      pets: false,
      furnished: '',
      airConditioning: false,
      internet: false,
      electricity: false,
      water: false,
      gas: false,
      wifi: false,
      security: false
    }
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await getAllProperties();
      setProperties(response.data.properties);
      setError(null);
    } catch {
      setError('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setFormData({
      title: property.title,
      description: property.description,
      listingType: property.listingType,
      propertyType: property.propertyType,
      subType: property.subType,
      address: property.address,
      area: property.area,
      price: property.price,
      buildDate: new Date(property.buildDate).toISOString().split('T')[0],
      status: property.status,
      features: property.features
    });
  };

  const handleDelete = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        const response = await deleteProperty(propertyId);
        if (response.status === 'success') {
        setProperties(properties.filter(property => property._id !== propertyId));
          setError(null);
        } else {
          setError(response.message || 'Failed to delete property');
        }
      } catch (err) {
        console.error('Delete property error:', err);
        setError(err.response?.data?.message || 'Failed to delete property. Please try again.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateProperty(editingProperty._id, formData);
      setProperties(properties.map(property => 
        property._id === editingProperty._id ? response.data.property : property
      ));
      setEditingProperty(null);
    } catch {
      setError('Failed to update property');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#121212] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Property Management</h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {editingProperty && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#1a1a1a] rounded-lg p-6 w-full max-w-2xl">
              <h2 className="text-2xl font-bold text-white mb-4">Edit Property</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded bg-[#2a2a2a] text-white"
                    required
                  />
                </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Price</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded bg-[#2a2a2a] text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded bg-[#2a2a2a] text-white"
                    rows="3"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-gray-300 mb-2">Listing Type</label>
                    <select
                      name="listingType"
                      value={formData.listingType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded bg-[#2a2a2a] text-white"
                    required
                    >
                      <option value="sale">Sale</option>
                      <option value="rent">Rent</option>
                    </select>
                </div>
                <div>
                    <label className="block text-gray-300 mb-2">Property Type</label>
                  <select
                      name="propertyType"
                      value={formData.propertyType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded bg-[#2a2a2a] text-white"
                    required
                  >
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded bg-[#2a2a2a] text-white"
                    required
                  >
                      <option value="active">Active</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Street Address</label>
                    <input
                      type="text"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded bg-[#2a2a2a] text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">City</label>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded bg-[#2a2a2a] text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">State</label>
                    <input
                      type="text"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded bg-[#2a2a2a] text-white"
                      required
                    />
                  </div>
                <div>
                    <label className="block text-gray-300 mb-2">Country</label>
                  <input
                    type="text"
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded bg-[#2a2a2a] text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Area (sqft)</label>
                    <input
                      type="number"
                      name="area.sqft"
                      value={formData.area.sqft}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded bg-[#2a2a2a] text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Area (sqm)</label>
                    <input
                      type="number"
                      name="area.sqm"
                      value={formData.area.sqm}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded bg-[#2a2a2a] text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Build Date</label>
                    <input
                      type="date"
                      name="buildDate"
                      value={formData.buildDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded bg-[#2a2a2a] text-white"
                    required
                  />
                </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Bedrooms</label>
                    <input
                      type="number"
                      name="features.bedrooms"
                      value={formData.features.bedrooms}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded bg-[#2a2a2a] text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Bathrooms</label>
                    <input
                      type="number"
                      name="features.bathrooms"
                      value={formData.features.bathrooms}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded bg-[#2a2a2a] text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Garage Spaces</label>
                    <input
                      type="number"
                      name="features.garage"
                      value={formData.features.garage}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded bg-[#2a2a2a] text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Furnishing</label>
                  <select
                    name="features.furnished"
                    value={formData.features.furnished}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded bg-[#2a2a2a] text-white"
                    required
                  >
                    <option value="fully">Fully Furnished</option>
                    <option value="partly">Partly Furnished</option>
                    <option value="none">Unfurnished</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="features.pool"
                      checked={formData.features.pool}
                      onChange={handleChange}
                      className="rounded bg-[#2a2a2a] text-purple-600"
                    />
                    <span className="text-gray-300">Pool</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="features.yard"
                      checked={formData.features.yard}
                      onChange={handleChange}
                      className="rounded bg-[#2a2a2a] text-purple-600"
                    />
                    <span className="text-gray-300">Yard</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="features.pets"
                      checked={formData.features.pets}
                      onChange={handleChange}
                      className="rounded bg-[#2a2a2a] text-purple-600"
                    />
                    <span className="text-gray-300">Pets Allowed</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="features.airConditioning"
                      checked={formData.features.airConditioning}
                      onChange={handleChange}
                      className="rounded bg-[#2a2a2a] text-purple-600"
                    />
                    <span className="text-gray-300">Air Conditioning</span>
                  </label>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="features.internet"
                      checked={formData.features.internet}
                      onChange={handleChange}
                      className="rounded bg-[#2a2a2a] text-purple-600"
                    />
                    <span className="text-gray-300">Internet</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="features.electricity"
                      checked={formData.features.electricity}
                      onChange={handleChange}
                      className="rounded bg-[#2a2a2a] text-purple-600"
                    />
                    <span className="text-gray-300">Electricity</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="features.water"
                      checked={formData.features.water}
                      onChange={handleChange}
                      className="rounded bg-[#2a2a2a] text-purple-600"
                    />
                    <span className="text-gray-300">Water</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="features.gas"
                      checked={formData.features.gas}
                      onChange={handleChange}
                      className="rounded bg-[#2a2a2a] text-purple-600"
                    />
                    <span className="text-gray-300">Gas</span>
                  </label>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setEditingProperty(null)}
                    className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-[#1a1a1a] rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#2a2a2a]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {properties.map((property) => (
                  <tr key={property._id} className="hover:bg-[#2a2a2a]">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center">
                            <FaHome className="text-white" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">
                            {property.title}
                          </div>
                          <div className="text-sm text-gray-300">
                            {property.address.city}, {property.address.state}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-300 space-y-1">
                        <div className="flex items-center">
                          <FaBed className="mr-2 text-gray-400" />
                          {property.features.bedrooms} beds
                        </div>
                        <div className="flex items-center">
                          <FaBath className="mr-2 text-gray-400" />
                          {property.features.bathrooms} baths
                        </div>
                        <div className="flex items-center">
                          <FaCar className="mr-2 text-gray-400" />
                          {property.features.garage} garage
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        ${property.price.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-400">
                        {property.listingType === 'rent' ? '/month' : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                          {property.propertyType}
                        </span>
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {property.listingType}
                      </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        property.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(property)}
                        className="text-purple-600 hover:text-purple-900 mr-4"
                        title="Edit Property"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(property._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Property"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Properties; 