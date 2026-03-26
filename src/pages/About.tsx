import React from 'react';
import { motion } from 'motion/react';
import { Target, Eye, Award, Users, History, ShieldCheck } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-white">
      {/* Page Header */}
      <div className="bg-[#0B3C5D] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-extrabold mb-6"
          >
            About Silver Jubilee Hospital
          </motion.h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            A legacy of healing and care in the heart of Baramati. 
            Dedicated to providing world-class healthcare to all.
          </p>
        </div>
      </div>

      {/* Introduction */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#0B3C5D] mb-6">Our Legacy of Care</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Silver Jubilee Hospital, Baramati was established with the vision of providing high-quality, 
                affordable healthcare to the residents of Baramati and surrounding regions. 
                As a premier government institution, we have grown from a small clinic to a 
                multi-specialty hospital with state-of-the-art facilities.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Our team of dedicated doctors, nurses, and support staff work tirelessly to ensure 
                that every patient receives the best possible medical attention. We are committed 
                to continuous improvement and adopting the latest medical advancements.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-3 rounded-lg text-[#328CC1]">
                    <Award className="h-6 w-6" />
                  </div>
                  <span className="font-bold text-[#0B3C5D]">Accredited Care</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-3 rounded-lg text-[#328CC1]">
                    <Users className="h-6 w-6" />
                  </div>
                  <span className="font-bold text-[#0B3C5D]">Expert Team</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=2070" 
                alt="Hospital Interior" 
                className="rounded-3xl shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-10 -left-10 bg-[#328CC1] text-white p-8 rounded-3xl shadow-xl hidden md:block">
                <p className="text-4xl font-bold mb-1">25+</p>
                <p className="text-sm font-semibold uppercase tracking-widest">Years of Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100"
            >
              <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center text-[#328CC1] mb-8">
                <Target className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-[#0B3C5D] mb-6">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To provide accessible, affordable, and high-quality healthcare services to all sections of society, 
                with a focus on compassion, integrity, and medical excellence. We strive to improve the 
                health and well-being of our community through preventive and curative care.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100"
            >
              <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center text-[#328CC1] mb-8">
                <Eye className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-[#0B3C5D] mb-6">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To be a leading healthcare institution recognized for its clinical excellence, 
                patient-centric approach, and contribution to public health. We envision a 
                healthier Baramati where every individual has access to world-class medical facilities.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Government Info */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0B3C5D] rounded-3xl p-12 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <ShieldCheck className="h-64 w-64" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-8">Public Health Department</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div>
                  <h4 className="text-[#328CC1] font-bold mb-4 uppercase tracking-widest text-sm">Administration</h4>
                  <p className="text-gray-300">Governed by the Public Health Department, Government of Maharashtra. We adhere to all state and central health guidelines.</p>
                </div>
                <div>
                  <h4 className="text-[#328CC1] font-bold mb-4 uppercase tracking-widest text-sm">Schemes</h4>
                  <p className="text-gray-300">We actively implement government health schemes like Mahatma Jyotirao Phule Jan Arogya Yojana (MJPJAY) and PMJAY.</p>
                </div>
                <div>
                  <h4 className="text-[#328CC1] font-bold mb-4 uppercase tracking-widest text-sm">Transparency</h4>
                  <p className="text-gray-300">Committed to transparency in medical services, billing, and administration. All government audits are strictly followed.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
