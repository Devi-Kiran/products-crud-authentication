import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import { BsFillPlayFill } from "react-icons/bs";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

function EntryPage() {
  const [user, setUser] = useState({email: "",password: ""});
  const [isEmailValid, setEmailValid] = useState(false);
  const [isPasswordValid, setPasswordValid] = useState(false);
  const [isIncorrectInfo, setIncorrectInfo] = useState(false);
  const { email, password } = user;
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth,currentUser => {
      currentUser?.uid && navigate("/dashboard")
    })
  },[])
  
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
    setEmailValid(!emailResult);

    const enteredPassword = password;
    const passwordPattern = /^[a-zA-Z0-9]{8,20}$/;
    const passwordResult = passwordPattern.test(enteredPassword);
    setPasswordValid(!passwordResult);

    if (!emailResult || !passwordResult) return;

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Your Account Is Successfully Created, Now You Can Login", {
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

  const logIn = async () => {
    const enteredEmail = email;
    const emailPattern = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;
    const emailResult = emailPattern.test(enteredEmail);
    setEmailValid(!emailResult);

    const enteredPassword = password;
    const passwordPattern = /^[a-zA-Z0-9]{8,20}$/;
    const passwordResult = passwordPattern.test(enteredPassword);
    setPasswordValid(!passwordResult);

    if (!emailResult || !passwordResult) return;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (e) {
      if (isEmailValid === false && isPasswordValid === false) {
        setIncorrectInfo(true);
      }
    }
  };

  return (
    <div className="bg-white h-screen flex">
      <div className="hidden md:flex justify-center items-center h-screen w-2/4 bg-gradient-to-bl from-brandColor to-black">
        <div className="bg-white  p-6 rounded-xl">
          <p className="text-4xl font-bold leading-20">
            <BsFillPlayFill />
            Products
            <br />
            platform
            <br />
            for stock
            <br />
            <span className="text-brandColor">managament</span>
          </p>
        </div>
      </div>

      <div className="h-screen md:w-2/4 px-3 grow flex justify-center items-center">
        <div className="shadow-xl rounded-xl px-3 py-5">
          <h1 className="text-2xl font-bold mb-1">hey,hello</h1>
          <p className="text-slate-400 capitalize mb-3">
            enter the information you entered while registering
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
                    setIncorrectInfo(false);
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
                    setIncorrectInfo(false);
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
                  onClick={logIn}
                  variant="contained"
                  color="primary"
                  style={{ background: "#007DFC", color: "white" }}
                >
                  login
                </Button>
                <button onClick={signUp} className="hover:underline">
                  create an account
                </button>
              </div>
              <div className="flex justify-center mt-5">
                {isIncorrectInfo && (
                  <p className="max-w-xs text-red-700 text-center">
                    Sorry, your password was incorrect. Please double-check your
                    password.
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EntryPage;
