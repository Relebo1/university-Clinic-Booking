'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/layout/protected-route';
import { Navbar } from '@/components/layout/navbar';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/ui/page-header';
import { Search, User, Mail, Phone, Calendar, Clock, FileText } from 'lucide-react';
import { format, isAfter, parseISO } from 'date-fns';

export default function PatientsPage() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const resPatients = await fetch(`/api/patients?nurse_id=${user.id}`);
        const patientsData = await resPatients.json();

        const resAppointments = await fetch(`/api/appointments?nurse_id=${user.id}`);
        const appointmentsData = await resAppointments.json();

        // Ensure both are arrays
        setPatients(Array.isArray(patientsData) ? patientsData : []);
        setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch patients or appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getPatientAppointments = (patientId: string) => {
    return appointments
      .filter((apt) => apt.patientId === patientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getLastVisit = (patientId: string) => {
    const appts = getPatientAppointments(patientId);
    const lastCompleted = appts.find((apt) => apt.status === 'completed');
    return lastCompleted ? parseISO(lastCompleted.date) : null;
  };

  const getUpcomingAppointment = (patientId: string) => {
    const appts = getPatientAppointments(patientId);
    return appts.find(
      (apt) => apt.status === 'confirmed' && isAfter(parseISO(apt.date), new Date())
    );
  };

  const filteredPatients = patients.filter((patient: any) =>
    patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient?.studentId && patient.studentId.includes(searchTerm))
  );

  const getStatusColor = (status: string) => ({
    completed: 'bg-green-100 text-green-800',
    confirmed: 'bg-blue-100 text-blue-800',
    'no-show': 'bg-red-100 text-red-800',
  })[status] || 'bg-gray-100 text-gray-800';

  return (
    <ProtectedRoute requiredRole="nurse">
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageHeader
            title="My Patients"
            description="Manage your assigned patients and their appointment history"
          />

          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search patients by name, email, or student ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {loading && <p className="text-center py-12 text-gray-500">Loading patients...</p>}
          {error && <p className="text-center py-12 text-red-500">{error}</p>}

          {!loading && !error && (
            <div className="space-y-4">
              {filteredPatients.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
                    <p className="text-gray-500">
                      {searchTerm
                        ? 'Try adjusting your search terms.'
                        : "You don't have any assigned patients yet."}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredPatients.map((patient: any) => {
                  const patientAppointments = getPatientAppointments(patient.id);
                  const lastVisit = getLastVisit(patient.id);
                  const upcomingAppointment = getUpcomingAppointment(patient.id);
                  const totalVisits = patientAppointments.filter((a) => a.status === 'completed').length;

                  return (
                    <Card key={patient.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <div className="flex items-center space-x-1">
                                  <Mail className="h-4 w-4" />
                                  <span>{patient.email}</span>
                                </div>
                                {patient.phone && (
                                  <div className="flex items-center space-x-1">
                                    <Phone className="h-4 w-4" />
                                    <span>{patient.phone}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={patient.role === 'student' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                              {patient.role}
                            </Badge>
                            {patient.studentId && <Badge variant="outline">ID: {patient.studentId}</Badge>}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
