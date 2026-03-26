import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Hospital, Menu, X, User, LogOut, Phone, Calendar, ShieldCheck } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { UserProfile } from '../types';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as UserProfile;
          if (firebaseUser.email === "rutujavpatil2005@gmail.com" && userData.role !== 'admin') {
            userData.role = 'admin';
          }
          setUser(userData);
        } else if (firebaseUser.email === "rutujavpatil2005@gmail.com") {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || 'Admin',
            role: 'admin',
            createdAt: new Date().toISOString()
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Doctors', path: '/doctors' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="bg-[#0B3C5D] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Hospital className="h-10 w-10 text-[#328CC1]" />
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tight leading-none">SILVER JUBILEE</span>
                <span className="text-xs text-[#328CC1] font-semibold uppercase tracking-widest">Hospital, Baramati</span>
              </div>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="hover:text-[#328CC1] px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              
              {user ? (
                <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-white/20">
                  <Link to="/dashboard" className="flex items-center space-x-1 hover:text-[#328CC1]">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">Dashboard</span>
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="flex items-center space-x-1 hover:text-[#328CC1]">
                      <ShieldCheck className="h-4 w-4" />
                      <span className="text-sm font-medium">Admin</span>
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 hover:text-[#D9534F] text-sm font-medium"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : null}
              
              <Link
                to="/appointment"
                className="bg-[#D9534F] hover:bg-[#c9302c] px-6 py-2 rounded-full text-sm font-bold transition-all transform hover:scale-105 flex items-center space-x-2"
              >
                <Calendar className="h-4 w-4" />
                <span>Book Appointment</span>
              </Link>
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:text-[#328CC1] focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0B3C5D] border-t border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#328CC1]"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/appointment"
              className="block px-3 py-2 rounded-md text-base font-medium bg-[#D9534F] text-center mt-4"
              onClick={() => setIsOpen(false)}
            >
              Book Appointment
            </Link>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#328CC1]"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#328CC1]"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium hover:bg-[#D9534F]"
                >
                  Logout
                </button>
              </>
            ) : null}
          </div>
        </div>
      )}
    </nav>
  );
}
