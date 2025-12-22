import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaArrowLeft, FaHome } from 'react-icons/fa';

function ProjectProperties() {
  const { projectId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [propertyForm, setPropertyForm] = useState({
    title: '',
    description: '',
    price: '',
    listingType: 'sale',
    propertyType: 'house',
    address: { street: '', city: '', state: '', country: '', zipCode: '' },
    area: { sqft: '', sqm: '' },
    features: { bedrooms: '', bathrooms: '', garage: '' },
    images: []
  });

  useEffect(() => {
    if (!user || user.role !== 'developer') {
      navigate('/');
      return;
    }
    fetchProjectAndProperties();
  }, [user, projectId, navigate]);

  const fetchProjectAndProperties = () => {
    Promise.all([
      fetch(`http://localhost:3000/api/projects/${projectId}`).then(res => res.json()),
      fetch(`http://localhost:3000/api/developer-properties/project/${projectId}`).then(res => res.json())
    ])
      .then(([projectData, propertiesData]) => {
        if (projectData?.data?.project) {
          setProject(projectData.data.project);
        }
        if (propertiesData?.data?.properties) {
          setProperties(propertiesData.data.properties);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setLoading(false);
      });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = [];
    
    files.forEach(file => {
      // Create canvas to compress image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Set max dimensions
        const maxWidth = 800;
        const maxHeight = 600;
        let { width, height } = img;
        
        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7); // 70% quality
        
        imageUrls.push(compressedDataUrl);
        if (imageUrls.length === files.length) {
          setPropertyForm({ ...propertyForm, images: [...propertyForm.images, ...imageUrls] });
        }
      };
      
      const reader = new FileReader();
      reader.onload = (event) => {
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const newImages = propertyForm.images.filter((_, i) => i !== index);
    setPropertyForm({ ...propertyForm, images: newImages });
  };

  const handlePropertySubmit = async (e) => {
    e.preventDefault();
    if (!user?._id) return;

    const url = editingProperty 
      ? `http://localhost:3000/api/developer-properties/user/${user._id}/${editingProperty._id}`
      : `http://localhost:3000/api/developer-properties/project/${user._id}/${projectId}`;
    const method = editingProperty ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propertyForm)
      });
      if (response.ok) {
        fetchProjectAndProperties();
        setShowPropertyForm(false);
        setEditingProperty(null);
        setPropertyForm({
          title: '', description: '', price: '', listingType: 'sale',
          propertyType: 'house', address: { street: '', city: '', state: '', country: '', zipCode: '' },
          area: { sqft: '', sqm: '' }, features: { bedrooms: '', bathrooms: '', garage: '' }, images: []
        });
      }
    } catch (error) {
      console.error('Error saving property:', error);
    }
  };

  const handleDeleteProperty = async (id) => {
    if (!user?._id) return;
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await fetch(`http://localhost:3000/api/developer-properties/user/${user._id}/${id}`, { method: 'DELETE' });
        fetchProjectAndProperties();
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
        <div className="flex items-center gap-4 mb-10">
          <button
            onClick={() => navigate('/my-projects')}
            className="flex items-center gap-2 text-[#703BF7] hover:text-white transition-colors"
          >
            <FaArrowLeft /> Back to Projects
          </button>
        </div>

        {project && (
          <div className="bg-[#1a1a1a] rounded-2xl p-8 mb-10 border border-[#252525]">
            <div className="flex items-center gap-6">
              <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-r from-[#703BF7] to-[#5f2cc6] rounded-full">
                <FaHome className="text-5xl text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">{project.name}</h1>
                <p className="text-gray-400 mb-2">{project.location}</p>
                {project.description && (
                  <p className="text-gray-500">{project.description}</p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold">Properties</h2>
            <p className="text-gray-400 mt-2">Manage properties in this project</p>
          </div>
          <button
            onClick={() => { setShowPropertyForm(true); setEditingProperty(null); }}
            className="bg-[#703BF7] hover:bg-[#5f2cc6] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FaPlus /> Add Property
          </button>
        </div>

        {showPropertyForm && (
          <div className="bg-[#1a1a1a] p-6 rounded-lg mb-6 border border-[#252525]">
            <h3 className="text-xl font-bold mb-4">{editingProperty ? 'Edit' : 'Add'} Property</h3>
            <form onSubmit={handlePropertySubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Property Title"
                value={propertyForm.title}
                onChange={(e) => setPropertyForm({ ...propertyForm, title: e.target.value })}
                className="w-full px-4 py-3 rounded bg-[#252525] border border-gray-700 focus:border-[#703BF7] focus:outline-none"
                required
              />
              <textarea
                placeholder="Description"
                value={propertyForm.description}
                onChange={(e) => setPropertyForm({ ...propertyForm, description: e.target.value })}
                className="w-full px-4 py-3 rounded bg-[#252525] border border-gray-700 focus:border-[#703BF7] focus:outline-none"
                rows="3"
              />
              <input
                type="number"
                placeholder="Price"
                value={propertyForm.price}
                onChange={(e) => setPropertyForm({ ...propertyForm, price: e.target.value })}
                className="w-full px-4 py-3 rounded bg-[#252525] border border-gray-700 focus:border-[#703BF7] focus:outline-none"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={propertyForm.listingType}
                  onChange={(e) => setPropertyForm({ ...propertyForm, listingType: e.target.value })}
                  className="px-4 py-3 rounded bg-[#252525] border border-gray-700 focus:border-[#703BF7] focus:outline-none"
                >
                  <option value="sale">Sale</option>
                  <option value="rent">Rent</option>
                </select>
                <select
                  value={propertyForm.propertyType}
                  onChange={(e) => setPropertyForm({ ...propertyForm, propertyType: e.target.value })}
                  className="px-4 py-3 rounded bg-[#252525] border border-gray-700 focus:border-[#703BF7] focus:outline-none"
                >
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="land">Land</option>
                </select>
              </div>
              <input
                type="text"
                placeholder="Street"
                value={propertyForm.address.street}
                onChange={(e) => setPropertyForm({ ...propertyForm, address: { ...propertyForm.address, street: e.target.value } })}
                className="w-full px-4 py-3 rounded bg-[#252525] border border-gray-700 focus:border-[#703BF7] focus:outline-none"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  value={propertyForm.address.city}
                  onChange={(e) => setPropertyForm({ ...propertyForm, address: { ...propertyForm.address, city: e.target.value } })}
                  className="px-4 py-3 rounded bg-[#252525] border border-gray-700 focus:border-[#703BF7] focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={propertyForm.address.state}
                  onChange={(e) => setPropertyForm({ ...propertyForm, address: { ...propertyForm.address, state: e.target.value } })}
                  className="px-4 py-3 rounded bg-[#252525] border border-gray-700 focus:border-[#703BF7] focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="number"
                  placeholder="Bedrooms"
                  value={propertyForm.features.bedrooms}
                  onChange={(e) => setPropertyForm({ ...propertyForm, features: { ...propertyForm.features, bedrooms: e.target.value } })}
                  className="px-4 py-3 rounded bg-[#252525] border border-gray-700 focus:border-[#703BF7] focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Bathrooms"
                  value={propertyForm.features.bathrooms}
                  onChange={(e) => setPropertyForm({ ...propertyForm, features: { ...propertyForm.features, bathrooms: e.target.value } })}
                  className="px-4 py-3 rounded bg-[#252525] border border-gray-700 focus:border-[#703BF7] focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Sq Ft"
                  value={propertyForm.area.sqft}
                  onChange={(e) => setPropertyForm({ ...propertyForm, area: { ...propertyForm.area, sqft: e.target.value } })}
                  className="px-4 py-3 rounded bg-[#252525] border border-gray-700 focus:border-[#703BF7] focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Property Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-3 rounded bg-[#252525] border border-gray-700 focus:border-[#703BF7] focus:outline-none"
                />
                {propertyForm.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {propertyForm.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img src={image} alt={`Property ${index + 1}`} className="w-full h-24 object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button type="submit" className="flex-1 bg-[#703BF7] hover:bg-[#5f2cc6] text-white py-3 rounded-lg flex items-center justify-center gap-2">
                  <FaSave /> Save Property
                </button>
                <button type="button" onClick={() => { setShowPropertyForm(false); setEditingProperty(null); }} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg flex items-center justify-center gap-2">
                  <FaTimes /> Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {properties.length === 0 ? (
          <div className="text-center py-20">
            <FaHome className="text-6xl text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-4">No properties in this project yet.</p>
            <button
              onClick={() => setShowPropertyForm(true)}
              className="bg-[#703BF7] hover:bg-[#5f2cc6] text-white px-6 py-3 rounded-lg"
            >
              Add First Property
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {properties.map((property) => (
              <div key={property._id} className="bg-[#1a1a1a] p-6 rounded-lg border border-[#252525]">
                {property.images && property.images.length > 0 && (
                  <img src={property.images[0]} alt={property.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                )}
                <h3 className="text-xl font-bold mb-2">{property.title}</h3>
                <p className="text-[#703BF7] font-bold mb-2">${property.price?.toLocaleString()}</p>
                <p className="text-gray-400 text-sm mb-2">{property.address?.city}, {property.address?.state}</p>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{property.description}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditingProperty(property); setPropertyForm(property); setShowPropertyForm(true); }}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProperty(property._id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <footer className="bg-[#1a1a1a] py-6 text-center text-gray-400">
        <p>© 2025 Tamalk. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default ProjectProperties;