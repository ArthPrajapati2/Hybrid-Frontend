import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CollegePortal = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('registration');

  const [registrationForm, setRegistrationForm] = useState({
    studentId: '',
    firstName: '',
    lastName: '',
    email: '',
    program: ''
  });

  const [enrollmentForm, setEnrollmentForm] = useState({
    studentId: '',
    courseId: ''
  });

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/students`);
      setStudents(response.data);
    } catch (err) {
      setError('Failed to fetch students');
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/courses`);
      setCourses(response.data);
    } catch (err) {
      setError('Failed to fetch courses');
    }
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/students/register`, registrationForm);
      setSuccess('Student registered successfully');
      fetchStudents();
      setRegistrationForm({
        studentId: '',
        firstName: '',
        lastName: '',
        email: '',
        program: ''
      });
    } catch (err) {
      setError('Registration failed');
    }
  };

  const handleEnrollment = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/enrollments`, enrollmentForm);
      setSuccess('Course enrollment successful');
      fetchStudents();
    } catch (err) {
      setError('Enrollment failed');
    }
  };

  const handleDeenrollment = async (studentId, courseId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/enrollments/${studentId}/${courseId}`);
      setSuccess('Course de-enrollment successful');
      fetchStudents();
    } catch (err) {
      setError('De-enrollment failed');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-center">College Portal</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded ${activeTab === 'registration' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('registration')}
        >
          Registration
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'enrollment' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('enrollment')}
        >
          Enrollment
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'students' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('students')}
        >
          Students
        </button>
      </div>

      {activeTab === 'registration' && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Register New Student</h2>
          <form onSubmit={handleRegistration} className="space-y-4">
            <input
              className="w-full p-2 border rounded"
              placeholder="Student ID"
              value={registrationForm.studentId}
              onChange={(e) => setRegistrationForm({ ...registrationForm, studentId: e.target.value })}
            />
            <input
              className="w-full p-2 border rounded"
              placeholder="First Name"
              value={registrationForm.firstName}
              onChange={(e) => setRegistrationForm({ ...registrationForm, firstName: e.target.value })}
            />
            <input
              className="w-full p-2 border rounded"
              placeholder="Last Name"
              value={registrationForm.lastName}
              onChange={(e) => setRegistrationForm({ ...registrationForm, lastName: e.target.value })}
            />
            <input
              className="w-full p-2 border rounded"
              type="email"
              placeholder="Email"
              value={registrationForm.email}
              onChange={(e) => setRegistrationForm({ ...registrationForm, email: e.target.value })}
            />
            <input
              className="w-full p-2 border rounded"
              placeholder="Program"
              value={registrationForm.program}
              onChange={(e) => setRegistrationForm({ ...registrationForm, program: e.target.value })}
            />
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
              Register Student
            </button>
          </form>
        </div>
      )}

      {activeTab === 'enrollment' && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Course Enrollment</h2>
          <form onSubmit={handleEnrollment} className="space-y-4">
            <select
              className="w-full p-2 border rounded"
              value={enrollmentForm.studentId}
              onChange={(e) => setEnrollmentForm({ ...enrollmentForm, studentId: e.target.value })}
            >
              <option value="">Select Student</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.firstName} {student.lastName}
                </option>
              ))}
            </select>
            <select
              className="w-full p-2 border rounded"
              value={enrollmentForm.courseId}
              onChange={(e) => setEnrollmentForm({ ...enrollmentForm, courseId: e.target.value })}
            >
              <option value="">Select Course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
              Enroll in Course
            </button>
          </form>
        </div>
      )}

      {activeTab === 'students' && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Enrolled Students</h2>
          <div className="space-y-4">
            {students.map(student => (
              <div key={student.id} className="border p-4 rounded">
                <h3 className="font-bold">{student.firstName} {student.lastName}</h3>
                <p>Student ID: {student.studentId}</p>
                <p>Program: {student.program}</p>
                <div className="mt-2">
                  <h4 className="font-semibold">Enrolled Courses:</h4>
                  {student.enrolledCourses?.map(course => (
                    <div key={course.id} className="flex justify-between items-center mt-1">
                      <span>{course.name}</span>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                        onClick={() => handleDeenrollment(student.id, course.id)}
                      >
                        De-enroll
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegePortal;