import { collection, addDoc, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from './firebase';
import { Doctor, Announcement } from '../types';

const DOCTORS_SEED: Omit<Doctor, 'id'>[] = [
  // General OPD
  {
    name: "Dr. Arvind Swaminathan",
    department: "General OPD",
    specialization: "Internal Medicine",
    timing: "09:00 AM - 01:00 PM",
    bio: "Senior consultant with 20+ years of experience in chronic disease management.",
    schedule: { "Monday": "09:00 AM - 01:00 PM", "Tuesday": "09:00 AM - 01:00 PM", "Wednesday": "09:00 AM - 01:00 PM", "Thursday": "09:00 AM - 01:00 PM", "Friday": "09:00 AM - 01:00 PM", "Saturday": "10:00 AM - 12:00 PM", "Sunday": "Off" }
  },
  {
    name: "Dr. Meera Ranganathan",
    department: "General OPD",
    specialization: "Family Physician",
    timing: "02:00 PM - 06:00 PM",
    bio: "Specializes in preventive healthcare and wellness for all age groups.",
    schedule: { "Monday": "02:00 PM - 06:00 PM", "Tuesday": "02:00 PM - 06:00 PM", "Wednesday": "02:00 PM - 06:00 PM", "Thursday": "02:00 PM - 06:00 PM", "Friday": "02:00 PM - 06:00 PM", "Saturday": "Off", "Sunday": "Off" }
  },
  // Emergency
  {
    name: "Dr. Sanjay Bharadwaj",
    department: "Emergency",
    specialization: "Critical Care Specialist",
    timing: "08:00 AM - 04:00 PM",
    bio: "Expert in acute trauma management and emergency surgical interventions.",
    schedule: { "Monday": "08:00 AM - 04:00 PM", "Tuesday": "08:00 AM - 04:00 PM", "Wednesday": "08:00 AM - 04:00 PM", "Thursday": "08:00 AM - 04:00 PM", "Friday": "08:00 AM - 04:00 PM", "Saturday": "08:00 AM - 04:00 PM", "Sunday": "08:00 AM - 04:00 PM" }
  },
  {
    name: "Dr. Neha Chaturvedi",
    department: "Emergency",
    specialization: "Emergency Medicine",
    timing: "04:00 PM - 12:00 AM",
    bio: "Dedicated to rapid patient stabilization and high-pressure medical care.",
    schedule: { "Monday": "04:00 PM - 12:00 AM", "Tuesday": "04:00 PM - 12:00 AM", "Wednesday": "04:00 PM - 12:00 AM", "Thursday": "04:00 PM - 12:00 AM", "Friday": "04:00 PM - 12:00 AM", "Saturday": "04:00 PM - 12:00 AM", "Sunday": "04:00 PM - 12:00 AM" }
  },
  // ICU
  {
    name: "Dr. Rohan Malhotra",
    department: "ICU",
    specialization: "Pulmonologist",
    timing: "09:00 AM - 05:00 PM",
    bio: "Specialist in respiratory failure and advanced mechanical ventilation.",
    schedule: { "Monday": "09:00 AM - 05:00 PM", "Tuesday": "09:00 AM - 05:00 PM", "Wednesday": "09:00 AM - 05:00 PM", "Thursday": "09:00 AM - 05:00 PM", "Friday": "09:00 AM - 05:00 PM", "Saturday": "Off", "Sunday": "Off" }
  },
  {
    name: "Dr. Ananya Reddy",
    department: "ICU",
    specialization: "Cardiac Intensivist",
    timing: "09:00 PM - 06:00 AM",
    bio: "Expert in post-operative cardiac care and hemodynamics monitoring.",
    schedule: { "Monday": "09:00 PM - 06:00 AM", "Tuesday": "09:00 PM - 06:00 AM", "Wednesday": "09:00 PM - 06:00 AM", "Thursday": "09:00 PM - 06:00 AM", "Friday": "09:00 PM - 06:00 AM", "Saturday": "09:00 PM - 06:00 AM", "Sunday": "09:00 PM - 06:00 AM" }
  },
  // Maternity
  {
    name: "Dr. Shalini Varma",
    department: "Maternity",
    specialization: "Obstetrician",
    timing: "10:00 AM - 01:00 PM",
    bio: "Passionate about natural birthing and comprehensive prenatal education.",
    schedule: { "Monday": "10:00 AM - 01:00 PM", "Tuesday": "10:00 AM - 01:00 PM", "Wednesday": "10:00 AM - 01:00 PM", "Thursday": "10:00 AM - 01:00 PM", "Friday": "10:00 AM - 01:00 PM", "Saturday": "Off", "Sunday": "Off" }
  },
  {
    name: "Dr. Pooja Hegde",
    department: "Maternity",
    specialization: "Fertility Specialist",
    timing: "02:00 PM - 05:00 PM",
    bio: "Helping families with advanced reproductive technologies and care.",
    schedule: { "Monday": "02:00 PM - 05:00 PM", "Tuesday": "02:00 PM - 05:00 PM", "Wednesday": "02:00 PM - 05:00 PM", "Thursday": "02:00 PM - 05:00 PM", "Friday": "02:00 PM - 05:00 PM", "Saturday": "Off", "Sunday": "Off" }
  },
  // Paediatrics
  {
    name: "Dr. Arjun Kapoor",
    department: "Paediatrics",
    specialization: "Pediatric Cardiologist",
    timing: "11:00 AM - 03:00 PM",
    bio: "Specialized in congenital heart defects and pediatric heart health.",
    schedule: { "Monday": "11:00 AM - 03:00 PM", "Tuesday": "11:00 AM - 03:00 PM", "Wednesday": "11:00 AM - 03:00 PM", "Thursday": "11:00 AM - 03:00 PM", "Friday": "11:00 AM - 03:00 PM", "Saturday": "11:00 AM - 01:00 PM", "Sunday": "Off" }
  },
  {
    name: "Dr. Divya Nair",
    department: "Paediatrics",
    specialization: "Pediatric Surgeon",
    timing: "04:00 PM - 08:00 PM",
    bio: "Expert in minimally invasive surgeries for infants and children.",
    schedule: { "Monday": "04:00 PM - 08:00 PM", "Tuesday": "04:00 PM - 08:00 PM", "Wednesday": "04:00 PM - 08:00 PM", "Thursday": "04:00 PM - 08:00 PM", "Friday": "04:00 PM - 08:00 PM", "Saturday": "Off", "Sunday": "Off" }
  },
  // Orthopaedics
  {
    name: "Dr. Karthik Ramachandran",
    department: "Orthopaedics",
    specialization: "Sports Medicine",
    timing: "10:00 AM - 02:00 PM",
    bio: "Treating professional athletes and sports-related musculoskeletal injuries.",
    schedule: { "Monday": "10:00 AM - 02:00 PM", "Tuesday": "10:00 AM - 02:00 PM", "Wednesday": "10:00 AM - 02:00 PM", "Thursday": "10:00 AM - 02:00 PM", "Friday": "10:00 AM - 02:00 PM", "Saturday": "Off", "Sunday": "Off" }
  },
  {
    name: "Dr. Simran Kaur",
    department: "Orthopaedics",
    specialization: "Pediatric Orthopaedist",
    timing: "03:00 PM - 07:00 PM",
    bio: "Focuses on bone and joint health in growing children and adolescents.",
    schedule: { "Monday": "03:00 PM - 07:00 PM", "Tuesday": "03:00 PM - 07:00 PM", "Wednesday": "03:00 PM - 07:00 PM", "Thursday": "03:00 PM - 07:00 PM", "Friday": "03:00 PM - 07:00 PM", "Saturday": "Off", "Sunday": "Off" }
  },
  // Ophthalmology
  {
    name: "Dr. Vivek Oberoi",
    department: "Ophthalmology",
    specialization: "Cornea Specialist",
    timing: "09:00 AM - 01:00 PM",
    bio: "Expert in corneal transplants and advanced refractive surgeries.",
    schedule: { "Monday": "09:00 AM - 01:00 PM", "Tuesday": "09:00 AM - 01:00 PM", "Wednesday": "09:00 AM - 01:00 PM", "Thursday": "09:00 AM - 01:00 PM", "Friday": "09:00 AM - 01:00 PM", "Saturday": "09:00 AM - 11:00 AM", "Sunday": "Off" }
  },
  {
    name: "Dr. Rashmi Desai",
    department: "Ophthalmology",
    specialization: "Oculoplastic Surgeon",
    timing: "02:00 PM - 06:00 PM",
    bio: "Specialized in eyelid surgery and orbital reconstructive procedures.",
    schedule: { "Monday": "02:00 PM - 06:00 PM", "Tuesday": "02:00 PM - 06:00 PM", "Wednesday": "02:00 PM - 06:00 PM", "Thursday": "02:00 PM - 06:00 PM", "Friday": "02:00 PM - 06:00 PM", "Saturday": "Off", "Sunday": "Off" }
  }
];

const ANNOUNCEMENTS_SEED: Omit<Announcement, 'id'>[] = [
  {
    title: "Free Health Checkup Camp",
    content: "Silver Jubilee Hospital is organizing a free health checkup camp this Sunday from 10 AM to 4 PM. All are welcome for general checkups and consultations.",
    createdAt: new Date().toISOString()
  },
  {
    title: "New Cardiology Wing Opened",
    content: "We are proud to announce the opening of our state-of-the-art Cardiology department with advanced diagnostic and surgical facilities.",
    createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  },
  {
    title: "Blood Donation Drive",
    content: "Join us for a blood donation drive on April 10th. Your contribution can save lives. Register at the reception desk.",
    createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
  }
];

export const seedAnnouncements = async () => {
  try {
    const annRef = collection(db, 'announcements');
    const existing = await getDocs(query(annRef, limit(1)));
    if (existing.empty) {
      for (const ann of ANNOUNCEMENTS_SEED) {
        await addDoc(annRef, ann);
      }
    }
    return true;
  } catch (error) {
    console.error("Error seeding announcements:", error);
    return false;
  }
};

export const seedDoctors = async () => {
  try {
    const doctorsRef = collection(db, 'doctors');
    for (const doctor of DOCTORS_SEED) {
      const q = query(doctorsRef, where('name', '==', doctor.name));
      const existing = await getDocs(q);
      if (existing.empty) {
        await addDoc(doctorsRef, doctor);
      }
    }
    return true;
  } catch (error) {
    console.error("Error seeding doctors:", error);
    return false;
  }
};
