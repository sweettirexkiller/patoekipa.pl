'use client';

import React, { useState, useEffect } from 'react';
import { AdminUser } from '@/lib/database-schema';

interface AdminUsersManagementProps {
  currentUser?: {
    githubUsername: string;
    role: string;
  };
}

interface AdminUserFormData {
  githubUsername: string;
  githubUserId: string;
  displayName: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor';
  permissions: {
    canManageUsers: boolean;
    canManageProjects: boolean;
    canManageTeam: boolean;
    canManageTestimonials: boolean;
    canManageContacts: boolean;
  };
  notes: string;
}

const AdminUsersManagement = ({ currentUser }: AdminUsersManagementProps) => {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [formData, setFormData] = useState<AdminUserFormData>({
    githubUsername: '',
    githubUserId: '',
    displayName: '',
    email: '',
    role: 'editor',
    permissions: {
      canManageUsers: false,
      canManageProjects: true,
      canManageTeam: true,
      canManageTestimonials: true,
      canManageContacts: true,
    },
    notes: ''
  });

  // Check if current user is super admin
  const isSuperAdmin = currentUser?.role === 'super_admin';

  useEffect(() => {
    if (isSuperAdmin) {
      fetchAdminUsers();
    }
  }, [isSuperAdmin]);

  const fetchAdminUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/adminusers');
      if (response.ok) {
        const users = await response.json();
        setAdminUsers(users);
      } else {
        setError('Failed to fetch admin users');
      }
    } catch (error) {
      setError('Error fetching admin users');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const url = editingUser ? '/api/adminusers' : '/api/adminusers';
      const method = editingUser ? 'PUT' : 'POST';
      const body = editingUser 
        ? { ...formData, id: editingUser.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        await fetchAdminUsers();
        resetForm();
        setShowForm(false);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to save admin user');
      }
    } catch (error) {
      setError('Error saving admin user');
    }
  };

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user);
    setFormData({
      githubUsername: user.githubUsername,
      githubUserId: user.githubUserId,
      displayName: user.displayName,
      email: user.email || '',
      role: user.role,
      permissions: {
        canManageUsers: user.permissions?.canManageUsers ?? (user.role === 'super_admin'),
        canManageProjects: user.permissions?.canManageProjects ?? true,
        canManageTeam: user.permissions?.canManageTeam ?? true,
        canManageTestimonials: user.permissions?.canManageTestimonials ?? true,
        canManageContacts: user.permissions?.canManageContacts ?? true,
      },
      notes: user.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (user: AdminUser) => {
    if (!confirm(`Are you sure you want to delete admin user "${user.displayName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/adminusers?id=${user.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchAdminUsers();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete admin user');
      }
    } catch (error) {
      setError('Error deleting admin user');
    }
  };

  const handleToggleActive = async (user: AdminUser) => {
    try {
      const response = await fetch('/api/adminusers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          isActive: !user.isActive
        })
      });

      if (response.ok) {
        await fetchAdminUsers();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update user status');
      }
    } catch (error) {
      setError('Error updating user status');
    }
  };

  const resetForm = () => {
    setFormData({
      githubUsername: '',
      githubUserId: '',
      displayName: '',
      email: '',
      role: 'editor',
      permissions: {
        canManageUsers: false,
        canManageProjects: true,
        canManageTeam: true,
        canManageTestimonials: true,
        canManageContacts: true,
      },
      notes: ''
    });
    setEditingUser(null);
    setError(null);
  };

  const handleRoleChange = (role: 'super_admin' | 'admin' | 'editor') => {
    setFormData(prev => ({
      ...prev,
      role,
      permissions: {
        ...prev.permissions,
        canManageUsers: role === 'super_admin'
      }
    }));
  };

  if (!isSuperAdmin) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Access Denied</h3>
        <p className="text-red-600">Only super administrators can manage admin users.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-center mt-2 text-gray-600">Loading admin users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Admin Users Management</h2>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          Add Admin User
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Admin Users List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {adminUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.displayName}
                      </div>
                      <div className="text-sm text-gray-500">
                        @{user.githubUsername}
                      </div>
                      {user.email && (
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === 'super_admin' 
                      ? 'bg-purple-100 text-purple-800'
                      : user.role === 'admin'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {user.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.lastLoginAt 
                    ? new Date(user.lastLoginAt).toLocaleDateString()
                    : 'Never'
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleActive(user)}
                    className={user.isActive 
                      ? "text-yellow-600 hover:text-yellow-900"
                      : "text-green-600 hover:text-green-900"
                    }
                  >
                    {user.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDelete(user)}
                    className="text-red-600 hover:text-red-900"
                    disabled={user.githubUsername === currentUser?.githubUsername}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {adminUsers.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No admin users found. Add the first admin user to get started.
          </div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingUser ? 'Edit Admin User' : 'Add Admin User'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub Username *
                </label>
                <input
                  type="text"
                  value={formData.githubUsername}
                  onChange={(e) => setFormData(prev => ({ ...prev, githubUsername: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                  disabled={!!editingUser}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub User ID *
                </label>
                <input
                  type="text"
                  value={formData.githubUserId}
                  onChange={(e) => setFormData(prev => ({ ...prev, githubUserId: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                  disabled={!!editingUser}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Name *
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => handleRoleChange(e.target.value as 'super_admin' | 'admin' | 'editor')}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permissions
                </label>
                <div className="space-y-2">
                  {Object.entries(formData.permissions).map(([key, value]) => (
                    <label key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          permissions: {
                            ...prev.permissions,
                            [key]: e.target.checked
                          }
                        }))}
                        className="mr-2"
                        disabled={key === 'canManageUsers' && formData.role !== 'super_admin'}
                      />
                      <span className="text-sm text-gray-700">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingUser ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersManagement; 