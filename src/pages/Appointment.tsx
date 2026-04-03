import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, User, Phone, ClipboardList, Stethoscope, CheckCircle2, AlertCircle, Megaphone } from 'lucide-react';
import { auth, db, handleFirestoreError } from '../lib/firebase';
import { collection, addDoc, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { Doctor, Appointment as AppointmentType, OperationType } from '../types';

export default function Appointment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [doctors, setDoctors] = React.useState<Doctor[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState<{ token: number, emailSent?: boolean, emailError?: string } | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [sendingEmail, setSendingEmail] = React.useState(false);

  const [formData, setFormData] = React.useState({
    patientName: '',
    email: '',
    mobileNumber: '',
    department: location.state?.department || '',
    doctorId: location.state?.doctorId || '',
    date: new Date().toISOString().split('T')[0]
  });

  const departments = ['General OPD', 'Emergency', 'ICU', 'Maternity', 'Paediatrics', 'Orthopaedics', 'Ophthalmology'];

  React.useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'doctors'));
        setDoctors(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Doctor)));
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
        setError("Failed to load doctor list. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(d => !formData.department || d.department === formData.department);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#328CC1]"></div>
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
          <AlertCircle className="h-12 w-12 text-[#D9534F] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#0B3C5D] mb-2">No Doctors Available</h2>
          <p className="text-gray-500 mb-6">We are currently updating our doctor list. Please try again later or contact support.</p>
          <button onClick={() => navigate('/')} className="w-full bg-[#0B3C5D] text-white py-3 rounded-xl font-bold">Go Back</button>
        </div>
      </div>
    );
  }

  const sendEmail = async (token: number) => {
    if (!formData.email) return;
    
    setSendingEmail(true);
    try {
      const selectedDoctor = doctors.find(d => d.id === formData.doctorId);
      const res = await fetch('/api/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          patientName: formData.patientName,
          doctorName: selectedDoctor?.name || 'Unknown',
          department: formData.department,
          date: formData.date,
          tokenNumber: token
        })
      });
      
      if (res.ok) {
        setSuccess(prev => prev ? { ...prev, emailSent: true, emailError: undefined } : null);
      } else {
        const data = await res.json();
        setSuccess(prev => prev ? { ...prev, emailSent: false, emailError: data.error || 'Failed to send email' } : null);
      }
    } catch (err) {
      setSuccess(prev => prev ? { ...prev, emailSent: false, emailError: 'Network error' } : null);
    } finally {
      setSendingEmail(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const tokenNumber = Math.floor(Math.random() * 100) + 1;
      const selectedDoctor = doctors.find(d => d.id === formData.doctorId);

      const appointmentData: Omit<AppointmentType, 'id'> = {
        patientUid: auth.currentUser?.uid || null,
        patientName: formData.patientName,
        mobileNumber: formData.mobileNumber,
        department: formData.department,
        doctorId: formData.doctorId,
        doctorName: selectedDoctor?.name || 'Unknown',
        email: formData.email,
        date: formData.date,
        tokenNumber: tokenNumber,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'appointments'), appointmentData);
      
      setSuccess({ token: tokenNumber, emailSent: false });
      window.scrollTo(0, 0);
      
      // Automatically trigger email sending
      if (formData.email) {
        sendEmail(tokenNumber);
      }
    } catch (err: any) {
      setError(`Failed to book appointment: ${err.message || 'Please check your details and try again.'}`);
      setSubmitting(false);
      try {
        handleFirestoreError(err, OperationType.CREATE, 'appointments');
      } catch (e) {}
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-12 rounded-3xl shadow-2xl max-w-md w-full text-center">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 text-green-600">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <h2 className="text-3xl font-bold text-[#0B3C5D] mb-4">Appointment Booked!</h2>
          
          <div className="text-gray-500 mb-8">
            <p className="mb-4">Your appointment has been successfully scheduled.</p>
            
            {formData.email && (
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-4">
                {sendingEmail ? (
                  <div className="flex items-center justify-center gap-2 text-sm text-[#328CC1]">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#328CC1]"></div>
                    <span>Sending automatic confirmation...</span>
                  </div>
                ) : success.emailSent ? (
                  <div className="flex items-center justify-center gap-2 text-sm text-green-600 font-medium">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Confirmation email sent!</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-red-400 text-xs italic">
                      {`Email failed: ${success.emailError}`}
                    </p>
                    <button 
                      onClick={() => sendEmail(success.token)}
                      className="text-[#328CC1] text-xs font-bold underline hover:text-[#0B3C5D]"
                    >
                      Try Resending
                    </button>
                  </div>
                )}
              </div>
            )}
            
            <p className="text-sm">Please show this token at the reception.</p>
          </div>
          
          <div className="bg-gray-50 p-8 rounded-2xl border-2 border-dashed border-gray-200 mb-8">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Your Token Number</p>
            <p className="text-6xl font-black text-[#328CC1]">{success.token}</p>
          </div>

          <button 
            onClick={() => navigate(auth.currentUser ? '/dashboard' : '/')}
            className="w-full bg-[#0B3C5D] text-white py-4 rounded-2xl font-bold hover:bg-[#082d46] transition-colors"
          >
            {auth.currentUser ? 'Go to Dashboard' : 'Go to Home'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-[#0B3C5D] mb-4">Book an Appointment</h1>
          <p className="text-gray-600">Fill in the details below to schedule your visit with our specialists.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
          {/* Info Side */}
          <div className="bg-[#0B3C5D] text-white p-12 md:w-1/3">
            <h3 className="text-xl font-bold mb-8">Important Notes</h3>
            <ul className="space-y-6 text-sm text-blue-100">
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="h-5 w-5 text-[#328CC1] flex-shrink-0" />
                <span>Please arrive 15 minutes before your scheduled time.</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="h-5 w-5 text-[#328CC1] flex-shrink-0" />
                <span>Bring your valid ID proof and previous medical reports.</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="h-5 w-5 text-[#328CC1] flex-shrink-0" />
                <span>Token numbers are generated based on booking sequence.</span>
              </li>
            </ul>
          </div>

          {/* Form Side */}
          <div className="p-12 flex-grow">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center space-x-3 text-sm font-medium">
                  <AlertCircle className="h-5 w-5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center space-x-2">
                    <User className="h-4 w-4 text-[#328CC1]" />
                    <span>Patient Full Name</span>
                  </label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#328CC1] outline-none"
                    placeholder="Enter patient name"
                    value={formData.patientName}
                    onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-[#328CC1]" />
                    <span>Mobile Number</span>
                  </label>
                  <input 
                    required
                    type="tel" 
                    minLength={10}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#328CC1] outline-none"
                    placeholder="Enter mobile number"
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center space-x-2">
                    <ClipboardList className="h-4 w-4 text-[#328CC1]" />
                    <span>Email Address (Optional)</span>
                  </label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#328CC1] outline-none"
                    placeholder="For confirmation email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center space-x-2">
                    <ClipboardList className="h-4 w-4 text-[#328CC1]" />
                    <span>Department</span>
                  </label>
                  <select 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#328CC1] outline-none bg-white"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value, doctorId: ''})}
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center space-x-2">
                    <Stethoscope className="h-4 w-4 text-[#328CC1]" />
                    <span>Doctor</span>
                  </label>
                  <select 
                    required
                    disabled={!formData.department}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#328CC1] outline-none bg-white disabled:bg-gray-50"
                    value={formData.doctorId}
                    onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
                  >
                    <option value="">Select Doctor</option>
                    {filteredDoctors.map(doc => (
                      <option key={doc.id} value={doc.id}>{doc.name} ({doc.specialization})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-[#328CC1]" />
                  <span>Appointment Date</span>
                </label>
                <input 
                  required
                  type="date" 
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#328CC1] outline-none"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className="w-full bg-[#D9534F] hover:bg-[#c9302c] text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Calendar className="h-5 w-5" />
                    <span>Confirm Appointment</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
