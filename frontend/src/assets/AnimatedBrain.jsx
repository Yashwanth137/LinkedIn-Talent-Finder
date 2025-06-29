import React from "react";
import { Brain, Sparkles } from "lucide-react";

const AnimatedBrain = () => {
  return (
    <div className="relative w-56 h-56 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl gradient-animate">
      <div className="w-40 h-40 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
        <div className="relative">
          <Brain className="w-12 h-12 text-white drop-shadow-lg" />
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
      {/* Floating labels */}
      <div className="absolute -top-4 -left-16 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-bounce">
        AI
      </div>
      <div className="absolute -bottom-4 -right-16 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-bounce">
        Search
      </div>
      <div className="absolute top-0 right-0 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-bounce">
        Smart
      </div>
    </div>
  );
};

export default AnimatedBrain;
