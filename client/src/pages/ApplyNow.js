import React, { useState } from "react";
import axios from 'axios';

const courses = [
  "Diploma in Software Engineering",
  "Diploma in Networking & Cybersecurity",
  "Diploma in Data Science",
  "Diploma in Web Development",
  "Diploma in Graphic Design"
];

export default function ApplyNow() {
  const [form, setForm] = useState({
    name: "",
    middleName: "",
    email: "",
    phone: "",
    residentAddress: "",
    streetAddress: "",
    streetAddressLine2: "",
    cityStateProvince: "",
    course: "",
    institutionName: "",
    dob: "",
    howHear: "",
    message: "",
    declaration: false
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    try {
      await axios.post('/api/applications', {
        firstName: form.name,
        middleName: form.middleName,
        lastName: '', // Not available in ApplyNow form
        email: form.email,
        gender: '', // Not available in ApplyNow form
        residentialAddress: form.residentAddress,
        streetAddress: form.streetAddress,
        streetAddressLine2: form.streetAddressLine2,
        cityStateProvince: form.cityStateProvince,
        country: '', // Not available in ApplyNow form
        course: form.course,
        institutionName: form.institutionName,
        highestEducation: '', // Not available in ApplyNow form
        dateOfBirth: form.dob,
        reasonForCourse: form.message, // Using message for reasonForCourse
        howHear: form.howHear,
        declaration: form.declaration,
      });
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Apply Now</h2>
      <p className="mb-6 text-center text-gray-600">
        Empowering Careers Through Expert ICT Training, Global Certifications, and Job Placement Support – Join Us Today!
      </p>
      {submitted ? (
        <div className="text-green-600 font-semibold text-center">Thank you for your application! We will contact you soon.</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="middleName"
            value={form.middleName}
            onChange={handleChange}
            placeholder="Middle Name"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            required
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="residentAddress"
            value={form.residentAddress}
            onChange={handleChange}
            placeholder="Resident Address"
            required
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="streetAddress"
            value={form.streetAddress}
            onChange={handleChange}
            placeholder="Street Address"
            required
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="streetAddressLine2"
            value={form.streetAddressLine2}
            onChange={handleChange}
            placeholder="Street Address Line 2 (optional)"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="cityStateProvince"
            value={form.cityStateProvince}
            onChange={handleChange}
            placeholder="City/State/Province"
            required
            className="w-full border px-3 py-2 rounded"
          />
          <select
            name="course"
            value={form.course}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Course</option>
            {courses.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            type="text"
            name="institutionName"
            value={form.institutionName}
            onChange={handleChange}
            placeholder="Institution Name (e.g., High School, College)"
            required
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
          <div className="flex items-center">
            <label htmlFor="howHear" className="block text-sm font-medium text-gray-700 mr-2">
              How did you hear about Eston IT College?
            </label>
            <select
              id="howHear"
              name="howHear"
              value={form.howHear}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select an option</option>
              <option value="Social Media">Social Media</option>
              <option value="Friend/Family">Friend/Family</option>
              <option value="Online Ad">Online Ad</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Additional Message (optional)"
            className="w-full border px-3 py-2 rounded"
          />
          <div className="flex items-start">
            <input
              type="checkbox"
              name="declaration"
              checked={form.declaration}
              onChange={(e) => setForm({ ...form, declaration: e.target.checked })}
              required
              className="mt-1 mr-2"
            />
            <label htmlFor="declaration" className="text-sm text-gray-700">
              I hereby declare that the information provided here set forth are true and correct to the best of my knowledge. I understand that misrepresentation herein may cause the withdrawal of my application for admission.
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700"
          >
            Submit Application
          </button>
        </form>
      )}
    </div>
  );
}
