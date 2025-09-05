import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, BookOpen, FileText, Settings, Calendar, DollarSign } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const { user, updateProfile } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || ''
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get('/api/admissions/my-applications');
      setApplications(response.data.applications);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'pending':
        return 'Under Review';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.first_name}!
          </h1>
          <p className="mt-2 text-gray-600">
            Here's an overview of your admissions journey at Eston University.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button type="submit" className="btn-primary flex-1">
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="btn-secondary flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Full Name</p>
                      <p className="text-gray-900">{user?.first_name} {user?.last_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-900">{user?.email}</p>
                    </div>
                  </div>
                  {user?.phone && (
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Phone</p>
                        <p className="text-gray-900">{user?.phone}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Member Since</p>
                      <p className="text-gray-900">
                        {new Date(user?.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Applications Overview */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Applications</h2>
                <Link to="/applications" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View All
                </Link>
              </div>

              {applications.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                  <p className="text-gray-500 mb-4">
                    Start your journey by exploring our courses and submitting your first application.
                  </p>
                  <Link to="/courses" className="btn-primary">
                    Browse Courses
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.slice(0, 5).map((application) => (
                    <div key={application.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{application.course_name}</h3>
                          <p className="text-sm text-gray-500">{application.course_code}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(application.status)}`}>
                          {getStatusText(application.status)}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                        <span>Applied: {new Date(application.application_date).toLocaleDateString()}</span>
                        <span>Fee: ${application.fee}</span>
                      </div>
                      <div className="mt-3">
                        <Link
                          to={`/applications/${application.id}`}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="card mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  to="/courses"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                >
                  <BookOpen className="h-8 w-8 text-primary-600 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900">Browse Courses</h4>
                    <p className="text-sm text-gray-500">Explore available programs</p>
                  </div>
                </Link>
                <Link
                  to="/applications"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                >
                  <FileText className="h-8 w-8 text-primary-600 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900">My Applications</h4>
                    <p className="text-sm text-gray-500">Track your applications</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
