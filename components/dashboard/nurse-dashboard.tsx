"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/ui/page-header';
import { Calendar, Clock, Users, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

export function NurseDashboard() {
  const { user } = useAuth();
  const [todayAppointments, setTodayAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchAppointments() {
      try {
        const today = format(new Date(), 'yyyy-MM-dd');
        const res = await fetch(`/api/appointments?nurseId=${user.id}&date=${today}`);
        if (!res.ok) throw new Error('Failed to fetch appointments');
        const data = await res.json();
        setTodayAppointments(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
  }, [user]);

  const upcomingToday = todayAppointments.filter(apt => apt.status === 'confirmed');
  const completedToday = todayAppointments.filter(apt => apt.status === 'completed');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'no-show': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) return <div className="text-center py-12">Loading appointments...</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Hello, ${user?.name}!`}
        description={`Today's schedule - ${format(new Date(), 'EEEE, MMMM d, yyyy')}`}
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Total</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAppointments.length}</div>
            <p className="text-xs text-muted-foreground">appointments scheduled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{upcomingToday.length}</div>
            <p className="text-xs text-muted-foreground">upcoming today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedToday.length}</div>
            <p className="text-xs text-muted-foreground">finished today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {todayAppointments.filter(apt => apt.priority === 'high').length}
            </div>
            <p className="text-xs text-muted-foreground">urgent cases</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Your appointments for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {todayAppointments.length === 0 ? (
              <div className="text-center py-6">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments today</h3>
                <p className="mt-1 text-sm text-gray-500">Enjoy your lighter schedule!</p>
              </div>
            ) : (
              todayAppointments
                .sort((a, b) => a.time.localeCompare(b.time))
                .map(appointment => (
                  <div
                    key={appointment.id}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      appointment.status === 'completed' ? 'bg-gray-50 opacity-75' : 'bg-white hover:bg-gray-50'
                    } ${getPriorityColor(appointment.priority).includes('red') ? 'border-red-200' : 'border-gray-200'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">{appointment.time}</span>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                        {appointment.priority === 'high' && (
                          <Badge className="bg-red-100 text-red-800">
                            <AlertTriangle className="h-3 w-3 mr-1" /> High Priority
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{appointment.patientName}</p>
                      <p className="text-sm text-gray-600">
                        {appointment.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                      <p className="text-sm text-gray-500">{appointment.symptoms}</p>
                    </div>
                    {appointment.status === 'confirmed' && (
                      <div className="mt-3 flex space-x-2">
                        <Button size="sm" variant="outline">Check In</Button>
                        <Button size="sm" variant="outline">Reschedule</Button>
                      </div>
                    )}
                  </div>
                ))
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <Button className="justify-start" variant="outline"><Users className="mr-2 h-4 w-4" /> View All Patients</Button>
              <Button className="justify-start" variant="outline"><Calendar className="mr-2 h-4 w-4" /> Schedule Emergency Slot</Button>
              <Button className="justify-start" variant="outline"><Clock className="mr-2 h-4 w-4" /> View Weekly Schedule</Button>
              <Button className="justify-start" variant="outline"><AlertTriangle className="mr-2 h-4 w-4" /> Report Issue</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Patient Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Patient Notes</CardTitle>
          <CardDescription>Latest updates and observations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {completedToday.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No completed appointments yet today</div>
            ) : (
              completedToday.map(appointment => (
                <div key={appointment.id} className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-green-900">{appointment.patientName}</h4>
                    <span className="text-sm text-green-600">{appointment.time}</span>
                  </div>
                  <p className="text-sm text-green-800">{appointment.notes}</p>
                  <div className="mt-2">
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      {appointment.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
