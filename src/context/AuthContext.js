'use client';

import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        setUsers(data);

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Failed to load users:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (email, role, country) => {
    const match = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.role.toLowerCase() === role.toLowerCase() &&
        u.country.toLowerCase() === country.toLowerCase()
    );

    if (match) {
      setUser(match);
      localStorage.setItem('user', JSON.stringify(match));
      router.push('/');
    } else {
      alert('Invalid credentials. Please try again.');
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null); // This triggers the useEffect below
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, users }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
