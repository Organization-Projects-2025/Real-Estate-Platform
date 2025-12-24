import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaSwimmingPool,
  FaCarAlt,
  FaTree,
  FaPaw,
  FaCouch,
  FaPhoneAlt,
  FaEnvelope,
  FaWhatsapp,
  FaWifi,
  FaShieldAlt,
  FaSnowflake,
} from 'react-icons/fa';
import FeaturedProperties from '../components/FeaturedProperties';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/properties')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Network response was not ok: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Fetched Properties:', data);
        setProperties(data.data.properties);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch properties:', err);
        setProperties([]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Fetch property data based on ID
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/api/properties/${id}`
        );

        if (!response.ok) {
          // If not found in standard properties, check if it's a developer property
          const devResponse = await fetch(`http://127.0.0.1:3000/api/developer-properties/${id}`);
          if (devResponse.ok) {
            const devData = await devResponse.json();
            if (devData?.data?.property) {
              navigate(`/developer-property/${id}`, { replace: true });
              return;
            }
          }
          throw new Error(`Failed to fetch property with ID: ${id}`);
        }

        const data = await response.json();
        setProperty(data.data.property);
      } catch (err) {
        console.error('Error fetching property details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  // Function to handle image navigation
  const handleImageNav = (index) => {
    setActiveImage(index);
  };

  const formatPrice = (price, listingType) => {
    if (listingType === 'rent') {
      return `${price.toLocaleString()}$/month`;
    } else {
      return `${price.toLocaleString()}$`;
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-[#0c0c1d] via-[#1a1a2e] to-[#1a1a2e] min-h-screen text-white flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-16 h-16 border-4 border-[#7F00FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-b from-[#0c0c1d] via-[#1a1a2e] to-[#1a1a2e] min-h-screen text-white flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-2">Property Not Found</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-[#7F00FF] rounded-lg hover:bg-[#6800d6] transition-colors"
          >
            Return to Listings
          </button>
        </div>
      </div>
    );
  }

  if (!property) {
    return null;
  }

  const {
    title,
    description,
    price,
    propertyType,
    subType,
    address,
    area,
    features,
    buildDate,
    status,
    media,
    listingType,
  } = property;

  return (
    <div className="bg-gradient-to-b from-[#0c0c1d] via-[#1a1a2e] to-[#1a1a2e] min-h-screen text-white">
      {/* Header with back button */}
      <header className="sticky top-0 bg-[#0c0c1d]/90 backdrop-blur-md z-30 border-b border-white/10 px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <span className="text-xl">←</span>
            <span>Back</span>
          </button>
          <div className="text-lg font-medium text-[#B983FF]">
            {formatPrice(price, listingType)}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
        {/* Property Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#7F00FF] to-[#E100FF] bg-clip-text text-transparent">
          {title}
        </h1>

        {/* Location */}
        <div className="flex items-center gap-2 text-gray-300 mb-8">
          <FaMapMarkerAlt className="text-[#B983FF]" />
          <span>
            {address.street}, {address.city}, {address.state}, {address.country}
          </span>
        </div>

        {/* Image Gallery */}
        <div className="mb-12 space-y-4">
          <div className="h-96 rounded-2xl overflow-hidden shadow-xl">
            <img
              src={media[activeImage] || media[0]}
              alt={`Property view ${activeImage + 1}`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails */}
          {media.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
              {media.map((image, index) => (
                <div
                  key={index}
                  onClick={() => handleImageNav(index)}
                  className={`h-20 w-24 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer snap-start border-2 transition-all ${activeImage === index
                    ? 'border-[#B983FF] scale-105 shadow-lg shadow-[#B983FF]/20'
                    : 'border-transparent opacity-70'
                    }`}
                >
                  <img
                    src={media[index] || media[0]}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <section className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#7F00FF] flex items-center justify-center">
                  <span className="text-sm">1</span>
                </span>
                Overview
              </h2>

              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                {description || 'No description available.'}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center bg-white/5 rounded-xl p-4">
                  <FaBed className="text-[#B983FF] text-2xl mb-2" />
                  <span className="font-bold text-lg">{features.bedrooms}</span>
                  <span className="text-sm text-gray-400">Bedrooms</span>
                </div>

                <div className="flex flex-col items-center bg-white/5 rounded-xl p-4">
                  <FaBath className="text-[#B983FF] text-2xl mb-2" />
                  <span className="font-bold text-lg">
                    {features.bathrooms}
                  </span>
                  <span className="text-sm text-gray-400">Bathrooms</span>
                </div>

                <div className="flex flex-col items-center bg-white/5 rounded-xl p-4">
                  <FaRulerCombined className="text-[#B983FF] text-2xl mb-2" />
                  <span className="font-bold text-lg">{area.sqft}</span>
                  <span className="text-sm text-gray-400">Sq Ft</span>
                </div>

                <div className="flex flex-col items-center bg-white/5 rounded-xl p-4">
                  <FaCalendarAlt className="text-[#B983FF] text-2xl mb-2" />
                  <span className="font-bold text-lg">
                    {buildDate || 'N/A'}
                  </span>
                  <span className="text-sm text-gray-400">Build Date</span>
                </div>
              </div>
            </section>

            {/* Property Details */}
            <section className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#7F00FF] flex items-center justify-center">
                  <span className="text-sm">2</span>
                </span>
                Property Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                <div className="flex justify-between">
                  <span className="text-gray-400">Property Type</span>
                  <span className="font-medium capitalize">{propertyType}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Sub Type</span>
                  <span className="font-medium capitalize">{subType}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className="font-medium">{status}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Listing Type</span>
                  <span className="font-medium capitalize">{listingType}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Area (sqft)</span>
                  <span className="font-medium">{area.sqft} sqft</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Area (sqm)</span>
                  <span className="font-medium">{area.sqm} sqm</span>
                </div>
              </div>
            </section>

            {/* Features & Amenities */}
            <section className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#7F00FF] flex items-center justify-center">
                  <span className="text-sm">3</span>
                </span>
                Features & Amenities
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <div
                  className={`flex items-center gap-2 p-3 rounded-lg ${features.garage
                    ? 'bg-[#7F00FF]/20'
                    : 'bg-white/5 opacity-60'
                    }`}
                >
                  <FaCarAlt
                    className={
                      features.garage ? 'text-[#B983FF]' : 'text-gray-500'
                    }
                  />
                  <span>{features.garage ? 'Garage' : 'No Garage'}</span>
                </div>

                <div
                  className={`flex items-center gap-2 p-3 rounded-lg ${features.pool ? 'bg-[#7F00FF]/20' : 'bg-white/5 opacity-60'
                    }`}
                >
                  <FaSwimmingPool
                    className={
                      features.pool ? 'text-[#B983FF]' : 'text-gray-500'
                    }
                  />
                  <span>{features.pool ? 'Pool' : 'No Pool'}</span>
                </div>

                <div
                  className={`flex items-center gap-2 p-3 rounded-lg ${features.yard ? 'bg-[#7F00FF]/20' : 'bg-white/5 opacity-60'
                    }`}
                >
                  <FaTree
                    className={
                      features.yard ? 'text-[#B983FF]' : 'text-gray-500'
                    }
                  />
                  <span>{features.yard ? 'Yard' : 'No Yard'}</span>
                </div>

                <div
                  className={`flex items-center gap-2 p-3 rounded-lg ${features.pets ? 'bg-[#7F00FF]/20' : 'bg-white/5 opacity-60'
                    }`}
                >
                  <FaPaw
                    className={
                      features.pets ? 'text-[#B983FF]' : 'text-gray-500'
                    }
                  />
                  <span>{features.pets ? 'Pets Allowed' : 'No Pets'}</span>
                </div>

                <div
                  className={`flex items-center gap-2 p-3 rounded-lg ${features.furnished
                    ? 'bg-[#7F00FF]/20'
                    : 'bg-white/5 opacity-60'
                    }`}
                >
                  <FaCouch
                    className={
                      features.furnished ? 'text-[#B983FF]' : 'text-gray-500'
                    }
                  />
                  <span>
                    {features.furnished ? 'Furnished' : 'Not Furnished'}
                  </span>
                </div>

                {features.wifi && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-[#7F00FF]/20">
                    <FaWifi className="text-[#B983FF]" />
                    <span>WiFi</span>
                  </div>
                )}

                {features.security && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-[#7F00FF]/20">
                    <FaShieldAlt className="text-[#B983FF]" />
                    <span>Security</span>
                  </div>
                )}

                {features.airConditioning && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-[#7F00FF]/20">
                    <FaSnowflake className="text-[#B983FF]" />
                    <span>Air Conditioning</span>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right Column - Contact & Location */}
          <div className="space-y-8">
            {/* Price Card */}
            <div className="backdrop-blur-sm bg-gradient-to-br from-[#7F00FF]/20 to-[#E100FF]/20 border border-white/10 rounded-2xl p-6 shadow-lg  top-24">
              <h3 className="text-3xl font-bold mb-2 text-white">
                {formatPrice(price, listingType)}
              </h3>

              <p className="text-gray-300 mb-6">
                {listingType === 'rent'
                  ? 'Rental price per month'
                  : 'Sale price'}
              </p>

              <button
                onClick={() => setShowContactForm(!showContactForm)}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#8E2DE2] to-[#4A00E0] hover:from-[#4A00E0] hover:to-[#8E2DE2] transition-all duration-300 text-white text-lg font-semibold shadow-lg mb-4"
              >
                Contact Agent
              </button>

              {/* Quick Contact Options */}
              <div className="grid grid-cols-3 gap-2 text-white">
                <a
                  href="tel:+1234567890"
                  className="flex flex-col items-center justify-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <FaPhoneAlt className="text-xl mb-1" />
                  <span className="text-xs">Call</span>
                </a>

                <a
                  href="mailto:agent@example.com"
                  className="flex flex-col items-center justify-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <FaEnvelope className="text-xl mb-1" />
                  <span className="text-xs">Email</span>
                </a>

                <a
                  href="https://wa.me/1234567890" //i should replace the number with the number of lister!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                  className="flex flex-col items-center justify-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <FaWhatsapp className="text-xl mb-1" />
                  <span className="text-xs">WhatsApp</span>
                </a>
              </div>

              {/* Contact Form */}
              {showContactForm && (
                <div className="mt-6 space-y-4">
                  <h4 className="font-semibold text-white mb-2">
                    Send a Message
                  </h4>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full p-3 bg-white/10 border border-white/10 rounded-lg focus:outline-none focus:border-[#B983FF]"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full p-3 bg-white/10 border border-white/10 rounded-lg focus:outline-none focus:border-[#B983FF]"
                  />
                  <textarea
                    placeholder="Your Message"
                    rows="4"
                    className="w-full p-3 bg-white/10 border border-white/10 rounded-lg focus:outline-none focus:border-[#B983FF]"
                  />
                  <button className="w-full py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 text-white font-medium">
                    Send Message
                  </button>
                </div>
              )}
            </div>

            {/* Map Location Placeholder */}
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-lg h-64">
              <div className="w-full h-full flex items-center justify-center bg-[#1a1a2e]">
                <div className="text-center px-4">
                  <FaMapMarkerAlt className="text-3xl text-[#B983FF] mx-auto mb-2" />
                  <p className="text-gray-300">Map view would appear here</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {address.street}, {address.city}, {address.state}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Properties Suggestion */}
        <section className="mt-16">
          <FeaturedProperties properties={properties} />{' '}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0c0c1d] border-t border-white/10 mt-16 py-8 text-center text-gray-400">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2025 Tamalk Real Estate. All Rights Reserved.</p>
          <p className="mt-2 text-sm">Luxury properties, exceptional service</p>
        </div>
      </footer>
    </div>
  );
};

export default PropertyDetail;