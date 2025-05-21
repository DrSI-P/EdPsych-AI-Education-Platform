'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { Alert } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/loading';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pagination } from '@/components/ui/pagination';
import { Dropdown } from '@/components/ui/dropdown';

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: '',
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    role: '',
  });
  const [actionLoading, setActionLoading] = useState(false);

  const pageSize = 10;

  useEffect(() => {
    fetchUsers();
  }, [currentPage, activeTab, searchQuery]);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        role: activeTab !== 'all' ? activeTab : '',
        search: searchQuery,
      });
      
      const response = await fetch(`/api/admin/users?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data.users);
      setTotalPages(Math.ceil(data.total / pageSize));
    } catch (err) {
      setError('An error occurred while fetching users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name || '',
      email: user.email,
      role: user.role,
    });
    setFormErrors({
      name: '',
      email: '',
      role: '',
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const validateForm = () => {
    const errors = {
      name: '',
      email: '',
      role: '',
    };
    
    if (!editForm.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!editForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(editForm.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!editForm.role) {
      errors.role = 'Role is required';
    }
    
    setFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  const handleSaveUser = async () => {
    if (!validateForm() || !selectedUser) return;
    
    setActionLoading(true);
    
    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      
      // Update the user in the local state
      setUsers(users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, ...editForm } 
          : user
      ));
      
      setIsEditModalOpen(false);
    } catch (err) {
      setError('An error occurred while updating the user');
      console.error('Error updating user:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    
    setActionLoading(true);
    
    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      
      // Remove the user from the local state
      setUsers(users.filter(user => user.id !== selectedUser.id));
      
      setIsDeleteModalOpen(false);
    } catch (err) {
      setError('An error occurred while deleting the user');
      console.error('Error deleting user:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    // fetchUsers will be called by the useEffect
  };

  // Create a wrapper function that extracts the value from the event
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1); // Reset to first page on tab change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const roleOptions = [
    { value: 'user', label: 'User' },
    { value: 'student', label: 'Student' },
    { value: 'teacher', label: 'Teacher' },
    { value: 'admin', label: 'Admin' },
    { value: 'parent', label: 'Parent' },
    { value: 'professional', label: 'Professional' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-grey-900 mb-2">User Management</h1>
        <p className="text-grey-600">
          Manage users, assign roles, and control access to the platform.
        </p>
      </div>
      
      {error && (
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
      )}
      
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-centre md:justify-between gap-4 mb-6">
            <form onSubmit={handleSearch} className="w-full md:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users by name or email"
                  className="w-full md:w-80 px-4 py-2 border border-grey-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-grey-500 hover:text-grey-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>
            
            <Button
              onClick={() => {
                setSelectedUser(null);
                setEditForm({
                  name: '',
                  email: '',
                  role: 'user',
                });
                setFormErrors({
                  name: '',
                  email: '',
                  role: '',
                });
                setIsEditModalOpen(true);
              }}
              className="w-full md:w-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New User
            </Button>
          </div>
          
          <Tabs defaultValue={activeTab} className="mb-6" onValueChange={handleTabChange}>
            <TabsList className="w-full">
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="student">Students</TabsTrigger>
              <TabsTrigger value="teacher">Teachers</TabsTrigger>
              <TabsTrigger value="parent">Parents</TabsTrigger>
              <TabsTrigger value="professional">Professionals</TabsTrigger>
              <TabsTrigger value="admin">Administrators</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {loading ? (
            <div className="flex justify-centre items-centre py-12">
              <Spinner size="lg" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-centre py-12 bg-grey-50 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-grey-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h3 className="text-lg font-medium text-grey-900 mb-1">No users found</h3>
              <p className="text-grey-500">
                {searchQuery 
                  ? `No users match your search criteria "${searchQuery}"`
                  : activeTab !== 'all' 
                    ? `No users with role "${activeTab}" found`
                    : 'There are no users in the system yet'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">Role</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">Created</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-grey-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-grey-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-grey-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-centre">
                            <div className="flex-shrink-0 h-10 w-10 bg-grey-200 rounded-full flex items-centre justify-centre">
                              {user.name ? (
                                <span className="text-grey-600 font-medium">
                                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </span>
                              ) : (
                                <span className="text-grey-600 font-medium">
                                  {user.email[0].toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-grey-900">
                                {user.name || 'No name provided'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-grey-900">{user.email}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                              user.role === 'teacher' ? 'bg-green-100 text-green-800' : 
                                user.role === 'student' ? 'bg-blue-100 text-blue-800' : 
                                  user.role === 'parent' ? 'bg-yellow-100 text-yellow-800' : 
                                    user.role === 'professional' ? 'bg-indigo-100 text-indigo-800' : 
                                      'bg-grey-100 text-grey-800'}`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${user.emailVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {user.emailVerified ? 'Verified' : 'Unverified'}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-grey-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditUser(user)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-900 border-red-300 hover:border-red-500"
                              onClick={() => handleDeleteUser(user)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={selectedUser ? 'Edit User' : 'Add New User'}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-grey-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.name ? 'border-red-500' : 'border-grey-300'
              }`}
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            />
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-grey-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.email ? 'border-red-500' : 'border-grey-300'
              }`}
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            />
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-grey-700 mb-1">
              Role
            </label>
            <select
              id="role"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.role ? 'border-red-500' : 'border-grey-300'
              }`}
              value={editForm.role}
              onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
            >
              <option value="">Select a role</option>
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {formErrors.role && (
              <p className="mt-1 text-sm text-red-600">{formErrors.role}</p>
            )}
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveUser}
              disabled={actionLoading}
            >
              {actionLoading ? <Spinner size="sm" className="mr-2" /> : null}
              {selectedUser ? 'Save Changes' : 'Create User'}
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Delete User Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete User"
      >
        <div>
          <p className="text-grey-700 mb-6">
            Are you sure you want to delete the user <span className="font-semibold">{selectedUser?.name || selectedUser?.email}</span>? This action cannot be undone.
          </p>
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={actionLoading}
            >
              {actionLoading ? <Spinner size="sm" className="mr-2" /> : null}
              Delete User
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
