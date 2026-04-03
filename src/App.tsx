import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import { UserProfile } from './types';
import { seedDoctors, seedAnnouncements } from './lib/seedData';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Doctors from './pages/Doctors';
import Appointment from './pages/Appointment';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import DoctorProfile from './pages/DoctorProfile';

export default function App() {
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [loading, setLoading] = React.useState(true);
  const seededRef = React.useRef(false);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Seed doctors if the logged-in user is the admin and not already seeded this session
        if (firebaseUser.email === "rutujavpatil2005@gmail.com" && !seededRef.current) {
          seededRef.current = true;
          // Seed data in background, handle errors silently
          seedDoctors().catch(err => console.error("Doctor seeding failed:", err));
          seedAnnouncements().catch(err => console.error("Announcement seeding failed:", err));
        }

        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as UserProfile;
          
          // Ensure default admin always has admin role
          if (firebaseUser.email === "rutujavpatil2005@gmail.com" && userData.role !== 'admin') {
            userData.role = 'admin';
          }
          
          setUser(userData);
        } else {
          // Create user profile if it doesn't exist (fallback for first-time login)
          const newUser: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            role: firebaseUser.email === "rutujavpatil2005@gmail.com" ? 'admin' : 'patient',
            createdAt: new Date().toISOString()
          };
          
          try {
            await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
            setUser(newUser);
          } catch (err) {
            console.error("Failed to create user profile:", err);
            // Still set user state for UI even if Firestore write fails (though rules should allow it)
            setUser(newUser);
          }
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B3C5D]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#328CC1]"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/:doctorId" element={<DoctorProfile />} />
            <Route path="/appointment" element={<Appointment />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/admin" element={user?.role === 'admin' ? <Admin /> : <Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
