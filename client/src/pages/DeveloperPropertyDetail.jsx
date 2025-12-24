import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FaBed,
    FaBath,
    FaRulerCombined,
    FaMapMarkerAlt,
    FaArrowLeft,
    FaBuilding,
    FaPhoneAlt,
    FaWhatsapp,
    FaCarAlt,
    FaSwimmingPool,
    FaTree,
    FaPaw,
    FaCouch,
    FaShieldAlt,
} from 'react-icons/fa';
import Navbar from '../components/Navbar';

const DeveloperPropertyDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        const fetchProperty = async () => {
            setLoading(true);
            try {
                // Using 127.0.0.1 for maximum compatibility during local dev
                const response = await fetch(`http://127.0.0.1:3000/api/developer-properties/${id}`);
                if (!response.ok) {
                    const errorMsg = `Error ${response.status}: Failed to fetch details for ID ${id}`;
                    throw new Error(errorMsg);
                }
                const data = await response.json();
                console.log('Fetched Developer Property:', data);
                if (data?.data?.property) {
                    setProperty(data.data.property);
                } else {
                    throw new Error(`Data structure mismatch: property field not found for ID ${id}`);
                }
            } catch (err) {
                console.error('Fetch Error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProperty();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="bg-[#121212] min-h-screen text-white">
                <Navbar />
                <div className="flex items-center justify-center h-[80vh]">
                    <div className="w-12 h-12 border-4 border-[#703BF7] border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="bg-[#121212] min-h-screen text-white">
                <Navbar />
                <div className="max-w-7xl mx-auto px-6 py-20 text-center">
                    <h2 className="text-3xl font-bold mb-4 text-[#703BF7]">Property Not Found</h2>
                    <p className="text-gray-400 mb-8">{error || 'This developer property could not be loaded.'}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-[#703BF7] px-8 py-3 rounded-lg hover:bg-[#5f2cc6] transition-all"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const {
        title,
        description,
        price,
        propertyType,
        address,
        area,
        features,
        images = [],
        listingType,
    } = property;

    return (
        <div className="bg-[#121212] min-h-screen text-white">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-10">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-[#703BF7] transition-colors mb-8 group"
                >
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-video rounded-2xl overflow-hidden bg-[#1a1a1a] border border-white/5 shadow-2xl">
                            {images.length > 0 ? (
                                <img
                                    src={images[activeImage]}
                                    alt={title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <FaBuilding className="text-8xl text-gray-700" />
                                </div>
                            )}
                        </div>

                        {images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                                {images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveImage(index)}
                                        className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${activeImage === index ? 'border-[#703BF7] scale-105 shadow-lg shadow-[#703BF7]/20' : 'border-transparent opacity-50 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={img} alt={`${title} ${index}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Core Info */}
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-4 py-1.5 bg-[#703BF7]/10 text-[#703BF7] rounded-full text-xs font-bold uppercase tracking-widest border border-[#703BF7]/20">
                                    {listingType}
                                </span>
                                <span className="px-4 py-1.5 bg-white/5 text-gray-400 rounded-full text-xs font-bold uppercase tracking-widest border border-white/10">
                                    {propertyType}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">{title}</h1>
                            <p className="flex items-center gap-3 text-gray-400 text-xl font-medium">
                                <FaMapMarkerAlt className="text-[#703BF7]" />
                                {address?.street ? `${address.street}, ` : ''}{address?.city}, {address?.state}
                            </p>
                        </div>

                        <div className="text-5xl font-black text-[#703BF7] tracking-tight">
                            ${price?.toLocaleString()}
                        </div>

                        <div className="grid grid-cols-3 gap-6 py-8 border-y border-white/10">
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-2 text-gray-500 mb-2">
                                    <FaBed className="text-lg" /> <span className="text-sm font-bold uppercase">Beds</span>
                                </div>
                                <div className="text-2xl font-black">{features?.bedrooms || 0}</div>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-2 text-gray-500 mb-2">
                                    <FaBath className="text-lg" /> <span className="text-sm font-bold uppercase">Baths</span>
                                </div>
                                <div className="text-2xl font-black">{features?.bathrooms || 0}</div>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-2 text-gray-500 mb-2">
                                    <FaRulerCombined className="text-lg" /> <span className="text-sm font-bold uppercase">Sq Ft</span>
                                </div>
                                <div className="text-2xl font-black">{area?.sqft || 0}</div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold flex items-center gap-3">
                                <span className="w-1 h-8 bg-[#703BF7] rounded-full"></span>
                                Key Features
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <FeatureItem icon={<FaCarAlt />} label="Garage" value={features?.garage ? `${features.garage} Spaces` : 'No'} />
                                <FeatureItem icon={<FaSwimmingPool />} label="Pool" value={features?.pool ? 'Yes' : 'No'} />
                                <FeatureItem icon={<FaTree />} label="Yard" value={features?.yard ? 'Yes' : 'No'} />
                                <FeatureItem icon={<FaPaw />} label="Pets" value={features?.pets ? 'Allowed' : 'No'} />
                                <FeatureItem icon={<FaCouch />} label="Furnished" value={features?.furnished || 'No'} />
                                <FeatureItem icon={<FaShieldAlt />} label="Security" value="24/7" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-10">
                        <section className="bg-white/5 p-8 rounded-3xl border border-white/10">
                            <h2 className="text-3xl font-black mb-6 text-white uppercase tracking-tight">Description</h2>
                            <p className="text-gray-400 leading-relaxed text-lg whitespace-pre-line font-medium italic opacity-90">
                                "{description || 'This exclusive developer property offers a modern living experience with high-end finishes and strategic location.'}"
                            </p>
                        </section>
                    </div>

                    <aside className="space-y-6">
                        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#703BF7]/10 blur-3xl -mr-16 -mt-16 group-hover:bg-[#703BF7]/20 transition-all duration-500"></div>
                            <h3 className="text-2xl font-black mb-8 relative z-10 uppercase tracking-tighter">Inquire Now</h3>
                            <div className="space-y-6 relative z-10">
                                <button className="w-full bg-[#703BF7] hover:bg-[#5f2cc6] text-white py-5 rounded-2xl font-black transition-all shadow-xl hover:shadow-[#703BF7]/30 transform hover:-translate-y-1 uppercase tracking-widest text-sm">
                                    Request Details
                                </button>
                                <div className="space-y-3">
                                    <button className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 py-4 rounded-xl transition-all border border-white/5 hover:border-[#703BF7]/50 font-bold">
                                        <FaPhoneAlt className="text-[#703BF7]" /> Call Developer
                                    </button>
                                    <button className="w-full flex items-center justify-center gap-3 bg-green-500/5 hover:bg-green-500/10 py-4 rounded-xl transition-all border border-green-500/10 hover:border-green-500/50 font-bold">
                                        <FaWhatsapp className="text-green-500" /> WhatsApp
                                    </button>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            <footer className="bg-[#121212] py-12 text-center text-gray-600 border-t border-white/5 mt-20">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-lg font-bold text-gray-400 mb-2">TAMALAK</p>
                    <p className="text-sm">© 2025 Luxury Real Estate Collective. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
};

const FeatureItem = ({ icon, label, value }) => (
    <div className="flex flex-col gap-1 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 hover:border-[#703BF7]/30 transition-all cursor-default">
        <div className="text-[#703BF7] text-lg mb-1">{icon}</div>
        <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{label}</div>
        <div className="text-sm font-bold text-white leading-tight">{value}</div>
    </div>
);

export default DeveloperPropertyDetail;
