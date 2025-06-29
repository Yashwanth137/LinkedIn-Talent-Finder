import React from "react";

export default function GlassBackgroundLayout({ children }) {
  return (
    
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Frosted full-page glass layer */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-xl z-0 pointer-events-none"></div>

      {/* Top-left geometry shape */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-100 opacity-20 rounded-full blur-3xl z-0"></div>

      {/* Bottom-right geometry shape */}
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-200 opacity-20 rounded-full blur-2xl z-0"></div>

      {/* Content container */}
      <div className="relative z-10">{children}</div>
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-red-200 opacity-40 rounded-full blur-2xl z-0"></div>

    </div>
  );
}
