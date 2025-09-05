import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, Clock, Banknote, GraduationCap, Filter } from 'lucide-react';
import axios from 'axios';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchCourses();
  }, [searchTerm, currentPage]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm || undefined,
        limit: 12,
        offset: (currentPage - 1) * 12
      };
      
      const response = await axios.get('/api/courses', { params });
      setCourses(response.data.courses);
      setPagination(response.data.pagination);
      setTotalPages(Math.ceil(response.data.pagination.total / 12));
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'GHS'
    }).format(amount);
  };

  if (loading && courses.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Our Courses
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover a wide range of programs designed to help you achieve your academic and career goals. 
            From undergraduate to graduate studies, we offer quality education that prepares you for success.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search courses by name, code, or description..."
                className="input-field pl-10 pr-4 text-lg"
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 px-4 bg-primary-600 text-white rounded-r-lg hover:bg-primary-700 transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="mb-6 text-center">
            <p className="text-gray-600">
              Showing {courses.length} of {pagination.total} courses
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>
        )}

        {/* Courses Grid */}
        {courses.length === 0 && !loading ? (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? `No courses match your search for "${searchTerm}". Try different keywords.`
                : 'No courses are currently available.'
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setCurrentPage(1);
                }}
                className="btn-primary"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {courses.map((course) => (
              <div key={course.id} className={`card ${course.is_active ? 'hover:shadow-lg transition-shadow duration-200' : 'bg-gray-100 text-gray-500 cursor-not-allowed'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className={`h-6 w-6 ${course.is_active ? 'text-primary-600' : 'text-gray-400'}`} />
                    <span className={`text-sm font-medium ${course.is_active ? 'text-primary-600 bg-primary-50' : 'text-gray-500 bg-gray-200'} px-2 py-1 rounded`}>
                      {course.code}
                    </span>
                  </div>
                </div>
                
                <h3 className={`text-xl font-semibold ${course.is_active ? 'text-gray-900' : 'text-gray-600'} mb-3 line-clamp-2`}>
                  {course.name}
                </h3>
                
                <p className={`${course.is_active ? 'text-gray-600' : 'text-gray-500'} mb-4 line-clamp-3`}>
                  {course.description}
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className={`h-4 w-4 ${course.is_active ? '' : 'text-gray-400'}`} />
                    <span>{course.duration}</span>
                  </div>
                  
                  {course.requirements && (
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Requirements:</span> {course.requirements}
                    </div>
                  )}
                  
                  <div className={`flex items-center space-x-2 text-lg font-semibold ${course.is_active ? 'text-primary-600' : 'text-gray-500'}`}>
                    <Banknote className={`h-5 w-5 ${course.is_active ? '' : 'text-gray-400'}`} />
                    <span>{formatCurrency(course.fee)}</span>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  {course.is_active ? (
                    <Link
                      to={`/courses/${course.id}`}
                      className="btn-primary flex-1 text-center"
                    >
                      View Details
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="btn-primary-disabled flex-1 text-center"
                    >
                      Closed
                    </button>
                  )}
                  {course.is_active && (
                    <Link
                      to={`/courses/${course.id}`}
                      className="btn-secondary flex-1 text-center"
                    >
                      Apply Now
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    page === currentPage
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-primary-700 rounded-lg py-12 px-6 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of students who have chosen Eston University to shape their future. 
              Apply today and take the first step towards your dreams.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="bg-white text-primary-700 hover:bg-primary-50 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
                Get Started Today
              </Link>
              <Link to="/login" className="border-2 border-white text-white hover:bg-white hover:text-primary-700 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
