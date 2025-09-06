import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  BookOpen,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  Eye,
  Edit,
  Plus,
  GraduationCap, // Icon for courses
  UserCheck, // Icon for users
  ClipboardList, // Icon for applications
  AlertCircle
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [counts, setCounts] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { totalUsers, totalCourses, totalApplications, applicationStatistics } = response.data;

      setCounts({
        totalUsers: totalUsers,
        totalCourses: totalCourses,
        totalApplications: totalApplications,
        pendingApplications: applicationStatistics?.pending_applications || 0,
        approvedApplications: applicationStatistics?.approved_applications || 0,
        rejectedApplications: applicationStatistics?.rejected_applications || 0,
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
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
            onClick={fetchDashboardData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6 flex items-center">
            <Users className="h-10 w-10 text-purple-600 mr-4" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Users</h2>
              <p className="text-2xl font-bold text-purple-600">{counts.totalUsers}</p>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-6 flex items-center">
            <GraduationCap className="h-10 w-10 text-green-600 mr-4" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Courses</h2>
              <p className="text-2xl font-bold text-green-600">{counts.totalCourses}</p>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-6 flex items-center">
            <ClipboardList className="h-10 w-10 text-blue-600 mr-4" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Applications</h2>
              <p className="text-2xl font-bold text-blue-600">{counts.totalApplications}</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6 flex items-center">
            <Clock className="h-10 w-10 text-yellow-600 mr-4" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Pending</h2>
              <p className="text-xl font-bold text-yellow-600">{counts.pendingApplications}</p>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-6 flex items-center">
            <CheckCircle className="h-10 w-10 text-green-600 mr-4" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Approved</h2>
              <p className="text-xl font-bold text-green-600">{counts.approvedApplications}</p>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-6 flex items-center">
            <XCircle className="h-10 w-10 text-red-600 mr-4" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Rejected</h2>
              <p className="text-xl font-bold text-red-600">{counts.rejectedApplications}</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/admin/users"
            className="flex items-center p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition"
          >
            <Users className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900">User Management</h4>
              <p className="text-sm text-gray-500">View and manage users</p>
            </div>
          </Link>
          <Link
            to="/admin/courses"
            className="flex items-center p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition"
          >
            <GraduationCap className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900">Course Management</h4>
              <p className="text-sm text-gray-500">View and manage courses</p>
            </div>
          </Link>
          <Link
            to="/admin/applications"
            className="flex items-center p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition"
          >
            <ClipboardList className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900">Applications</h4>
              <p className="text-sm text-gray-500">View and manage applications</p>
            </div>
          </Link>
          <div className="flex items-center p-4 border border-gray-200 rounded-lg bg-gray-50">
            <TrendingUp className="h-8 w-8 text-gray-400 mr-3" />
            <div>
              <h4 className="font-medium text-gray-500">Reports</h4>
              <p className="text-sm text-gray-400">Coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
