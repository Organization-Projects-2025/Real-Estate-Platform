import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaBuilding, FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function MyProjects() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    location: '',
    startDate: '',
    expectedCompletionDate: '',
    images: []
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'developer') {
      navigate('/');
      return;
    }
    fetchProjects();
  }, [user, navigate]);

  const fetchProjects = () => {
    if (!user?._id) return;
    
    fetch(`http://localhost:3000/api/projects/user/${user._id}`)
      .then(res => res.json())
      .then(data => {
        if (data?.data?.projects) {
          setProjects(data.data.projects);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching projects:', err);
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
          setProjectForm({ ...projectForm, images: [...projectForm.images, ...imageUrls] });
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
    const newImages = projectForm.images.filter((_, i) => i !== index);
    setProjectForm({ ...projectForm, images: newImages });
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    if (!user?._id) return;

    const url = editingProject 
      ? `http://localhost:3000/api/projects/user/${user._id}/${editingProject._id}`
      : `http://localhost:3000/api/projects/user/${user._id}`;
    const method = editingProject ? 'PUT' : 'POST';

    const projectData = {
      ...projectForm,
      developerId: user._id
    };

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });
      if (response.ok) {
        fetchProjects();
        setShowProjectForm(false);
        setEditingProject(null);
        setProjectForm({
          name: '', description: '', location: '', startDate: '', expectedCompletionDate: '', images: []
        });
      }
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!user?._id) return;
    if (window.confirm('Are you sure you want to delete this project? This will also delete all properties in this project.')) {
      try {
        await fetch(`http://localhost:3000/api/projects/user/${user._id}/${id}`, { method: 'DELETE' });
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
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
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold">My Projects</h1>
            <p className="text-gray-400 mt-2">Manage your development projects and properties</p>
          </div>
          <button
            onClick={() => { setShowProjectForm(true); setEditingProject(null); }}
            className="bg-[#703BF7] hover:bg-[#5f2cc6] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FaPlus /> Add Project
          </button>
        </div>

        {showProjectForm && (
          <div className="bg-[#1a1a1a] p-6 rounded-lg mb-6 border border-[#252525]">
            <h3 className="text-xl font-bold mb-4">{editingProject ? 'Edit' : 'Add'} Project</h3>
            <form onSubmit={handleProjectSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Project Name"
                value={projectForm.name}
                onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                className="w-full px-4 py-3 rounded bg-[#252525] border border-gray-700 focus:border-[#703BF7] focus:outline-none"
                required
              />
              <textarea
                placeholder="Project Description"
                value={projectForm.description}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                className="w-full px-4 py-3 rounded bg-[#252525] border border-gray-700 focus:border-[#703BF7] focus:outline-none"
                rows="3"
              />
              <input
                type="text"
                placeholder="Location"
                value={projectForm.location}
                onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
                className="w-full px-4 py-3 rounded bg-[#252525] border border-gray-700 focus:border-[#703BF7] focus:outline-none"
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={projectForm.startDate}
                    onChange={(e) => setProjectForm({ ...projectForm, startDate: e.target.value })}
                    className="w-full px-4 py-3 rounded bg-[#252525] border border-gray-700 focus:border-[#703BF7] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Expected Completion</label>
                  <input
                    type="date"
                    value={projectForm.expectedCompletionDate}
                    onChange={(e) => setProjectForm({ ...projectForm, expectedCompletionDate: e.target.value })}
                    className="w-full px-4 py-3 rounded bg-[#252525] border border-gray-700 focus:border-[#703BF7] focus:outline-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Project Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-3 rounded bg-[#252525] border border-gray-700 focus:border-[#703BF7] focus:outline-none"
                />
                {projectForm.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {projectForm.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img src={image} alt={`Project ${index + 1}`} className="w-full h-24 object-cover rounded" />
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
                  <FaSave /> Save Project
                </button>
                <button type="button" onClick={() => { setShowProjectForm(false); setEditingProject(null); }} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg flex items-center justify-center gap-2">
                  <FaTimes /> Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {projects.length === 0 ? (
          <div className="text-center py-20">
            <FaBuilding className="text-6xl text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-4">You haven't created any projects yet.</p>
            <button
              onClick={() => setShowProjectForm(true)}
              className="bg-[#703BF7] hover:bg-[#5f2cc6] text-white px-6 py-3 rounded-lg"
            >
              Create Your First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project._id} className="bg-[#1a1a1a] p-6 rounded-lg border border-[#252525] hover:border-[#703BF7] transition-colors">
                {project.images && project.images.length > 0 && (
                  <img src={project.images[0]} alt={project.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                )}
                <div className="flex items-center gap-2 mb-2">
                  <FaBuilding className="text-[#703BF7]" />
                  <h3 className="text-xl font-bold">{project.name}</h3>
                </div>
                <p className="text-gray-400 text-sm mb-2">{project.location}</p>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => navigate(`/project/${project._id}/properties`)}
                    className="flex-1 bg-[#703BF7] hover:bg-[#5f2cc6] text-white py-2 rounded-lg flex items-center justify-center gap-2"
                  >
                    <FaHome /> Properties
                  </button>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditingProject(project); setProjectForm(project); setShowProjectForm(true); }}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project._id)}
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

export default MyProjects;