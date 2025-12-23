import { useState, useEffect } from 'react';
import { TrashIcon, PencilIcon, PlusIcon, CheckIcon } from '@heroicons/react/24/outline';

const apiGatewayURL = 'http://localhost:3000/api';

const Filters = () => {
  const [filters, setFilters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [categories] = useState(['property-type', 'amenities', 'features', 'location']);
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'property-type',
    description: '',
    isActive: true,
    order: 0,
  });

  // Fetch filters
  const fetchFilters = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiGatewayURL}/filters`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched filters:', data);
      setFilters(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching filters:', error);
      setFilters([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : name === 'order' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        // Update existing filter
        const response = await fetch(`${apiGatewayURL}/filters/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          alert('Filter updated successfully!');
          fetchFilters();
        }
      } else {
        // Create new filter
        const response = await fetch(`${apiGatewayURL}/filters`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          alert('Filter created successfully!');
          fetchFilters();
        }
      }

      // Reset form
      setFormData({
        name: '',
        category: 'property-type',
        description: '',
        isActive: true,
        order: 0,
      });
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error saving filter:', error);
      alert('Error saving filter');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (filter) => {
    setFormData({
      name: filter.name,
      category: filter.category,
      description: filter.description || '',
      isActive: filter.isActive,
      order: filter.order || 0,
    });
    setEditingId(filter._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this filter?')) {
      setLoading(true);
      try {
        const response = await fetch(`${apiGatewayURL}/filters/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('Filter deleted successfully!');
          fetchFilters();
        }
      } catch (error) {
        console.error('Error deleting filter:', error);
        alert('Error deleting filter');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: '',
      category: 'property-type',
      description: '',
      isActive: true,
      order: 0,
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">Filters Management</h1>
        <button
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white rounded-lg font-semibold gap-2 flex items-center transition-all"
          onClick={() => setShowForm(true)}
          disabled={showForm}
        >
          <PlusIcon className="w-5 h-5" />
          Add Filter
        </button>
      </div>

      {/* Form Section */}
      {showForm && (
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg mb-6 p-6">
          <h2 className="text-xl font-bold mb-4 text-white">
            {editingId ? 'Edit Filter' : 'Add New Filter'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-300">Name *</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter filter name"
                  className="input input-bordered bg-gray-900 border-gray-700 text-white placeholder-gray-500"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-300">Category *</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="select select-bordered bg-gray-900 border-gray-700 text-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-300">Order</span>
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  placeholder="Display order"
                  className="input input-bordered bg-gray-900 border-gray-700 text-white placeholder-gray-500"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-300">Active</span>
                </label>
                <label className="label cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="checkbox checkbox-primary"
                  />
                  <span className="label-text ml-2 text-gray-300">Active</span>
                </label>
              </div>

              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text font-semibold text-gray-300">Description</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter description"
                  className="textarea textarea-bordered h-24 bg-gray-900 border-gray-700 text-white placeholder-gray-500"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white rounded-lg font-semibold gap-2 flex items-center transition-all"
                disabled={loading}
              >
                <CheckIcon className="w-5 h-5" />
                {editingId ? 'Update Filter' : 'Create Filter'}
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-semibold transition-all"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters Table */}
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg overflow-hidden">
        {loading && !showForm ? (
          <div className="flex justify-center items-center p-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : filters.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <p>No filters found. Create one to get started!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="bg-gray-900 border-b border-gray-800">
                  <th className="text-gray-300">Name</th>
                  <th className="text-gray-300">Category</th>
                  <th className="text-gray-300">Description</th>
                  <th className="text-gray-300">Order</th>
                  <th className="text-gray-300">Status</th>
                  <th className="text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filters.map((filter) => (
                  <tr key={filter._id} className="border-b border-gray-800 hover:bg-gray-900/50">
                    <td className="font-semibold text-white">{filter.name}</td>
                    <td>
                      <span className="badge badge-outline bg-gray-800 text-gray-300 border-gray-700">
                        {filter.category}
                      </span>
                    </td>
                    <td className="max-w-xs truncate text-gray-400">
                      {filter.description || '-'}
                    </td>
                    <td className="text-gray-300">{filter.order}</td>
                    <td>
                      {filter.isActive ? (
                        <span className="badge bg-green-900 text-green-300 border-green-800 gap-2">
                          <CheckIcon className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="badge bg-gray-800 text-gray-300 border-gray-700">Inactive</span>
                      )}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          className="btn btn-sm bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700"
                          onClick={() => handleEdit(filter)}
                          disabled={loading || showForm}
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          className="btn btn-sm bg-red-900/30 hover:bg-red-900/50 text-red-400 border-red-800"
                          onClick={() => handleDelete(filter._id)}
                          disabled={loading}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Filters;
