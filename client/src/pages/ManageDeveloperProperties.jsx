import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

function ManageDeveloperProperties() {
  const [developers, setDevelopers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeveloperForm, setShowDeveloperForm] = useState(false);
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [editingDeveloper, setEditingDeveloper] = useState(null);
  const [editingProperty, setEditingProperty] = useState(null);
  const [developerForm, setDeveloperForm] = useState({
    name: '',
    description: '',
    contact: { email: '', phone: '', website: '' }
  });
  const [propertyForm, setPropertyForm] = useState({
    developerId: '',
    title: '',
    description: '',
    price: '',
    listingType: 'sale',
    propertyType: 'house',
    address: { street: '', city: '', state: '', country: '', zipCode: '' },
    area: { sqft: '', sqm: '' },
    features: { bedrooms: '', bathrooms: '', garage: '' },
    media: ['']
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    Promise.all([
      fetch('http://localhost:3000/api/developers').then(res => res.json()),
      fetch('http://localhost:3000/api/developer-properties').then(res => res.json())
    ])
      .then(([devData, propData]) => {
        if (devData?.data?.developers) setDevelopers(devData.data.developers);
        if (propData?.data?.properties) setProperties(propData.data.properties);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setLoading(false);
      });
  };

  const handleDeveloperSubmit = async (e) => {
    e.preventDefault();
    const url = editingDeveloper 
      ? `http://localhost:3000/api/developers/${editingDeveloper._id}`
      : 'http://localhost:3000/api/developers';
    const method = editingDeveloper ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(developerForm)
      });
      if (response.ok) {
        fetchData();
        setShowDeveloperForm(false);
        setEditingDeveloper(null);
        setDeveloperForm({ name: '', description: '', contact: { email: '', phone: '', website: '' } });
      }
    } catch (error) {
      console.error('Error saving developer:', error);
    }
  };

  const handlePropertySubmit = async (e) => {
    e.preventDefault();
    const url = editingProperty 
      ? `http://localhost:3000/api/developer-properties/${editingProperty._id}`
      : 'http://localhost:3000/api/developer-properties';
    const method = editingProperty ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propertyForm)
      });
      if (response.ok) {
        fetchData();
        setShowPropertyForm(false);
        setEditingProperty(null);
        setPropertyForm({
          developerId: '', title: '', description: '', price: '', listingType: 'sale',
          propertyType: 'house', address: { street: '', city: '', state: '', country: '', zipCode: '' },
          area: { sqft: '', sqm: '' }, features: { bedrooms: '', bathrooms: '', garage: '' }, media: ['']
        });
      }
    } catch (error) {
      console.error('Error saving property:', error);
    }
  };

  const handleDeleteDeveloper = async (id) => {
    if (window.confirm('Are you sure you want to delete this developer?')) {
      try {
        await fetch(`http://localhost:3000/api/developers/${id}`, { method: 'DELETE' });
        fetchData();
      } catch (error) {
        console.error('Error deleting developer:', error);
      }
    }
  };

  const handleDeleteProperty = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await fetch(`http://localhost:3000/api/developer-properties/${id}`, { method: 'DELETE' });
        fetchData();
      } catch (error) {
        console.error('Error deleting property:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-[#121212] text-[#fff] min-h-screen">
        <Navbar />
        <div className="px-6 md:px-16 py-20">
          <div className="animate-pulse">
            <div className="h-12 bg-[#1a1a1a] rounded w-1/2 mb-10"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-[#1a1a1a] p-6 rounded-lg h-32"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#121212] text-[#fff] min-h-screen">
      <Navbar />
      <section className="px-6 md:px-16 py-20">
        <h1 className="text-4xl font-bold mb-10">Manage Developer Properties</h1>

        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Developers</h2>
            <button
              onClick={() => { setShowDeveloperForm(true); setEditingDeveloper(null); }}
              className="bg-[#703BF7] hover:bg-[#5f2cc6] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              <FaPlus /> Add Developer
            </button>
          </div>

          {showDeveloperForm && (
            <div className="bg-[#1a1a1a] p-6 rounded-lg mb-6 border border-[#252525]">
              <h3 className="text-xl font-bold mb-4">{editingDeveloper ? 'Edit' : 'Add'} Developer</h3>
              <form onSubmit={handleDeveloperSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Developer Name"
                  value={developerForm.name}
                  onChange={(e) => setDeveloperForm({ ...developerForm, name: e.target.value })}
                  className="w-full px-4 py-3 rounded bg-[#252525] border border-gray-700 focus:border-[#703BF7] focus:outline-none"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={developerForm.description}
                  onChange={(e) => setDeveloperForm({ ...developerForm, description: e.target.value })}
                  className="w-full px-4 py-3 rounded bg-[#252525] border border-gray-700 focus:border-[#703BF7] focus:outline-none"
                  rows="3"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={developerForm.contact.email}
                  onChange={(e) => setDeveloperForm({ ...developerForm, contact: { ...developerForm.contact, email: e.target.value } })}
                  className="w-full px-4 py-3 rounded bg-[#252525] border border-gray-700 focus:border-[#703BF7] focus:outline-none"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={developerForm.contact.phone}
                  onChange={(e) => setDeveloperForm({ ...developerForm, contact: { ...developerForm.contact, phone: e.target.value } })}
                  className="w-full px-4 py-3 rounded bg-[#252525] border border-gray-700 focus:border-[#703BF7] focus:outline-none"
                />
                <input
                  type="url"
                  placeholder="Website"
                  value={developerForm.contact.website}
                  onChange={(e) => setDeveloperForm({ ...developerForm, contact: { ...developerForm.contact, website: e.target.value } })}
                  className="w-full px-4 py-3 rounded bg-[#252525] border border-gray-700 focus:border-[#703BF7] focus:outline-none"
                />
                <div className="flex gap-4">
                  <button type="submit" className="flex-1 bg-[#703BF7] hover:bg-[#5f2cc6] text-white py-3 rounded-lg flex items-center justify-center gap-2">
                    <FaSave /> Save
                  </button>
                  <button type="button" onClick={() => { setShowDeveloperForm(false); setEditingDeveloper(null); }} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg flex items-center justify-center gap-2">
                    <FaTimes /> Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {developers.map((dev) => (
              <div key={dev._id} className="bg-[#1a1a1a] p-6 rounded-lg border border-[#252525]">
                <h3 className="text-xl font-bold mb-2">{dev.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{dev.description}</p>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingDeveloper(dev); setDeveloperForm(dev); setShowDeveloperForm(true); }} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg flex items-center justify-center gap-2">
                    <FaEdit /> Edit
                  </button>
                  <button onClick={() => handleDeleteDeveloper(dev._id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg flex items-center justify-center gap-2">
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Properties</h2>
            <button onClick={() => { setShowPropertyForm(true); setEditingProperty(null); }} className="bg-[#703BF7] hover:bg-[#5f2cc6] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors">
              <FaPlus /> Add Property
            </button>
          </div>

          {showPropertyForm && (
            <div className="bg-[#1a1a1a] p-6 rounded-lg mb-6 border border-[#252525]">
              <h3 className="text-xl font-bold mb-4">{editingProperty ? 'Edit' : 'Add'} Property</h3>
              <form onSubmit={handlePropertySubmit} className="space-y-4">
                <select value={propertyForm.developerId} onChange={(e) => setPropertyForm({ ...propertyForm, developerId: e.target.value })} className="w-full px-4 py-3 rounded bg-[#252525] border border-gray-700 focus:border-[#703BF7] focus:outline-none" required>
                  <option value="">Select Developer</option>
                  {developers.map(dev => <option key={dev._id} value={dev._id}>{dev.name}</option>)}
                </select>
                <input type="text" placeholder="Property Title" value={propertyForm.title} onChange={(e) => setPropertyForm({ ...propertyForm, title: e.target.value })} className="w-full px-4 py-3 rounded bg-[#252525] border border-gray-700 focus:border-[#703BF7] focus:outline-none" required />
                <textarea placeholder="Description" value={propertyForm.description} onChange={(e) => setPropertyForm({ ...propertyForm, description: e.target.value })} className="w-full px-4 py-3 rounded bg-[#252525] border border-gray-700 focus:border-[#703BF7] focus:outline-none" rows="3" />
                <input type="number" placeholder="Price" value={propertyForm.price} onChange={(e) => setPropertyForm({ ...propertyForm, price: e.target.value })} className="w-full px-4 py-3 rounded bg-[#252525] border border-gray-700 focus:border-[#703BF7] focus:outline-none" required />
                <div className="grid grid-cols-2 gap-4">
                  <select value={propertyForm.listingType} onChange={(e) => setPropertyForm({ ...propertyForm, listingType: e.target.value })} className="px-4 py-3 rounded bg-[#252525] border border-gray-700 focus:border-[#703BF7] focus:outline-none">
                    <option value="sale">Sale</option>
                    <option value="rent">Rent</option>
                  </select>
                  <select value={propertyForm.propertyType} onChange={(e) => setPropertyForm({ ...propertyForm, propertyType: e.target.value })} className="px-4 py-3 rounded bg-[#252525] border border-gray-700 focus:border-[#703BF7] focus:outline-none">
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="land">Land</option>
                  </select>
                </div>
                <input type="text" placeholder="Street" value={propertyForm.address.street} onChange={(e) => setPropertyForm({ ...propertyForm, address: { ...propertyForm.address, street: e.target.value } })} className="w-full px-4 py-3 rounded bg-[#252525] border border-gray-700 focus:border-[#703BF7] focus:outline-none" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="City" value={propertyForm.address.city} onChange={(e) => setPropertyForm({ ...propertyForm, address: { ...propertyForm.address, city: e.target.value } })} className="px-4 py-3 rounded bg-[#252525] border border-gray-700 focus:border-[#703BF7] focus:outline-none" />
                  <input type="text" placeholder="State" value={propertyForm.address.state} onChange={(e) => setPropertyForm({ ...propertyForm, address: { ...propertyForm.address, state: e.target.value } })} className="px-4 py-3 rounded bg-[#252525] border border-gray-700 focus:border-[#703BF7] focus:outline-none" />
                </div>
                <input type="url" placeholder="Image URL" value={propertyForm.media[0]} onChange={(e) => setPropertyForm({ ...propertyForm, media: [e.target.value] })} className="w-full px-4 py-3 rounded bg-[#252525] border border-gray-700 focus:border-[#703BF7] focus:outline-none" />
                <div className="flex gap-4">
                  <button type="submit" className="flex-1 bg-[#703BF7] hover:bg-[#5f2cc6] text-white py-3 rounded-lg flex items-center justify-center gap-2"><FaSave /> Save</button>
                  <button type="button" onClick={() => { setShowPropertyForm(false); setEditingProperty(null); }} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg flex items-center justify-center gap-2"><FaTimes /> Cancel</button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {properties.map((prop) => (
              <div key={prop._id} className="bg-[#1a1a1a] p-6 rounded-lg border border-[#252525]">
                {prop.media && prop.media[0] && <img src={prop.media[0]} alt={prop.title} className="w-full h-48 object-cover rounded-lg mb-4" />}
                <h3 className="text-xl font-bold mb-2">{prop.title}</h3>
                <p className="text-[#703BF7] font-bold mb-2">${prop.price?.toLocaleString()}</p>
                <p className="text-gray-400 text-sm mb-4">{prop.description}</p>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingProperty(prop); setPropertyForm(prop); setShowPropertyForm(true); }} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg flex items-center justify-center gap-2">
                    <FaEdit /> Edit
                  </button>
                  <button onClick={() => handleDeleteProperty(prop._id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg flex items-center justify-center gap-2">
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <footer className="bg-[#1a1a1a] py-6 text-center text-gray-400">
        <p>© 2025 Tamalk. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default ManageDeveloperProperties;
