// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, getMe, logout as apiLogout } from '../api/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthProvider → Mounted & starting auth check (should appear only once)");

    let isMounted = true;

    const checkAuth = async () => {
      try {
        console.log("AuthProvider → Sending request to /api/auth/me");
        const res = await getMe();
        console.log("AuthProvider → /me success → user:", res.data.data?.email || 'no email');
        if (isMounted) {
          setUser(res.data.data);
        }
      } catch (err) {
        console.log("AuthProvider → /me failed (likely 401/no cookie) → user set to null");
        if (isMounted) {
          setUser(null);
        }
      } finally {
        console.log("AuthProvider → auth check completed → loading = false");
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    // Cleanup
    return () => {
      isMounted = false;
      console.log("AuthProvider → Unmounting / cleanup");
    };
  }, []); // ← EMPTY array = run ONLY once on mount

  const signIn = async (email, password) => {
    console.log("AuthProvider → signIn called with email:", email);
    const res = await apiLogin(email, password);
    console.log("AuthProvider → signIn success → setting user");
    setUser(res.data.data || { email });
    toast.success('Logged in successfully');
  };

  const signOut = async () => {
    console.log("AuthProvider → signOut called");
    await apiLogout();
    setUser(null);
    toast.success('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}