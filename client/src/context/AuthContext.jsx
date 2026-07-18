import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi, register as registerApi, logout as logoutApi } from '../api/auth';
import { auth, db } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // Firebase handles tokens, but we keep the state for compatibility
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        const tokenStr = await firebaseUser.getIdToken();
        setToken(tokenStr);
        
        // Fetch custom user data (role, etc.)
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        let userData = { role: 'User', username: firebaseUser.email };
        if (userDoc.exists()) {
          userData = userDoc.data();
        }
        
        setUser({
          _id: firebaseUser.uid,
          email: firebaseUser.email,
          ...userData
        });
      } else {
        // User is signed out
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (credentials) => {
    // The actual login happens in the API, which triggers onAuthStateChanged
    const data = await loginApi(credentials);
    return data;
  };

  const register = async (userData) => {
    return await registerApi(userData);
  };

  const logout = async () => {
    await logoutApi();
  };

  const isAdmin = user?.role === 'Admin';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
