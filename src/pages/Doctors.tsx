import React from 'react';
import { motion } from 'motion/react';
import { Search, User, Clock, Stethoscope, Calendar, ChevronRight, Database } from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { Doctor } from '../types';
import { Link } from 'react-router-dom';

export default function Doctors() {
  const [doctors, setDoctors] = React.useState<Doctor[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedDept, setSelectedDept] = React.useState('All');

  const departments = ['All', 'General OPD', 'Emergency', 'ICU', 'Maternity', 'Paediatrics', 'Orthopaedics', 'Ophthalmology'];

  React.useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'doctors'), (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Doctor));
      setDoctors(docs);
      setLoading(false);
    }, () => {
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredDoctors = doctors.filter(doctor => {
    const name = doctor.name || '';
    const specialization = doctor.specialization || '';
    const department = doctor.department || '';
    
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All' || department.trim() === selectedDept.trim();
    
    return matchesSearch && matchesDept;
  });

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
            Our Expert Doctors
          </motion.h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Meet our team of highly qualified and experienced medical professionals.
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <section className="py-12 -mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col lg:flex-row gap-6 items-center">
            <div className="relative flex-grow w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input 
                type="text" 
                placeholder="Search by name or specialization..." 
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#328CC1] focus:border-transparent outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {departments.map(dept => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${
                    selectedDept === dept 
                    ? 'bg-[#328CC1] text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#328CC1] mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading doctors...</p>
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
              <User className="h-16 w-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#0B3C5D] mb-2">No doctors in database</h3>
              <p className="text-gray-500 mb-8">The doctor list is currently empty.</p>
              
              {/* Admin Seed Button */}
              {auth.currentUser?.email === "rutujavpatil2005@gmail.com" ? (
                <button 
                  onClick={async () => {
                    setLoading(true);
                    const { seedDoctors } = await import('../lib/seedData');
                    await seedDoctors();
                    setLoading(false);
                  }}
                  className="bg-[#328CC1] hover:bg-[#2a78a5] text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg flex items-center space-x-2 mx-auto"
                >
                  <Database className="h-5 w-5" />
                  <span>Seed Doctors Now</span>
                </button>
              ) : (
                <Link to="/login" className="text-[#328CC1] font-bold hover:underline">
                  Log in as Admin to seed data
                </Link>
              )}
            </div>
          ) : filteredDoctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDoctors.map((doctor) => (
                <motion.div 
                  key={doctor.id}
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all overflow-hidden border border-gray-100"
                >
                  <div className="p-8">
                    <div className="flex items-center space-x-4 mb-6">
                      {doctor.photoUrl ? (
                        <div className="h-20 w-20 rounded-2xl overflow-hidden shadow-lg border-2 border-white">
                          <img 
                            src={doctor.photoUrl} 
                            alt={doctor.name} 
                            className="h-full w-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ) : (
                        <div className="bg-blue-100 p-4 rounded-2xl text-[#328CC1]">
                          <User className="h-10 w-10" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-bold text-[#0B3C5D]">{doctor.name}</h3>
                        <p className="text-sm font-bold text-[#328CC1] uppercase tracking-widest">{doctor.department}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center text-sm text-gray-600">
                        <Stethoscope className="h-4 w-4 mr-3 text-gray-400" />
                        <span>Specialization: <span className="font-semibold text-gray-800">{doctor.specialization}</span></span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-3 text-gray-400" />
                        <span>Timing: <span className="font-semibold text-gray-800">{doctor.timing}</span></span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <Link 
                        to={`/doctors/${doctor.id}`}
                        className="w-full bg-gray-50 hover:bg-gray-100 text-[#0B3C5D] py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center space-x-2 border border-gray-100"
                      >
                        <User className="h-4 w-4" />
                        <span>View Profile</span>
                      </Link>
                      <Link 
                        to="/appointment" 
                        state={{ doctorId: doctor.id, doctorName: doctor.name, department: doctor.department }}
                        className="w-full bg-[#328CC1] hover:bg-[#2a78a5] text-white py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-900/10"
                      >
                        <Calendar className="h-4 w-4" />
                        <span>Book Appointment</span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
              <Search className="h-16 w-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#0B3C5D] mb-2">No doctors found</h3>
              <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
