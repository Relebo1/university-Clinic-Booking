"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/layout/protected-route';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader } from '@/components/ui/page-header';
import { Calendar, Clock, Search, Filter, Plus, CreditCard as Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { toast } from 'sonner';

export default function AppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    if (!user) return;

    const fetchAppointments = async () => {
      try {
        let query = '';
        if (user.role === 'student' || user.role === 'staff') query = `?userId=${user.id}`;
        if (user.role === 'nurse') query = `?userId=${user.id}`;

        const res = await fetch(`/api/appointments${query}`);
        if (!res.ok) throw new Error('Failed to fetch appointments');
        const data = await res.json();
        setAppointments(data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user]);

  const getFilteredAppointments = () => {
    let filtered = appointments;

    if (searchTerm) {
      filtered = filtered.filter(
        apt =>
          apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (apt.nurseName && apt.nurseName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          apt.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(apt => apt.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(apt => apt.type === typeFilter);
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no-show': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-red-500';
      case 'normal': return 'border-l-4 border-blue-500';
      default: return 'border-l-4 border-gray-300';
    }
  };

  const filteredAppointments = getFilteredAppointments();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageHeader
            title="Appointments"
            description={
              user?.role === 'administrator'
                ? "Manage all clinic appointments and schedules"
                : user?.role === 'nurse'
                ? "Your assigned appointments and patient schedule"
                : "Your appointment history and upcoming visits"
            }
          >
            {(user?.role === 'student' || user?.role === 'staff') && (
              <Link href="/appointments/book">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Book Appointment
                </Button>
              </Link>
            )}
          </PageHeader>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Filter Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search appointments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="no-show">No Show</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="general-checkup">General Checkup</SelectItem>
                    <SelectItem value="illness">Illness</SelectItem>
                    <SelectItem value="injury">Injury</SelectItem>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                    <SelectItem value="mental-health">Mental Health</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setTypeFilter('all');
                }}>
                  <Filter className="mr-2 h-4 w-4" />
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Appointments List */}
          <div className="space-y-4">
            {loading ? (
              <p className="text-center text-gray-500">Loading appointments...</p>
            ) : filteredAppointments.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
                  {(user?.role === 'student' || user?.role === 'staff') && (
                    <Link href="/appointments/book">
                      <Button>Book Your First Appointment</Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ) : (
              filteredAppointments.map((apt) => (
                <Card key={apt.id} className={`hover:shadow-md transition-shadow ${getPriorityColor(apt.priority)}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {user?.role === 'administrator' || user?.role === 'nurse' ? apt.patientName : apt.nurseName}
                          </h3>
                          <p className="text-sm text-gray-600">{apt.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(apt.status)}>{apt.status}</Badge>
                        {apt.priority === 'high' && <Badge className="bg-red-100 text-red-800">High Priority</Badge>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{format(new Date(apt.date), 'EEEE, MMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{apt.time} - {apt.endTime}</span>
                      </div>
                      <div className="text-sm text-gray-600">ID: {apt.id}</div>
                    </div>

                    {apt.symptoms && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-1">Symptoms/Concerns:</p>
                        <p className="text-sm text-gray-600">{apt.symptoms}</p>
                      </div>
                    )}

                    {apt.notes && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
                        <p className="text-sm text-gray-600">{apt.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
