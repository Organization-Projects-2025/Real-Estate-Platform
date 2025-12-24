import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaBuilding, FaArrowRight, FaMapMarkerAlt } from 'react-icons/fa';

function DeveloperProperties() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all projects
    fetch('http://localhost:3000/api/projects')
      .then((res) => res.json())
      .then((data) => {
        if (data?.data?.projects) {
          setProjects(data.data.projects);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching projects:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-[#121212] text-[#fff] min-h-screen">
        <Navbar />
        <div className="px-6 md:px-16 py-20">
          <div className="animate-pulse">
            <div className="h-12 bg-[#1a1a1a] rounded w-1/2 mb-10 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-[#1a1a1a] p-6 rounded-lg">
                  <div className="h-32 bg-[#252525] rounded-lg mb-4"></div>
                  <div className="h-6 bg-[#252525] rounded w-3/4 mb-2"></div>
                  <div className="h-5 bg-[#252525] rounded w-1/2"></div>
                </div>
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
      <section
        className="relative flex flex-col items-center justify-center px-6 md:px-16 py-24 bg-[#121212] bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab')`,
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#703BF7] to-[#121212] opacity-70"></div>
        <div className="relative max-w-3xl space-y-8 z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
            New <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#703BF7] to-[#fff]">Projects</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            Explore the latest residential and commercial developments
          </p>
        </div>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-96 h-96 bg-[#703BF7]/20 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-[#fff]/10 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>
        </div>
      </section>

      <section className="px-6 md:px-16 py-20">
        <h2 className="text-3xl font-bold text-center mb-10">
          Featured Developments
        </h2>
        {projects.length === 0 ? (
          <p className="text-center text-gray-400">
            No projects found.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project._id}
                onClick={() => navigate(`/projects/${project._id}`)}
                className="bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#252525] cursor-pointer group hover:border-[#703BF7] flex flex-col"
              >
                <div className="relative h-64 overflow-hidden">
                  {project.images && project.images.length > 0 ? (
                    <img
                      src={project.images[0]}
                      alt={project.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#252525] to-[#1a1a1a] flex items-center justify-center">
                      <FaBuilding className="text-5xl text-gray-600" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#000] to-transparent opacity-60"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-[#703BF7] transition-colors">
                      {project.name}
                    </h3>
                    {project.location && (
                      <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <FaMapMarkerAlt className="text-[#703BF7]" />
                        {project.location}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <p className="text-gray-400 line-clamp-3 mb-4">
                    {project.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#333]">
                    <span className="text-sm text-gray-500">
                      {project.status || 'Development'}
                    </span>
                    <div className="flex items-center gap-2 text-[#703BF7] font-semibold text-sm group-hover:gap-3 transition-all">
                      View Details <FaArrowRight />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="bg-[#1a1a1a] py-6 text-center text-gray-400">
        <p>© 2025 Tamalak. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default DeveloperProperties;
