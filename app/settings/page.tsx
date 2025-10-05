"use client";

import { useState } from 'react';
import { ProtectedRoute } from '@/components/layout/protected-route';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/components/ui/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Clock, 
  Users, 
  Shield, 
  Database, 
  Mail,
  Save,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  
  // General Settings
  const [clinicName, setClinicName] = useState('University Health Center');
  const [clinicAddress, setClinicAddress] = useState('123 University Ave, Campus City, ST 12345');
  const [clinicPhone, setClinicPhone] = useState('+1 (555) 123-4567');
  const [clinicEmail, setClinicEmail] = useState('health@university.edu');
  
  // Appointment Settings
  const [appointmentDuration, setAppointmentDuration] = useState('30');
  const [advanceBookingDays, setAdvanceBookingDays] = useState('30');
  const [workingHoursStart, setWorkingHoursStart] = useState('08:00');
  const [workingHoursEnd, setWorkingHoursEnd] = useState('17:00');
  const [allowWeekendBooking, setAllowWeekendBooking] = useState(false);
  
  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [reminderHours, setReminderHours] = useState('24');
  const [autoConfirmation, setAutoConfirmation] = useState(true);
  
  // Security Settings
  const [sessionTimeout, setSessionTimeout] = useState('60');
  const [passwordExpiry, setPasswordExpiry] = useState('90');
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [auditLogging, setAuditLogging] = useState(true);

  const handleSave = async (section: string) => {
    setIsLoading(true);
    // Mock save operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast.success(`${section} settings saved successfully!`);
  };

  const handleReset = (section: string) => {
    toast.info(`${section} settings reset to defaults`);
  };

  return (
    <ProtectedRoute requiredRole="administrator">
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageHeader
            title="System Settings"
            description="Configure clinic operations, notifications, and security settings"
          />

          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general" className="flex items-center space-x-2">
                <SettingsIcon className="h-4 w-4" />
                <span>General</span>
              </TabsTrigger>
              <TabsTrigger value="appointments" className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Appointments</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Users</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Security</span>
              </TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>
                    Basic clinic information and configuration
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="clinic-name">Clinic Name</Label>
                      <Input
                        id="clinic-name"
                        value={clinicName}
                        onChange={(e) => setClinicName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clinic-phone">Phone Number</Label>
                      <Input
                        id="clinic-phone"
                        value={clinicPhone}
                        onChange={(e) => setClinicPhone(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="clinic-address">Address</Label>
                    <Textarea
                      id="clinic-address"
                      value={clinicAddress}
                      onChange={(e) => setClinicAddress(e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="clinic-email">Contact Email</Label>
                    <Input
                      id="clinic-email"
                      type="email"
                      value={clinicEmail}
                      onChange={(e) => setClinicEmail(e.target.value)}
                    />
                  </div>

                  <div className="flex space-x-4">
                    <Button onClick={() => handleSave('General')} disabled={isLoading}>
                      <Save className="mr-2 h-4 w-4" />
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button variant="outline" onClick={() => handleReset('General')}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reset to Defaults
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appointment Settings */}
            <TabsContent value="appointments">
              <Card>
                <CardHeader>
                  <CardTitle>Appointment Settings</CardTitle>
                  <CardDescription>
                    Configure appointment booking rules and schedules
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="appointment-duration">Default Appointment Duration (minutes)</Label>
                      <Select value={appointmentDuration} onValueChange={setAppointmentDuration}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="advance-booking">Advance Booking Limit (days)</Label>
                      <Select value={advanceBookingDays} onValueChange={setAdvanceBookingDays}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">7 days</SelectItem>
                          <SelectItem value="14">14 days</SelectItem>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="60">60 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="working-hours-start">Working Hours Start</Label>
                      <Input
                        id="working-hours-start"
                        type="time"
                        value={workingHoursStart}
                        onChange={(e) => setWorkingHoursStart(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="working-hours-end">Working Hours End</Label>
                      <Input
                        id="working-hours-end"
                        type="time"
                        value={workingHoursEnd}
                        onChange={(e) => setWorkingHoursEnd(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="weekend-booking"
                      checked={allowWeekendBooking}
                      onCheckedChange={setAllowWeekendBooking}
                    />
                    <Label htmlFor="weekend-booking">Allow weekend appointments</Label>
                  </div>

                  <div className="flex space-x-4">
                    <Button onClick={() => handleSave('Appointment')} disabled={isLoading}>
                      <Save className="mr-2 h-4 w-4" />
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button variant="outline" onClick={() => handleReset('Appointment')}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reset to Defaults
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Configure email, SMS, and reminder settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="email-notifications"
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                      <Label htmlFor="email-notifications">Enable email notifications</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="sms-notifications"
                        checked={smsNotifications}
                        onCheckedChange={setSmsNotifications}
                      />
                      <Label htmlFor="sms-notifications">Enable SMS notifications</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="auto-confirmation"
                        checked={autoConfirmation}
                        onCheckedChange={setAutoConfirmation}
                      />
                      <Label htmlFor="auto-confirmation">Auto-confirm appointments</Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reminder-hours">Reminder Time (hours before appointment)</Label>
                    <Select value={reminderHours} onValueChange={setReminderHours}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hour</SelectItem>
                        <SelectItem value="2">2 hours</SelectItem>
                        <SelectItem value="24">24 hours</SelectItem>
                        <SelectItem value="48">48 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex space-x-4">
                    <Button onClick={() => handleSave('Notification')} disabled={isLoading}>
                      <Save className="mr-2 h-4 w-4" />
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button variant="outline" onClick={() => handleReset('Notification')}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reset to Defaults
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* User Settings */}
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Management Settings</CardTitle>
                  <CardDescription>
                    Configure user registration and role settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="self-registration" defaultChecked={false} />
                      <Label htmlFor="self-registration">Allow self-registration</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="email-verification" defaultChecked={true} />
                      <Label htmlFor="email-verification">Require email verification</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="admin-approval" defaultChecked={true} />
                      <Label htmlFor="admin-approval">Require admin approval for new accounts</Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="default-role">Default Role for New Users</Label>
                    <Select defaultValue="student">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex space-x-4">
                    <Button onClick={() => handleSave('User')} disabled={isLoading}>
                      <Save className="mr-2 h-4 w-4" />
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button variant="outline" onClick={() => handleReset('User')}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reset to Defaults
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Configure authentication and security policies
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                      <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                          <SelectItem value="480">8 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password-expiry">Password Expiry (days)</Label>
                      <Select value={passwordExpiry} onValueChange={setPasswordExpiry}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="60">60 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                          <SelectItem value="180">180 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="two-factor-auth"
                        checked={twoFactorAuth}
                        onCheckedChange={setTwoFactorAuth}
                      />
                      <Label htmlFor="two-factor-auth">Enable two-factor authentication</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="audit-logging"
                        checked={auditLogging}
                        onCheckedChange={setAuditLogging}
                      />
                      <Label htmlFor="audit-logging">Enable audit logging</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="login-attempts" defaultChecked={true} />
                      <Label htmlFor="login-attempts">Limit failed login attempts</Label>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Button onClick={() => handleSave('Security')} disabled={isLoading}>
                      <Save className="mr-2 h-4 w-4" />
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button variant="outline" onClick={() => handleReset('Security')}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reset to Defaults
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* System Information */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>System Information</span>
              </CardTitle>
              <CardDescription>
                Current system status and version information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">Online</div>
                  <p className="text-sm text-gray-600">System Status</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">v2.1.0</div>
                  <p className="text-sm text-gray-600">Current Version</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">99.9%</div>
                  <p className="text-sm text-gray-600">Uptime</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
}