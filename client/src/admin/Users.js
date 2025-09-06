import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Users,
  Search,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  AlertCircle,
  UserPlus,
  Download
} from 'lucide-react';
import * as XLSX from 'xlsx';
import AdminNavbar from './AdminNavbar';

const API_URL = process.env.REACT_APP_API_URL;

const AdminUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: 'student'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingUser
        ? `${API_URL}/api/admin/users/${editingUser.id}`
        : `${API_URL}/api/admin/users`;

      const method = editingUser ? 'PUT' : 'POST';

      const userPayload = editingUser
        ? { role: formData.role }
        : { ...formData, password: 'zxcv123$$' };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(userPayload)
      });

      if (!response.ok) {
        throw new Error('Failed to save user');
      }

      const data = await response.json();

      if (editingUser) {
        setUsers(prev => prev.map(user =>
          user.id === editingUser.id ? data.user : user
        ));
      } else {
        setUsers(prev => [...prev, data.user]);
      }

      setShowModal(false);
      setEditingUser(null);
      resetForm();
      alert(editingUser ? 'User updated successfully!' : 'User created successfully!');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone || '',
      role: user.role
    });
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      setUsers(prev => prev.filter(user => user.id !== userId));
      alert('User deleted successfully!');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/users/${userId}/toggle-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          is_active: !currentStatus
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update user status');
      }

      setUsers(prev => prev.map(user =>
        user.id === userId
          ? { ...user, is_active: !currentStatus }
          : user
      ));

      alert('User status updated successfully!');
    } catch (err) {
      alert(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      role: 'student'
    });
  };

  const openCreateModal = () => {
    setEditingUser(null);
    resetForm();
    setShowModal(true);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'student':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const exportToExcel = () => {
    const exportData = filteredUsers.map(user => ({
      'User ID': user.id,
      'First Name': user.first_name,
      'Last Name': user.last_name,
      'Email': user.email,
      'Phone': user.phone || '',
      'Role': user.role,
      'Status': user.is_active !== false ? 'Active' : 'Inactive',
      'Created Date': user.created_at ? new Date(user.created_at).toLocaleDateString('en-US') : ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

    const fileName = `users_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchUsers}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 m-0 p-0">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Your content stays unchanged here */}
      </div>
    </div>
  );
};

export default AdminUsers;
