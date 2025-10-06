"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/layout/protected-route';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader } from '@/components/ui/page-header';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Download, Calendar, TrendingUp, Users, FileText, Filter, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface AnalyticsData {
  totalUsers: number;
  totalAppointments: number;
  completedAppointments: number;
  noShows: number;
  completionRate: number;
  appointmentTrends: Array<{ date: string; appointments: number; completed: number; noShows: number }>;
  appointmentTypes: Array<{ name: string; value: number; color: string }>;
  peakHours: Array<{ hour: string; appointments: number }>;
  growthRate: string;
}

export default function ReportsPage() {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) fetchAnalyticsData();
  }, [user]);

  const fetchAnalyticsData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/analytics?adminId=${user.id}`);
      if (!res.ok) throw new Error('Failed to fetch analytics data');
      const data = await res.json();
      setAnalyticsData(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const generateCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
      alert('No data available to export');
      return;
    }
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportAppointmentData = async () => {
    try {
      const res = await fetch('/api/appointments');
      if (!res.ok) throw new Error('Failed to fetch appointments');
      const appointments = await res.json();
      const data = appointments.map((apt: any) => ({
        id: apt.id,
        patient: apt.patientName || 'Unknown',
        nurse: apt.nurseName || 'Unknown',
        date: apt.date,
        time: apt.time,
        type: apt.type,
        status: apt.status
      }));
      generateCSV(data, 'appointments-report');
    } catch (error) {
      alert('Failed to export appointments data');
    }
  };

  const exportAnalyticsData = () => {
    if (!analyticsData) {
      alert('No analytics data available');
      return;
    }
    const data = analyticsData.appointmentTrends.map(trend => ({
      date: trend.date,
      appointments: trend.appointments,
      completed: trend.completed,
      no_shows: trend.noShows,
      completion_rate: trend.appointments > 0 ? `${((trend.completed / trend.appointments) * 100).toFixed(1)}%` : '0%'
    }));
    generateCSV(data, 'analytics-report');
  };

  const exportUserData = async () => {
    try {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      const users = await res.json();
      const data = users.map((user: any) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department || '',
        phone: user.phone || ''
      }));
      generateCSV(data, 'users-report');
    } catch (error) {
      alert('Failed to export users data');
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requiredRole="administrator">
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-12">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
              <p className="mt-2 text-gray-600">Loading reports data...</p>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !analyticsData) {
    return (
      <ProtectedRoute requiredRole="administrator">
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-12 text-red-600">
              <p className="mb-4">{error || 'Failed to load reports'}</p>
              <Button onClick={fetchAnalyticsData}>Retry</Button>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  const { totalAppointments, completedAppointments, noShows, completionRate, appointmentTrends, appointmentTypes, peakHours, growthRate } = analyticsData;

  const recentDays = appointmentTrends.slice(-7);
  const avgDailyAppointments = recentDays.length > 0 
    ? recentDays.reduce((sum, day) => sum + day.appointments, 0) / recentDays.length 
    : 0;

  return (
    <ProtectedRoute requiredRole="administrator">
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageHeader
            title="Reports & Analytics"
            description="Comprehensive clinic performance reports with real-time data"
          >
            <div className="flex space-x-2">
              <Button variant="outline" onClick={exportAppointmentData}>
                <Download className="mr-2 h-4 w-4" />
                Export Appointments
              </Button>
              <Button variant="outline" onClick={exportAnalyticsData}>
                <Download className="mr-2 h-4 w-4" />
                Export Analytics
              </Button>
              <Button variant="outline" onClick={exportUserData}>
                <Download className="mr-2 h-4 w-4" />
                Export Users
              </Button>
            </div>
          </PageHeader>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Report Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <Button onClick={fetchAnalyticsData}>
                  <Filter className="mr-2 h-4 w-4" />
                  Refresh Data
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAppointments.toLocaleString()}</div>
                <p className="text-xs text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  {growthRate} growth
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{completionRate}%</div>
                <p className="text-xs text-muted-foreground">
                  {completedAppointments} completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">No-Shows</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{noShows.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {totalAppointments > 0 ? ((noShows / totalAppointments) * 100).toFixed(1) : 0}% rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgDailyAppointments.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">appointments per day</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Trends</CardTitle>
                <CardDescription>Last 7 days performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={appointmentTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(value) => format(new Date(value), 'MMM d')} />
                    <YAxis />
                    <Tooltip labelFormatter={(value) => format(new Date(value), 'MMM d')} />
                    <Line type="monotone" dataKey="appointments" stroke="#1e40af" strokeWidth={2} name="Total" />
                    <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} name="Completed" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Appointment Types</CardTitle>
                <CardDescription>Distribution by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={appointmentTypes} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {appointmentTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Recent Data</CardTitle>
              <CardDescription>Detailed appointment trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Total</th>
                      <th className="text-left p-2">Completed</th>
                      <th className="text-left p-2">No-Shows</th>
                      <th className="text-left p-2">Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointmentTrends.map((day, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-2">{format(new Date(day.date), 'MMM d')}</td>
                        <td className="p-2">{day.appointments}</td>
                        <td className="p-2 text-green-600">{day.completed}</td>
                        <td className="p-2 text-red-600">{day.noShows}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            day.appointments > 0 && (day.completed / day.appointments) > 0.8 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {day.appointments > 0 ? ((day.completed / day.appointments) * 100).toFixed(1) : 0}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
}