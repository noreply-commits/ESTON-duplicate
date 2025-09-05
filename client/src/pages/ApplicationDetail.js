import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  ArrowLeft,
  User,
  BookOpen,
  Calendar,
  Banknote,
  FileCheck
} from 'lucide-react';

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingDocuments, setUpdatingDocuments] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchApplication();
    }
  }, [id, isAuthenticated]);

  const fetchApplication = async () => {
    try {
      const response = await fetch(`/api/applications/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Application not found');
      }

      const data = await response.json();
      setApplication(data.application);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDocuments = async (documentsSubmitted) => {
    setUpdatingDocuments(true);
    try {
      const response = await fetch(`/api/applications/${id}/documents`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          documents_submitted: documentsSubmitted
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update documents status');
      }

      const data = await response.json();
      setApplication(data.application);
      alert('Documents status updated successfully!');
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingDocuments(false);
    }
  };

  const handleWithdraw = async () => {
    if (!window.confirm('Are you sure you want to withdraw this application? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to withdraw application');
      }

      alert('Application withdrawn successfully!');
      navigate('/applications');
    } catch (err) {
      alert(err.message);
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
        return <Clock className="h-5 w-5" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5" />;
      case 'rejected':
        return <XCircle className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'GHS'
    }).format(amount);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h2>
          <p className="text-gray-600 mb-4">You need to be logged in to view application details.</p>
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
            onClick={() => navigate('/applications')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  if (!application) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate('/applications')}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Applications
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Details</h1>
          <p className="text-gray-600">Application ID: {application.id}</p>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Application Status</h2>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                <div className="flex items-center">
                  {getStatusIcon(application.status)}
                  <span className="ml-2 capitalize">{application.status}</span>
                </div>
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Application Date</p>
              <p className="font-medium text-gray-900">{formatDate(application.application_date)}</p>
            </div>
          </div>
        </div>

        {/* Course Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
            Course Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Course Name</p>
              <p className="font-medium text-gray-900">{application.course_name}</p>
            </div>
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
              <p className="font-medium text-gray-900">{formatCurrency(application.fee)}</p>
            </div>
          </div>
          {application.course_description && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">Description</p>
              <p className="text-gray-900 mt-1">{application.course_description}</p>
            </div>
          )}
          {application.course_requirements && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">Requirements</p>
              <p className="text-gray-900 mt-1">{application.course_requirements}</p>
            </div>
          )}
        </div>

        {/* Application Details */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            Application Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Documents Submitted</p>
              <p className="font-medium text-gray-900">
                {application.documents_submitted ? 'Yes' : 'No'}
              </p>
            </div>
            {application.review_date && (
              <div>
                <p className="text-sm text-gray-500">Review Date</p>
                <p className="font-medium text-gray-900">{formatDate(application.review_date)}</p>
              </div>
            )}
          </div>
          
          {application.admin_notes && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">Admin Notes</p>
              <div className="mt-1 p-3 bg-gray-50 rounded border">
                <p className="text-gray-900">{application.admin_notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Documents Section */}
        {application.documents && application.documents.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileCheck className="h-5 w-5 mr-2 text-blue-600" />
              Submitted Documents
            </h3>
            <div className="space-y-3">
              {application.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium text-gray-900">{doc.document_type}</p>
                    <p className="text-sm text-gray-500">{doc.file_name}</p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {formatDate(doc.uploaded_at)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
          <div className="flex flex-wrap gap-4">
            {application.status === 'pending' && (
              <>
                <button
                  onClick={() => handleUpdateDocuments(!application.documents_submitted)}
                  disabled={updatingDocuments}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {updatingDocuments ? 'Updating...' : 
                   application.documents_submitted ? 'Mark Documents as Not Submitted' : 'Mark Documents as Submitted'}
                </button>
                <button
                  onClick={handleWithdraw}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Withdraw Application
                </button>
              </>
            )}
            <Link
              to="/applications"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Back to Applications
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;
