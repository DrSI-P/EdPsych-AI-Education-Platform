'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/loading';
import { Alert } from '@/components/ui/alert';
import { useToast } from '@/components/ui/toast';

interface AdminDashboardProps {
  className?: string;
}

export function AdminDashboard({
  className = ''
}: AdminDashboardProps): React.ReactNode {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  
  // Mock data for demonstration
  const [adminData, setAdminData] = useState({
    name: 'Admin User',
    role: 'System Administrator',
    organisation: 'EdPsych Connect',
    users: [
      {
        id: '1',
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@example.com',
        role: 'Educational Psychologist',
        status: 'active',
        lastLogin: '2025-05-15 14:32',
        dateCreated: '2025-01-10'
      },
      {
        id: '2',
        name: 'James Wilson',
        email: 'james.wilson@example.com',
        role: 'Teacher',
        status: 'active',
        lastLogin: '2025-05-14 09:15',
        dateCreated: '2025-02-05'
      },
      {
        id: '3',
        name: 'Emma Thompson',
        email: 'emma.thompson@example.com',
        role: 'Student',
        status: 'active',
        lastLogin: '2025-05-15 16:45',
        dateCreated: '2025-02-10'
      },
      {
        id: '4',
        name: 'Michael Brown',
        email: 'michael.brown@example.com',
        role: 'Parent',
        status: 'inactive',
        lastLogin: '2025-04-28 11:20',
        dateCreated: '2025-02-15'
      },
      {
        id: '5',
        name: 'Olivia Davis',
        email: 'olivia.davis@example.com',
        role: 'School Administrator',
        status: 'pending',
        lastLogin: 'Never',
        dateCreated: '2025-05-14'
      }
    ],
    schools: [
      {
        id: '1',
        name: 'Oakwood Secondary School',
        type: 'Secondary',
        location: 'London',
        usersCount: 245,
        status: 'active',
        dateAdded: '2025-01-05'
      },
      {
        id: '2',
        name: 'Oakwood Primary School',
        type: 'Primary',
        location: 'London',
        usersCount: 180,
        status: 'active',
        dateAdded: '2025-01-05'
      },
      {
        id: '3',
        name: 'Riverside Academy',
        type: 'Secondary',
        location: 'Manchester',
        usersCount: 320,
        status: 'active',
        dateAdded: '2025-02-12'
      },
      {
        id: '4',
        name: 'Meadow Lane Primary',
        type: 'Primary',
        location: 'Birmingham',
        usersCount: 150,
        status: 'active',
        dateAdded: '2025-03-08'
      },
      {
        id: '5',
        name: 'Hillside School',
        type: 'Special Education',
        location: 'Leeds',
        usersCount: 85,
        status: 'pending',
        dateAdded: '2025-05-10'
      }
    ],
    systemStats: {
      totalUsers: 980,
      activeUsers: 845,
      totalSchools: 12,
      totalResources: 1250,
      totalAssessments: 3450,
      storageUsed: '1.2 TB',
      apiCalls: {
        daily: 12500,
        monthly: 320000
      },
      aiUsage: {
        completions: 8500,
        embeddings: 15000,
        images: 2200
      }
    },
    recentActivity: [
      {
        id: '1',
        type: 'user',
        action: 'created',
        details: 'New user account created: Olivia Davis (School Administrator)',
        timestamp: '2025-05-14 15:30',
        actor: 'System'
      },
      {
        id: '2',
        type: 'school',
        action: 'added',
        details: 'New school added: Hillside School (Special Education)',
        timestamp: '2025-05-10 11:15',
        actor: 'Admin User'
      },
      {
        id: '3',
        type: 'system',
        action: 'updated',
        details: 'System update deployed: v2.5.0 (AI Service Enhancements)',
        timestamp: '2025-05-08 03:00',
        actor: 'System'
      },
      {
        id: '4',
        type: 'resource',
        action: 'added',
        details: 'New resource library added: Special Educational Needs Resources',
        timestamp: '2025-05-05 14:20',
        actor: 'Admin User'
      }
    ],
    alerts: [
      {
        id: '1',
        type: 'warning',
        message: 'Storage usage approaching 80% of allocated capacity',
        timestamp: '2025-05-15 08:30'
      },
      {
        id: '2',
        type: 'info',
        message: 'Scheduled maintenance planned for 2025-05-20 02:00-04:00 UTC',
        timestamp: '2025-05-14 10:00'
      },
      {
        id: '3',
        type: 'error',
        message: 'API rate limit exceeded for OpenAI service on 2025-05-13',
        timestamp: '2025-05-13 16:45'
      }
    ]
  });
  
  // Fetch data on component mount
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  
  // Handle user status change
  const handleUserStatusChange = (userId: string, newStatus: string): void => {
    setAdminData(prev => ({
      ...prev,
      users: prev.users.map(user => 
        user.id === userId 
          ? { ...user, status: newStatus } 
          : user
      )
    }));
    
    showToast({
      title: `User status updated to ${newStatus}`,
      type: 'success'
    });
  };
  
  // Handle school status change
  const handleSchoolStatusChange = (schoolId: string, newStatus: string): void => {
    setAdminData(prev => ({
      ...prev,
      schools: prev.schools.map(school => 
        school.id === schoolId 
          ? { ...school, status: newStatus } 
          : school
      )
    }));
    
    showToast({
      title: `School status updated to ${newStatus}`,
      type: 'success'
    });
  };
  
  // Handle alert dismissal
  const handleDismissAlert = (alertId: string): void => {
    setAdminData(prev => ({
      ...prev,
      alerts: prev.alerts.filter(alert => alert.id !== alertId)
    }));
  };
  
  // Define the tabs
  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      content: (
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-centre py-8">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              <div className="flex justify-between items-centre">
                <div>
                  <h2 className="text-xl font-semibold">Admin Dashboard</h2>
                  <p className="text-sm text-grey-600">{adminData.role} • {adminData.organisation}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">System Status</p>
                  <p className="text-sm text-green-600">Operational</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {adminData.alerts.length > 0 && (
                  <div className="space-y-2">
                    {adminData.alerts.map(alert => (
                      <Alert 
                        key={alert.id} 
                        variant={alert.type as 'info' | 'warning' | 'error'}
                        dismissible
                        onDismiss={() => handleDismissAlert(alert.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{alert.message}</p>
                            <p className="text-sm text-grey-600">{alert.timestamp}</p>
                          </div>
                        </div>
                      </Alert>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-centre">
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        {adminData.systemStats.totalUsers}
                      </div>
                      <p className="text-sm text-grey-600">Total Users</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-centre">
                      <div className="text-3xl font-bold text-green-600 mb-1">
                        {adminData.systemStats.activeUsers}
                      </div>
                      <p className="text-sm text-grey-600">Active Users</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-centre">
                      <div className="text-3xl font-bold text-purple-600 mb-1">
                        {adminData.systemStats.totalSchools}
                      </div>
                      <p className="text-sm text-grey-600">Schools</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-centre">
                      <div className="text-3xl font-bold text-orange-600 mb-1">
                        {adminData.systemStats.totalResources}
                      </div>
                      <p className="text-sm text-grey-600">Resources</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">System Usage</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Storage Used</span>
                          <span>{adminData.systemStats.storageUsed}</span>
                        </div>
                        <div className="w-full bg-grey-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: '80%' }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>API Calls (Daily)</span>
                          <span>{adminData.systemStats.apiCalls.daily.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-grey-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: '65%' }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <h4 className="text-sm font-medium mb-2">AI Usage Breakdown</h4>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="p-2 bg-grey-50 rounded-md">
                            <p className="text-xs text-grey-500">Completions</p>
                            <p className="text-sm font-medium">{adminData.systemStats.aiUsage.completions.toLocaleString()}</p>
                          </div>
                          <div className="p-2 bg-grey-50 rounded-md">
                            <p className="text-xs text-grey-500">Embeddings</p>
                            <p className="text-sm font-medium">{adminData.systemStats.aiUsage.embeddings.toLocaleString()}</p>
                          </div>
                          <div className="p-2 bg-grey-50 rounded-md">
                            <p className="text-xs text-grey-500">Images</p>
                            <p className="text-sm font-medium">{adminData.systemStats.aiUsage.images.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline"
                      className="w-full"
                    >
                      View Detailed Analytics
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Recent Activity</h3>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {adminData.recentActivity.map(activity => (
                      <div key={activity.id} className="p-3 rounded-md border hover:bg-grey-50">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{activity.details}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            activity.type === 'user' ? 'bg-blue-100 text-blue-800' :
                            activity.type === 'school' ? 'bg-green-100 text-green-800' :
                            activity.type === 'system' ? 'bg-purple-100 text-purple-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {activity.type}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-grey-600 mt-1">
                          <span>By: {activity.actor}</span>
                          <span>{activity.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline"
                      className="w-full"
                    >
                      View All Activity
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-centre">
                      <h3 className="text-lg font-semibold">Recent Users</h3>
                      <Button size="sm">Manage Users</Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {adminData.users.slice(0, 3).map(user => (
                      <div key={user.id} className="p-3 rounded-md border hover:bg-grey-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{user.name}</h4>
                            <p className="text-sm text-grey-600">{user.email}</p>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            user.status === 'active' ? 'bg-green-100 text-green-800' :
                            user.status === 'inactive' ? 'bg-grey-100 text-grey-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {user.status}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-grey-600 mt-1">
                          <span>{user.role}</span>
                          <span>Last login: {user.lastLogin}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline"
                      className="w-full"
                    >
                      View All Users
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-centre">
                      <h3 className="text-lg font-semibold">Recent Schools</h3>
                      <Button size="sm">Manage Schools</Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {adminData.schools.slice(0, 3).map(school => (
                      <div key={school.id} className="p-3 rounded-md border hover:bg-grey-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{school.name}</h4>
                            <p className="text-sm text-grey-600">{school.type} • {school.location}</p>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            school.status === 'active' ? 'bg-green-100 text-green-800' :
                            school.status === 'inactive' ? 'bg-grey-100 text-grey-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {school.status}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-grey-600 mt-1">
                          <span>{school.usersCount} users</span>
                          <span>Added: {school.dateAdded}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline"
                      className="w-full"
                    >
                      View All Schools
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </>
          )}
        </div>
      )
    },
    {
      id: 'users',
      label: 'Users',
      content: (
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <p className="text-grey-600">Manage user accounts, roles, and permissions.</p>
        </div>
      )
    },
    {
      id: 'schools',
      label: 'Schools',
      content: (
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">School Management</h2>
          <p className="text-grey-600">Manage schools, departments, and classes.</p>
        </div>
      )
    },
    {
      id: 'settings',
      label: 'Settings',
      content: (
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">System Settings</h2>
          <p className="text-grey-600">Configure system settings, integrations, and preferences.</p>
        </div>
      )
    }
  ];
  
  return (
    <div className={`space-y-6 ${className}`}>
      <Tabs defaultValue="dashboard">
        <div className="border-b">
          <div className="flex space-x-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                value={tab.id}
                className={`px-4 py-2 border-b-2 ${
                  tab.id === 'dashboard' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent hover:text-primary hover:border-primary/40'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="py-4">
          {tabs.find(tab => tab.id === 'dashboard')?.content}
        </div>
      </Tabs>
    </div>
  );
}
