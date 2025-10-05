"use client";

import { useState } from 'react';
import { ProtectedRoute } from '@/components/layout/protected-route';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/ui/page-header';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CircleHelp as HelpCircle, Search, MessageCircle, Phone, Mail, Clock, Calendar, User, Settings, Shield, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: ''
  });

  const faqCategories = [
    {
      title: 'Account & Login',
      icon: User,
      faqs: [
        {
          question: 'How do I reset my password?',
          answer: 'You can reset your password by clicking the "Forgot Password" link on the login page. Enter your email address and follow the instructions sent to your email.'
        },
        {
          question: 'Why can\'t I log in to my account?',
          answer: 'Make sure you\'re using the correct email address and password. Check that your account role matches the one you\'re trying to log in with. If you\'re still having trouble, contact support.'
        },
        {
          question: 'How do I update my profile information?',
          answer: 'Go to your Profile page from the navigation menu. Click "Edit Profile" to update your personal information, contact details, and preferences.'
        }
      ]
    },
    {
      title: 'Appointments',
      icon: Calendar,
      faqs: [
        {
          question: 'How do I book an appointment?',
          answer: 'Click "Book Appointment" from your dashboard or appointments page. Select your preferred date, time, appointment type, and provide details about your visit. Confirm your booking to schedule the appointment.'
        },
        {
          question: 'Can I reschedule my appointment?',
          answer: 'Yes, you can reschedule appointments up to 24 hours before the scheduled time. Go to your appointments page, find the appointment, and click "Reschedule" to select a new time.'
        },
        {
          question: 'How far in advance can I book appointments?',
          answer: 'You can book appointments up to 30 days in advance. Same-day appointments may be available based on nurse availability.'
        },
        {
          question: 'What should I do if I need to cancel my appointment?',
          answer: 'You can cancel appointments through your appointments page. Please cancel at least 2 hours before your scheduled time to allow others to book that slot.'
        }
      ]
    },
    {
      title: 'Notifications',
      icon: MessageCircle,
      faqs: [
        {
          question: 'How do I manage my notification preferences?',
          answer: 'Go to your Profile page and click on the "Notifications" tab. You can enable or disable email, SMS, and push notifications for different types of updates.'
        },
        {
          question: 'When will I receive appointment reminders?',
          answer: 'You\'ll receive appointment reminders 24 hours before your scheduled appointment via your preferred notification methods (email, SMS, or in-app).'
        },
        {
          question: 'Why am I not receiving notifications?',
          answer: 'Check your notification preferences in your profile settings. Make sure your email address and phone number are correct and up to date.'
        }
      ]
    },
    {
      title: 'Technical Issues',
      icon: Settings,
      faqs: [
        {
          question: 'The website is loading slowly. What should I do?',
          answer: 'Try refreshing the page or clearing your browser cache. If the problem persists, try using a different browser or check your internet connection.'
        },
        {
          question: 'I\'m getting an error message. How do I fix it?',
          answer: 'Note down the exact error message and try refreshing the page. If the error continues, contact our technical support team with the error details.'
        },
        {
          question: 'Is the system compatible with mobile devices?',
          answer: 'Yes, the University Clinic system is fully responsive and works on all modern mobile devices and tablets. You can access all features through your mobile browser.'
        }
      ]
    }
  ];

  const contactOptions = [
    {
      title: 'Phone Support',
      description: 'Call us for immediate assistance',
      contact: '+1 (555) 123-4567',
      hours: 'Mon-Fri: 8:00 AM - 5:00 PM',
      icon: Phone
    },
    {
      title: 'Email Support',
      description: 'Send us an email for detailed inquiries',
      contact: 'support@university.edu',
      hours: 'Response within 24 hours',
      icon: Mail
    },
    {
      title: 'Emergency Line',
      description: 'For medical emergencies only',
      contact: '+1 (555) 911-HELP',
      hours: '24/7 Emergency Support',
      icon: Shield
    }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Your message has been sent! We\'ll get back to you soon.');
    setContactForm({ subject: '', message: '' });
  };

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageHeader
            title="Help & Support"
            description="Find answers to common questions and get the help you need"
          />

          {/* Search */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search for help topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* FAQ Section */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HelpCircle className="mr-2 h-5 w-5" />
                    Frequently Asked Questions
                  </CardTitle>
                  <CardDescription>
                    Find quick answers to the most common questions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredFAQs.length === 0 ? (
                    <div className="text-center py-8">
                      <HelpCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                      <p className="text-gray-500">
                        Try adjusting your search terms or browse the categories below.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {filteredFAQs.map((category, categoryIndex) => (
                        <div key={categoryIndex}>
                          <div className="flex items-center space-x-2 mb-4">
                            <category.icon className="h-5 w-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                            <Badge variant="outline">{category.faqs.length}</Badge>
                          </div>
                          <Accordion type="single" collapsible className="space-y-2">
                            {category.faqs.map((faq, faqIndex) => (
                              <AccordionItem
                                key={faqIndex}
                                value={`${categoryIndex}-${faqIndex}`}
                                className="border rounded-lg px-4"
                              >
                                <AccordionTrigger className="text-left">
                                  {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600">
                                  {faq.answer}
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Contact & Support */}
            <div className="space-y-6">
              {/* Contact Options */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Support</CardTitle>
                  <CardDescription>
                    Get in touch with our support team
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contactOptions.map((option, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start space-x-3">
                        <option.icon className="h-5 w-5 text-blue-600 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{option.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                          <p className="text-sm font-medium text-blue-600">{option.contact}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <p className="text-xs text-gray-500">{option.hours}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                  <CardDescription>
                    Can't find what you're looking for? Send us a message
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        Subject
                      </label>
                      <Input
                        id="subject"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                        placeholder="Brief description of your issue"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        value={contactForm.message}
                        onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                        placeholder="Describe your issue in detail..."
                        rows={4}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    User Guide
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    System Status
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Shield className="mr-2 h-4 w-4" />
                    Privacy Policy
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}