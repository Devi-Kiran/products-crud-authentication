import React, { useState, useEffect } from "react";
import { Modal } from "react-responsive-modal";
import Button from "@material-ui/core/Button";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  onAuthStateChanged,
} from "firebase/auth";
import "react-responsive-modal/styles.css";

function LogInWithPhone({
  isOpenLogInWithPhoneForm,
  closeLogInWithPhoneForm,
  loginPage,
}) {
  const contryCode = "+91";
  const [phoneNumber, setPhoneNumber] = useState(contryCode);
  const [expandForm, setExpandForm] = useState(false);
  const [OTP, setOTP] = useState("");
  const [isValidOTP, setIsValidOTP] = useState(false);

  const navigate = useNavigate();

  const generateRecapcha = () => {
    window.RecaptchaVerifier = new RecaptchaVerifier(
      "recapcha-container",
      {
        size: "invisible",
        callback: (response) => {},
      },
      auth
    );
  };

  const requestOTP = (e) => {
    e.preventDefault();
    if (phoneNumber.length >= 12) {
      setExpandForm(true);
      generateRecapcha();
      let appVerifier = window.RecaptchaVerifier;
      signInWithPhoneNumber(auth, phoneNumber, appVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
          toast.info("OTP sent to your device", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "dark",
          });
        })
        .catch((error) => {
            console.log(error.message.includes("(auth/too-many-requests)"))
          if(error.message.includes("(auth/too-many-requests)")) {
            toast.error("Multiple login attempts, please retry later.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "dark",
                });
          }
        });
    }
  };

  const verifyOTP = (e) => {
    let otp = e.target.value;
    setOTP(otp);
    if (otp?.length === 6) {
      let confirmationResult = window.confirmationResult;
      confirmationResult
        ?.confirm(otp)
        .then((result) => {})
        .catch((error) => {
          setIsValidOTP(true);
          console.log(error);
        });
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      currentUser?.uid && navigate("/dashboard");
    });
  }, []);

  return (
    <Modal
      open={isOpenLogInWithPhoneForm}
      onClose={closeLogInWithPhoneForm}
      center
    >
      <h2 className="text-lg font-bold capitalize ml-2">
        {loginPage ? "Login" : "Signin"} With Phone
      </h2>
      <form onSubmit={requestOTP} autoComplete="off" className="px-3">
        <div className="py-2">
          <label className="block capitalize mb-[5px]" htmlFor="addProductName">
            Phone Number
          </label>
          <input
            className="border-2 border-brandColor w-64 rounded px-1.5 py-1"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        {expandForm === true && (
          <div className="py-2">
            <label
              className="block capitalize mb-[5px]"
              htmlFor="addProductImage"
            >
              OTP
            </label>
            <input
              className="border-2 border-brandColor w-64 rounded px-1.5 py-1"
              type="number"
              placeholder="enter 6 digit OTP"
              value={OTP}
              onChange={verifyOTP}
            />
            {isValidOTP && (
              <p className="text-red-600 capitalize">please enter valid OTP</p>
            )}
          </div>
        )}

        {expandForm === false && (
          <Button
            variant="contained"
            type="submit"
            color="primary"
            style={{
              background: "#007DFC",
              color: "white",
              width: "100%",
              padding: "7px 0px 7px 0px",
              marginTop: "20px",
            }}
          >
            login
          </Button>
        )}
      </form>
    </Modal>
  );
}

export default LogInWithPhone;
