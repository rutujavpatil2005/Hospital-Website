import React from 'react';
import { motion } from 'motion/react';
import { 
  Stethoscope, 
  HeartPulse, 
  Activity, 
  Baby, 
  Pill, 
  Microscope, 
  Bone, 
  Eye, 
  Brain, 
  Thermometer,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import SymptomChecker from '../components/SymptomChecker';

export default function Services() {
  const departments = [
    {
      title: 'General OPD',
      icon: Stethoscope,
      color: 'bg-blue-100 text-blue-600',
      description: 'Comprehensive outpatient consultation for all general health concerns.',
      features: ['Daily Clinics', 'Specialist Consultations', 'Preventive Checkups']
    },
    {
      title: 'Emergency & Trauma',
      icon: HeartPulse,
      color: 'bg-red-100 text-red-600',
      description: '24/7 emergency medical services for critical and trauma cases.',
      features: ['24/7 Availability', 'Advanced Life Support', 'Trauma Specialists']
    },
    {
      title: 'ICU & Critical Care',
      icon: Activity,
      color: 'bg-orange-100 text-orange-600',
      description: 'High-dependency units with advanced monitoring and life support systems.',
      features: ['Intensive Monitoring', 'Ventilator Support', 'Specialized Nursing']
    },
    {
      title: 'Maternity & Gynaecology',
      icon: Baby,
      color: 'bg-pink-100 text-pink-600',
      description: 'Comprehensive care for expectant mothers and women health.',
      features: ['Antenatal Care', 'Labour & Delivery', 'Postnatal Support']
    },
    {
      title: 'Pharmacy',
      icon: Pill,
      color: 'bg-green-100 text-green-600',
      description: 'In-house pharmacy providing essential medicines at government rates.',
      features: ['24/7 Service', 'Essential Medicines', 'Quality Assurance']
    },
    {
      title: 'Pathology & Radiology',
      icon: Microscope,
      color: 'bg-purple-100 text-purple-600',
      description: 'Advanced diagnostic services including blood tests, X-ray, and ultrasound.',
      features: ['Modern Lab', 'Digital X-Ray', 'Accurate Reporting']
    },
    {
      title: 'Orthopaedics',
      icon: Bone,
      color: 'bg-amber-100 text-amber-600',
      description: 'Specialized care for bone, joint, and musculoskeletal disorders.',
      features: ['Fracture Management', 'Joint Replacement', 'Physiotherapy']
    },
    {
      title: 'Ophthalmology',
      icon: Eye,
      color: 'bg-cyan-100 text-cyan-600',
      description: 'Comprehensive eye care services including cataract surgeries.',
      features: ['Vision Testing', 'Cataract Surgery', 'Eye Screenings']
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-[#0B3C5D] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-extrabold mb-6"
          >
            Our Medical Services
          </motion.h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Comprehensive healthcare solutions delivered by experts across multiple specialties.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {departments.map((dept, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all overflow-hidden border border-gray-100"
              >
                <div className="p-8">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${dept.color}`}>
                    <dept.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0B3C5D] mb-4">{dept.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {dept.description}
                  </p>
                  <ul className="space-y-3">
                    {dept.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-500">
                        <ChevronRight className="h-4 w-4 text-[#328CC1] mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
                  <button className="text-[#328CC1] font-bold text-sm hover:underline flex items-center">
                    View Department Details <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Symptom Checker CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-extrabold text-[#0B3C5D] mb-6">Interactive Symptom Checker</h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Our symptom checker is designed to help you understand your health better and guide you 
                to the right medical department. It's quick, easy to use, and provides immediate suggestions.
              </p>
              <div className="bg-[#0B3C5D] p-8 rounded-3xl text-white shadow-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <CheckCircle2 className="h-6 w-6 text-[#328CC1]" />
                  <h3 className="text-xl font-bold">How it works?</h3>
                </div>
                <ol className="space-y-4 text-sm text-blue-100 list-decimal list-inside">
                  <li>Select one or more symptoms you are experiencing.</li>
                  <li>Click on "Check Now" to get a suggestion.</li>
                  <li>Review the recommended department and possible condition.</li>
                  <li>Book an appointment with the suggested specialist directly.</li>
                </ol>
              </div>
            </div>
            <SymptomChecker />
          </div>
        </div>
      </section>
    </div>
  );
}
