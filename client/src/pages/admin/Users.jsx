import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllUsers, deactivateUser, updateUser, reactivateUser } from '../../services/adminService';
import { FaEdit, FaUserSlash, FaUser, FaPhone, FaWhatsapp, FaEnvelope, FaCalendarAlt, FaUserCheck } from 'react-icons/fa';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    phoneNumber: '',
    whatsapp: '',
    contactEmail: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      console.log('Users response:', response); // Debug log
      if (response && response.data && response.data.users) {
        setUsers(response.data.users);
      } else {
        console.error('Unexpected response structure:', response);
        setError('Invalid response format from server');
      }
      setError(null);
    } catch (error) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber || '',
      whatsapp: user.whatsapp || '',
      contactEmail: user.contactEmail || '',
    });
  };

  const handleDeactivate = async (userId) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      try {
        await deactivateUser(userId);
        setUsers(users.map(user => 
          user._id === userId ? { ...user, active: false } : user
        ));
        toast.success('User deactivated successfully!');
      } catch (error) {
        toast.error('Failed to deactivate user');
        console.error('Error deactivating user:', error);
      }
    }
  };

  const handleReactivate = async (userId) => {
    if (window.confirm('Are you sure you want to reactivate this user?')) {
      try {
        const response = await reactivateUser(userId);
        console.log('Reactivate response:', response);
        if (response && response.data && response.data.user) {
          setUsers(users.map(user => 
            user._id === userId ? response.data.user : user
          ));
          toast.success('User reactivated successfully!');
        } else {
          console.error('Unexpected reactivation response:', response);
          toast.error('Failed to reactivate user: Invalid response format');
        }
      } catch (error) {
        console.error('Error reactivating user:', error);
        toast.error(error.response?.data?.message || 'Failed to reactivate user');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateUser(editingUser._id, formData);
      setUsers(users.map(user => 
        user._id === editingUser._id ? response.data.user : user
      ));
      setEditingUser(null);
      toast.success('User updated successfully!');
    } catch (error) {
      toast.error('Failed to update user');
      console.error('Error updating user:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
        <h1 className="text-3xl font-bold text-white mb-8">User Management</h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {editingUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-[#1a1a1a] rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold text-white mb-4">Edit User</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded bg-[#2a2a2a] text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded bg-[#2a2a2a] text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded bg-[#2a2a2a] text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded bg-[#2a2a2a] text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">WhatsApp</label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded bg-[#2a2a2a] text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Contact Email</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded bg-[#2a2a2a] text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded bg-[#2a2a2a] text-white"
                    required
                  >
                    <option value="user">User</option>
                    <option value="agent">Agent</option>
                    <option value="developer">Developer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
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
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-[#2a2a2a]">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center">
                            <FaUser className="text-white" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-300 space-y-1">
                        {user.phoneNumber && (
                          <div className="flex items-center">
                            <FaPhone className="mr-2 text-gray-400" />
                            {user.phoneNumber}
                          </div>
                        )}
                        {user.whatsapp && (
                          <div className="flex items-center">
                            <FaWhatsapp className="mr-2 text-gray-400" />
                            {user.whatsapp}
                          </div>
                        )}
                        {user.contactEmail && (
                          <div className="flex items-center">
                            <FaEnvelope className="mr-2 text-gray-400" />
                            {user.contactEmail}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-red-100 text-red-800'
                          : user.role === 'agent'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.active 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-300">
                        <FaCalendarAlt className="mr-2 text-gray-400" />
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-purple-600 hover:text-purple-900 mr-4"
                        title="Edit User"
                      >
                        <FaEdit />
                      </button>
                      {user.active ? (
                        <button
                          onClick={() => handleDeactivate(user._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Deactivate User"
                        >
                          <FaUserSlash />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReactivate(user._id)}
                          className="text-green-600 hover:text-green-900"
                          title="Reactivate User"
                        >
                          <FaUserCheck />
                        </button>
                      )}
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

export default Users; 