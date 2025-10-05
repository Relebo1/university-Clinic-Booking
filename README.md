# University Clinic Appointment Booking System

A comprehensive appointment booking system built with Next.js 14, featuring role-based authentication, real-time scheduling, and advanced analytics dashboard.

## 🚀 Features

### Multi-Role Authentication System
- **Students**: Book appointments, view history, manage profile
- **Staff**: Same as students with additional privileges
- **Nurses**: Manage daily schedules, patient check-ins, appointment updates
- **Administrators**: System overview, user management, reports, settings

### Core Functionality
- ✅ Real-time appointment booking with conflict prevention
- ✅ Interactive calendar with availability checking
- ✅ Role-based dashboards with tailored interfaces
- ✅ Comprehensive notification system (email/SMS mock)
- ✅ Advanced analytics with interactive charts
- ✅ Responsive design for all devices
- ✅ Search and filtering across all data
- ✅ Export functionality for reports

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand
- **Authentication**: Mock JWT implementation
- **Charts**: Recharts for analytics
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **Notifications**: Sonner for toast messages

## 📁 Project Structure

```
src/
├── app/
│   ├── login/                 # Authentication page
│   ├── dashboard/             # Role-based dashboard
│   ├── appointments/          # Appointment management
│   │   └── book/             # Appointment booking flow
│   ├── schedule/             # Nurse schedule view
│   ├── patients/             # Patient management (nurses)
│   ├── reports/              # Analytics and reporting
│   ├── users/                # User management (admin)
│   └── settings/             # System settings (admin)
├── components/
│   ├── ui/                   # Reusable UI components
│   ├── layout/               # Layout components
│   └── dashboard/            # Dashboard components
├── lib/
│   ├── auth.ts              # Authentication logic
│   ├── dummy-data.ts        # Mock data
│   └── utils.ts             # Utility functions
└── hooks/
    └── useAuth.ts           # Authentication hook
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student', 'staff', 'nurse', 'administrator') NOT NULL,
    student_id VARCHAR(20),
    department VARCHAR(100),
    title VARCHAR(100),
    shift ENUM('morning', 'afternoon', 'evening'),
    year VARCHAR(20),
    phone VARCHAR(20),
    license VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Appointments Table
```sql
CREATE TABLE appointments (
    id VARCHAR(10) PRIMARY KEY,
    patient_id VARCHAR(10) NOT NULL,
    patient_name VARCHAR(100) NOT NULL,
    patient_email VARCHAR(100) NOT NULL,
    nurse_id VARCHAR(10) NOT NULL,
    nurse_name VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    end_time TIME NOT NULL,
    status ENUM('confirmed', 'completed', 'cancelled', 'no-show') DEFAULT 'confirmed',
    type ENUM('general-checkup', 'illness', 'injury', 'follow-up', 'mental-health', 'vaccination', 'screening') NOT NULL,
    notes TEXT,
    symptoms TEXT,
    priority ENUM('normal', 'high') DEFAULT 'normal',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(id),
    FOREIGN KEY (nurse_id) REFERENCES users(id)
);
```

### Notifications Table
```sql
CREATE TABLE notifications (
    id VARCHAR(10) PRIMARY KEY,
    user_id VARCHAR(10) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('reminder', 'appointment', 'report', 'system') NOT NULL,
    read_status BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Appointment Types Table
```sql
CREATE TABLE appointment_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    value VARCHAR(50) UNIQUE NOT NULL,
    label VARCHAR(100) NOT NULL,
    duration INT NOT NULL, -- in minutes
    description TEXT,
    active BOOLEAN DEFAULT TRUE
);
```

### System Settings Table
```sql
CREATE TABLE system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 📊 Demo Data

### Sample Users
```javascript
// Students
{ id: 'STU001', name: 'John Doe', email: 'john.doe@university.edu', role: 'student', studentId: '2024001', department: 'Computer Science', year: 'Junior' }
{ id: 'STU002', name: 'Jane Smith', email: 'jane.smith@university.edu', role: 'student', studentId: '2024002', department: 'Biology', year: 'Senior' }
{ id: 'STU003', name: 'Alex Johnson', email: 'alex.johnson@university.edu', role: 'student', studentId: '2024003', department: 'Psychology', year: 'Sophomore' }

// Staff
{ id: 'STA001', name: 'Dr. Mike Wilson', email: 'mike.wilson@university.edu', role: 'staff', department: 'Computer Science', title: 'Professor' }
{ id: 'STA002', name: 'Prof. Emily Davis', email: 'emily.davis@university.edu', role: 'staff', department: 'Mathematics', title: 'Associate Professor' }

// Nurses
{ id: 'NUR001', name: 'Sarah Johnson', email: 'sarah.j@university.edu', role: 'nurse', shift: 'morning', license: 'RN-12345' }
{ id: 'NUR002', name: 'Michael Brown', email: 'michael.brown@university.edu', role: 'nurse', shift: 'afternoon', license: 'RN-23456' }

// Administrators
{ id: 'ADM001', name: 'Lisa Brown', email: 'lisa.brown@university.edu', role: 'administrator', department: 'Health Services', title: 'Director' }
```

### Sample Appointments
```javascript
{
  id: 'APT001',
  patientId: 'STU001',
  patientName: 'John Doe',
  nurseId: 'NUR001',
  nurseName: 'Sarah Johnson',
  date: '2024-10-15',
  time: '10:00',
  endTime: '10:30',
  status: 'confirmed',
  type: 'general-checkup',
  symptoms: 'Routine checkup',
  priority: 'normal'
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd university-clinic-booking
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to `http://localhost:3000`

## 🔐 Demo Login Credentials

### Student Account
- **Email**: `john.doe@university.edu`
- **Password**: `password123`
- **Role**: Student

### Staff Account
- **Email**: `mike.wilson@university.edu`
- **Password**: `password123`
- **Role**: Staff

### Nurse Account
- **Email**: `sarah.j@university.edu`
- **Password**: `password123`
- **Role**: Nurse

### Administrator Account
- **Email**: `lisa.brown@university.edu`
- **Password**: `password123`
- **Role**: Administrator

## 📱 Available Pages

### Public Pages
- `/login` - Authentication page with role selection

### Student/Staff Pages
- `/dashboard` - Personal dashboard with appointments overview
- `/appointments` - View and manage personal appointments
- `/appointments/book` - Multi-step appointment booking process

### Nurse Pages
- `/dashboard` - Nurse dashboard with daily schedule
- `/schedule` - Weekly schedule view with appointment management
- `/patients` - Patient management and history
- `/appointments` - All assigned appointments

### Administrator Pages
- `/dashboard` - System overview with analytics
- `/appointments` - All system appointments
- `/reports` - Comprehensive reporting and analytics
- `/users` - User management interface
- `/settings` - System configuration

## 🎨 Design System

### Color Palette
- **Primary**: University Blue (#1e40af)
- **Secondary**: Light Blue (#3b82f6)
- **Success**: Green (#10b981)
- **Warning**: Orange (#f59e0b)
- **Error**: Red (#ef4444)
- **Neutral**: Gray shades

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: 150% line height, bold weights
- **Body**: 150% line height, regular weight
- **Small text**: 120% line height

### Components
- Built with shadcn/ui for consistency
- Tailwind CSS for styling
- Responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

## 📊 Analytics Features

### Dashboard Metrics
- Total appointments and completion rates
- User statistics by role
- Peak usage hours analysis
- No-show rate tracking

### Interactive Charts
- Weekly appointment trends (Line chart)
- Appointment type distribution (Pie chart)
- Peak hours analysis (Bar chart)
- Performance metrics (Progress bars)

### Export Functionality
- CSV export for appointments
- Analytics data export
- Custom date range filtering

## 🔧 Configuration

### Appointment Settings
- Default duration: 30 minutes
- Advance booking limit: 30 days
- Working hours: 8:00 AM - 5:00 PM
- Available time slots: 30-minute intervals

### Notification Settings
- Email notifications (mock implementation)
- SMS reminders (mock implementation)
- In-app notifications with badge counts
- Reminder timing: 24 hours before appointment

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables
Create a `.env.local` file:
```env
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Note**: This is a demo application using mock data. In a production environment, you would need to implement proper database connections, real authentication, and actual email/SMS services.