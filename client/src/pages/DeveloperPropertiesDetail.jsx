import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard';
import { FaArrowLeft, FaBuilding } from 'react-icons/fa';

function DeveloperPropertiesDetail() {
  const { developerId } = useParams();
  const navigate = useNavigate();
  const [developer, setDeveloper] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`http://localhost:3000/api/developers/${developerId}`).then(res => res.json()),
      fetch(`http://localhost:3000/api/developer-properties/developer/${developerId}`).then(res => res.json())
    ])
      .then(([devData, propData]) => {
        if (devData?.data?.developer) {
          setDeveloper(devData.data.developer);
        }
        if (propData?.data?.properties) {
          setProperties(propData.data.properties);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setLoading(false);
      });
  }, [developerId]);

  if (loading) {
    return (
      <div className="bg-[#121212] text-[#fff] min-h-screen">
        <Navbar />
        <div className="px-6 md:px-16 py-20">
          <div className="animate-pulse">
            <div className="h-12 bg-[#1a1a1a] rounded w-1/2 mb-10"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-[#1a1a1a] p-4 rounded-lg">
                  <div className="h-48 bg-[#252525] rounded-lg mb-4"></div>
                  <div className="h-6 bg-[#252525] rounded w-3/4 mb-2"></div>
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
      
      <section className="px-6 md:px-16 py-10">
        <button
          onClick={() => navigate('/developer-properties')}
          className="flex items-center gap-2 text-[#703BF7] hover:text-white transition-colors mb-6"
        >
          <FaArrowLeft /> Back to Developers
        </button>

        {developer && (
          <div className="bg-[#1a1a1a] rounded-2xl p-8 mb-10 border border-[#252525]">
            <div className="flex items-center gap-6">
              <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-r from-[#703BF7] to-[#5f2cc6] rounded-full">
                <FaBuilding className="text-5xl text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">{developer.name}</h1>
                {developer.description && (
                  <p className="text-gray-400 mb-4">{developer.description}</p>
                )}
                {developer.contact && (
                  <div className="text-gray-500 text-sm space-y-1">
                    {developer.contact.email && (
                      <p>Email: {developer.contact.email}</p>
                    )}
                    {developer.contact.phone && (
                      <p>Phone: {developer.contact.phone}</p>
                    )}
                    {developer.contact.website && (
                      <p>Website: <a href={developer.contact.website} target="_blank" rel="noopener noreferrer" className="text-[#703BF7] hover:underline">{developer.contact.website}</a></p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <h2 className="text-3xl font-bold mb-6">
          Properties by {developer?.name}
        </h2>
        
        {properties.length === 0 ? (
          <p className="text-center text-gray-400 py-10">
            No properties found for this developer.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </section>

      <footer className="bg-[#1a1a1a] py-6 text-center text-gray-400 mt-20">
        <p>© 2025 Tamalk. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default DeveloperPropertiesDetail;
