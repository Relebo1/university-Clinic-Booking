"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/layout/protected-route';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader } from '@/components/ui/page-header';
import { Search, Plus, Edit, Trash2, User, Mail, Phone, Shield, Loader2 } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'staff' | 'nurse' | 'administrator';
  studentId?: string;
  department?: string;
  title?: string;
  shift?: 'morning' | 'afternoon' | 'evening';
  year?: string;
  phone?: string;
  license?: string;
  created_at?: string;
  updated_at?: string;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch users from database API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Failed to fetch users from database');
      const data = await res.json();
      console.log('Fetched users from API:', data); // Debug: Check what IDs we're getting
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users from database. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    console.log('Attempting to delete user with ID:', userId); // Debug
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    try {
      setActionLoading(`delete-${userId}`);
      
      const res = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });
      
      console.log('Delete response status:', res.status); // Debug
      
      if (!res.ok) {
        const errorData = await res.json();
        console.log('Delete error data:', errorData); // Debug
        throw new Error(errorData.error || 'Failed to delete user');
      }
      
      // Remove user from local state
      setUsers(users.filter(user => user.id === userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete user');
    } finally {
      setActionLoading(null);
    }
  };

  const updateUserRole = async (userId: string, newRole: User['role']) => {
    console.log('Attempting to update user role:', userId, 'to', newRole); // Debug
    
    try {
      setActionLoading(`role-${userId}`);
      
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });
      
      console.log('Update role response status:', res.status); // Debug
      
      if (!res.ok) {
        const errorData = await res.json();
        console.log('Update role error data:', errorData); // Debug
        throw new Error(errorData.error || 'Failed to update user role');
      }
      
      const updatedUser = await res.json();
      console.log('Updated user response:', updatedUser); // Debug
      
      // Update user in local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, ...updatedUser } : user
      ));
    } catch (error) {
      console.error('Error updating user role:', error);
      setError(error instanceof Error ? error.message : 'Failed to update user role');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.studentId && user.studentId.includes(searchTerm)) ||
                         (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      student: 'bg-blue-100 text-blue-800',
      staff: 'bg-green-100 text-green-800',
      nurse: 'bg-purple-100 text-purple-800',
      administrator: 'bg-red-100 text-red-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'administrator':
        return <Shield className="h-4 w-4" />;
      case 'nurse':
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const userStats = {
    total: users.length,
    students: users.filter(u => u.role === 'student').length,
    staff: users.filter(u => u.role === 'staff').length,
    nurses: users.filter(u => u.role === 'nurse').length,
    administrators: users.filter(u => u.role === 'administrator').length
  };

  if (loading) return (
    <ProtectedRoute requiredRole="administrator">
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
            <p className="mt-2 text-gray-600">Loading users from database...</p>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );

  if (error) return (
    <ProtectedRoute requiredRole="administrator">
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12 text-red-600">
            <p className="mb-4">{error}</p>
            <Button onClick={fetchUsers}>Retry</Button>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );

  return (
    <ProtectedRoute requiredRole="administrator">
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageHeader
            title="User Management"
            description={`Manage system users, roles, and permissions - ${users.length} users found`}
          >
            <Button onClick={() => router.push('/users/create')}>
              <Plus className="mr-2 h-4 w-4" />
              Add New User
            </Button>
          </PageHeader>

          {/* User Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats.total}</div>
                <p className="text-xs text-muted-foreground">registered users</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Students</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{userStats.students}</div>
                <p className="text-xs text-muted-foreground">student accounts</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Staff</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{userStats.staff}</div>
                <p className="text-xs text-muted-foreground">staff members</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Nurses</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{userStats.nurses}</div>
                <p className="text-xs text-muted-foreground">healthcare providers</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Administrators</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{userStats.administrators}</div>
                <p className="text-xs text-muted-foreground">system admins</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Filter Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="student">Students</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="nurse">Nurses</SelectItem>
                    <SelectItem value="administrator">Administrators</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => {
                  setSearchTerm('');
                  setRoleFilter('all');
                }}>
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Users ({filteredUsers.length})</CardTitle>
              <CardDescription>
                Manage user accounts and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                  <p className="text-gray-500">
                    Try adjusting your search terms or filters.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">User</th>
                        <th className="text-left p-4">Role</th>
                        <th className="text-left p-4">Department/Info</th>
                        <th className="text-left p-4">Contact</th>
                        <th className="text-left p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                {getRoleIcon(user.role)}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                                {user.studentId && (
                                  <p className="text-xs text-gray-400">Student ID: {user.studentId}</p>
                                )}
                                <p className="text-xs text-gray-400">Database ID: {user.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-2">
                              <Badge className={getRoleBadgeColor(user.role)}>
                                {user.role}
                              </Badge>
                              <Select 
                                value={user.role} 
                                onValueChange={(value: User['role']) => updateUserRole(user.id, value)}
                                disabled={actionLoading === `role-${user.id}`}
                              >
                                <SelectTrigger className="w-32">
                                  {actionLoading === `role-${user.id}` ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <SelectValue />
                                  )}
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="student">Student</SelectItem>
                                  <SelectItem value="staff">Staff</SelectItem>
                                  <SelectItem value="nurse">Nurse</SelectItem>
                                  <SelectItem value="administrator">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm">
                              {user.department && (
                                <p className="font-medium">{user.department}</p>
                              )}
                              {user.title && (
                                <p className="text-gray-600">{user.title}</p>
                              )}
                              {user.shift && (
                                <p className="text-gray-600">{user.shift} shift</p>
                              )}
                              {user.year && (
                                <p className="text-gray-600">{user.year}</p>
                              )}
                              {user.license && (
                                <p className="text-gray-600">License: {user.license}</p>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm space-y-1">
                              {user.phone && (
                                <div className="flex items-center space-x-1">
                                  <Phone className="h-3 w-3 text-gray-400" />
                                  <span>{user.phone}</span>
                                </div>
                              )}
                              <div className="flex items-center space-x-1">
                                <Mail className="h-3 w-3 text-gray-400" />
                                <span className="truncate">{user.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  console.log('Editing user with ID:', user.id);
                                  router.push(`/users/edit/${user.id}`);
                                }}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-red-600 hover:text-red-700"
                                onClick={() => {
                                  console.log('Deleting user with ID:', user.id);
                                  deleteUser(user.id);
                                }}
                                disabled={actionLoading === `delete-${user.id}`}
                              >
                                {actionLoading === `delete-${user.id}` ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Trash2 className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
}