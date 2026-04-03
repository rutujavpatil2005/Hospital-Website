import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Facebook, Twitter, Instagram, Clock } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function Contact() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'contactMessages'), {
        ...formData,
        createdAt: new Date().toISOString()
      });
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error("Failed to send message:", err);
      // Silent fail but log it
    } finally {
      setSubmitting(false);
    }
  };

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
            Contact Us
          </motion.h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Have questions? We're here to help. Reach out to us through any of the channels below.
          </p>
        </div>
      </div>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-2xl font-bold text-[#0B3C5D] mb-8">Get in Touch</h3>
                
                <div className="space-y-8">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-xl text-[#328CC1]">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold text-[#0B3C5D]">Address</p>
                      <p className="text-sm text-gray-500 mt-1">Silver Jubilee Hospital, Bhigwan Road, Baramati, Maharashtra 413102</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-xl text-[#328CC1]">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold text-[#0B3C5D]">Phone</p>
                      <p className="text-sm text-gray-500 mt-1">+91 2112 222222</p>
                      <p className="text-sm text-gray-500">Emergency: 108</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-xl text-[#328CC1]">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold text-[#0B3C5D]">Email</p>
                      <p className="text-sm text-gray-500 mt-1">info@silverjubileehospital.gov.in</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-xl text-[#328CC1]">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold text-[#0B3C5D]">Working Hours</p>
                      <p className="text-sm text-gray-500 mt-1">OPD: 9:00 AM - 5:00 PM</p>
                      <p className="text-sm text-gray-500">Emergency: 24/7</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100">
                  <p className="font-bold text-[#0B3C5D] mb-4">Follow Us</p>
                  <div className="flex space-x-4">
                    <a href="#" className="bg-gray-100 p-3 rounded-xl text-[#0B3C5D] hover:bg-[#328CC1] hover:text-white transition-all"><Facebook className="h-5 w-5" /></a>
                    <a href="#" className="bg-gray-100 p-3 rounded-xl text-[#0B3C5D] hover:bg-[#328CC1] hover:text-white transition-all"><Twitter className="h-5 w-5" /></a>
                    <a href="#" className="bg-gray-100 p-3 rounded-xl text-[#0B3C5D] hover:bg-[#328CC1] hover:text-white transition-all"><Instagram className="h-5 w-5" /></a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white p-12 rounded-3xl shadow-xl border border-gray-100">
                <h3 className="text-2xl font-bold text-[#0B3C5D] mb-8">Send us a Message</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {success && (
                    <div className="bg-green-50 text-green-600 p-4 rounded-xl flex items-center space-x-3 text-sm font-medium">
                      <CheckCircle2 className="h-5 w-5" />
                      <span>Your message has been sent successfully! We'll get back to you soon.</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Full Name</label>
                      <input 
                        required
                        type="text" 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#328CC1] outline-none"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Email Address</label>
                      <input 
                        required
                        type="email" 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#328CC1] outline-none"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Subject</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#328CC1] outline-none"
                      placeholder="How can we help you?"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Message</label>
                    <textarea 
                      required
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#328CC1] outline-none resize-none"
                      placeholder="Type your message here..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#328CC1] hover:bg-[#2a78a5] text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {submitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-200 h-[400px] rounded-3xl overflow-hidden relative shadow-inner">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-[#328CC1] mx-auto mb-4" />
                <p className="text-gray-500 font-bold">Interactive Map of Silver Jubilee Hospital, Baramati</p>
                <p className="text-sm text-gray-400 mt-2">Bhigwan Road, Baramati, Maharashtra</p>
              </div>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1920" 
              alt="Map" 
              className="w-full h-full object-cover opacity-30 grayscale"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
