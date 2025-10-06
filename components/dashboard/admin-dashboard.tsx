"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
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
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  TriangleAlert as AlertTriangle, 
  Download, 
  Settings, 
  Clock, 
  CircleCheck as CheckCircle, 
  Loader2,
  User,
  Shield
} from 'lucide-react';
import { format } from 'date-fns';

// Default data structures to prevent undefined errors
const defaultAnalyticsData = {
  totalUsers: 0,
  totalAppointments: 0,
  completedAppointments: 0,
  noShows: 0,
  completionRate: 0,
  studentCount: 0,
  staffCount: 0,
  nurseCount: 0,
  adminCount: 0,
  growthRate: '+0%',
  appointmentTrends: [],
  appointmentTypes: [],
  peakHours: [],
  recentAppointments: [],
  systemMetrics: {
    uptime: '99.9%',
    responseTime: '0.8s',
    activeUsers: '0',
    databaseSize: '0GB'
  }
};

export function AdminDashboard() {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState(defaultAnalyticsData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    async function fetchAnalyticsData() {
      try {
        const res = await fetch(`/api/analytics?adminId=${user.id}`);
        if (!res.ok) throw new Error('Failed to fetch analytics data');
        const data = await res.json();
        
        // Merge with default data to ensure all properties exist
        setAnalyticsData({
          ...defaultAnalyticsData,
          ...data,
          systemMetrics: {
            ...defaultAnalyticsData.systemMetrics,
            ...(data.systemMetrics || {})
          }
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setError(error instanceof Error ? error.message : 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    }

    fetchAnalyticsData();

    // Refresh data every 30 seconds
    const interval = setInterval(fetchAnalyticsData, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const refreshData = () => {
    setLoading(true);
    setError(null);
    fetchAnalyticsData();
  };

  async function fetchAnalyticsData() {
    try {
      const res = await fetch(`/api/analytics?adminId=${user?.id}`);
      if (!res.ok) throw new Error('Failed to fetch analytics data');
      const data = await res.json();
      
      setAnalyticsData({
        ...defaultAnalyticsData,
        ...data,
        systemMetrics: {
          ...defaultAnalyticsData.systemMetrics,
          ...(data.systemMetrics || {})
        }
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError(error instanceof Error ? error.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }

  // Show loading state
  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
        <p className="mt-4 text-lg font-medium text-gray-900">Loading dashboard data...</p>
        <p className="mt-2 text-gray-600">Fetching real-time analytics from database</p>
      </div>
    </div>
  );

  // Show error state
  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md">
        <AlertTriangle className="mx-auto h-16 w-16 text-red-500 mb-4" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">Failed to load dashboard</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button onClick={refreshData} size="lg">
          <Loader2 className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    </div>
  );

  // Use safe data access with fallbacks
  const { 
    totalUsers, 
    totalAppointments, 
    completedAppointments, 
    noShows, 
    completionRate,
    appointmentTrends,
    appointmentTypes,
    peakHours,
    recentAppointments,
    systemMetrics,
    studentCount,
    staffCount,
    nurseCount,
    adminCount,
    growthRate
  } = analyticsData;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader
          title="Admin Dashboard"
          description="Real-time system overview and analytics from live database"
        >
          <div className="flex space-x-2">
            <Button variant="outline" onClick={refreshData} disabled={loading}>
              <Loader2 className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white shadow-sm border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{totalUsers.toLocaleString()}</div>
              <div className="flex space-x-3 mt-3">
                <div className="text-xs">
                  <div className="text-blue-600 font-medium">{studentCount}</div>
                  <div className="text-gray-500">Students</div>
                </div>
                <div className="text-xs">
                  <div className="text-green-600 font-medium">{staffCount}</div>
                  <div className="text-gray-500">Staff</div>
                </div>
                <div className="text-xs">
                  <div className="text-purple-600 font-medium">{nurseCount}</div>
                  <div className="text-gray-500">Nurses</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Appointments</CardTitle>
              <Calendar className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{totalAppointments.toLocaleString()}</div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">{growthRate}</span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completion Rate</CardTitle>
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">{completionRate}%</div>
              <p className="text-sm text-gray-500 mt-1">
                {completedAppointments.toLocaleString()} of {totalAppointments.toLocaleString()} completed
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">No-Shows</CardTitle>
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{noShows.toLocaleString()}</div>
              <p className="text-sm text-gray-500 mt-1">
                {totalAppointments > 0 ? ((noShows / totalAppointments) * 100).toFixed(1) : 0}% of total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Role Distribution */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Students</CardTitle>
              <User className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800">{studentCount}</div>
              <p className="text-xs text-blue-600">registered students</p>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Staff</CardTitle>
              <User className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800">{staffCount}</div>
              <p className="text-xs text-green-600">staff members</p>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-800">Nurses</CardTitle>
              <User className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-800">{nurseCount}</div>
              <p className="text-xs text-purple-600">healthcare providers</p>
            </CardContent>
          </Card>

          <Card className="bg-red-50 border-red-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-800">Admins</CardTitle>
              <Shield className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-800">{adminCount}</div>
              <p className="text-xs text-red-600">administrators</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Appointment Trends */}
          <Card className="bg-white shadow-sm border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                Weekly Appointment Trends
              </CardTitle>
              <CardDescription>
                Appointments, completions, and no-shows over the past week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={appointmentTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => format(new Date(value), 'MMM d')}
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    labelFormatter={(value) => format(new Date(value), 'EEEE, MMM d')}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="appointments" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    name="Appointments"
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="completed" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    name="Completed"
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="noShows" 
                    stroke="#ef4444" 
                    strokeWidth={3}
                    name="No-Shows"
                    dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Appointment Types */}
          <Card className="bg-white shadow-sm border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                Appointment Types
              </CardTitle>
              <CardDescription>
                Distribution of appointment types this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={appointmentTypes}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {appointmentTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} appointments`, 'Count']}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Peak Hours */}
          <Card className="bg-white shadow-sm border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-orange-600" />
                Peak Hours Analysis
              </CardTitle>
              <CardDescription>
                Busiest times of day for appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={peakHours}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="hour" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                  />
                  <Bar 
                    dataKey="appointments" 
                    fill="#f59e0b" 
                    radius={[4, 4, 0, 0]}
                    name="Appointments"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white shadow-sm border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2 text-green-600" />
                Recent System Activity
              </CardTitle>
              <CardDescription>
                Latest appointments and user activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(!recentAppointments || recentAppointments.length === 0) ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <p>No recent activity</p>
                </div>
              ) : (
                recentAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        appointment.status === 'completed' ? 'bg-green-500' :
                        appointment.status === 'confirmed' ? 'bg-blue-500' :
                        'bg-red-500'
                      }`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{appointment.patientName}</p>
                        <p className="text-xs text-gray-500">
                          {appointment.type?.replace('-', ' ')?.replace(/\b\w/g, l => l.toUpperCase())} • {appointment.nurseName}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={
                        appointment.status === 'confirmed' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        appointment.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
                        'bg-red-100 text-red-800 border-red-200'
                      }>
                        {appointment.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {appointment.date ? format(new Date(appointment.date), 'MMM d, yyyy') : 'Unknown date'} at {appointment.time}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* System Health */}
        <Card className="bg-white shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2 text-gray-600" />
              System Health & Performance
            </CardTitle>
            <CardDescription>
              Key system metrics and performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-700">{systemMetrics.uptime}</div>
                <p className="text-sm text-green-600 font-medium">System Uptime</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-700">{systemMetrics.responseTime}</div>
                <p className="text-sm text-blue-600 font-medium">Avg Response Time</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-2xl font-bold text-purple-700">{systemMetrics.activeUsers}</div>
                <p className="text-sm text-purple-600 font-medium">Daily Active Users</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="text-2xl font-bold text-orange-700">{systemMetrics.databaseSize}</div>
                <p className="text-sm text-orange-600 font-medium">Database Size</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Add the missing Activity icon import
function Activity(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}