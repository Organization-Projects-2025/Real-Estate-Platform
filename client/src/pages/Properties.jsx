import React, { useEffect, useState } from 'react';
import PropertyCard from '../components/PropertyCard';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';

function Properties() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});

  // Fetch dynamic filters
  useEffect(() => {
    fetch('http://localhost:3000/api/filters?category=property-type')
      .then((res) => res.json())
      .then((data) => {
        setFilters(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error('Error fetching filters:', err);
        setFilters([]);
      });
  }, []);

  useEffect(() => {
    fetch('http://localhost:3000/api/properties')
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data?.data?.properties) {
          setProperties(data.data.properties);
          setFilteredProperties(data.data.properties);
        } else {
          console.warn('No properties found in API response');
          setProperties([]);
          setFilteredProperties([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching properties:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    applyFilters(properties, searchTerm, selectedFilters);
  }, [searchTerm, properties, selectedFilters]);

  const applyFilters = (propertyList, search, filters) => {
    let filtered = propertyList;

    // Apply property type filters
    if (filters.propertyType && filters.propertyType.length > 0) {
      filtered = filtered.filter((property) =>
        filters.propertyType.includes(property.propertyType)
      );
    }

    // Apply search
    if (search.trim() !== '') {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter((property) => {
        try {
          const mainFields = [
            property.title || '',
            property.description || '',
            property.listingType || '',
            property.propertyType || '',
            property.subType || '',
            property.address
              ? `${property.address.street || ''} ${
                  property.address.city || ''
                } ${property.address.state || ''} ${
                  property.address.country || ''
                }`
              : '',
            property.area?.sqft?.toString() || '',
            property.area?.sqm?.toString() || '',
            property.price?.toString() || '',
            property.buildDate?.toString() || '',
            property.status || '',
          ];

          const featureFields = property.features
            ? [
                property.features.bedrooms?.toString() || '',
                property.features.bathrooms?.toString() || '',
                property.features.garage?.toString() || '',
                property.features.pool?.toString() || '',
                property.features.yard?.toString() || '',
                property.features.pets?.toString() || '',
                property.features.furnished || '',
                property.features.airConditioning?.toString() || '',
                property.features.internet?.toString() || '',
                property.features.electricity?.toString() || '',
                property.features.water?.toString() || '',
                property.features.gas?.toString() || '',
                property.features.wifi?.toString() || '',
                property.features.security?.toString() || '',
              ]
            : [];

          return [...mainFields, ...featureFields].some((field) =>
            field.toLowerCase().includes(lowerSearch)
          );
        } catch (err) {
          console.error('Error filtering property:', property, err);
          return false;
        }
      });
    }

    setFilteredProperties(filtered);
  };

  const handleFilterChange = (filterName, isChecked) => {
    setSelectedFilters((prev) => {
      const updated = { ...prev };
      if (!updated.propertyType) {
        updated.propertyType = [];
      }

      if (isChecked) {
        if (!updated.propertyType.includes(filterName)) {
          updated.propertyType.push(filterName);
        }
      } else {
        updated.propertyType = updated.propertyType.filter(
          (f) => f !== filterName
        );
        if (updated.propertyType.length === 0) {
          delete updated.propertyType;
        }
      }

      return updated;
    });
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  if (loading) {
    return (
      <div className="bg-[#121212] text-[#fff] min-h-screen">
        <Navbar />
        <div className="px-6 md:px-16 py-20">
          <div className="animate-pulse">
            <div className="mb-16">
              <div className="h-12 bg-[#1a1a1a] rounded w-1/2 mb-6"></div>
              <div className="h-6 bg-[#1a1a1a] rounded w-3/4 mb-8"></div>
              <div className="flex">
                <div className="h-12 bg-[#1a1a1a] rounded-l-full w-full"></div>
                <div className="h-12 bg-[#703BF7] rounded-r-full w-32"></div>
              </div>
            </div>
            <h2 className="h-10 bg-[#1a1a1a] rounded w-1/3 mx-auto mb-10"></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-[#1a1a1a] p-4 rounded-lg">
                  <div className="h-48 bg-[#252525] rounded-lg mb-4"></div>
                  <div className="h-6 bg-[#252525] rounded w-3/4 mb-2"></div>
                  <div className="h-5 bg-[#703BF7] rounded w-1/3 mb-4"></div>
                  <div className="h-10 bg-[#252525] rounded-lg w-full"></div>
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
          backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c')`,
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#703BF7] to-[#121212] opacity-70"></div>
        <div className="relative max-w-3xl space-y-8 z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
            Discover Your{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#703BF7] to-[#fff]">
              Dream Home
            </span>
          </h1>
          <div className="flex items-center justify-center mt-6">
            <SearchBar onSearch={handleSearch} />
            <button className="ml-2 bg-gradient-to-r from-[#703BF7] to-[#5f2cc6] px-8 py-4 rounded-full font-semibold text-white hover:from-[#5f2cc6] hover:to-[#703BF7] transition-all duration-300 transform hover:scale-105">
              Search
            </button>
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-96 h-96 bg-[#703BF7]/20 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-[#fff]/10 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>
        </div>
      </section>
      <section className="px-6 md:px-16 py-20">
        <h2 className="text-3xl font-bold text-center mb-10">
          Browse Properties
        </h2>

        {/* Dynamic Filters */}
        {filters.length > 0 && (
          <div className="mb-8 p-6 bg-[#1a1a1a] rounded-lg border border-[#252525]">
            <h3 className="text-xl font-semibold mb-4">Filter by Property Type</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filters.map((filter) => (
                <label
                  key={filter._id}
                  className="flex items-center cursor-pointer hover:text-[#703BF7] transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={
                      selectedFilters.propertyType?.includes(filter.name) || false
                    }
                    onChange={(e) =>
                      handleFilterChange(filter.name, e.target.checked)
                    }
                    className="w-4 h-4 mr-2 rounded border-[#252525]"
                  />
                  <span>{filter.name}</span>
                </label>
              ))}
            </div>
            {Object.keys(selectedFilters).length > 0 && (
              <button
                onClick={() => {
                  setSelectedFilters({});
                }}
                className="mt-4 text-sm text-[#703BF7] hover:underline"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}

        {filteredProperties.length === 0 ? (
          <p className="text-center text-gray-400">
            No properties found. Try adjusting your search or filters.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
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

export default Properties;
