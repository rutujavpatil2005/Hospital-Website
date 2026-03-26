import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { db } from './firebase';
import { Doctor } from '../types';

const DOCTORS_SEED: Omit<Doctor, 'id'>[] = [
  // General OPD
  {
    name: "Dr. Rajesh Patil",
    department: "General OPD",
    specialization: "General Physician",
    timing: "10:00 AM - 02:00 PM",
    bio: "Expert in general medicine with 15 years of experience.",
    photoUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Dr. Sunita Deshmukh",
    department: "General OPD",
    specialization: "Family Medicine",
    timing: "02:00 PM - 06:00 PM",
    bio: "Dedicated to providing comprehensive primary care.",
    photoUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Dr. Rutuja Patil",
    department: "Emergency",
    specialization: "Emergency Medicine Specialist",
    timing: "09:00 AM - 05:00 PM",
    bio: "Expert in emergency medicine and critical care with a focus on rapid patient stabilization.",
    photoUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400"
  },
  // Emergency
  {
    name: "Dr. Amit Shinde",
    department: "Emergency",
    specialization: "Trauma Specialist",
    timing: "08:00 AM - 04:00 PM",
    bio: "Specialized in handling critical trauma cases.",
    photoUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Dr. Priya Kulkarni",
    department: "Emergency",
    specialization: "Emergency Medicine",
    timing: "04:00 PM - 12:00 AM",
    bio: "Expert in rapid response and emergency procedures.",
    photoUrl: "https://images.unsplash.com/photo-1559839734-2b71f153678f?auto=format&fit=crop&q=80&w=400"
  },
  // ICU
  {
    name: "Dr. Vikram Pawar",
    department: "ICU",
    specialization: "Intensivist",
    timing: "09:00 AM - 05:00 PM",
    bio: "Critical care specialist with focus on multi-organ failure.",
    photoUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Dr. Anjali More",
    department: "ICU",
    specialization: "Critical Care",
    timing: "09:00 PM - 06:00 AM",
    bio: "Expert in managing life-support systems and critical monitoring.",
    photoUrl: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=400"
  },
  // Maternity
  {
    name: "Dr. Snehal Jadhav",
    department: "Maternity",
    specialization: "Gynaecologist",
    timing: "10:00 AM - 01:00 PM",
    bio: "Expert in high-risk pregnancies and neonatal care.",
    photoUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Dr. Kavita Gaware",
    department: "Maternity",
    specialization: "Obstetrician",
    timing: "02:00 PM - 05:00 PM",
    bio: "Dedicated to maternal health and safe deliveries.",
    photoUrl: "https://images.unsplash.com/photo-1559839734-2b71f153678f?auto=format&fit=crop&q=80&w=400"
  },
  // Paediatrics
  {
    name: "Dr. Rahul Thorat",
    department: "Paediatrics",
    specialization: "Child Specialist",
    timing: "11:00 AM - 03:00 PM",
    bio: "Compassionate care for infants and children.",
    photoUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Dr. Megha Salunke",
    department: "Paediatrics",
    specialization: "Neonatologist",
    timing: "04:00 PM - 08:00 PM",
    bio: "Specialized in newborn care and developmental paediatrics.",
    photoUrl: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=400"
  },
  // Orthopaedics
  {
    name: "Dr. Sameer Kadam",
    department: "Orthopaedics",
    specialization: "Joint Replacement Surgeon",
    timing: "10:00 AM - 02:00 PM",
    bio: "Expert in knee and hip replacement surgeries.",
    photoUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Dr. Mahesh Bhosale",
    department: "Orthopaedics",
    specialization: "Spine Specialist",
    timing: "03:00 PM - 07:00 PM",
    bio: "Specialized in spinal disorders and sports injuries.",
    photoUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400"
  },
  // Ophthalmology
  {
    name: "Dr. Aarti Shah",
    department: "Ophthalmology",
    specialization: "Eye Surgeon",
    timing: "09:00 AM - 01:00 PM",
    bio: "Expert in cataract and laser eye surgeries.",
    photoUrl: "https://images.unsplash.com/photo-1559839734-2b71f153678f?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Dr. Nitin Mehta",
    department: "Ophthalmology",
    specialization: "Retina Specialist",
    timing: "02:00 PM - 06:00 PM",
    bio: "Specialized in retinal disorders and glaucoma management.",
    photoUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400"
  }
];

export const seedDoctors = async () => {
  try {
    const doctorsRef = collection(db, 'doctors');
    const snapshot = await getDocs(doctorsRef);
    
    // If we already have doctors, don't seed again (or we could check per department)
    if (snapshot.size >= DOCTORS_SEED.length) {
      return;
    }

    for (const doctor of DOCTORS_SEED) {
      // Check if doctor already exists by name to avoid duplicates
      const q = query(doctorsRef, where('name', '==', doctor.name));
      const existing = await getDocs(q);
      
      if (existing.empty) {
        await addDoc(doctorsRef, doctor);
      }
    }
  } catch (error: any) {
    if (error.code !== 'permission-denied') {
      // Silent fail for seeding
    }
  }
};
