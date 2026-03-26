export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'patient' | 'admin';
  createdAt: string;
}

export interface DoctorSchedule {
  [day: string]: string;
}

export interface Doctor {
  id: string;
  name: string;
  department: string;
  timing: string;
  specialization: string;
  schedule?: DoctorSchedule;
  bio?: string;
  photoUrl?: string;
}

export interface Appointment {
  id: string;
  patientUid: string | null;
  patientName: string;
  mobileNumber: string;
  department: string;
  doctorId: string;
  doctorName: string;
  email?: string;
  date: string;
  tokenNumber: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface HealthTip {
  id: string;
  tip: string;
  category: string;
}

export interface BedAvailability {
  id: string;
  type: 'ICU' | 'General' | 'Maternity' | 'Emergency';
  total: number;
  available: number;
}

export interface BloodAvailability {
  id: string;
  group: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  status: 'Available' | 'Low' | 'Unavailable';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string;
    email?: string | null;
    emailVerified?: boolean;
    isAnonymous?: boolean;
    tenantId?: string | null;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}
