import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaPhone, FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaSearch } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
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
    phoneNumber: '',
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
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/courses`, { withCredentials: true });
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
      const fields = ['firstName', 'lastName', 'phoneNumber', 'email', 'gender', 'dateOfBirth', 'residentialAddress'];
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
      await axios.post(`${process.env.REACT_APP_API_URL}/api/applications`, payload);
      alert('Application submitted successfully!');
      // Clear all form fields after successful submission
      setFormData({
        firstName: '',
        middleName: '',
        lastName: '',
        phoneNumber: '',
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
);

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
                label="Phone Number"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                required={true}
                error={errors.phoneNumber}
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
