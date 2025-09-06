import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaPhone, FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const countries = [
  // ... your full countries list here (unchanged) ...
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo (Congo-Brazzaville)",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czechia (Czech Republic)",
  "Democratic Republic of the Congo",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini (fmr. \"Swaziland\")",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Holy See",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar (formerly Burma)",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine State",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States of America",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe"
];

const InputField = ({ label, name, value, onChange, type = 'text', required = false, error }) => (
  <div className="mb-4 max-w-md mx-auto">
    <label htmlFor={name} className="block text-sm font-medium text-black">
      {label}{required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className={`mt-1 block w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${error ? 'border-red-500 focus:ring-red-500' : 'border-blue-600 focus:ring-blue-500 focus:border-blue-700'}`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const SelectField = ({ label, name, value, onChange, children, required = false, error }) => (
  <div className="mb-4 max-w-md mx-auto">
    <label htmlFor={name} className="block text-sm font-medium text-black">
      {label}{required && <span className="text-red-500">*</span>}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className={`mt-1 block w-full p-2 border rounded-md bg-white focus:outline-none focus:ring-2 ${error ? 'border-red-500 focus:ring-red-500' : 'border-blue-600 focus:ring-blue-600 focus:border-blue-700'}`}
    >
      {children}
    </select>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const TextAreaField = ({ label, name, value, onChange, required = false, error }) => (
  <div className="mb-4 max-w-md mx-auto">
    <label htmlFor={name} className="block text-sm font-medium text-black">
      {label}{required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      rows={4}
      required={required}
      className={`mt-1 block w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${error ? 'border-red-500 focus:ring-red-500' : 'border-blue-600 focus:ring-blue-500 focus:border-blue-700'}`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const ApplicationForm = () => {
  // Hamburger menu state for mobile navigation
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    gender: '',
    residentialAddress: '',
    streetAddress: '',
    streetAddressLine2: '',
    cityStateProvince: '',
    country: '',
    course: '',
    institutionName: '',
    highestEducation: '',
    dateOfBirth: '',
    reasonForCourse: '',
    howHear: '',
    declaration: false,
  });
  const [courses, setCourses] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [errorCourses, setErrorCourses] = useState('');
  const [submitting, setSubmitting] = useState(false);
  // Revert modal addition
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      setLoadingCourses(true);
      try {
        const response = await axios.get('/api/courses');
        setCourses(response.data.courses);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setErrorCourses('Failed to load courses. Please try again later.');
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const validateStep = () => {
    let isValid = true;
    const errors = {};

    if (currentStep === 1) {
      const fields = ['firstName', 'lastName', 'email', 'gender', 'dateOfBirth', 'residentialAddress'];
      fields.forEach(field => {
        if (!formData[field]) {
          isValid = false;
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
        }
      });
      // Basic email format validation
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        isValid = false;
        errors.email = 'Email address is invalid.';
      }
    } else if (currentStep === 2) {
      const fields = ['streetAddress', 'streetAddressLine2', 'cityStateProvince', 'country', 'course', 'institutionName'];
      fields.forEach(field => {
        if (!formData[field]) {
          isValid = false;
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
        }
      });
    } else if (currentStep === 3) {
      const fields = ['highestEducation', 'reasonForCourse', 'howHear'];
      fields.forEach(field => {
        if (!formData[field]) {
          isValid = false;
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
        }
      });
      if (!formData.declaration) {
        isValid = false;
        errors.declaration = 'You must agree to the declaration.';
      }
    }
    setErrors(errors);
    return isValid;
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep((prev) => prev + 1);
    }
  };
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) {
      return;
    }
    setSubmitting(true);
    // Ensure declaration is sent as a string 'true' or 'false'
    const payload = {
      ...formData,
      declaration: formData.declaration ? 'true' : 'false',
    };
    console.log('Submitting application payload:', payload);
    try {
      await axios.post('/api/applications', payload);
      alert('Application submitted successfully!');
      // Clear all form fields after successful submission
      setFormData({
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        gender: '',
        residentialAddress: '',
        streetAddress: '',
        streetAddressLine2: '',
        cityStateProvince: '',
        country: '',
        course: '',
        institutionName: '',
        highestEducation: '',
        dateOfBirth: '',
        reasonForCourse: '',
        howHear: '',
        declaration: false,
      });
      setCurrentStep(1); // Optionally reset to first step
      setErrors({});
      navigate('/');
    } catch (error) {
      console.error('Error submitting application:', error);
      if (error.response && error.response.data) {
        console.error('Backend error response:', error.response.data);
        alert(
          error.response.data.message ||
          (error.response.data.errors
            ? error.response.data.errors.map(e => e.msg).join(', ')
            : 'Failed to submit application. Please try again.')
        );
      } else {
        alert('Failed to submit application. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
  <>
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Enhanced Header Styles */
          .header-top {
            background: linear-gradient(135deg,#07294D);
            color: white;
            padding: 12px 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header-top .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 2rem;
          }
          @media (max-width: 768px) {
            .header-left {
              display: none !important;
            }
            .social {
              width: 100%;
              justify-content: center;
              gap: 1rem;
            }
            .follow-us {
              display: none !important;
            }
            .social-icons {
              flex-direction: row;
              justify-content: center;
              gap: 1rem;
              width: 100%;
            }
          }

          .contact-info {
            display: flex;
            gap: 20px;
            list-style: none;
            margin: 0;
            padding: 0;
          }

          .contact-info li {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
          }

          .contact-info i {
            color: #fbbf24;
            font-size: 16px;
          }

          .contact-info a {
            color: white;
            text-decoration: none;
            transition: color 0.3s ease;
          }

          .contact-info a:hover {
            color: #fbbf24;
          }

          .social {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .follow-us {
            font-size: 14px;
            font-weight: 500;
          }

          .social-icons {
            display: flex;
            gap: 12px;
            list-style: none;
            margin: 0;
            padding: 0;
          }

          .social-icons li a {
            color: white;
            font-size: 18px;
            transition: all 0.3s ease;
            padding: 8px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .social-icons li a:hover {
            background-color: rgba(255,255,255,0.1);
            transform: translateY(-2px);
          }

          /* Main Header Styles */
          .header-sections {
            background: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 1000;
          }

          .header-sections .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
          }

          .header-area {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 2rem;
            padding: 15px 0;
            flex-wrap: wrap;
            position: relative;
          }

          @media (max-width: 1024px) {
            .header-area {
              gap: 1.5rem;
            }
          }
          @media (max-width: 768px) {
            .header-area {
              flex-direction: row;
              gap: 1rem;
              align-items: center;
              justify-content: space-between;
              text-align: left;
            }
          }
          }

          .site-branding img {
            max-width: 250px;
            height: auto;
            transition: transform 0.3s ease;
          }

          .site-branding img:hover {
            transform: scale(1.05);
          }

          .navigation-section {
            display: flex;
            align-items: center;
            gap: 20px;
          }

          .main-menu {
            display: flex;
            list-style: none;
            margin: 0;
            padding: 0;
            gap: 30px;
          }

          .main-menu li {
            position: relative;
          }

          .main-menu a {
            color: #374151;
            text-decoration: none;
            font-weight: 500;
            padding: 10px 15px;
            transition: all 0.3s ease;
            border-radius: 6px;
          }

          .main-menu a:hover,
          .main-menu .current_page_item a {
            background-color: #3b82f6;
            color: white;
          }

          .sub-menu {
            position: absolute;
            top: 100%;
            left: 0;
            background: white;
            min-width: 200px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            border-radius: 6px;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-10px);
            transition: all 0.3s ease;
            z-index: 1000;
          }

          .menu-item-has-children:hover .sub-menu {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
          }

          .sub-menu li {
            border-bottom: 1px solid #f3f4f6;
          }

          .sub-menu li:last-child {
            border-bottom: none;
          }

          .sub-menu a {
            padding: 12px 20px;
            display: block;
            color: #374151;
            font-weight: 400;
          }

          .sub-menu a:hover {
            background-color: #f3f4f6;
            color: #3b82f6;
          }

          .header-right-icon a {
            color: #6b7280;
            font-size: 20px;
            padding: 10px;
            border-radius: 50%;
            transition: all 0.3s ease;
          }

          .header-right-icon a:hover {
            background-color: #f3f4f6;
            color: #3b82f6;
          }

          .mobile-menu-icon {
            display: none;
            cursor: pointer;
            font-size: 24px;
            color: #374151;
          }

          /* Page Header Styles */
          .page-header {
            position: relative;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            min-height: 300px;
            display: flex;
            align-items: center;
            overflow: hidden;
          }

          .page-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(58, 87, 166, 0.8) 0%, #07294D 100%);
            z-index: 1;
          }

          .page-header .container {
            position: relative;
            z-index: 2;
            text-align: center;
            color: white;
          }

          .page-title {
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          }

          .breadcrumb-trail {
            background: rgba(255,255,255,0.1);
            padding: 12px 20px;
            border-radius: 25px;
            display: inline-block;
            backdrop-filter: blur(10px);
          }

          .breadcrumb-trail a,
          .breadcrumb-trail span {
            color: white;
            text-decoration: none;
            font-weight: 500;
          }

          .breadcrumb-trail a:hover {
            text-decoration: underline;
          }

          .trail-items {
            display: flex;
            align-items: center;
            gap: 8px;
            list-style: none;
            margin: 0;
            padding: 0;
          }

          .trail-items li:not(:last-child)::after {
            content: '/';
            margin-left: 8px;
            color: rgba(255,255,255,0.7);
          }

          /* Search Box Styles */
          .edubin-search-box {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 9999;
            display: none;
            align-items: center;
            justify-content: center;
          }

          .edubin-search-box.active {
            display: flex;
          }

          .edubin-search-form {
            background: white;
            padding: 40px;
            border-radius: 10px;
            max-width: 500px;
            width: 90%;
            position: relative;
          }

          .edubin-closebtn {
            position: absolute;
            top: 15px;
            right: 15px;
            cursor: pointer;
            width: 30px;
            height: 30px;
          }

          .edubin-closebtn span {
            position: absolute;
            width: 100%;
            height: 2px;
            background: #374151;
            top: 50%;
            left: 0;
            transform: translateY(-50%) rotate(45deg);
          }

          .edubin-closebtn span:last-child {
            transform: translateY(-50%) rotate(-45deg);
          }

          .edubin-search-form input {
            width: 100%;
            padding: 15px;
            border: 2px solid #e5e7eb;
            border-radius: 25px;
            font-size: 16px;
            outline: none;
          }

          .edubin-search-form input:focus {
            border-color: #3b82f6;
          }

          .edubin-search-form button {
            position: absolute;
            right: 45px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: #6b7280;
            font-size: 18px;
            cursor: pointer;
          }

          /* Responsive Design */
          @media (max-width: 768px) {
            .header-top .container {
              flex-direction: column;
              gap: 10px;
            }

            .contact-info {
              flex-wrap: wrap;
              justify-content: center;
            }

            .social {
              justify-content: center;
            }

            .main-menu {
              display: none;
            }

            .mobile-menu-icon {
              display: block;
            }

            .page-title {
              font-size: 2rem;
            }

            .header-area {
              flex-wrap: wrap;
              justify-content: space-between;
            }

            .site-branding img {
              max-width: 200px;
            }
          }

          @media (max-width: 480px) {
            .contact-info {
              flex-direction: column;
              gap: 5px;
            }

            .social-icons {
              gap: 8px;
            }

            .page-title {
              font-size: 1.8rem;
            }

            .breadcrumb-trail {
              padding: 10px 15px;
            }
          }
        `
      }} />
      <div className="header-top">
        <div className="container">
          {/* Desktop: show email/phone, Mobile: hide */}
          <div className="header-left hidden md:block">
            <ul className="contact-info list-inline">
              <li className="email list-inline-item">
                <FaEnvelope className="text-yellow-400" />
                <a href="mailto:info@eston.edu.gh">
                  info@eston.edu.gh
                </a>
              </li>

            </ul>
          </div>
          {/* Desktop: show all icons, Mobile: only show social icons */}
          <div className="header-right w-full flex justify-end">
            <div className="social w-full flex justify-end">
              <span className="follow-us hidden md:inline">Follow Us :</span>
              <ul className="social-icons alignright flex">
                <li className="twitter md:ml-2"><a href="https://twitter.com" title="Follow me on Twitter" target="_blank"><FaTwitter /></a></li>
                <li className="instagram md:ml-2"><a href="https://instagram.com" title="Follow me on Instagram" target="_blank"><FaInstagram /></a></li>
                <li className="youtube md:ml-2"><a href="https://youtube.com" title="Subscribe to me on YouTube" target="_blank"><FaYoutube /></a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <header id="header" className="header-sections is-header-sticky">
        <div className="container">
          <div className="header-menu sticky-active menu-effect-2">
            <div className="header-area flex items-center justify-between gap-8">
              <div className="site-branding flex items-center gap-6">
                <a href="https://www.eston.edu.gh/" className="custom-logo-link" rel="home">
                  <img width="180" height="60" src="https://www.eston.edu.gh/wp-content/uploads/2025/01/Eston-IT-College-logo.png" className="custom-logo" alt="Eston IT College" decoding="async" />
                </a>
              </div>
              <div className="flex-1"></div>
              {/* Hamburger menu for mobile */}
              <div className="lg:hidden block">
                <button
                  className="p-2 rounded focus:outline-none"
                  onClick={() => setShowMobileMenu((prev) => !prev)}
                  aria-label="Toggle navigation menu"
                >
                  <span className="sr-only">Open main menu</span>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-700" style={{ color: '#07294D' }}>
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                </button>
              </div>
              <nav
                id="site-navigation"
                className="main-navigation hidden lg:flex items-center gap-8 ml-auto"
                role="navigation"
              >
                <a href="https://www.eston.edu.gh/" className="font-semibold">Home</a>
                <a href="https://www.eston.edu.gh/our-courses/" className="font-semibold">Courses</a>
                <a href="https://www.eston.edu.gh/about-us/" className="font-semibold">About Us</a>
                <a href="https://www.eston.edu.gh/contact-us/" className="font-semibold">Contact Us</a>
                <a href="../admin" className="font-semibold">Admin</a>
              </nav>
              <div className="header-right-icon ml-4 hidden lg:block">
                <ul className="flex items-center gap-4 m-0">
                  <li className="top-search">
                      <a href="javascript:void(0)" id="search">
                        <FaSearch />
                      </a>
                  </li>
                </ul>
              </div>
              {/* Mobile dropdown menu */}
              {showMobileMenu && (
                <nav className="absolute top-full left-0 w-full bg-white shadow-lg z-50 flex flex-col items-center py-4 animate-fade-in lg:hidden">
                  <a href="https://www.eston.edu.gh/" className="font-semibold py-2 w-full text-center border-b">Home</a>
                  <a href="https://www.eston.edu.gh/our-courses/" className="font-semibold py-2 w-full text-center border-b">Courses</a>
                  <a href="https://www.eston.edu.gh/about-us/" className="font-semibold py-2 w-full text-center border-b">About Us</a>
                  <a href="https://www.eston.edu.gh/contact-us/" className="font-semibold py-2 w-full text-center border-b">Contact Us</a>
                  <a href="/admin" className="font-semibold py-2 w-full text-center">Admin</a>
                </nav>
              )}
            </div>
          </div>
        </div>
                            {/* Old navigation removed for clean JSX structure */}
        <div className="edubin-search-box">
          <div className="edubin-search-form">
            <div className="edubin-closebtn">
              <span></span>
              <span></span>
            </div>
            <form action="https://www.eston.edu.gh/" method="get">
              <input placeholder="Search Here.." type="text" name="s" id="popup-search" value="" />
              <button>
                <FaSearch />
              </button>
            </form>
          </div>
        </div>
      </header>

      <section className="page-header flex items-center justify-center min-h-[300px]" style={{ backgroundImage: "url('https://www.eston.edu.gh/wp-content/uploads/2024/03/eston-it-college-header.jpg')" }}>
        <div className="container flex flex-col items-center justify-center text-center w-full">
          <h2 className="page-title text-center w-full">Admissions</h2>
          <div className="header-breadcrumb w-full flex items-center justify-center">
            <nav role="navigation" aria-label="Breadcrumbs" className="breadcrumb-trail breadcrumbs w-auto">
              <ul className="trail-items flex items-center justify-center">
                <li className="trail-item trail-begin">
                  <a href="https://www.eston.edu.gh/" rel="home">
                    <span>Home</span>
                  </a>
                </li>
                <li className="trail-item trail-end">
                  <span>Admissions</span>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </section>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full bg-white shadow-xl rounded-lg p-8">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Apply for Admission</h1>
            <p className="text-gray-600 text-lg max-w-xl mx-auto">
              Welcome to Eston IT College! Please fill out this form to start the application process for admission. Ensure all details are accurate and complete. For any inquiries, contact us at{' '}
              <a href="mailto:info@eston.edu.gh" className="text-blue-600 underline">
                info@eston.edu.gh
              </a>{' '}
              or call +233 (0)302 280 388.
            </p>
          </header>

        {/* Step Indicator */}
        <div className="flex justify-center mb-8 space-x-4" aria-label="Progress">
          {[1, 2, 3].map((step) => (
            <React.Fragment key={step}>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white ${
                  currentStep >= step ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                aria-current={currentStep === step ? 'step' : undefined}
              >
                {step}
              </div>
              {step !== 3 && (
                <div
                  className={`flex-grow h-1 mt-5 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {currentStep === 1 && (
            <>
              <InputField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required={true}
                error={errors.firstName}
              />
              <InputField
                label="Middle Name"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                required={false}
                error={errors.middleName}
              />
              <InputField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required={false}
                error={errors.lastName}
              />
              <InputField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required={true}
                error={errors.email}
              />
              <SelectField
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required={true}
                error={errors.gender}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </SelectField>
              <InputField
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required={true}
                error={errors.dateOfBirth}
              />
              <InputField
                label="Residential Address"
                name="residentialAddress"
                value={formData.residentialAddress}
                onChange={handleChange}
                required={true}
                error={errors.residentialAddress}
              />
            </>
          )}

          {currentStep === 2 && (
            <>
              <InputField
                label="Street Address"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleChange}
                required={true}
                error={errors.streetAddress}
              />
              <InputField
                label="Street Address Line 2"
                name="streetAddressLine2"
                value={formData.streetAddressLine2}
                onChange={handleChange}
                required={true}
                error={errors.streetAddressLine2}
              />
              <InputField
                label="City/State/Province"
                name="cityStateProvince"
                value={formData.cityStateProvince}
                onChange={handleChange}
                required={true}
                error={errors.cityStateProvince}
              />
              <SelectField
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required={true}
                error={errors.country}
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </SelectField>

              {loadingCourses ? (
                <div className="mb-4 max-w-md mx-auto text-center text-blue-600">Loading courses...</div>
              ) : errorCourses ? (
                <div className="mb-4 max-w-md mx-auto text-center text-red-600">{errorCourses}</div>
              ) : (
                <SelectField
                  label="Course You Want to Do"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  required={true}
                  error={errors.course}
                >
                  <option value="">Select a Course</option>
                  {courses.map(({ id, name, code }) => (
                    <option key={id} value={name}>
                      {name} ({code})
                    </option>
                  ))}
                </SelectField>
              )}

              <InputField
                label="Institution Name (Last Attended)"
                name="institutionName"
                value={formData.institutionName}
                onChange={handleChange}
                required={true}
                error={errors.institutionName}
              />
            </>
          )}

          {currentStep === 3 && (
            <>
              <SelectField
                label="Highest Education"
                name="highestEducation"
                value={formData.highestEducation}
                onChange={handleChange}
                required={true}
                error={errors.highestEducation}
              >
                <option value="">Select Highest Education</option>
                <option value="JHS">JHS</option>
                <option value="SHS">SHS</option>
                <option value="College">College</option>
                <option value="University">University</option>
                <option value="Under Graduate">Under Graduate</option>
                <option value="Post Graduate">Post Graduate</option>
              </SelectField>

              <TextAreaField
                label="Reason for Course"
                name="reasonForCourse"
                value={formData.reasonForCourse}
                onChange={handleChange}
                required={true}
                error={errors.reasonForCourse}
              />

              <SelectField
                label="How did you hear about Eston IT College?"
                name="howHear"
                value={formData.howHear}
                onChange={handleChange}
                required={true}
                error={errors.howHear}
              >
                <option value="">Select an option</option>
                <option value="Social Media">Social Media</option>
                <option value="Friend/Family">Friend/Family</option>
                <option value="Online Ad">Online Ad</option>
                <option value="School Event">School Event</option>
                <option value="Other">Other</option>
              </SelectField>

              <div className="mb-4 max-w-md mx-auto">
                <label htmlFor="declaration" className="flex items-center text-sm font-medium text-black">
                  <input
                    type="checkbox"
                    id="declaration"
                    name="declaration"
                    checked={formData.declaration}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, declaration: e.target.checked }));
                      setErrors((prev) => ({ ...prev, declaration: '' }));
                    }}
                    required={true}
                    className="mr-2"
                  />
                  I hereby declare that the information provided here set forth are true and correct to the best of my knowledge. I understand that misrepresentation herein may cause the withdrawal of my application for admission.
                </label>
                {errors.declaration && <p className="text-red-500 text-sm mt-1">{errors.declaration}</p>}
              </div>
            </>
          )}

          <div className="flex justify-between mt-4 max-w-md mx-auto">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
                disabled={submitting}
              >
                Previous
              </button>
            )}
            {currentStep < 3 && (
              <button
                type="button"
                onClick={nextStep}
                className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Next
              </button>
            )}
            {currentStep === 3 && (
              <button
                type="submit"
                disabled={submitting || loadingCourses || errorCourses}
                className={`ml-auto px-4 py-2 rounded-md focus:outline-none focus:ring-2 ${
                  submitting || loadingCourses || errorCourses
                    ? 'bg-green-300 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  </>
  );
};

export default ApplicationForm;
