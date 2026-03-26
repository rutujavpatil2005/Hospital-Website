import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Doctor } from '../types';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, Award, ArrowLeft, User } from 'lucide-react';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function DoctorProfile() {
  const { doctorId } = useParams();
  const [doctor, setDoctor] = React.useState<Doctor | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchDoctor() {
      if (!doctorId) return;
      try {
        const docRef = doc(db, 'doctors', doctorId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDoctor({ id: docSnap.id, ...docSnap.data() } as Doctor);
        }
      } catch (error) {
        // Silent fail
      } finally {
        setLoading(false);
      }
    }
    fetchDoctor();
  }, [doctorId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0B3C5D]"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-[#0B3C5D] mb-4">Doctor Not Found</h2>
        <Link to="/doctors" className="text-[#328CC1] flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Doctors
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Hero Header */}
      <div className="bg-[#0B3C5D] text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Link to="/doctors" className="inline-flex items-center gap-2 text-[#328CC1] hover:text-white mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Doctors
          </Link>
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="w-48 h-48 rounded-2xl overflow-hidden bg-white/10 flex items-center justify-center border-4 border-white/20 shadow-xl">
              {doctor.photoUrl ? (
                <img src={doctor.photoUrl} alt={doctor.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <User className="h-24 w-24 text-white/40" />
              )}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold mb-2">{doctor.name}</h1>
              <p className="text-xl text-[#328CC1] font-semibold mb-4">{doctor.specialization}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm opacity-90">
                <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                  <MapPin className="h-4 w-4" /> {doctor.department}
                </span>
                <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                  <Award className="h-4 w-4" /> Senior Consultant
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Bio & Info */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-[#0B3C5D] mb-4">About Doctor</h2>
              <p className="text-gray-600 leading-relaxed">
                {doctor.bio || `${doctor.name} is a highly experienced specialist in the ${doctor.department} department at Silver Jubilee Hospital. With a focus on patient-centered care, they bring years of expertise to provide the best possible medical outcomes.`}
              </p>
            </motion.div>

            {/* Visual Weekly Schedule */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#0B3C5D]">Working Hours</h2>
                <Clock className="h-6 w-6 text-[#328CC1]" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {DAYS_OF_WEEK.map((day) => {
                  const hours = doctor.schedule?.[day];
                  const isAvailable = hours && hours.toLowerCase() !== 'off' && hours.toLowerCase() !== 'not available';
                  
                  return (
                    <div 
                      key={day} 
                      className={`p-4 rounded-2xl border transition-all ${
                        isAvailable 
                          ? 'bg-blue-50 border-blue-100' 
                          : 'bg-gray-50 border-gray-100 opacity-60'
                      }`}
                    >
                      <p className="text-xs font-bold text-[#328CC1] uppercase mb-2">{day.substring(0, 3)}</p>
                      <p className={`text-sm font-semibold ${isAvailable ? 'text-[#0B3C5D]' : 'text-gray-400'}`}>
                        {isAvailable ? hours : 'Off'}
                      </p>
                    </div>
                  );
                })}
              </div>
              
              <p className="mt-6 text-sm text-gray-500 italic">
                * Schedule is subject to change. Please confirm via appointment booking.
              </p>
            </motion.div>
          </div>

          {/* Right Column: Quick Actions */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-24"
            >
              <h3 className="text-xl font-bold text-[#0B3C5D] mb-6">Book Appointment</h3>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="h-5 w-5 text-[#328CC1]" />
                  <span>Next Available: Tomorrow</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Clock className="h-5 w-5 text-[#328CC1]" />
                  <span>{doctor.timing}</span>
                </div>
              </div>
              <Link 
                to={`/appointment?doctor=${doctor.id}`}
                className="block w-full bg-[#0B3C5D] text-white text-center py-4 rounded-2xl font-bold hover:bg-[#328CC1] transition-colors shadow-lg shadow-blue-900/20"
              >
                Book Now
              </Link>
              <p className="text-center text-xs text-gray-400 mt-4">
                No payment required for booking
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
