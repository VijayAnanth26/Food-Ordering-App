'use client';

import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useLocale } from 'next-intl';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    const initializeAuth = async () => {
      const sessionUser = sessionStorage.getItem('user');
      if (sessionUser) {
        setUser(JSON.parse(sessionUser));
      }

      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        setUsers(data);
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
      sessionStorage.setItem('user', JSON.stringify(match));
      router.push('/', { locale });
    } else {
      alert('Invalid credentials. Please try again.');
    }
  };

  const logout = () => {
    sessionStorage.removeItem('user');
    setUser(null);
    router.push('/login', { locale });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, users, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
