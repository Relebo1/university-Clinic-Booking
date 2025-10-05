"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/layout/protected-route';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/ui/page-header';
import { Calendar, Clock, User, TriangleAlert as AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';

interface Appointment {
  id: number;
  patientName: string;
  date: string;
  time: string;
  status: string;
  priority: string;
  type: string;
}

export default function SchedulePage() {
  const { user } = useAuth();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Fetch appointments for logged-in nurse
  useEffect(() => {
    if (!user) return;

    async function fetchAppointments() {
      setLoading(true);
      try {
        const res = await fetch(`/api/appointments?userId=${user.id}&role=nurse`);
        if (!res.ok) throw new Error('Failed to fetch appointments');
        const data: Appointment[] = await res.json();
        setAppointments(data);
      } catch (error) {
        console.error(error);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
  }, [user]);

  const weekAppointments = appointments.filter(
    apt => new Date(apt.date) >= weekStart && new Date(apt.date) <= weekEnd
  );

  const getAppointmentsForDay = (date: Date) =>
    weekAppointments
      .filter(apt => isSameDay(new Date(apt.date), date))
      .sort((a, b) => a.time.localeCompare(b.time));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'no-show': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) =>
    priority === 'high' ? 'border-l-4 border-red-500' : 'border-l-4 border-blue-500';

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(direction === 'prev' ? subDays(currentWeek, 7) : addDays(currentWeek, 7));
  };

  if (loading) return <p className="text-center py-8">Loading...</p>;

  // Real stats
  const totalAppointments = weekAppointments.length;
  const confirmedCount = weekAppointments.filter(a => a.status === 'confirmed').length;
  const completedCount = weekAppointments.filter(a => a.status === 'completed').length;
  const highPriorityCount = weekAppointments.filter(a => a.priority === 'high').length;

  return (
    <ProtectedRoute requiredRole="nurse">
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageHeader
            title="Weekly Schedule"
            description={`Your appointment schedule for ${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`}
          >
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => navigateWeek('prev')}><ChevronLeft className="h-4 w-4" /></Button>
              <Button variant="outline" onClick={() => setCurrentWeek(new Date())}>Today</Button>
              <Button variant="outline" onClick={() => navigateWeek('next')}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </PageHeader>

          {/* Week Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex justify-between pb-2">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAppointments}</div>
                <p className="text-xs text-muted-foreground">total appointments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex justify-between pb-2">
                <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{confirmedCount}</div>
                <p className="text-xs text-muted-foreground">upcoming</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex justify-between pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{completedCount}</div>
                <p className="text-xs text-muted-foreground">finished</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex justify-between pb-2">
                <CardTitle className="text-sm font-medium">High Priority</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{highPriorityCount}</div>
                <p className="text-xs text-muted-foreground">urgent cases</p>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Calendar Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
            {weekDays.map(day => {
              const dayAppointments = getAppointmentsForDay(day);
              const isToday = isSameDay(day, new Date());

              return (
                <Card key={day.toISOString()} className={isToday ? 'ring-2 ring-blue-500' : ''}>
                  <CardHeader className="pb-3">
                    <CardTitle className={`text-sm ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                      {format(day, 'EEE')}
                    </CardTitle>
                    <CardDescription className={`text-lg font-semibold ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                      {format(day, 'd')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {dayAppointments.length === 0 ? (
                      <p className="text-xs text-gray-500 text-center py-4">No appointments</p>
                    ) : (
                      dayAppointments.map(a => (
                        <div key={a.id} className={`p-2 rounded-md border text-xs ${getStatusColor(a.status)} ${getPriorityColor(a.priority)}`}>
                          <div className="font-medium">{a.time}</div>
                          <div className="truncate">{a.patientName}</div>
                          <div className="text-xs opacity-75">{a.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                          {a.priority === 'high' && (
                            <Badge className="bg-red-100 text-red-800 text-xs mt-1">
                              <AlertTriangle className="h-2 w-2 mr-1" /> Urgent
                            </Badge>
                          )}
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
