import React, { useState } from 'react';
import {
  Settings,
  FileText,
  Search,
  BarChart3,
  User,
  Eye,
  Sparkles,
  Zap,
  Award,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function InputPage() {
  const [activeTab, setActiveTab] = useState('Job Description');
  const [jobDescription, setJobDescription] = useState('');

  const skills = ['React', 'Python', 'AI/ML', 'Leadership', 'Strategy', 'Design'];

  const tabStyles = {
    blue: 'border-blue-500 text-blue-600 bg-blue-50/50',
    purple: 'border-purple-500 text-purple-600 bg-purple-50/50',
    emerald: 'border-emerald-500 text-emerald-600 bg-emerald-50/50',
  };

  const iconStyles = {
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    emerald: 'text-emerald-600',
  };

  const pulseStyles = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    emerald: 'bg-emerald-500',
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col relative overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-white/20 px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white">
                <path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-2 h-2 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              LinkedIn Talent Finder
            </h1>
            <p className="text-xs text-gray-500">AI-Powered Recruitment</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-700 font-medium">Online</span>
          </div>
          <Settings className="w-5 h-5 text-gray-500 hover:text-blue-600 transition-colors hover:rotate-12 transform duration-300 cursor-pointer" />
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-white/20 px-6">
        <div className="flex space-x-8">
          {[
            { name: 'Job Description', icon: FileText, color: 'blue' },
            { name: 'Search Results', icon: Search, color: 'purple' },
            { name: 'Dashboard', icon: BarChart3, color: 'emerald' }
          ].map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`py-4 px-4 border-b-[3px] font-semibold text-sm flex items-center space-x-3 transition-all duration-300 transform hover:scale-105 ${
                activeTab === tab.name
                  ? tabStyles[tab.color]
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.name ? iconStyles[tab.color] : ''}`} />
              <span>{tab.name}</span>
              {activeTab === tab.name && (
                <div className={`w-2 h-2 ${pulseStyles[tab.color]} rounded-full animate-pulse`}></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        className="flex-1 flex flex-col items-center justify-center px-6 py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-w-4xl bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 hover:shadow-3xl transition-shadow duration-500">
          <div className="mb-6">
            <label className="flex items-center space-x-2 text-lg font-semibold text-gray-800 mb-4">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>Job Description</span>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </label>
            <div className="relative">
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Describe your ideal candidate..."
                rows={6}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 resize-none text-base placeholder-gray-400 bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-blue-300"
              />
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <Eye className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-400">{jobDescription.length}/2000</span>
              </div>
            </div>

            {/* Skill Tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-500 mr-2">Popular skills:</span>
              {skills.map((skill, index) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-xs font-medium cursor-pointer hover:from-blue-200 hover:to-purple-200 transition-all duration-300 transform hover:scale-110"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <button className="group flex items-center space-x-3 px-10 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-2xl font-bold text-lg hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-2xl">
              <Zap className="w-6 h-6 group-hover:animate-spin" />
              <span>AI Smart Search</span>
              <Award className="w-5 h-5 group-hover:animate-bounce" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
