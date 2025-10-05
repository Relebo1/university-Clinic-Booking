export const USERS = [
  // Students
  { 
    id: 'STU001', 
    name: 'John Doe', 
    email: 'john.doe@university.edu', 
    role: 'student', 
    studentId: '2024001',
    department: 'Computer Science',
    year: 'Junior',
    phone: '+1 (555) 123-4567'
  },
  { 
    id: 'STU002', 
    name: 'Jane Smith', 
    email: 'jane.smith@university.edu', 
    role: 'student', 
    studentId: '2024002',
    department: 'Biology',
    year: 'Senior',
    phone: '+1 (555) 234-5678'
  },
  { 
    id: 'STU003', 
    name: 'Alex Johnson', 
    email: 'alex.johnson@university.edu', 
    role: 'student', 
    studentId: '2024003',
    department: 'Psychology',
    year: 'Sophomore',
    phone: '+1 (555) 345-6789'
  },

  // Staff
  { 
    id: 'STA001', 
    name: 'Dr. Mike Wilson', 
    email: 'mike.wilson@university.edu', 
    role: 'staff', 
    department: 'Computer Science',
    title: 'Professor',
    phone: '+1 (555) 456-7890'
  },
  { 
    id: 'STA002', 
    name: 'Prof. Emily Davis', 
    email: 'emily.davis@university.edu', 
    role: 'staff', 
    department: 'Mathematics',
    title: 'Associate Professor',
    phone: '+1 (555) 567-8901'
  },

  // Nurses  
  { 
    id: 'NUR001', 
    name: 'Sarah Johnson', 
    email: 'sarah.j@university.edu', 
    role: 'nurse', 
    shift: 'morning',
    department: 'Health Services',
    phone: '+1 (555) 678-9012',
    license: 'RN-12345'
  },
  { 
    id: 'NUR002', 
    name: 'Michael Brown', 
    email: 'michael.brown@university.edu', 
    role: 'nurse', 
    shift: 'afternoon',
    department: 'Health Services',
    phone: '+1 (555) 789-0123',
    license: 'RN-23456'
  },

  // Administrators
  { 
    id: 'ADM001', 
    name: 'Lisa Brown', 
    email: 'lisa.brown@university.edu', 
    role: 'administrator',
    department: 'Health Services',
    title: 'Director',
    phone: '+1 (555) 890-1234'
  }
];

export const APPOINTMENTS = [
  {
    id: 'APT001',
    patientId: 'STU001',
    patientName: 'John Doe',
    patientEmail: 'john.doe@university.edu',
    nurseId: 'NUR001',
    nurseName: 'Sarah Johnson',
    date: '2024-10-15',
    time: '10:00',
    endTime: '10:30',
    status: 'confirmed',
    type: 'general-checkup',
    notes: 'Regular health checkup',
    createdAt: '2024-10-10T09:00:00Z',
    symptoms: 'Routine checkup',
    priority: 'normal'
  },
  {
    id: 'APT002',
    patientId: 'STU002',
    patientName: 'Jane Smith',
    patientEmail: 'jane.smith@university.edu',
    nurseId: 'NUR002',
    nurseName: 'Michael Brown',
    date: '2024-10-15',
    time: '14:00',
    endTime: '14:30',
    status: 'confirmed',
    type: 'illness',
    notes: 'Flu-like symptoms',
    createdAt: '2024-10-12T14:30:00Z',
    symptoms: 'Headache, fever, fatigue',
    priority: 'high'
  },
  {
    id: 'APT003',
    patientId: 'STA001',
    patientName: 'Dr. Mike Wilson',
    patientEmail: 'mike.wilson@university.edu',
    nurseId: 'NUR001',
    nurseName: 'Sarah Johnson',
    date: '2024-10-16',
    time: '09:00',
    endTime: '09:30',
    status: 'confirmed',
    type: 'follow-up',
    notes: 'Blood pressure follow-up',
    createdAt: '2024-10-11T16:00:00Z',
    symptoms: 'Blood pressure monitoring',
    priority: 'normal'
  },
  {
    id: 'APT004',
    patientId: 'STU003',
    patientName: 'Alex Johnson',
    patientEmail: 'alex.johnson@university.edu',
    nurseId: 'NUR002',
    nurseName: 'Michael Brown',
    date: '2024-10-14',
    time: '11:00',
    endTime: '11:30',
    status: 'completed',
    type: 'injury',
    notes: 'Sprained ankle from sports',
    createdAt: '2024-10-09T10:15:00Z',
    symptoms: 'Ankle pain and swelling',
    priority: 'high'
  },
  {
    id: 'APT005',
    patientId: 'STU001',
    patientName: 'John Doe',
    patientEmail: 'john.doe@university.edu',
    nurseId: 'NUR001',
    nurseName: 'Sarah Johnson',
    date: '2024-10-13',
    time: '15:00',
    endTime: '15:30',
    status: 'no-show',
    type: 'mental-health',
    notes: 'Stress counseling session',
    createdAt: '2024-10-08T11:20:00Z',
    symptoms: 'Academic stress and anxiety',
    priority: 'normal'
  }
];

export const NOTIFICATIONS = [
  {
    id: 'NOT001',
    userId: 'STU001',
    title: 'Appointment Reminder',
    message: 'Your appointment with Sarah Johnson is tomorrow at 10:00 AM',
    type: 'reminder',
    read: false,
    createdAt: '2024-10-14T08:00:00Z'
  },
  {
    id: 'NOT002',
    userId: 'NUR001',
    title: 'New Appointment',
    message: 'New appointment scheduled for October 15, 2024',
    type: 'appointment',
    read: false,
    createdAt: '2024-10-12T10:30:00Z'
  },
  {
    id: 'NOT003',
    userId: 'ADM001',
    title: 'Weekly Report Ready',
    message: 'Your weekly clinic statistics report is ready for review',
    type: 'report',
    read: true,
    createdAt: '2024-10-13T09:00:00Z'
  }
];

export const ANALYTICS_DATA = {
  appointmentTrends: [
    { date: '2024-10-07', appointments: 12, completed: 10, noShows: 2 },
    { date: '2024-10-08', appointments: 15, completed: 13, noShows: 2 },
    { date: '2024-10-09', appointments: 18, completed: 16, noShows: 2 },
    { date: '2024-10-10', appointments: 14, completed: 12, noShows: 2 },
    { date: '2024-10-11', appointments: 16, completed: 15, noShows: 1 },
    { date: '2024-10-12', appointments: 20, completed: 18, noShows: 2 },
    { date: '2024-10-13', appointments: 13, completed: 11, noShows: 2 }
  ],
  appointmentTypes: [
    { name: 'General Checkup', value: 45, color: '#1e40af' },
    { name: 'Illness', value: 30, color: '#ef4444' },
    { name: 'Follow-up', value: 15, color: '#10b981' },
    { name: 'Injury', value: 7, color: '#f59e0b' },
    { name: 'Mental Health', value: 3, color: '#8b5cf6' }
  ],
  userStats: {
    totalStudents: 1250,
    totalStaff: 180,
    activePatients: 95,
    totalAppointments: 486
  },
  peakHours: [
    { hour: '08:00', appointments: 5 },
    { hour: '09:00', appointments: 12 },
    { hour: '10:00', appointments: 18 },
    { hour: '11:00', appointments: 15 },
    { hour: '12:00', appointments: 8 },
    { hour: '13:00', appointments: 6 },
    { hour: '14:00', appointments: 14 },
    { hour: '15:00', appointments: 16 },
    { hour: '16:00', appointments: 11 },
    { hour: '17:00', appointments: 7 }
  ]
};

export const APPOINTMENT_TYPES = [
  { value: 'general-checkup', label: 'General Checkup', duration: 30 },
  { value: 'illness', label: 'Illness/Symptoms', duration: 30 },
  { value: 'injury', label: 'Injury', duration: 45 },
  { value: 'follow-up', label: 'Follow-up', duration: 30 },
  { value: 'mental-health', label: 'Mental Health', duration: 60 },
  { value: 'vaccination', label: 'Vaccination', duration: 15 },
  { value: 'screening', label: 'Health Screening', duration: 45 }
];

export const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
];