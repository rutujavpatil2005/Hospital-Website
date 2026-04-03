import React from 'react';
import { Link } from 'react-router-dom';
import { 
  PhoneCall, 
  Calendar, 
  Search, 
  Stethoscope, 
  HeartPulse, 
  Activity, 
  Info, 
  ChevronRight, 
  Megaphone, 
  Lightbulb,
  Bed,
  Droplets,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Announcement, HealthTip, BedAvailability, BloodAvailability } from '../types';

import SymptomChecker from '../components/SymptomChecker';
import EmergencyGuide from '../components/EmergencyGuide';

export default function Home() {
  const [announcements, setAnnouncements] = React.useState<Announcement[]>([]);
  const [healthTip, setHealthTip] = React.useState<HealthTip | null>(null);
  const [beds, setBeds] = React.useState<BedAvailability[]>([]);
  const [blood, setBlood] = React.useState<BloodAvailability[]>([]);

  React.useEffect(() => {
    // Fetch Announcements
    const annQuery = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'), limit(3));
    const unsubAnn = onSnapshot(annQuery, (snapshot) => {
      if (!snapshot.empty) {
        setAnnouncements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Announcement)));
      }
    }, (err) => {
      console.error("Announcements snapshot error:", err);
    });

    // Fetch Random Health Tip
    const tipQuery = collection(db, 'healthTips');
    const unsubscribeTip = onSnapshot(tipQuery, (snapshot) => {
      if (!snapshot.empty) {
        const randomIndex = Math.floor(Math.random() * snapshot.docs.length);
        setHealthTip({ id: snapshot.docs[randomIndex].id, ...snapshot.docs[randomIndex].data() } as HealthTip);
      }
    }, (err) => {
      console.error("Health tips snapshot error:", err);
    });

    // Fetch Bed Availability
    const bedQuery = collection(db, 'beds');
    const unsubscribeBed = onSnapshot(bedQuery, (snapshot) => {
      if (!snapshot.empty) {
        const bedData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BedAvailability));
        // Deduplicate by bed type
        const uniqueBeds = Array.from(
          bedData.reduce((map, item) => {
            if (!map.has(item.type)) map.set(item.type, item);
            return map;
          }, new Map<string, BedAvailability>()).values()
        );
        // Sort by type for consistent display
        uniqueBeds.sort((a, b) => a.type.localeCompare(b.type));
        setBeds(uniqueBeds);
      }
    }, (err) => {
      console.error("Beds snapshot error:", err);
    });

    // Fetch Blood Availability
    const bloodQuery = collection(db, 'bloodAvailability');
    const unsubscribeBlood = onSnapshot(bloodQuery, (snapshot) => {
      if (!snapshot.empty) {
        const bloodData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BloodAvailability));
        // Deduplicate by group name, keeping the most recently updated (or first found)
        const uniqueBlood = Array.from(
          bloodData.reduce((map, item) => {
            if (!map.has(item.group)) map.set(item.group, item);
            return map;
          }, new Map<string, BloodAvailability>()).values()
        );
        // Sort by group name for consistent display
        uniqueBlood.sort((a, b) => a.group.localeCompare(b.group));
        setBlood(uniqueBlood);
      }
    }, (err) => {
      console.error("Blood snapshot error:", err);
    });

    return () => {
      unsubAnn();
      unsubscribeTip();
      unsubscribeBed();
      unsubscribeBlood();
    };
  }, []);

  return (
    <div className="bg-white">
      {/* Live Hospital Pulse Ticker */}
      <div className="bg-[#0B3C5D] text-white py-2 overflow-hidden whitespace-nowrap border-b border-white/10">
        <div className="flex animate-marquee items-center gap-12">
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
            <Activity className="h-4 w-4 text-green-400" /> Live Hospital Pulse:
          </span>
          {beds.map((bed) => (
            <span key={bed.id} className="text-xs font-medium">
              {bed.type} Beds: <span className={bed.available > 0 ? 'text-green-400' : 'text-red-400'}>{bed.available} Available</span>
            </span>
          ))}
          {blood.filter(b => b.status !== 'Available').map((b) => (
            <span key={b.id} className="text-xs font-medium">
              Blood Group {b.group}: <span className="text-yellow-400">{b.status}</span>
            </span>
          ))}
          {announcements.length > 0 && (
            <span className="text-xs font-medium">
              Latest: <span className="text-[#328CC1]">{announcements[0].title}</span>
            </span>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2053" 
            alt="Hospital Building" 
            className="w-full h-full object-cover brightness-50"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              Excellence in <span className="text-[#328CC1]">Healthcare</span> for Baramati
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              Silver Jubilee Hospital provides compassionate care with advanced medical technology. 
              Your health is our priority.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/appointment" 
                className="bg-[#D9534F] hover:bg-[#c9302c] px-8 py-4 rounded-full text-lg font-bold transition-all transform hover:scale-105 flex items-center space-x-2 shadow-lg"
              >
                <Calendar className="h-5 w-5" />
                <span>Book Appointment</span>
              </Link>
              <Link 
                to="/doctors" 
                className="bg-[#328CC1] hover:bg-[#2a78a5] px-8 py-4 rounded-full text-lg font-bold transition-all transform hover:scale-105 flex items-center space-x-2 shadow-lg"
              >
                <Search className="h-5 w-5" />
                <span>Find Doctor</span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Emergency Floating Button */}
        <div className="absolute bottom-10 right-10 z-20">
          <a 
            href="tel:108" 
            className="bg-[#D9534F] text-white p-6 rounded-full shadow-2xl flex items-center space-x-3 animate-pulse hover:scale-110 transition-transform"
          >
            <PhoneCall className="h-8 w-8" />
            <div className="hidden md:block">
              <p className="text-xs font-bold uppercase">Emergency Call</p>
              <p className="text-xl font-black">108</p>
            </div>
          </a>
        </div>
      </section>

      {/* Quick Stats / Availability Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0B3C5D] mb-2">Live Hospital Status</h2>
            <p className="text-gray-500">Real-time availability of essential hospital resources.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bed Availability */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-50 p-3 rounded-2xl">
                    <Bed className="h-6 w-6 text-[#328CC1]" />
                  </div>
                  <h2 className="text-xl font-bold text-[#0B3C5D]">Bed Availability</h2>
                </div>
                <span className="text-[10px] font-bold text-green-500 bg-green-50 px-3 py-1 rounded-full uppercase tracking-widest">Live</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {beds.length > 0 ? beds.map((bed) => (
                  <div key={bed.id} className="text-center p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-[#328CC1] transition-colors">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">{bed.type}</p>
                    <p className={`text-3xl font-black ${bed.available > 0 ? 'text-[#328CC1]' : 'text-red-400'}`}>{bed.available}</p>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full mt-3 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${bed.available > 5 ? 'bg-green-500' : 'bg-red-500'}`} 
                        style={{ width: `${(bed.available / bed.total) * 100}%` }} 
                      />
                    </div>
                  </div>
                )) : (
                  <p className="col-span-4 text-center text-gray-400 py-4">Loading data...</p>
                )}
              </div>
            </motion.div>

            {/* Blood Availability */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="bg-red-50 p-3 rounded-2xl">
                    <Droplets className="h-6 w-6 text-[#D9534F]" />
                  </div>
                  <h2 className="text-xl font-bold text-[#0B3C5D]">Blood Bank Status</h2>
                </div>
                <span className="text-[10px] font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full uppercase tracking-widest">Real-time</span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                {blood.length > 0 ? blood.map((item) => (
                  <div key={item.id} className="text-center p-3 rounded-2xl border border-gray-100 bg-gray-50 hover:border-[#D9534F] transition-colors">
                    <p className="text-sm font-black text-[#0B3C5D]">{item.group}</p>
                    <div className={`h-2.5 w-2.5 mx-auto rounded-full mt-2 shadow-sm ${
                      item.status === 'Available' ? 'bg-green-500' : 
                      item.status === 'Low' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                  </div>
                )) : (
                  <p className="col-span-8 text-center text-gray-400 py-4">Loading data...</p>
                )}
              </div>
              <p className="mt-6 text-xs text-gray-400 text-center italic">
                * Contact blood bank for emergency requests: 02112-222222
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Announcements & Health Tips */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Announcements */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-8">
                <Megaphone className="h-6 w-6 text-[#328CC1]" />
                <h2 className="text-3xl font-bold text-[#0B3C5D]">Latest Announcements</h2>
              </div>
              <div className="space-y-6">
                {announcements.length > 0 ? announcements.map((ann) => (
                  <motion.div 
                    key={ann.id}
                    whileHover={{ x: 10 }}
                    className="p-6 bg-white border-l-4 border-[#328CC1] shadow-sm rounded-r-xl"
                  >
                    <p className="text-xs font-bold text-[#328CC1] mb-2">
                      {new Date(ann.createdAt).toLocaleDateString()}
                    </p>
                    <h3 className="text-xl font-bold text-[#0B3C5D] mb-2">{ann.title}</h3>
                    <p className="text-gray-600 line-clamp-2">{ann.content}</p>
                  </motion.div>
                )) : (
                  <div className="p-12 text-center bg-gray-50 rounded-xl">
                    <p className="text-gray-400">No recent announcements.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Daily Health Tip */}
            <div className="bg-[#0B3C5D] text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Lightbulb className="h-24 w-24" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center space-x-2 mb-6">
                  <Lightbulb className="h-6 w-6 text-[#328CC1]" />
                  <h2 className="text-xl font-bold">Daily Health Tip</h2>
                </div>
                {healthTip ? (
                  <>
                    <p className="text-2xl font-medium leading-relaxed mb-8 italic">
                      "{healthTip.tip}"
                    </p>
                    <div className="bg-white/10 px-4 py-2 rounded-full inline-block text-xs font-bold uppercase tracking-widest">
                      {healthTip.category || 'General Health'}
                    </div>
                  </>
                ) : (
                  <p className="text-gray-300">Loading your daily tip...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <EmergencyGuide />
            <SymptomChecker />
          </div>

          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-[#0B3C5D] mb-4">Our Specialized Departments</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide a wide range of medical services with specialized departments to cater to every patient's needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Emergency', icon: HeartPulse, color: 'text-red-500', desc: '24/7 trauma and critical care services.' },
              { title: 'OPD', icon: Stethoscope, color: 'text-blue-500', desc: 'General consultation and specialized clinics.' },
              { title: 'ICU', icon: Activity, color: 'text-orange-500', desc: 'Advanced monitoring and life support.' },
              { title: 'Maternity', icon: Info, color: 'text-pink-500', desc: 'Comprehensive care for mother and child.' },
            ].map((service, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100"
              >
                <service.icon className={`h-12 w-12 ${service.color} mb-6`} />
                <h3 className="text-xl font-bold text-[#0B3C5D] mb-3">{service.title}</h3>
                <p className="text-gray-500 text-sm mb-6">{service.desc}</p>
                <Link to="/services" className="text-[#328CC1] font-bold flex items-center text-sm hover:underline">
                  Learn More <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-[#328CC1] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold mb-8">Need Immediate Medical Assistance?</h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto text-blue-50">
            Our team of expert doctors and medical staff are ready to help you 24/7. 
            Book your appointment online or visit us directly.
          </p>
          <div className="flex justify-center space-x-6">
            <Link to="/appointment" className="bg-white text-[#328CC1] px-10 py-4 rounded-full text-lg font-bold hover:bg-blue-50 transition-colors">
              Book Now
            </Link>
            <Link to="/contact" className="border-2 border-white px-10 py-4 rounded-full text-lg font-bold hover:bg-white/10 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
