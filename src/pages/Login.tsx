import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, LogIn, AlertCircle, Hospital } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile } from '../types';

export default function Login() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/dashboard';

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        const userProfile: UserProfile = {
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName || 'User',
          role: user.email === "rutujavpatil2005@gmail.com" ? 'admin' : 'patient',
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'users', user.uid), userProfile);
      }
      navigate(from);
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Login was cancelled. Please try again.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password login is currently disabled. Please use Google Sign-In.');
      } else {
        setError(err.message || 'Failed to login.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate(from);
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B3C5D] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#328CC1] rounded-full -translate-x-1/2 -translate-y-1/2 opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#D9534F] rounded-full translate-x-1/2 translate-y-1/2 opacity-10 blur-3xl"></div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full relative z-10"
      >
        <div className="text-center mb-10">
          <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#328CC1]">
            <Hospital className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-[#0B3C5D] mb-2">Staff Portal</h1>
          <p className="text-gray-500">Sign in to access the hospital management system</p>
        </div>

        <div className="space-y-4">
          <button 
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white border-2 border-gray-100 hover:border-[#328CC1] text-gray-700 py-4 rounded-2xl font-bold transition-all flex items-center justify-center space-x-3 group shadow-sm hover:shadow-md"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-5 w-5" />
            <span>Sign in with Google</span>
          </button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-white text-gray-400 font-medium uppercase tracking-widest">Or use email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {email === "rutujavpatil2005@gmail.com" && !error && (
              <div className="bg-blue-50 text-[#328CC1] p-4 rounded-xl text-xs font-medium border border-blue-100">
                <p>Admin detected. Please use <strong>Sign in with Google</strong> for instant access.</p>
              </div>
            )}
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center space-x-3 text-sm font-medium border border-red-100">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center space-x-2">
                <Mail className="h-4 w-4 text-[#328CC1]" />
                <span>Email Address</span>
              </label>
              <input 
                required
                type="email" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#328CC1] outline-none"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center space-x-2">
                <Lock className="h-4 w-4 text-[#328CC1]" />
                <span>Password</span>
              </label>
              <input 
                required
                type="password" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#328CC1] outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#328CC1] hover:bg-[#2a78a5] text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  <span>Login</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-10 text-center">
        </div>
      </motion.div>
    </div>
  );
}
