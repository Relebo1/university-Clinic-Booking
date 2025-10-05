"use client";

import { useState } from 'react';
import { ProtectedRoute } from '@/components/layout/protected-route';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader } from '@/components/ui/page-header';
import { ANALYTICS_DATA, APPOINTMENTS } from '@/lib/dummy-data';
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
import { Download, Calendar, TrendingUp, Users, FileText, Filter } from 'lucide-react';
import { format, subDays, subMonths } from 'date-fns';

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('7days');
  const [reportType, setReportType] = useState('overview');

  const generateCSV = (data: any[], filename: string) => {
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

  const exportAppointmentData = () => {
    const data = APPOINTMENTS.map(apt => ({
      id: apt.id,
      patient: apt.patientName,
      nurse: apt.nurseName,
      date: apt.date,
      time: apt.time,
      type: apt.type,
      status: apt.status,
      priority: apt.priority
    }));
    generateCSV(data, 'appointments-report');
  };

  const exportAnalyticsData = () => {
    generateCSV(ANALYTICS_DATA.appointmentTrends, 'analytics-report');
  };

  const getDateRangeText = () => {
    switch (dateRange) {
      case '7days':
        return 'Last 7 Days';
      case '30days':
        return 'Last 30 Days';
      case '3months':
        return 'Last 3 Months';
      case '1year':
        return 'Last Year';
      default:
        return 'Last 7 Days';
    }
  };

  const totalAppointments = APPOINTMENTS.length;
  const completedAppointments = APPOINTMENTS.filter(apt => apt.status === 'completed').length;
  const noShows = APPOINTMENTS.filter(apt => apt.status === 'no-show').length;
  const completionRate = ((completedAppointments / totalAppointments) * 100).toFixed(1);

  return (
    <ProtectedRoute requiredRole="administrator">
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageHeader
            title="Reports & Analytics"
            description="Comprehensive clinic performance reports and data insights"
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
            </div>
          </PageHeader>

          {/* Report Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Report Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Date Range</label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">Last 7 Days</SelectItem>
                      <SelectItem value="30days">Last 30 Days</SelectItem>
                      <SelectItem value="3months">Last 3 Months</SelectItem>
                      <SelectItem value="1year">Last Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Report Type</label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="overview">Overview</SelectItem>
                      <SelectItem value="appointments">Appointments</SelectItem>
                      <SelectItem value="patients">Patients</SelectItem>
                      <SelectItem value="staff">Staff Performance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button className="w-full">
                    <Filter className="mr-2 h-4 w-4" />
                    Apply Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAppointments}</div>
                <p className="text-xs text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +12% from last period
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
                  {completedAppointments} of {totalAppointments} completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">No-Show Rate</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {((noShows / totalAppointments) * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {noShows} no-shows
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Daily Appointments</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(totalAppointments / 7).toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground">
                  per day this week
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Appointment Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Appointment Trends - {getDateRangeText()}</CardTitle>
                <CardDescription>
                  Daily appointment volume and completion rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={ANALYTICS_DATA.appointmentTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => format(new Date(value), 'MMM d')}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => format(new Date(value), 'EEEE, MMM d')}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="appointments" 
                      stroke="#1e40af" 
                      strokeWidth={2}
                      name="Total Appointments"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="completed" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      name="Completed"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="noShows" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      name="No-Shows"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Appointment Types Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Appointment Types Distribution</CardTitle>
                <CardDescription>
                  Breakdown of appointment categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={ANALYTICS_DATA.appointmentTypes}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {ANALYTICS_DATA.appointmentTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Peak Hours Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Peak Hours Analysis</CardTitle>
                <CardDescription>
                  Busiest appointment times throughout the day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ANALYTICS_DATA.peakHours}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="appointments" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  Key performance indicators for the clinic
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Patient Satisfaction</span>
                    <span className="text-sm font-bold text-green-600">4.8/5.0</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '96%' }}></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">On-Time Performance</span>
                    <span className="text-sm font-bold text-blue-600">87%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Resource Utilization</span>
                    <span className="text-sm font-bold text-purple-600">73%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '73%' }}></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Staff Efficiency</span>
                    <span className="text-sm font-bold text-orange-600">91%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: '91%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Reports Table */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Detailed Report Data</CardTitle>
              <CardDescription>
                Comprehensive data table for {getDateRangeText().toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Total Appointments</th>
                      <th className="text-left p-2">Completed</th>
                      <th className="text-left p-2">No-Shows</th>
                      <th className="text-left p-2">Completion Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ANALYTICS_DATA.appointmentTrends.map((day, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-2">{format(new Date(day.date), 'MMM d, yyyy')}</td>
                        <td className="p-2">{day.appointments}</td>
                        <td className="p-2 text-green-600">{day.completed}</td>
                        <td className="p-2 text-red-600">{day.noShows}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            (day.completed / day.appointments) > 0.8 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {((day.completed / day.appointments) * 100).toFixed(1)}%
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