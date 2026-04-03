import React from 'react';
import { motion } from 'motion/react';
import { User, Calendar, Clock, MapPin, Phone, LogOut, ChevronRight, ClipboardList, AlertCircle } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { collection, query, where, onSnapshot, orderBy, doc, getDoc, updateDoc } from 'firebase/firestore';
import { UserProfile, Appointment } from '../types';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      navigate('/login');
      return;
    }

    // Fetch User Profile
    const fetchUser = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data() as UserProfile);
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };
    fetchUser();

    // Fetch Appointments
    const q = query(
      collection(db, 'appointments'), 
      where('patientUid', '==', firebaseUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAppointments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment)));
      setLoading(false);
    }, (err) => {
      console.error("Dashboard snapshot error:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleCancel = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await updateDoc(doc(db, 'appointments', id), { status: 'cancelled' });
    } catch (err) {
      console.error("Failed to cancel appointment:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#328CC1]"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar / Profile */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100 sticky top-24">
              <div className="text-center mb-8">
                <div className="bg-blue-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 text-[#328CC1]">
                  <User className="h-12 w-12" />
                </div>
                <h2 className="text-xl font-bold text-[#0B3C5D]">{user?.displayName}</h2>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <div className="mt-4 inline-block bg-blue-50 text-[#328CC1] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  {user?.role}
                </div>
              </div>

              <div className="space-y-4 pt-8 border-t border-gray-100">
                <button 
                  onClick={() => navigate('/appointment')}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-[#328CC1]" />
                    <span className="text-sm font-bold text-gray-700">New Appointment</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => navigate('/contact')}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-[#328CC1]" />
                    <span className="text-sm font-bold text-gray-700">Support</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-8 flex items-center justify-between">
              <h1 className="text-3xl font-bold text-[#0B3C5D]">My Appointments</h1>
              <div className="text-sm text-gray-500 font-medium">
                Showing {appointments.length} appointments
              </div>
            </div>

            {appointments.length > 0 ? (
              <div className="space-y-6">
                {appointments.map((app) => (
                  <motion.div 
                    key={app.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    <div className="p-8">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-start space-x-4">
                          <div className={`p-4 rounded-2xl ${
                            app.status === 'confirmed' ? 'bg-green-100 text-green-600' : 
                            app.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                          }`}>
                            <ClipboardList className="h-8 w-8" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-3 mb-1">
                              <h3 className="text-xl font-bold text-[#0B3C5D]">{app.doctorName}</h3>
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                app.status === 'confirmed' ? 'bg-green-100 text-green-600' : 
                                app.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                              }`}>
                                {app.status}
                              </span>
                            </div>
                            <p className="text-sm font-bold text-[#328CC1] mb-4 uppercase tracking-widest">{app.department}</p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="flex items-center text-sm text-gray-500">
                                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                <span>{new Date(app.date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                                <span>Token: <span className="font-bold text-[#0B3C5D]">{app.tokenNumber}</span></span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          {app.status === 'pending' && (
                            <button 
                              onClick={() => handleCancel(app.id)}
                              className="px-6 py-3 rounded-xl border border-red-200 text-red-600 font-bold text-sm hover:bg-red-50 transition-colors"
                            >
                              Cancel Appointment
                            </button>
                          )}
                          <button className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200 transition-colors">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-sm p-20 text-center border border-gray-100">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                  <Calendar className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold text-[#0B3C5D] mb-2">No appointments yet</h3>
                <p className="text-gray-500 mb-8">You haven't booked any appointments yet. Start by finding a doctor or booking directly.</p>
                <button 
                  onClick={() => navigate('/appointment')}
                  className="bg-[#328CC1] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#2a78a5] transition-all shadow-lg"
                >
                  Book Your First Appointment
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
