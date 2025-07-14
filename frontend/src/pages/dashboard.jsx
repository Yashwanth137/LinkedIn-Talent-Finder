import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
} from "recharts";

/**
 * Dashboard – visual summary of the top‑k search hits
 * @param {Array<{document_id:string, score:number}>} results – search results from backend
 * @param {number} topK – number of candidates to show (default 10)
 */
const Dashboard = ({ results = [], topK = 10 }) => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch full profile details for each result
  useEffect(() => {
    const fetchProfiles = async () => {
      if (!results.length) return;
      setLoading(true);
      const topResults = results.slice(0, topK);

      const fetched = await Promise.all(
        topResults.map(async ({ document_id, score }) => {
          try {
            const { data } = await axios.get(`http://localhost:8000/profile/${document_id}`);
            return { ...data, score: Math.round(score) };
          } catch (err) {
            console.error("Failed to fetch", document_id, err);
            return null;
          }
        })
      );

      setProfiles(fetched.filter(Boolean));
      setLoading(false);
    };

    fetchProfiles();
  }, [results, topK]);

  // === 📊 Chart Data ===
  const sortedProfiles = [...profiles].sort((a, b) => b.score - a.score);

  const barData = sortedProfiles.map(p => ({
    name: p.name?.split(" ")[0] || p.document_id,
    score: p.score,
  }));

  const skillUniverse = Array.from(
    new Set(profiles.flatMap(p => p.skills || []))
  ).slice(0, 8);

  const radarData = profiles.map(p => {
    const row = { name: p.name?.split(" ")[0] };
    skillUniverse.forEach(skill => {
      row[skill] = p.skills?.includes(skill) ? 1 : 0;
    });
    return row;
  });

  return (
    <div className="p-8 space-y-12 min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <h2 className="text-3xl font-bold text-emerald-700 mb-4">
        Top {profiles.length} Candidates Overview
      </h2>

      {loading ? (
        <p className="text-gray-500 animate-pulse">Loading dashboard...</p>
      ) : (
        <>
          {/* 📊 Bar Chart: Match Score */}
          <div className="w-full h-80 bg-white shadow rounded-lg p-4 mb-10" style={{ height: `${Math.max(barData.length * 45 + 80, 400)}px` }} >
            <h3 className="text-lg font-semibold text-emerald-700 mb-2">Match Score</h3>
            <ResponsiveContainer>
              <BarChart barCategoryGap={10} barSize={20} data={barData} layout="vertical" margin={{ left: 50, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="score" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 🕸️ Radar Chart: Skills */}
          {skillUniverse.length > 0 && (
            <div className="w-full bg-white shadow rounded-lg p-4 mb-12 flex flex-col">
              <h3 className="text-lg font-semibold text-emerald-700 mb-4">Skill Comparison</h3>
              <div className="w-full" style={{ height: 384 }}> {/* ~ h-96 */}
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis />
                    {skillUniverse.map(skill => (
                      <Radar
                        key={skill}
                        name={skill}
                        dataKey={skill}
                        stroke="#14B8A6"
                        fill="#14B8A6"
                        fillOpacity={0.2}
                      />
                    ))}
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}


          {/* 📋 Table Overview */}
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Score</th>
                  <th className="px-6 py-3 font-medium">Skills</th>
                  <th className="px-6 py-3 font-medium">Experience (yrs)</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {profiles.map(p => (
                  <tr key={p.document_id} className="hover:bg-gray-50">
                    <td className="px-6 py-3">{p.name}</td>
                    <td className="px-6 py-3">{p.score}</td>
                    <td className="px-6 py-3">{p.skills?.length ?? 0}</td>
                    <td className="px-6 py-3">{p.years_experience ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
