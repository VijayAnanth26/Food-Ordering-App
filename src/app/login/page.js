'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();

  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [country, setCountry] = useState('');

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };
    fetchUsers();
  }, []);

  // When email changes, autofill role and country
  const handleEmailChange = (e) => {
    const selectedEmail = e.target.value;
    setEmail(selectedEmail);

    const user = users.find((u) => u.email === selectedEmail);
    if (user) {
      setRole(user.role);
      setCountry(user.country);
    } else {
      setRole('');
      setCountry('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, role, country);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md space-y-8 border border-orange-100">
        <div className="text-center">
          <img
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=orange&shade=600"
            alt="Fury Foods"
            className="mx-auto h-12 w-auto mb-6"
          />
          <h2 className="text-3xl font-extrabold text-orange-600 mb-2">Login to Fury Foods</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <select
              value={email}
              onChange={handleEmailChange}
              required
              className="w-full border rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select Dummy Email</option>
              {users.map(({ email }) => (
                <option key={email} value={email}>
                  {email}
                </option>
              ))}
            </select>
          </div>
          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              disabled
              className="w-full border rounded-md p-2 bg-gray-100 cursor-not-allowed"
            >
              <option value="">Select Role</option>
              {role && <option value={role}>{role}</option>}
            </select>
          </div>
          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              disabled
              className="w-full border rounded-md p-2 bg-gray-100 cursor-not-allowed"
            >
              <option value="">Select Country</option>
              {country && <option value={country}>{country}</option>}
            </select>
          </div>
          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-semibold py-2 rounded-md transition duration-200 shadow"
              disabled={!email}
            >
              Login
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-gray-500">
          New to Fury Foods? <span className="text-orange-600 font-medium">Ask Nick Fury</span>
        </p>
      </div>
    </div>
  );
}
