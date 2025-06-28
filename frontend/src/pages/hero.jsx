import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BriefcaseIcon, DocumentTextIcon, MagnifyingGlassIcon, UserCircleIcon, ChartBarIcon } from "@heroicons/react/24/solid";
import { Link as ScrollLink } from "react-scroll";
import LoginRegisterPage from "./login";

export default function Hero() {
  const primaryColor = "#FF4B2B";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const featureData = [
    { title: "NLP Skill Extraction", desc: "Automatically identify key skills from job descriptions using AI.", icon: <DocumentTextIcon className="h-6 w-6 text-red-400" /> },
    { title: "AI Candidate Ranking", desc: "Rank LinkedIn profiles using tailored algorithms based on fit score.", icon: <ChartBarIcon className="h-6 w-6 text-red-400" /> },
    { title: "Smart Export Tools", desc: "Export shortlists and manage hiring funnel effortlessly.", icon: <BriefcaseIcon className="h-6 w-6 text-red-400" /> },
    { title: "Job Description Input", desc: "Add roles through text upload or manual form entry with intelligent parsing.", icon: <DocumentTextIcon className="h-6 w-6 text-red-400" /> },
    { title: "LinkedIn Profile Search", desc: "Search real-time LinkedIn candidates via API integration.", icon: <MagnifyingGlassIcon className="h-6 w-6 text-red-400" /> },
    { title: "Detailed Profile Previews", desc: "View enhanced candidate summaries with skill and experience highlights.", icon: <UserCircleIcon className="h-6 w-6 text-red-400" /> },
    { title: "Intuitive Dashboard & Analytics", desc: "Filter, visualize, and analyze candidate pools from a centralized dashboard.", icon: <ChartBarIcon className="h-6 w-6 text-red-400" /> },
  ];

  return (
    <div className="bg-gray-50 relative overflow-hidden">
      {/* Floating background shapes */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-red-100 opacity-20 blur-2xl rounded-full z-0"></div>
      <div className="absolute bottom-40 right-10 w-40 h-40 bg-red-200 opacity-20 blur-3xl rounded-full z-0"></div>

      {/* HERO SECTION */}
      <div className="relative z-10" style={{ backgroundColor: primaryColor }} id="hero">
        <header className="flex justify-between items-center px-8 py-4">
          <motion.h2 className="text-2xl font-bold text-white" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
            TalentFinder
          </motion.h2>
          <motion.div className="flex gap-4" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
            <Link to="/login" className="border border-white px-4 py-2 rounded-xl font-medium text-white transition-colors hover:bg-white hover:text-red-500">Login</Link>
            <Link to="/login" className="bg-white text-red-500 px-4 py-2 rounded-xl font-medium transition-transform hover:scale-105">Sign up</Link>
          </motion.div>
        </header>

        <motion.section variants={containerVariants} initial="hidden" animate="visible" className="text-center px-6 pt-12 pb-32 md:pb-40 text-white relative z-10">
          <motion.div variants={itemVariants} className="inline-block mb-6 px-6 py-2 rounded-xl text-sm font-semibold bg-white text-red-500 shadow-md">
            AI-Powered Talent Matching
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
            Streamline your recruitment <br className="hidden md:block" /> with AI Powered Tools.
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg text-white/80 max-w-xl mx-auto mb-10">
            Let AI do the heavy lifting in your hiring process. Find the perfect fit faster than ever.
          </motion.p>
          <motion.div variants={itemVariants} className="flex justify-center gap-4 flex-wrap">
            <Link to="/auth" className="bg-white text-red-500 px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:scale-105 flex items-center gap-2">
              <BriefcaseIcon className="h-5 w-5 text-red-500" />
              Start Hiring →
            </Link>
            <ScrollLink to="features" smooth={true} duration={500} offset={-100} className="cursor-pointer border-2 border-white/50 hover:border-white px-6 py-3 rounded-xl font-semibold transition-all duration-300">
              Explore Features ✨
            </ScrollLink>
          </motion.div>
        </motion.section>

        <div className="absolute bottom-0 left-0 w-full h-auto">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-64" fill="white" style={{ filter: "drop-shadow(0 -10px 10px rgba(0,0,0,0.05))" }}>
            <path d="M1440,22.2C1200,74.7,960,105.7,720,105.7S240,74.7,0,22.2V120h1440V22.2z"></path>
          </svg>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <motion.section id="features" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-gradient-to-b from-white via-red-50 to-red-100 relative py-24 px-6 md:px-20 text-center text-gray-700">
        <h2 className="text-sm uppercase tracking-wide text-red-400 mb-2">Features</h2>
        <h3 className="text-3xl font-bold mb-4" style={{ color: primaryColor }}>Our Powerful Features</h3>
        <p className="max-w-4xl mx-auto mb-12 leading-relaxed">
          TalentFinder automates talent acquisition using cutting-edge AI and LinkedIn APIs. From intelligent job input to real-time candidate search, ranking, and analytics, we simplify your recruitment workflow and accelerate hiring decisions.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {featureData.map((feature, i) => (
            <motion.div key={i} whileHover={{ scale: 1.05, y: -5 }} transition={{ type: "spring", stiffness: 200 }} className="bg-white rounded-xl p-8 shadow-lg text-left">
              <div className="mb-4">{feature.icon}</div>
              <h4 className="text-xl font-semibold mb-2" style={{ color: primaryColor }}>{feature.title}</h4>
              <p className="text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA SECTION */}
      <section className="bg-white py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to simplify your hiring?</h2>
        <p className="text-gray-500 mb-6">Start using TalentFinder and discover top talent faster than ever.</p>
        <Link to="/auth" className="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-full transition">Get Started →</Link>
      </section>

      {/* FOOTER SECTION */}
      <footer className="bg-[#1A202C] text-gray-300 pt-16 pb-12 px-6 md:px-20">
        <div className="grid md:grid-cols-3 gap-8 items-center text-sm">
          <div>
            <h2 className="text-white text-xl font-bold mb-2">TalentFinder</h2>
            <p>Connecting talent with technology-driven hiring.</p>
          </div>
          <nav className="flex flex-col space-y-2 md:items-center">
            <ScrollLink to="hero" smooth={true} duration={500} offset={-100} className="cursor-pointer hover:text-red-300">Home</ScrollLink>
            <ScrollLink to="features" smooth={true} duration={500} offset={-100} className="cursor-pointer hover:text-red-300">Features</ScrollLink>
            <Link to="#privacy" className="hover:text-red-300">Privacy Policy</Link>
            <Link to="#terms" className="hover:text-red-300">Terms of Service</Link>
            <Link to="#contact" className="hover:text-red-300">Contact Us</Link>
          </nav>
        </div>
        <p className="text-center text-xs mt-10">© {new Date().getFullYear()} TalentFinder. All rights reserved.</p>
      </footer>
    </div>
  );
}
