import React, { useState } from 'react';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const PropertyCard = ({ property, onUpdate, isEditable = false, to }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProperty, setEditedProperty] = useState(property);

  const {
    _id,
    title,
    price,
    listingType,
    propertyType,
    address = {},
    area = {},
    features = {},
    media = [],
  } = editedProperty;

  const image = media && media.length > 0 ? media[0] : '';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProperty(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNestedInputChange = (category, field, value) => {
    setEditedProperty(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    onUpdate(_id, editedProperty);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProperty(property);
    setIsEditing(false);
  };

  return (
    <div className="max-w-sm rounded-2xl overflow-hidden shadow-lg bg-[#1a1a1a] hover:shadow-2xl transition-shadow duration-300 border border-[#252525]">
      <img className="w-full h-48 object-cover" src={image} alt={title || 'Property'} />
      <div className="p-4 space-y-2">
        {isEditing ? (
          <>
            <input
              type="text"
              name="title"
              value={editedProperty.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded bg-[#252525] border border-gray-700 focus:border-[#703BF7] focus:outline-none"
            />
            <div className="space-y-2">
              <input
                type="text"
                value={editedProperty.address?.city || ''}
                onChange={(e) => handleNestedInputChange('address', 'city', e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#252525] border border-gray-700 focus:border-[#703BF7] focus:outline-none"
                placeholder="City"
              />
              <input
                type="text"
                value={editedProperty.address?.state || ''}
                onChange={(e) => handleNestedInputChange('address', 'state', e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#252525] border border-gray-700 focus:border-[#703BF7] focus:outline-none"
                placeholder="State"
              />
            </div>
            <input
              type="number"
              name="price"
              value={editedProperty.price}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded bg-[#252525] border border-gray-700 focus:border-[#703BF7] focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex-1 bg-[#703BF7] hover:bg-[#5f2cc6] text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <FaSave /> Save
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <FaTimes /> Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            <p className="text-gray-400 text-sm flex items-center gap-1">
              <FaMapMarkerAlt className="text-gray-500" />
              {address?.city}, {address?.state}, {address?.country}
            </p>
            <p className="text-lg font-bold text-[#703BF7]">
              ${price?.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 capitalize">
              {listingType} | {propertyType}
            </p>
            <div className="flex justify-between text-sm text-gray-300 mt-3">
              <div className="flex items-center gap-1">
                <FaBed /> {features?.bedrooms} Beds
              </div>
              <div className="flex items-center gap-1">
                <FaBath /> {features?.bathrooms} Baths
              </div>
              <div className="flex items-center gap-1">
                <FaRulerCombined /> {area?.sqft} sqft
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                to={to || `/property/${_id}`}
                className="mt-4 block w-full bg-[#703BF7] hover:bg-[#5f2cc6] text-white py-2 text-center rounded-lg transition-colors"
                style={{ flex: isEditable ? 1 : 'none', width: isEditable ? 'auto' : '100%' }}
              >
                View Details
              </Link>
              {isEditable && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  style={{ flex: 1 }}
                >
                  <FaEdit /> Edit
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
