// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDH1S71AbxJKopk3xk6bMEgewOCwyVadQk",
  authDomain: "buskersbrightest.firebaseapp.com",
  projectId: "buskersbrightest",
  storageBucket: "buskersbrightest.appspot.com",
  messagingSenderId: "282540801748",
  appId: "1:282540801748:web:8867d065045df6ac270541",
  measurementId: "G-XPBM5SH5BF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;