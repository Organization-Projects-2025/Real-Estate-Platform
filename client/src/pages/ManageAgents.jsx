import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

const ManageAgents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactEmail: '',
    phoneNumber: '',
    yearsOfExperience: 0,
    age: 18,
    totalSales: 0,
    about: ''
  });

  // Fetch all agents
  const fetchAgents = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/agents');
      setAgents(response.data.data.agents);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch agents');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'yearsOfExperience' || name === 'age' || name === 'totalSales' 
        ? Number(value) 
        : value
    }));
  };

  // Create new agent
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/agents', formData);
      setAgents(prev => [...prev, response.data.data.agent]);
      setIsModalOpen(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        contactEmail: '',
        phoneNumber: '',
        yearsOfExperience: 0,
        age: 18,
        totalSales: 0,
        about: ''
      });
    } catch (err) {
      setError('Failed to create agent');
    }
  };

  // Update agent
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/agents/${selectedAgent._id}`,
        formData
      );
      setAgents(prev => prev.map(agent => 
        agent._id === selectedAgent._id ? response.data.data.agent : agent
      ));
      setIsModalOpen(false);
      setSelectedAgent(null);
    } catch (err) {
      setError('Failed to update agent');
    }
  };

  // Delete agent
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this agent?')) {
      try {
        await axios.delete(`http://localhost:3000/api/agents/${id}`);
        setAgents(prev => prev.filter(agent => agent._id !== id));
      } catch (err) {
        setError('Failed to delete agent');
      }
    }
  };

  // Open modal for edit
  const handleEdit = (agent) => {
    setSelectedAgent(agent);
    setFormData({
      firstName: agent.firstName,
      lastName: agent.lastName,
      email: agent.email,
      contactEmail: agent.contactEmail,
      phoneNumber: agent.phoneNumber,
      yearsOfExperience: agent.yearsOfExperience,
      age: agent.age,
      totalSales: agent.totalSales,
      about: agent.about
    });
    setIsModalOpen(true);
  };

  const inputClass = "w-full p-3 bg-[#2a2a2a] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#703BF7]";
  const buttonClass = "px-4 py-2 rounded-lg bg-[#703BF7] text-white hover:bg-[#5f2cc6] transition-colors duration-300";

  return (
    <div className="bg-[#121212] text-white min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Agents</h1>
          <button
            onClick={() => {
              setSelectedAgent(null);
              setFormData({
                firstName: '',
                lastName: '',
                email: '',
                contactEmail: '',
                phoneNumber: '',
                yearsOfExperience: 0,
                age: 18,
                totalSales: 0,
                about: ''
              });
              setIsModalOpen(true);
            }}
            className={buttonClass}
          >
            Add New Agent
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-[#703BF7] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map(agent => (
              <motion.div
                key={agent._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1a1a1a] rounded-xl p-6 shadow-lg"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold">
                    {agent.firstName} {agent.lastName}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(agent)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(agent._id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="space-y-2 text-gray-300">
                  <p>Email: {agent.email}</p>
                  <p>Contact: {agent.contactEmail}</p>
                  <p>Phone: {agent.phoneNumber}</p>
                  <p>Experience: {agent.yearsOfExperience} years</p>
                  <p>Age: {agent.age}</p>
                  <p>Total Sales: {agent.totalSales}</p>
                  <p className="mt-4">{agent.about}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#1a1a1a] rounded-xl p-8 w-full max-w-2xl"
            >
              <h2 className="text-2xl font-bold mb-6">
                {selectedAgent ? 'Edit Agent' : 'Add New Agent'}
              </h2>
              <form onSubmit={selectedAgent ? handleUpdate : handleCreate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Contact Email</label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className={inputClass}
                      min="18"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Years of Experience</label>
                    <input
                      type="number"
                      name="yearsOfExperience"
                      value={formData.yearsOfExperience}
                      onChange={handleChange}
                      className={inputClass}
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Total Sales</label>
                    <input
                      type="number"
                      name="totalSales"
                      value={formData.totalSales}
                      onChange={handleChange}
                      className={inputClass}
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">About</label>
                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                    className={`${inputClass} h-32`}
                  />
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={buttonClass}
                  >
                    {selectedAgent ? 'Update Agent' : 'Create Agent'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAgents; 