import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard';
import { FaArrowLeft, FaMapMarkerAlt, FaCalendarAlt, FaBuilding } from 'react-icons/fa';

function PublicProjectDetails() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch(`http://127.0.0.1:3000/api/projects/${projectId}`).then(res => res.json()),
            fetch(`http://127.0.0.1:3000/api/developer-properties/project/${projectId}`).then(res => res.json())
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
                console.error('Error fetching project details:', err);
                setLoading(false);
            });
    }, [projectId]);

    if (loading) {
        return (
            <div className="bg-[#121212] text-[#fff] min-h-screen">
                <Navbar />
                <div className="px-6 md:px-16 py-20 animate-pulse">
                    <div className="h-64 bg-[#1a1a1a] rounded-xl mb-8"></div>
                    <div className="h-10 bg-[#1a1a1a] w-1/3 mb-4 rounded"></div>
                    <div className="h-4 bg-[#1a1a1a] w-2/3 mb-2 rounded"></div>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="bg-[#121212] text-[#fff] min-h-screen">
                <Navbar />
                <div className="px-6 md:px-16 py-20 text-center">
                    <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
                    <button
                        onClick={() => navigate('/developer-properties')}
                        className="text-[#703BF7] hover:underline"
                    >
                        Back to Projects
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#121212] text-[#fff] min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <div className="relative h-[60vh] w-full">
                {project.images && project.images.length > 0 ? (
                    <img
                        src={project.images[0]}
                        alt={project.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#252525] to-[#1a1a1a] flex items-center justify-center">
                        <FaBuilding className="text-9xl text-gray-700" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent"></div>

                <div className="absolute bottom-0 left-0 w-full px-6 md:px-16 pb-12">
                    <button
                        onClick={() => navigate('/developer-properties')}
                        className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-6"
                    >
                        <FaArrowLeft /> Back to Projects
                    </button>
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-4">{project.name}</h1>
                    <div className="flex flex-wrap items-center gap-6 text-gray-300 text-lg">
                        {project.location && (
                            <div className="flex items-center gap-2">
                                <FaMapMarkerAlt className="text-[#703BF7]" />
                                {project.location}
                            </div>
                        )}
                        {project.status && (
                            <span className="px-3 py-1 bg-[#703BF7]/20 text-[#703BF7] rounded-full text-sm font-semibold border border-[#703BF7]/30">
                                {project.status}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="px-6 md:px-16 py-12">
                {/* Description & Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-3xl font-bold">About this Project</h2>
                        <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-line">
                            {project.description || 'No description available.'}
                        </p>
                    </div>

                    <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-[#252525] h-fit">
                        <h3 className="text-xl font-bold mb-6">Project Details</h3>
                        <div className="space-y-4">
                            {project.startDate && (
                                <div className="flex items-center justify-between py-3 border-b border-[#333]">
                                    <span className="text-gray-400 flex items-center gap-2">
                                        <FaCalendarAlt /> Start Date
                                    </span>
                                    <span className="font-semibold">{new Date(project.startDate).toLocaleDateString()}</span>
                                </div>
                            )}
                            {project.expectedCompletionDate && (
                                <div className="flex items-center justify-between py-3 border-b border-[#333]">
                                    <span className="text-gray-400 flex items-center gap-2">
                                        <FaCalendarAlt /> Completion
                                    </span>
                                    <span className="font-semibold">{new Date(project.expectedCompletionDate).toLocaleDateString()}</span>
                                </div>
                            )}

                            {project.developerId && (
                                <div className="pt-4">
                                    <button
                                        onClick={() => navigate(`/developer-properties/${project.developerId}`)}
                                        className="w-full bg-[#252525] hover:bg-[#333] text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FaBuilding className="text-[#703BF7]" />
                                        View Developer Profile
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Available Properties */}
                <div>
                    <h2 className="text-3xl font-bold mb-8">Available Properties</h2>
                    {properties.length === 0 ? (
                        <div className="text-center py-16 bg-[#1a1a1a] rounded-2xl border border-[#252525] border-dashed">
                            <p className="text-gray-400 text-lg">No properties listed for this project yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {properties.map((property) => (
                                <PropertyCard
                                    key={property._id}
                                    property={{ ...property, media: property.images || [] }}
                                    to={`/developer-property/${property._id}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <footer className="bg-[#1a1a1a] py-6 text-center text-gray-400 mt-20">
                <p>© 2025 Tamalak. All Rights Reserved.</p>
            </footer>
        </div>
    );
}

export default PublicProjectDetails;
