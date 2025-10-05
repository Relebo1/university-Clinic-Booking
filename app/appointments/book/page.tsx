"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/layout/protected-route';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/ui/page-header';
import { CalendarDays, Clock, FileText, CircleCheck as CheckCircle, ArrowLeft } from 'lucide-react';
import { format, addDays, isAfter, isBefore, startOfDay } from 'date-fns';
import Link from 'next/link';
import { toast } from 'sonner';

const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30",
  "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30"
];

export default function BookAppointmentPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedNurse, setSelectedNurse] = useState('auto'); // default "auto"
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [nurses, setNurses] = useState<{id: string, name: string, shift: string}[]>([]);
  const [appointmentTypes, setAppointmentTypes] = useState<{value: string, label: string, duration: number}[]>([]);

  const tomorrow = addDays(new Date(), 1);
  const maxDate = addDays(new Date(), 30);

  const isDateDisabled = (date: Date) => {
    return isBefore(date, tomorrow) || isAfter(date, maxDate);
  };

  // Fetch nurses and appointment types from API
useEffect(() => {
  const fetchData = async () => {
    try {
      // Fetch nurses from database
      const nursesRes = await fetch('/api/nurses'); // updated API route
      if (!nursesRes.ok) throw new Error('Failed to fetch nurses');
      const nursesData = await nursesRes.json();
      setNurses(nursesData);

      // Fetch appointment types
      const typesRes = await fetch('/api/appointment-types');
      if (!typesRes.ok) throw new Error('Failed to fetch appointment types');
      const typesData = await typesRes.json();
      setAppointmentTypes(typesData);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load data');
    }
  };

  fetchData();
}, []);


  const handleSubmit = async () => {
    if (!user) return;

    setIsSubmitting(true);

    const payload = {
      patientId: user.studentId || user.id,
      patientName: user.name,
      patientEmail: user.email,
      nurseId: selectedNurse === 'auto' ? null : selectedNurse,
      nurseName: selectedNurse === 'auto' ? null : nurses.find(n => n.id === selectedNurse)?.name,
      date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
      time: selectedTime,
      endTime: selectedTime ? format(new Date(`1970-01-01T${selectedTime}`.concat(':00').concat('')), 'HH:mm') : '',
      status: 'confirmed',
      type: selectedType,
      notes,
      symptoms,
      priority: 'normal'
    };

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || 'Failed to book appointment');
        setIsSubmitting(false);
        return;
      }

      toast.success('Appointment booked successfully!');
      router.push('/appointments');
    } catch (error) {
      toast.error('An error occurred while booking');
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center space-x-4 mb-8">
      {[1, 2, 3, 4].map((stepNum) => (
        <div key={stepNum} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            stepNum <= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            {stepNum < step ? <CheckCircle className="h-4 w-4" /> : stepNum}
          </div>
          {stepNum < 4 && (
            <div className={`w-8 h-px mx-2 ${stepNum < step ? 'bg-blue-600' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <ProtectedRoute requiredRole={['student', 'staff']}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link href="/dashboard">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <PageHeader
              title="Book New Appointment"
              description="Schedule your visit to the University Health Center"
            />
          </div>

          {renderStepIndicator()}

          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Appointment Type & Symptoms
                </CardTitle>
                <CardDescription>
                  Tell us about your visit and what you'd like to discuss
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="appointment-type">Appointment Type</Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select appointment type" />
                    </SelectTrigger>
                    <SelectContent>
                      {appointmentTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex justify-between items-center w-full">
                            <span>{type.label}</span>
                            <Badge variant="outline">{type.duration} min</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="symptoms">Symptoms or Concerns</Label>
                  <Textarea
                    id="symptoms"
                    placeholder="Describe your symptoms or the reason for your visit..."
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional information you'd like to share..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={() => setStep(2)} 
                  disabled={!selectedType || !symptoms}
                  className="w-full"
                >
                  Continue to Date Selection
                </Button>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarDays className="mr-2 h-5 w-5" />
                  Select Date
                </CardTitle>
                <CardDescription>
                  Choose your preferred appointment date (available up to 30 days in advance)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={isDateDisabled}
                    className="rounded-md border"
                  />
                </div>
                
                {selectedDate && (
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-blue-800 font-medium">
                      Selected: {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                    </p>
                  </div>
                )}

                <div className="flex space-x-4">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button 
                    onClick={() => setStep(3)} 
                    disabled={!selectedDate}
                    className="flex-1"
                  >
                    Continue to Time Selection
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Select Time & Nurse
                </CardTitle>
                <CardDescription>
                  Choose your preferred time slot and healthcare provider
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Available Time Slots</Label>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                    {TIME_SLOTS.map(time => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTime(time)}
                        className="w-full"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Preferred Nurse</Label>
                  <Select value={selectedNurse} onValueChange={setSelectedNurse}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a nurse or leave blank for automatic assignment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">No preference (Automatic assignment)</SelectItem>
                      {nurses.map(nurse => (
                        <SelectItem key={nurse.id} value={nurse.id}>
                          {nurse.name} <Badge variant="outline">{nurse.shift}</Badge>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex space-x-4">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button 
                    onClick={() => setStep(4)} 
                    disabled={!selectedTime}
                    className="flex-1"
                  >
                    Review & Confirm
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Review & Confirm
                </CardTitle>
                <CardDescription>
                  Please review your appointment details before confirming
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900">Patient Information</h4>
                      <p className="text-gray-600">{user?.name}</p>
                      <p className="text-gray-600">{user?.email}</p>
                      {user?.studentId && (
                        <p className="text-gray-600">ID: {user.studentId}</p>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Appointment Details</h4>
                      <p className="text-gray-600">
                        {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
                      </p>
                      <p className="text-gray-600">{selectedTime}</p>
                      <p className="text-gray-600">
                        {appointmentTypes.find(t => t.value === selectedType)?.label}
                      </p>
                    </div>
                  </div>

                  {selectedNurse !== 'auto' && (
                    <div>
                      <h4 className="font-medium text-gray-900">Assigned Nurse</h4>
                      <p className="text-gray-600">
                        {nurses.find(n => n.id === selectedNurse)?.name}
                      </p>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium text-gray-900">Symptoms/Concerns</h4>
                    <p className="text-gray-600">{symptoms}</p>
                  </div>

                  {notes && (
                    <div>
                      <h4 className="font-medium text-gray-900">Additional Notes</h4>
                      <p className="text-gray-600">{notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-4">
                  <Button variant="outline" onClick={() => setStep(3)}>
                    Back
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? 'Booking...' : 'Confirm Appointment'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
