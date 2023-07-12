import React, { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { auth } from "./firebase-config";
import { onAuthStateChanged } from "firebase/auth";

function PrivateRoutes() {
  const [token, setToken] = useState({
    loading: true,
    data: ''
  });

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setToken({
        loading: false,
        data: currentUser?.uid
      });
    });
  }, []);

  if(token.loading) return <p>Loading...</p>
  return token.data ? <Outlet /> : <Navigate to="/" />
}

export default PrivateRoutes;
