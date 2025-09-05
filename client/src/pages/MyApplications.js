import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, Eye } from 'lucide-react';

const MyApplications = () => {
  const { user, isAuthenticated } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchApplications();
    }
  }, [isAuthenticated]);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/applications/my-applications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }

      const data = await response.json();
      setApplications(data.applications);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'GHS'
    }).format(amount);
  };

  const handleWithdraw = async (applicationId) => {
    if (!window.confirm('Are you sure you want to withdraw this application? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to withdraw application');
      }

      alert('Application withdrawn successfully!');
      fetchApplications(); // Refresh the list
    } catch (err) {
      alert(err.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h2>
          <p className="text-gray-600 mb-4">You need to be logged in to view your applications.</p>
          <Link
            to="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

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
            onClick={fetchApplications}
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
          <p className="text-gray-600">Track the status of your course applications</p>
        </div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
            <p className="text-gray-600 mb-4">
              You haven't submitted any course applications yet.
            </p>
            <Link
              to="/courses"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <div key={application.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {application.course_name}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                        <div className="flex items-center">
                          {getStatusIcon(application.status)}
                          <span className="ml-1 capitalize">{application.status}</span>
                        </div>
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Course Code</p>
                        <p className="font-medium text-gray-900">{application.course_code}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="font-medium text-gray-900">{application.course_duration}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Fee</p>
                        <p className="font-medium text-gray-900">{formatCurrency(application.course_fee)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Application Date</p>
                        <p className="font-medium text-gray-900">
                          {formatDate(application.application_date)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Documents Submitted</p>
                        <p className="font-medium text-gray-900">
                          {application.documents_submitted ? 'Yes' : 'No'}
                        </p>
                      </div>
                    </div>

                    {application.review_date && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-500">Review Date</p>
                        <p className="font-medium text-gray-900">
                          {formatDate(application.review_date)}
                        </p>
                      </div>
                    )}

                    {application.admin_notes && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-500">Admin Notes</p>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded border">
                          {application.admin_notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <Link
                    to={`/applications/${application.id}`}
                    className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Link>
                  
                  {application.status === 'pending' && (
                    <button
                      onClick={() => handleWithdraw(application.id)}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Withdraw Application
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
