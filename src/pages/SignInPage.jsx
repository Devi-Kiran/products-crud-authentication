import React, { useState } from "react";
import EntryPageSideBox from "../components/EntryPageSideBox";
import Button from "@material-ui/core/Button";
import { auth, signInWithGoogle } from "../firebase-config";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInAnonymously,
} from "firebase/auth";
import { RxMobile } from "react-icons/rx";
import LogInWithPhone from "../components/LoginInWithPhone";

function SignInPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", password: "" });
  const [isEmailValid, setEmailValid] = useState(false);
  const [isPasswordValid, setPasswordValid] = useState(false);
  const { email, password } = user;

  const [isOpenLogInWithPhoneForm,setOpenLogInWithPhoneForm] = useState(false);
  const openLogInWithPhoneForm = () => setOpenLogInWithPhoneForm(true);
  const closeLogInWithPhoneForm = () => setOpenLogInWithPhoneForm(false);

  const inputHandler = (e) => {
    setUser((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const signUp = async (e) => {
    const enteredEmail = email;
    const emailPattern = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;
    const emailResult = emailPattern.test(enteredEmail);
    const enteredPassword = password;
    const passwordPattern = /^[a-zA-Z0-9]{8,20}$/;
    const passwordResult = passwordPattern.test(enteredPassword);

    e.preventDefault();
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
        <div className="shadow-xl rounded-xl px-3 py-5 w-[350px]">
          <h1 className="text-3xl font-bold mb-1 text-center">signup</h1>
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

              <Button
                onClick={signUp}
                variant="contained"
                color="primary"
                style={{
                  background: "#007DFC",
                  color: "white",
                  width: "100%",
                  padding: "7px 0px 7px 0px",
                  marginTop: "20px",
                }}
              >
                sign in
              </Button>
            </div>
          </form>

          <div className="text-center my-5">
            <p className="mb-[-5px]">
              Already have an account?{" "}
              <Link to="/" className="text-brandColor font-bold">
                Login
              </Link>
            </p>

            <div className="relative inline-flex items-center justify-center w-11/12">
              <hr className="w-11/12 h-px my-8 bg-gray-400 border-0 dark:bg-gray-700" />
              <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">
                Or
              </span>
            </div>
            
            <button
              className="border-2 border-brandColor rounded font-bold w-full mb-2"
              onClick={() => signInWithGoogle()}
            >
              <div className="flex items-center justify-center px-3 py-1.5 justify-center">
                <img
                  className="w-5 h-5 mt-[1.5px] mr-2"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2008px-Google_%22G%22_Logo.svg.png"
                />
                Continue With Google
              </div>
            </button>

            <button
              className="border-2 border-brandColor rounded font-bold w-full"
              onClick={openLogInWithPhoneForm}
            >
              <div className="flex items-center justify-center px-3 py-1.5 justify-center">
                <RxMobile  className="w-5 h-5 mt-[1.5px] mr-2"/>
                Continue With Phone
              </div>
            </button>
          </div>
        </div>
      </div>
      <LogInWithPhone isOpenLogInWithPhoneForm={isOpenLogInWithPhoneForm} closeLogInWithPhoneForm={closeLogInWithPhoneForm}/>
      <div id="recapcha-container"></div>
    </div>
  );
}

export default SignInPage;
