import React, { useState } from "react";
import EntryPageSideBox from "../components/EntryPageSideBox";
import Button from "@material-ui/core/Button";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";

function SignInPage() {
  const [user, setUser] = useState({ email: "", password: "" });
  const [isEmailValid, setEmailValid] = useState(false);
  const [isPasswordValid, setPasswordValid] = useState(false);
  const { email, password } = user;
  const navigate = useNavigate();

  const inputHandler = (e) => {
    setUser((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const signUp = async (e) => {
    e.preventDefault();
    const enteredEmail = email;
    const emailPattern = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;
    const emailResult = emailPattern.test(enteredEmail);
    const enteredPassword = password;
    const passwordPattern = /^[a-zA-Z0-9]{8,20}$/;
    const passwordResult = passwordPattern.test(enteredPassword);

    setEmailValid(!emailResult);
    setPasswordValid(!passwordResult);

    if (!emailResult || !passwordResult) return;

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
      toast.success("Your Account Is Successfully Created", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: false,
        theme: "dark",
      });
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <div className="bg-white h-screen flex">
      <EntryPageSideBox />

      <div className="h-screen md:w-2/4 px-3 grow flex justify-center items-center">
        <div className="shadow-xl rounded-xl px-3 py-5">
          <h1 className="text-2xl font-bold mb-1">hey,hello</h1>
          <p className="text-slate-400 capitalize mb-3">
            Please provide the required information for registration.
          </p>
          <form autoComplete="off">
            <div>
              <div className="py-1">
                <label
                  className="block capitalize mb-[5px] font-semibold text-brandColor"
                  htmlFor="email"
                >
                  email
                </label>
                <input
                  id="email"
                  className="border-2 border-brandColor w-full rounded px-1.5 py-2"
                  type="email"
                  name="email"
                  value={email}
                  onChange={inputHandler}
                  onFocus={() => {
                    setEmailValid(false);
                  }}
                />
                {isEmailValid && (
                  <p className="text-red-600 capitalize">
                    email is not invalid
                  </p>
                )}
              </div>
              <div className="py-1">
                <label
                  className="block capitalize mb-[5px] font-semibold text-brandColor"
                  htmlFor="password"
                >
                  password
                </label>
                <input
                  id="password"
                  className="border-2 border-brandColor w-full rounded px-1.5 py-2"
                  name="password"
                  type="password"
                  value={password}
                  onChange={inputHandler}
                  onFocus={() => {
                    setPasswordValid(false);
                  }}
                />
                {isPasswordValid && (
                  <p className="text-red-600 capitalize">
                    password must be atleast 8 characters
                  </p>
                )}
              </div>
              <div className="flex justify-between mt-3">
                <Button
                  onClick={signUp}
                  variant="contained"
                  color="primary"
                  style={{ background: "#007DFC", color: "white" }}
                >
                  sign in
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
