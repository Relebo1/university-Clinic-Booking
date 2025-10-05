"use client";

import { ANALYTICS_DATA, APPOINTMENTS, USERS } from '@/lib/dummy-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Users, Calendar, TrendingUp, TriangleAlert as AlertTriangle, Download, Settings, Clock, CircleCheck as CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

export function AdminDashboard() {
  const totalUsers = USERS.length;
  const totalAppointments = APPOINTMENTS.length;
  const completedAppointments = APPOINTMENTS.filter(apt => apt.status === 'completed').length;
  const noShows = APPOINTMENTS.filter(apt => apt.status === 'no-show').length;
  const completionRate = ((completedAppointments / totalAppointments) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Overview"
        description="University Clinic administration dashboard and analytics"
      >
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button>
            <Settings className="mr-2 h-4 w-4" />
            System Settings
          </Button>
        </div>
      </PageHeader>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <div className="flex space-x-4 mt-2">
              <span className="text-xs text-muted-foreground">
                {USERS.filter(u => u.role === 'student').length} Students
              </span>
              <span className="text-xs text-muted-foreground">
                {USERS.filter(u => u.role === 'staff').length} Staff
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAppointments}</div>
            <p className="text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completionRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {completedAppointments} of {totalAppointments} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">No-Shows</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{noShows}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((noShows / totalAppointments) * 100).toFixed(1)}% of total appointments
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointment Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Appointment Trends</CardTitle>
            <CardDescription>
              Appointments, completions, and no-shows over the past week
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
                  name="Appointments"
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

        {/* Appointment Types */}
        <Card>
          <CardHeader>
            <CardTitle>Appointment Types Distribution</CardTitle>
            <CardDescription>
              Breakdown of appointment types this month
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
        {/* Peak Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Peak Hours Analysis</CardTitle>
            <CardDescription>
              Busiest times of day for appointments
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

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent System Activity</CardTitle>
            <CardDescription>
              Latest appointments and user activities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {APPOINTMENTS.slice(0, 5).map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">{appointment.patientName}</p>
                    <p className="text-xs text-gray-500">
                      {appointment.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} - {appointment.nurseName}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={
                    appointment.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                    appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }>
                    {appointment.status}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    {format(new Date(appointment.date), 'MMM d')}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle>System Health & Performance</CardTitle>
          <CardDescription>
            Key system metrics and performance indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">99.9%</div>
              <p className="text-sm text-gray-600">System Uptime</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">0.8s</div>
              <p className="text-sm text-gray-600">Avg Response Time</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">1.2k</div>
              <p className="text-sm text-gray-600">Daily Active Users</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">15GB</div>
              <p className="text-sm text-gray-600">Database Size</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}