import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {getStorage} from "firebase/storage"; 

const firebaseConfig = {
    apiKey: "AIzaSyBHwA4BfOGZQrKkrFX3IPsNy62PCcJDbTw",
    authDomain: "testing-21614.firebaseapp.com",
    projectId: "testing-21614",
    storageBucket: "testing-21614.appspot.com",
    messagingSenderId: "707646001515",
    appId: "1:707646001515:web:ccf0218faa2db45ea4fc2e",
    measurementId: "G-5QDF2KC2ZT"
};

  const app = initializeApp(firebaseConfig);
  export const db = getFirestore(app);
  export const storage = getStorage(app);

  export const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  export const signInWithGoogle = () => {
    signInWithPopup(auth,provider).then(result => {
      const name = result.user.displayName;
      const email = result.user.email;
      const profilePic = result.user.photoURL;

      localStorage.setItem("name", name);
      localStorage.setItem("email", email);
      localStorage.setItem("profilePic", profilePic);
    }).catch(e => {
      console.log(e.message);
    })
  } 