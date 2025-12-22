import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaBuilding, FaArrowRight } from 'react-icons/fa';

function DeveloperProperties() {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch users with developer role instead of separate developers
    fetch('http://localhost:3000/api/auth/users/role/developer')
      .then((res) => res.json())
      .then((data) => {
        if (data?.data?.users) {
          setDevelopers(data.data.users);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching developers:', err);
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
            Properties by{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#703BF7] to-[#fff]">
              Developers
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            Explore properties from trusted real estate developers
          </p>
        </div>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-96 h-96 bg-[#703BF7]/20 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-[#fff]/10 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>
        </div>
      </section>

      <section className="px-6 md:px-16 py-20">
        <h2 className="text-3xl font-bold text-center mb-10">
          Browse Developers
        </h2>
        {developers.length === 0 ? (
          <p className="text-center text-gray-400">
            No developers found.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {developers.map((developer) => (
              <div
                key={developer._id}
                onClick={() => navigate(`/developer-properties/${developer._id}`)}
                className="bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#252525] cursor-pointer group hover:border-[#703BF7]"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#703BF7] to-[#5f2cc6] rounded-full mx-auto group-hover:scale-110 transition-transform duration-300">
                    <FaBuilding className="text-4xl text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white text-center group-hover:text-[#703BF7] transition-colors">
                    {developer.firstName} {developer.lastName}
                  </h3>
                  <div className="text-gray-500 text-sm text-center space-y-1">
                    <p>{developer.email}</p>
                    {developer.phoneNumber && (
                      <p>{developer.phoneNumber}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-[#703BF7] font-semibold group-hover:gap-4 transition-all">
                    View Properties <FaArrowRight />
                  </div>
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

export default DeveloperProperties;
