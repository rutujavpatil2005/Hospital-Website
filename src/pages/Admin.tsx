import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Calendar, 
  Megaphone, 
  Lightbulb, 
  Bed, 
  Droplets, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  XCircle,
  ShieldCheck,
  MessageSquare,
  Search,
  Filter,
  CalendarClock,
  UserCircle
} from 'lucide-react';
import { db, handleFirestoreError } from '../lib/firebase';
import { seedDoctors } from '../lib/seedData';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc, 
  query, 
  orderBy, 
  getDocs,
  setDoc,
  where
} from 'firebase/firestore';
import { 
  Doctor, 
  Appointment, 
  Announcement, 
  HealthTip, 
  BedAvailability, 
  BloodAvailability, 
  ContactMessage,
  OperationType,
  UserProfile
} from '../types';

export default function Admin() {
  const [activeTab, setActiveTab] = React.useState('appointments');
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [doctors, setDoctors] = React.useState<Doctor[]>([]);
  const [patients, setPatients] = React.useState<UserProfile[]>([]);
  const [announcements, setAnnouncements] = React.useState<Announcement[]>([]);
  const [healthTips, setHealthTips] = React.useState<HealthTip[]>([]);
  const [beds, setBeds] = React.useState<BedAvailability[]>([]);
  const [blood, setBlood] = React.useState<BloodAvailability[]>([]);
  const [messages, setMessages] = React.useState<ContactMessage[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [deptFilter, setDeptFilter] = React.useState('all');
  const [reschedulingId, setReschedulingId] = React.useState<string | null>(null);
  const [newDate, setNewDate] = React.useState('');

  const [newDoctor, setNewDoctor] = React.useState({ 
    name: '', 
    department: '', 
    timing: '', 
    specialization: '',
    bio: ''
  });
  const [newAnnouncement, setNewAnnouncement] = React.useState({ title: '', content: '' });
  const [newTip, setNewTip] = React.useState({ tip: '', category: '' });

  React.useEffect(() => {
    const handleError = (err: any, path: string) => {
      console.error(`Admin snapshot error (${path}):`, err);
      try {
        handleFirestoreError(err, OperationType.GET, path);
      } catch (e) {}
    };

    const unsubApp = onSnapshot(query(collection(db, 'appointments'), orderBy('createdAt', 'desc')), (s) => setAppointments(s.docs.map(d => ({ id: d.id, ...d.data() } as Appointment))), (err) => handleError(err, 'appointments'));
    const unsubDoc = onSnapshot(collection(db, 'doctors'), (s) => setDoctors(s.docs.map(d => ({ id: d.id, ...d.data() } as Doctor))), (err) => handleError(err, 'doctors'));
    const unsubAnn = onSnapshot(query(collection(db, 'announcements'), orderBy('createdAt', 'desc')), (s) => {
      if (!s.empty) setAnnouncements(s.docs.map(d => ({ id: d.id, ...d.data() } as Announcement)));
    }, (err) => handleError(err, 'announcements'));
    const unsubTip = onSnapshot(collection(db, 'healthTips'), (s) => {
      if (!s.empty) setHealthTips(s.docs.map(d => ({ id: d.id, ...d.data() } as HealthTip)));
    }, (err) => handleError(err, 'healthTips'));
    const unsubBed = onSnapshot(collection(db, 'beds'), (s) => {
      if (!s.empty) {
        const bedData = s.docs.map(d => ({ id: d.id, ...d.data() } as BedAvailability));
        // Sort by type
        bedData.sort((a, b) => a.type.localeCompare(b.type));
        setBeds(bedData);
      }
    }, (err) => handleError(err, 'beds'));
    const unsubBlood = onSnapshot(collection(db, 'bloodAvailability'), (s) => {
      if (!s.empty) {
        const bloodData = s.docs.map(d => ({ id: d.id, ...d.data() } as BloodAvailability));
        // Sort by group name
        bloodData.sort((a, b) => a.group.localeCompare(b.group));
        setBlood(bloodData);
      }
    }, (err) => handleError(err, 'bloodAvailability'));
    const unsubMsg = onSnapshot(query(collection(db, 'contactMessages'), orderBy('createdAt', 'desc')), (s) => setMessages(s.docs.map(d => ({ id: d.id, ...d.data() } as ContactMessage))), (err) => handleError(err, 'contactMessages'));
    const unsubPatients = onSnapshot(query(collection(db, 'users'), where('role', '==', 'patient')), (s) => setPatients(s.docs.map(d => ({ uid: d.id, ...d.data() } as UserProfile))), (err) => handleError(err, 'users'));

    return () => {
      unsubApp(); unsubDoc(); unsubAnn(); unsubTip(); unsubBed(); unsubBlood(); unsubMsg(); unsubPatients();
    };
  }, []);

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const schedule: Record<string, string> = {};
      ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].forEach(day => {
        schedule[day] = newDoctor.timing;
      });
      await addDoc(collection(db, 'doctors'), { ...newDoctor, schedule });
      setNewDoctor({ name: '', department: '', timing: '', specialization: '', bio: '' });
    } catch (err) { handleFirestoreError(err, OperationType.CREATE, 'doctors'); }
  };

  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'announcements'), { ...newAnnouncement, createdAt: new Date().toISOString() });
      setNewAnnouncement({ title: '', content: '' });
    } catch (err) { handleFirestoreError(err, OperationType.CREATE, 'announcements'); }
  };

  const handleAddTip = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'healthTips'), newTip);
      setNewTip({ tip: '', category: '' });
    } catch (err) { handleFirestoreError(err, OperationType.CREATE, 'healthTips'); }
  };

  const handleUpdateBed = async (id: string, available: number) => {
    try {
      await updateDoc(doc(db, 'beds', id), { available });
    } catch (err) { handleFirestoreError(err, OperationType.UPDATE, 'beds'); }
  };

  const handleUpdateBlood = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'bloodAvailability', id), { status });
    } catch (err) { handleFirestoreError(err, OperationType.UPDATE, 'bloodAvailability'); }
  };

  const handleUpdateAppointment = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'appointments', id), { status });
      
      // If confirmed, send email
      if (status === 'confirmed') {
        const app = appointments.find(a => a.id === id);
        if (app && app.email) {
          try {
            await fetch('/api/send-confirmation', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: app.email,
                patientName: app.patientName,
                doctorName: app.doctorName,
                department: app.department,
                date: app.date,
                tokenNumber: app.tokenNumber
              })
            });
          } catch (emailErr) {
            console.error("Failed to send confirmation email:", emailErr);
          }
        }
      }
    } catch (err) { handleFirestoreError(err, OperationType.UPDATE, 'appointments'); }
  };

  const handleReschedule = async (id: string) => {
    if (!newDate) return;
    try {
      await updateDoc(doc(db, 'appointments', id), { date: newDate });
      setReschedulingId(null);
      setNewDate('');
    } catch (err) { handleFirestoreError(err, OperationType.UPDATE, 'appointments'); }
  };

  const filteredAppointments = appointments.filter(app => {
    const matchesSearch = (app.patientName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                          (app.doctorName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                          (app.tokenNumber?.toString() || '').includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesDept = deptFilter === 'all' || app.department === deptFilter;
    return matchesSearch && matchesStatus && matchesDept;
  });

  const departments = Array.from(new Set(doctors.map(d => d.department)));

  const [testingEmail, setTestingEmail] = React.useState(false);
  const [testEmailResult, setTestEmailResult] = React.useState<{ success: boolean, message: string } | null>(null);

  const handleTestEmail = async () => {
    setTestingEmail(true);
    setTestEmailResult(null);
    try {
      const res = await fetch('/api/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com', // This will fail if SMTP is not configured, but we want to see the error
          patientName: 'Admin Test',
          doctorName: 'System Check',
          department: 'Diagnostics',
          date: new Date().toISOString(),
          tokenNumber: 0
        })
      });
      const data = await res.json();
      if (res.ok) {
        setTestEmailResult({ success: true, message: "SMTP connection verified! (Test email sent to test@example.com)" });
      } else {
        setTestEmailResult({ success: false, message: data.error || "Failed to connect to SMTP server." });
      }
    } catch (err: any) {
      setTestEmailResult({ success: false, message: "Network error: " + err.message });
    } finally {
      setTestingEmail(false);
    }
  };

  const tabs = [
    { id: 'appointments', name: 'Appointments', icon: Calendar },
    { id: 'patients', name: 'Patients', icon: UserCircle },
    { id: 'doctors', name: 'Doctors', icon: Users },
    { id: 'announcements', name: 'Announcements', icon: Megaphone },
    { id: 'healthTips', name: 'Health Tips', icon: Lightbulb },
    { id: 'beds', name: 'Beds', icon: Bed },
    { id: 'blood', name: 'Blood Bank', icon: Droplets },
    { id: 'messages', name: 'Messages', icon: MessageSquare },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div className="flex items-center space-x-4">
            <div className="bg-[#0B3C5D] p-4 rounded-2xl text-white shadow-lg">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#0B3C5D]">Admin Control Panel</h1>
              <p className="text-gray-500">Manage hospital operations and data in real-time.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={handleTestEmail}
              disabled={testingEmail}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${
                testEmailResult?.success ? 'bg-green-500 hover:bg-green-600' : 
                testEmailResult?.success === false ? 'bg-red-500 hover:bg-red-600' : 'bg-[#0B3C5D] hover:bg-[#082d46]'
              } text-white`}
            >
              <Megaphone className={`h-5 w-5 ${testingEmail ? 'animate-bounce' : ''}`} />
              <span>{testingEmail ? 'Testing...' : 'Test Email Service'}</span>
            </button>
          </div>
        </div>

        {testEmailResult && (
          <div className={`mb-8 p-4 rounded-2xl flex items-center space-x-3 border ${
            testEmailResult.success ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            {testEmailResult.success ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
            <p className="text-sm font-medium">{testEmailResult.message}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-sm p-4 border border-gray-100 sticky top-24">
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 p-4 rounded-2xl font-bold text-sm transition-all ${
                      activeTab === tab.id 
                      ? 'bg-[#0B3C5D] text-white shadow-lg' 
                      : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[600px]">
              <div className="p-8">
                {/* Appointments Tab */}
                {activeTab === 'appointments' && (
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                      <h2 className="text-2xl font-bold text-[#0B3C5D]">Patient Appointments</h2>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input 
                            type="text" 
                            placeholder="Search patient, doctor, token..."
                            className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#328CC1] w-full md:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl border border-gray-200">
                          <Filter className="h-4 w-4 text-gray-400 ml-2" />
                          <select 
                            className="bg-transparent text-xs font-bold outline-none pr-2"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                          >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <select 
                            className="bg-transparent text-xs font-bold outline-none pr-2 border-l border-gray-200 pl-2"
                            value={deptFilter}
                            onChange={(e) => setDeptFilter(e.target.value)}
                          >
                            <option value="all">All Depts</option>
                            {departments.map(dept => (
                              <option key={dept} value={dept}>{dept}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                            <th className="pb-4">Patient</th>
                            <th className="pb-4">Doctor</th>
                            <th className="pb-4">Date</th>
                            <th className="pb-4">Token</th>
                            <th className="pb-4">Status</th>
                            <th className="pb-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {filteredAppointments.map((app) => (
                            <tr key={app.id} className="text-sm">
                              <td className="py-4">
                                <p className="font-bold text-[#0B3C5D]">{app.patientName}</p>
                                <p className="text-xs text-gray-400">{app.mobileNumber}</p>
                                {app.email && <p className="text-[10px] text-[#328CC1]">{app.email}</p>}
                              </td>
                              <td className="py-4">
                                <p className="font-semibold">{app.doctorName}</p>
                                <p className="text-xs text-gray-400">{app.department}</p>
                              </td>
                              <td className="py-4">
                                {reschedulingId === app.id ? (
                                  <div className="flex items-center gap-2">
                                    <input 
                                      type="date" 
                                      className="p-1 text-xs border border-gray-200 rounded"
                                      value={newDate}
                                      onChange={(e) => setNewDate(e.target.value)}
                                    />
                                    <button 
                                      onClick={() => handleReschedule(app.id)}
                                      className="p-1 bg-green-500 text-white rounded text-[10px]"
                                    >
                                      Save
                                    </button>
                                    <button 
                                      onClick={() => setReschedulingId(null)}
                                      className="p-1 bg-gray-200 text-gray-600 rounded text-[10px]"
                                    >
                                      X
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-500">{new Date(app.date).toLocaleDateString()}</span>
                                    <button 
                                      onClick={() => {
                                        setReschedulingId(app.id);
                                        setNewDate(app.date);
                                      }}
                                      className="p-1 text-gray-400 hover:text-[#328CC1]"
                                      title="Reschedule"
                                    >
                                      <CalendarClock className="h-3 w-3" />
                                    </button>
                                  </div>
                                )}
                              </td>
                              <td className="py-4 font-black text-[#328CC1]">{app.tokenNumber}</td>
                              <td className="py-4">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                  app.status === 'confirmed' ? 'bg-green-100 text-green-600' : 
                                  app.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                                }`}>
                                  {app.status}
                                </span>
                              </td>
                              <td className="py-4">
                                <div className="flex space-x-2">
                                  {app.status === 'pending' && (
                                    <button 
                                      onClick={() => handleUpdateAppointment(app.id, 'confirmed')} 
                                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                      title="Confirm"
                                    >
                                      <CheckCircle2 className="h-4 w-4" />
                                    </button>
                                  )}
                                  {app.status !== 'cancelled' && (
                                    <button 
                                      onClick={() => handleUpdateAppointment(app.id, 'cancelled')} 
                                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                      title="Cancel"
                                    >
                                      <XCircle className="h-4 w-4" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                          {filteredAppointments.length === 0 && (
                            <tr>
                              <td colSpan={6} className="py-12 text-center text-gray-400 italic">
                                No appointments found matching your filters.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Patients Tab */}
                {activeTab === 'patients' && (
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                      <h2 className="text-2xl font-bold text-[#0B3C5D]">Registered Patients</h2>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input 
                          type="text" 
                          placeholder="Search patient name or email..."
                          className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#328CC1] w-full md:w-64"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {patients.filter(p => 
                        p.displayName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        p.email.toLowerCase().includes(searchTerm.toLowerCase())
                      ).map(patient => (
                        <div key={patient.uid} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-center space-x-4">
                          <div className="bg-white p-3 rounded-xl shadow-sm">
                            <UserCircle className="h-8 w-8 text-[#328CC1]" />
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-bold text-[#0B3C5D]">{patient.displayName}</h4>
                            <p className="text-xs text-gray-500">{patient.email}</p>
                            <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest">Joined: {new Date(patient.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-[#328CC1]">
                              {appointments.filter(a => a.patientUid === patient.uid).length} Appointments
                            </p>
                          </div>
                        </div>
                      ))}
                      {patients.length === 0 && (
                        <div className="col-span-2 py-12 text-center text-gray-400 italic">
                          No patients registered yet.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Doctors Tab */}
                {activeTab === 'doctors' && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-[#0B3C5D]">Manage Doctors</h2>
                    </div>
                    
                    <form onSubmit={handleAddDoctor} className="bg-gray-50 p-6 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input required placeholder="Doctor Name" className="p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#328CC1]" value={newDoctor.name} onChange={e => setNewDoctor({...newDoctor, name: e.target.value})} />
                      <input required placeholder="Department" className="p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#328CC1]" value={newDoctor.department} onChange={e => setNewDoctor({...newDoctor, department: e.target.value})} />
                      <input required placeholder="Timing (e.g. 9AM-1PM)" className="p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#328CC1]" value={newDoctor.timing} onChange={e => setNewDoctor({...newDoctor, timing: e.target.value})} />
                      <input required placeholder="Specialization" className="p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#328CC1]" value={newDoctor.specialization} onChange={e => setNewDoctor({...newDoctor, specialization: e.target.value})} />
                      <textarea placeholder="Doctor Bio" className="p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#328CC1] md:col-span-2" rows={3} value={newDoctor.bio} onChange={e => setNewDoctor({...newDoctor, bio: e.target.value})} />
                      <button type="submit" className="md:col-span-2 bg-[#0B3C5D] text-white py-3 rounded-xl font-bold hover:bg-[#082d46] transition-all flex items-center justify-center space-x-2">
                        <Plus className="h-5 w-5" />
                        <span>Add New Doctor</span>
                      </button>
                    </form>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {doctors.map(doctorItem => (
                        <div key={doctorItem.id} className="p-4 border border-gray-100 rounded-2xl flex items-center justify-between">
                          <div>
                            <p className="font-bold text-[#0B3C5D]">{doctorItem.name}</p>
                            <p className="text-xs text-[#328CC1] font-bold uppercase">{doctorItem.department}</p>
                          </div>
                          <button onClick={() => deleteDoc(doc(db, 'doctors', doctorItem.id))} className="p-2 text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Announcements Tab */}
                {activeTab === 'announcements' && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-[#0B3C5D]">Hospital Announcements</h2>
                    <form onSubmit={handleAddAnnouncement} className="space-y-4 bg-gray-50 p-6 rounded-2xl">
                      <input required placeholder="Announcement Title" className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#328CC1]" value={newAnnouncement.title} onChange={e => setNewAnnouncement({...newAnnouncement, title: e.target.value})} />
                      <textarea required placeholder="Announcement Content" rows={4} className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#328CC1] resize-none" value={newAnnouncement.content} onChange={e => setNewAnnouncement({...newAnnouncement, content: e.target.value})} />
                      <button type="submit" className="w-full bg-[#0B3C5D] text-white py-3 rounded-xl font-bold hover:bg-[#082d46] transition-all flex items-center justify-center space-x-2">
                        <Plus className="h-5 w-5" />
                        <span>Post Announcement</span>
                      </button>
                    </form>

                    <div className="space-y-4">
                      {announcements.map(ann => (
                        <div key={ann.id} className="p-6 border border-gray-100 rounded-2xl">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-[#0B3C5D]">{ann.title}</h4>
                            <button onClick={() => deleteDoc(doc(db, 'announcements', ann.id))} className="text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                          </div>
                          <p className="text-sm text-gray-500">{ann.content}</p>
                          <p className="text-[10px] text-gray-400 mt-4 font-bold uppercase">{new Date(ann.createdAt).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Health Tips Tab */}
                {activeTab === 'healthTips' && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-[#0B3C5D]">Daily Health Tips</h2>
                    <form onSubmit={handleAddTip} className="space-y-4 bg-gray-50 p-6 rounded-2xl">
                      <input required placeholder="Category (e.g. Hygiene, Exercise)" className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#328CC1]" value={newTip.category} onChange={e => setNewTip({...newTip, category: e.target.value})} />
                      <textarea required placeholder="Health Tip" rows={3} className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#328CC1] resize-none" value={newTip.tip} onChange={e => setNewTip({...newTip, tip: e.target.value})} />
                      <button type="submit" className="w-full bg-[#0B3C5D] text-white py-3 rounded-xl font-bold hover:bg-[#082d46] transition-all flex items-center justify-center space-x-2">
                        <Plus className="h-5 w-5" />
                        <span>Add Health Tip</span>
                      </button>
                    </form>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {healthTips.map(tip => (
                        <div key={tip.id} className="p-6 border border-gray-100 rounded-2xl">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-bold text-[#328CC1] uppercase tracking-wider bg-blue-50 px-2 py-1 rounded">{tip.category}</span>
                            <button onClick={() => deleteDoc(doc(db, 'healthTips', tip.id))} className="text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                          </div>
                          <p className="text-sm text-gray-600 italic">"{tip.tip}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Beds Tab */}
                {activeTab === 'beds' && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-[#0B3C5D]">Bed Availability Tracker</h2>
                      <p className="text-xs text-gray-400 italic">Delete any repetitive entries if they exist.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {beds.map(bed => (
                        <div key={bed.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 relative group">
                          <button 
                            onClick={() => deleteDoc(doc(db, 'beds', bed.id))}
                            className="absolute top-4 right-4 p-1 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete this entry"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-[#0B3C5D]">{bed.type} Beds</h4>
                            <span className="text-xs font-bold text-gray-400 uppercase">Total: {bed.total}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <input 
                              type="number" 
                              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#328CC1]"
                              value={bed.available}
                              onChange={(e) => handleUpdateBed(bed.id, parseInt(e.target.value))}
                            />
                            <span className="text-sm font-bold text-[#328CC1]">Available</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Blood Tab */}
                {activeTab === 'blood' && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-[#0B3C5D]">Blood Bank Inventory</h2>
                      <p className="text-xs text-gray-400 italic">Delete any repetitive entries if they exist.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {blood.map(item => (
                        <div key={item.id} className="p-4 border border-gray-100 rounded-2xl text-center relative group">
                          <button 
                            onClick={() => deleteDoc(doc(db, 'bloodAvailability', item.id))}
                            className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete this entry"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                          <p className="text-xl font-black text-[#D9534F] mb-3">{item.group}</p>
                          <select 
                            className="w-full p-2 text-xs font-bold rounded-lg border border-gray-200 outline-none"
                            value={item.status}
                            onChange={(e) => handleUpdateBlood(item.id, e.target.value)}
                          >
                            <option value="Available">Available</option>
                            <option value="Low">Low</option>
                            <option value="Unavailable">Unavailable</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Messages Tab */}
                {activeTab === 'messages' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-[#0B3C5D]">Contact Messages</h2>
                    <div className="space-y-4">
                      {messages.map(msg => (
                        <div key={msg.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-bold text-[#0B3C5D]">{msg.subject}</h4>
                              <p className="text-xs text-gray-400">From: {msg.name} ({msg.email})</p>
                            </div>
                            <button onClick={() => deleteDoc(doc(db, 'contactMessages', msg.id))} className="text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">{msg.message}</p>
                          <p className="text-[10px] text-gray-400 mt-4 font-bold uppercase">{new Date(msg.createdAt).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
