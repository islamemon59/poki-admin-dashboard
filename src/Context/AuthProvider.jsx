import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../Firebase/Firebase.config";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const signInUser = (email, password) => {
    setLoading(true)
   return signInWithEmailAndPassword(auth, email, password)
  }

  const signOutUser = () => {
    setLoading(true);
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log("Current User", currentUser);
      setLoading(false);
    });

    return () => {
      unsubscribe;
    };
  }, []);

  const userInfo = {
    name: "name",
    loading,
    setLoading,
    user,
    setUser,
    signOutUser,
    signInUser,
  };
  return <AuthContext value={userInfo}>{children}</AuthContext>;
};

export default AuthProvider;
