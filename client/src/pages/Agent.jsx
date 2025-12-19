import React, { useState, useEffect } from 'react';
import { FiSearch, FiMapPin, FiStar, FiCalendar, FiMail, FiPhone, FiUser } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import axios from 'axios';

const Agent = () => {
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    minExperience: '',
    minSales: '',
  });

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/agents');
      const agentsData = response.data.data.agents;
      setAgents(agentsData);
      setFilteredAgents(agentsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching agents:', error);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    if (searchTerm.trim() === '' && !filters.minExperience && !filters.minSales) {
      setFilteredAgents(agents);
      return;
    }

    const lowerSearch = searchTerm.toLowerCase();

    const filtered = agents.filter((agent) => {
      try {
        const searchFields = [
          `${agent.firstName} ${agent.lastName}`,
          agent.email,
          agent.contactEmail,
          agent.about || '',
        ];

        const matchesSearch = searchTerm === '' || searchFields.some(field => 
          field.toLowerCase().includes(lowerSearch)
        );

        const matchesExperience = !filters.minExperience || 
          (agent.yearsOfExperience >= parseInt(filters.minExperience));

        const matchesSales = !filters.minSales || 
          (agent.totalSales >= parseInt(filters.minSales));

        return matchesSearch && matchesExperience && matchesSales;
      } catch (err) {
        console.error('Error filtering agent:', agent, err);
        return false;
      }
    });

    setFilteredAgents(filtered);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    applyFilters();
    setLoading(false);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="bg-[#121212] min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#703BF7]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#121212] text-[#fff] min-h-screen">
      <Navbar />
      
      {/* Hero Section with Search */}
      <section className="relative py-16 bg-[#121212]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find a <span className="text-[#703BF7]">Real Estate Agent</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Connect with experienced agents in your area
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSearch} className="bg-[#1a1a1a] p-6 rounded-xl shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or keywords"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#252525] text-white rounded-lg focus:ring-2 focus:ring-[#703BF7] outline-none"
                  />
                </div>
                <div className="relative">
                  <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    name="minExperience"
                    value={filters.minExperience}
                    onChange={handleFilterChange}
                    className="w-full pl-10 pr-4 py-3 bg-[#252525] text-white rounded-lg focus:ring-2 focus:ring-[#703BF7] outline-none"
                  >
                    <option value="">Minimum Experience</option>
                    <option value="5">5+ Years</option>
                    <option value="3">3+ Years</option>
                    <option value="1">1+ Year</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <FiStar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    name="minSales"
                    value={filters.minSales}
                    onChange={handleFilterChange}
                    className="w-full pl-10 pr-4 py-3 bg-[#252525] text-white rounded-lg focus:ring-2 focus:ring-[#703BF7] outline-none"
                  >
                    <option value="">Minimum Sales</option>
                    <option value="10">10+ Sales</option>
                    <option value="5">5+ Sales</option>
                    <option value="1">1+ Sale</option>
                  </select>
                </div>
              </div>
              <div className="mt-6">
                <button 
                  type="submit"
                  className="w-full bg-[#703BF7] text-white py-3 rounded-lg hover:bg-[#5f2cc6] transition-colors font-semibold"
                >
                  Find Agents
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Agents List */}
      <section className="py-12 bg-[#121212]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredAgents.length === 0 ? (
            <p className="text-center text-gray-400 text-lg">
              No agents found matching your criteria. Try adjusting your search.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAgents.map((agent) => (
                <div key={agent._id} className="bg-[#1a1a1a] rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-[#703BF7] rounded-full flex items-center justify-center">
                      <FiUser className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">
                        {agent.firstName} {agent.lastName}
                      </h3>
                      <p className="text-gray-400">{agent.yearsOfExperience} years of experience</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-400">
                      <FiMail className="w-5 h-5 mr-2" />
                      <span>{agent.email}</span>
                    </div>
                    {agent.contactEmail && (
                      <div className="flex items-center text-gray-400">
                        <FiMail className="w-5 h-5 mr-2" />
                        <span>{agent.contactEmail}</span>
                      </div>
                    )}
                    <div className="flex items-center text-gray-400">
                      <FiPhone className="w-5 h-5 mr-2" />
                      <span>{agent.phoneNumber}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Total Sales: {agent.totalSales}</span>
                      <span>Age: {agent.age}</span>
                    </div>
                  </div>

                  {agent.about && (
                    <div className="mt-4">
                      <p className="text-gray-400 text-sm line-clamp-3">{agent.about}</p>
                    </div>
                  )}

                  <div className="mt-6">
                    <button className="w-full bg-[#703BF7] text-white py-2 rounded-lg hover:bg-[#5f2cc6] transition-colors">
                      Contact Agent
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Agent; 