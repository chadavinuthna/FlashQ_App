import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('student'); // 'student' | 'admin'
  const [studentRoll, setStudentRoll] = useState('23B81A0501');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const loginStudent = async (roll, password, studentsMap) => {
    const rec = studentsMap[roll];
    if (rec && rec.password === password) {
      setStudentRoll(roll);
      setUser({ uid: roll, email: rec.email, roll });
      setRole('student');
      return { success: true };
    }
    return { success: false, message: 'Invalid roll number or password' };
  };

  const signupStudent = async (email, roll, password, setStudentsMap) => {
    setStudentsMap(prev => ({
      ...prev,
      [roll]: { name: 'New Student', email, password }
    }));
    return { success: true };
  };

  const loginAdmin = async (email, password) => {
    if (email === 'admin@college.edu' && password === 'admin123') {
      setUser({ uid: 'admin-1', email, role: 'admin' });
      setRole('admin');
      return { success: true };
    }
    return { success: false, message: 'Invalid admin credentials' };
  };

  const logout = () => {
    if (auth) signOut(auth).catch(() => {});
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        setRole,
        studentRoll,
        setStudentRoll,
        loginStudent,
        signupStudent,
        loginAdmin,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
