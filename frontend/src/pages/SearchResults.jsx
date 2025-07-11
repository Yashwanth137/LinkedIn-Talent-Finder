import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SearchResults = ({ results }) => {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("Incoming search results:", results);

    const fetchProfiles = async () => {
      setLoading(true);
      try {
        const fetched = await Promise.all(
          results.map(async (res) => {
            try {
              const profileRes = await axios.get(`http://localhost:8000/profile/${res.document_id}`);
              return { ...profileRes.data, score: Math.round(res.score) };
            } catch (err) {
              console.error("❌ Failed to fetch profile for:", res.document_id);
              return null; // Handle missing profiles (e.g., 404)
            }
          })
        );
        setProfiles(fetched.filter(Boolean)); // Filter out nulls
      } catch (err) {
        console.error("❌ Error fetching profiles:", err);
      } finally {
        setLoading(false);
      }
    };

    if (results.length) fetchProfiles();
  }, [results]);

  const openModal = (profile) => {
    setSelectedProfile(profile);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProfile(null);
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-800">
      <h2 className="text-3xl font-bold mb-8 text-blue-700">Matched Profiles</h2>

      {loading ? (
        <p className="text-gray-500 animate-pulse">Loading profiles...</p>
      ) : profiles.length === 0 ? (
        <p className="text-gray-500">No profiles found</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile) => (
            <div
              key={profile.document_id}
              className="bg-white/90 border border-blue-100 p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 cursor-pointer hover:scale-[1.02]"
              onClick={() => openModal(profile)}
            >
              <h3 className="text-xl font-semibold text-blue-700 mb-1">{profile.name}</h3>
              <p className="text-gray-600 text-sm mb-1">Email: {profile.email}</p>
              <p className="text-gray-600 text-sm mb-1">Score: <span className="font-medium text-purple-600">{profile.score}</span></p>
              <div className="mt-2 flex flex-wrap gap-2">
                {profile.skills?.slice(0, 4).map((skill, idx) => (
                  <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                    {skill}
                  </span>
                ))}
                {profile.skills?.length > 4 && (
                  <span className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-full font-medium">
                    +{profile.skills.length - 4} more
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Modal Popup */}
      {isModalOpen && selectedProfile && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold"
              onClick={closeModal}
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold text-blue-700 mb-1">{selectedProfile.name}</h2>
            <p className="text-gray-500 mb-4">{selectedProfile.email}</p>
            <p className="mb-1"><strong>Mobile:</strong> {selectedProfile.mobile_number || "N/A"}</p>
            <p className="mb-1"><strong>Experience:</strong> {selectedProfile.years_experience} years</p>
            <p className="mb-3"><strong>Location:</strong> {selectedProfile.location || "N/A"}</p>

            <div className="mb-4">
              <strong>Skills:</strong>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedProfile.skills?.map((skill, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <strong>Previous Roles:</strong>
              <ul className="list-disc list-inside mt-2 text-sm text-gray-700">
                {selectedProfile.prev_roles?.map((role, idx) => (
                  <li key={idx}>{role}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
