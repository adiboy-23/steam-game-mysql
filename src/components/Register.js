import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    userId: '',
    userName: '',
    password: '',
    userType: 'User', // Note: Matching the case in your database
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Auto-generate UserId based on userType
  const generateUserId = (userType) => {
    switch(userType) {
      case 'User':
        return '10'; // Users start with 10
      case 'Developer':
        return '20'; // Developers start with 20
      case 'Publisher':
        return '30'; // Publishers start with 30
      default:
        return '10';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      // Get the next available ID
      const response = await axios.get(`http://localhost:3001/api/nextId/${formData.userType}`);
      const nextId = response.data.nextId;

      const registrationData = {
        ...formData,
        userId: nextId
      };

      const registerResponse = await axios.post('http://localhost:3001/api/register', registrationData);
      
      if (registerResponse.data.success) {
        setMessage('Registration successful! Your User ID is: ' + nextId);
        setFormData({
          userId: '',
          userName: '',
          password: '',
          userType: 'User',
        });
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1b2838]">
      <div className="bg-[#2a475e] p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">Register New Account</h2>
        
        {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{message}</div>}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white mb-2">User Type</label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="w-full p-2 rounded bg-[#1b2838] text-white border border-gray-600 focus:border-blue-500"
            >
              <option value="User">User</option>
              <option value="Developer">Developer</option>
              <option value="Publisher">Publisher</option>
            </select>
          </div>

          <div>
            <label className="block text-white mb-2">Username</label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="w-full p-2 rounded bg-[#1b2838] text-white border border-gray-600 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 rounded bg-[#1b2838] text-white border border-gray-600 focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#66c0f4] hover:bg-[#4fa3d9] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
