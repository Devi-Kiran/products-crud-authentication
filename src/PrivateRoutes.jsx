import React, { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { auth } from "./firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { Oval } from "react-loader-spinner";

function PrivateRoutes() {
  const [token, setToken] = useState({
    loading: true,
    data: "",
  });

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setToken({
        loading: false,
        data: currentUser?.uid,
      });
    });
  }, []);

  if (token.loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Oval
          height={80}
          width={80}
          color="#007dfc"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="rgba(0, 125, 252,0.5)"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      </div>
    );
  }
  return token.data ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateRoutes;
