import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Clock, DollarSign, FileText, CheckCircle, AlertCircle } from 'lucide-react';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/courses/${id}`);
      if (!response.ok) {
        throw new Error('Course not found');
      }
      const data = await response.json();
      setCourse(data.course);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setApplying(true);
    try {
      const response = await fetch('/api/admissions/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          course_id: parseInt(id),
          documents_submitted: false
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Application failed');
      }

      const data = await response.json();
      alert('Application submitted successfully!');
      navigate('/applications');
    } catch (err) {
      alert(err.message);
    } finally {
      setApplying(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'GHS'
    }).format(amount);
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/courses')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.name}</h1>
              <p className="text-xl text-gray-600 mb-4">{course.code}</p>
              <p className="text-gray-700 leading-relaxed">{course.description}</p>
            </div>
            <div className="ml-6">
              <button
                onClick={handleApply}
                disabled={applying}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {applying ? 'Applying...' : 'Apply Now'}
              </button>
            </div>
          </div>
        </div>

        {/* Course Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Course Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Information</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-700">Duration: {course.duration}</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-700">Fee: {formatCurrency(course.fee)}</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-700">Status: {course.is_active ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h3>
            <div className="space-y-2">
              {course.requirements ? (
                <p className="text-gray-700">{course.requirements}</p>
              ) : (
                <p className="text-gray-500 italic">No specific requirements listed</p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">What You'll Learn</h4>
              <p className="text-gray-700">
                This comprehensive course provides in-depth knowledge and practical skills 
                in {course.name.toLowerCase()}. You'll gain hands-on experience and theoretical 
                understanding to excel in your chosen field.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Career Opportunities</h4>
              <p className="text-gray-700">
                Graduates of this program can pursue various career paths including 
                professional roles, research positions, and entrepreneurial opportunities 
                in their respective industries.
              </p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/courses')}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
          >
            Back to Courses
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
