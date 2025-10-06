import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "../Firebase/Firebase.config";

const provider = new GoogleAuthProvider()

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const createUser = (email, password) => {
    setLoading(true)
   return createUserWithEmailAndPassword(auth, email, password);
  };

  const signOutUser = () => {
    setLoading(true);
    return signOut(auth);
  };

  const signInWithGoogle = () => {
    setLoading(true)
   return signInWithPopup(auth, provider)
  }

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
    createUser,
    signInWithGoogle
  };
  return <AuthContext value={userInfo}>{children}</AuthContext>;
};

export default AuthProvider;
