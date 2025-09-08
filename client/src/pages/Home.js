import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Users, Award, ArrowRight, CheckCircle } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Wide Range of Courses",
      description: "Choose from our comprehensive selection of undergraduate and graduate programs designed for your success."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Expert Faculty",
      description: "Learn from experienced professionals and academics who are leaders in their respective fields."
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Quality Education",
      description: "Accredited programs that meet international standards and prepare you for global opportunities."
    }
  ];

  const stats = [
    { number: "500+", label: "Students Enrolled" },
    { number: "50+", label: "Expert Faculty" },
    { number: "20+", label: "Programs Offered" },
    { number: "95%", label: "Graduation Rate" }
  ];

  return (
    <div className="min-h-screen">
      {/* Custom Header with Logo and Nav on Same Line */}
      <header className="flex items-center justify-between px-8 py-6 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="flex items-center gap-4">
          <GraduationCap className="h-16 w-16 text-primary-200" />
          <span className="text-3xl font-bold">Eston College</span>
        </div>
        <nav className="flex gap-8">
          <Link to="/" className="font-semibold hover:underline">Home</Link>
          <Link to="/admsinon" className="font-semibold hover:underline">Adminions</Link>
        </nav>
      </header>

      {/* Hero Section with Centered Adminions and /admsinon */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white flex flex-col items-center justify-center py-24">
        <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center mb-6">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to Eston University</h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl text-center">
              Transform your future with quality education. Apply for our programs and join a community of learners and innovators.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/courses" className="bg-white text-primary-600 hover:bg-primary-50 font-semibold py-3 px-8 rounded-lg transition-colors duration-200 inline-flex items-center justify-center">
                Explore Courses
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            {/* Centered Adminions and /admsinon */}
            <div className="flex flex-col items-center justify-center mt-10">
              <span className="text-2xl font-bold mb-2">Adminions</span>
              <Link to="/admsinon" className="text-xl text-primary-200 underline">/admsinon</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Eston College?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide an exceptional learning environment that nurtures talent and fosters innovation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
                <div className="text-primary-600 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have chosen Eston College to shape their future. 
            Apply today and take the first step towards your dreams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-white text-primary-700 hover:bg-primary-50 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
              Get Started Today
            </Link>
            <Link to="/courses" className="border-2 border-white text-white hover:bg-white hover:text-primary-700 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
              View All Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple Application Process
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Getting started is easy. Follow these simple steps to begin your educational journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Create Account", description: "Sign up with your email and personal information" },
              { step: "2", title: "Browse Courses", description: "Explore our wide range of programs and courses" },
              { step: "3", title: "Submit Application", description: "Fill out and submit your application online" },
              { step: "4", title: "Track Progress", description: "Monitor your application status in real-time" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
