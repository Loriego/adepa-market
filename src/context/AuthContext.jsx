import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import toast from "react-hot-toast";
import { auth } from "../firebase/firebaseConfig";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const adminEmails = [
    "stallonerouffab@gmail.com",
  ];

  const isAdmin = user ? adminEmails.includes(user.email) : false;

  const signup = async (email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    toast.success("Account created successfully");
    return result;
  };

  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    toast.success("Login successful");
    return result;
  };

  const logout = async () => {
    await signOut(auth);
    toast.success("Logged out");
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}