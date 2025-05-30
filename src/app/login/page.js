'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

export default function LoginPage() {
  const { login } = useAuth();

  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetch('/api/users');
        if (!res.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError('Failed to load users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // When email changes, autofill role and country
  const handleEmailChange = (e) => {
    const selectedEmail = e.target.value;
    setEmail(selectedEmail);
    setError('');

    const user = users.find((u) => u.email === selectedEmail);
    if (user) {
      setRole(user.role);
      setCountry(user.country);
    } else {
      setRole('');
      setCountry('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await login(email, role, country);
    } catch (err) {
      console.error('Login failed:', err);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md space-y-8 border border-orange-100">
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto mb-6">
            <Image
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=orange&shade=600"
              alt="Fury Foods"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
          <h2 className="text-3xl font-extrabold text-orange-600 mb-2">Login to Fury Foods</h2>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <select
              value={email}
              onChange={handleEmailChange}
              required
              disabled={loading}
              className={`w-full border rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
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
              disabled={!email || loading}
              className={`w-full bg-orange-600 hover:bg-orange-500 text-white font-semibold py-2 rounded-md transition duration-200 shadow ${
                (!email || loading) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Loading...' : 'Login'}
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
