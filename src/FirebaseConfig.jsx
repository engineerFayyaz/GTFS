// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBvqUHysbjYNn3nAg8pNhD8eA0LmbSOlX0",
  authDomain: "bus-driver-navigation.firebaseapp.com",
  databaseURL: "https://bus-driver-navigation-default-rtdb.firebaseio.com",
  projectId: "bus-driver-navigation",
  storageBucket: "bus-driver-navigation.appspot.com",
  messagingSenderId: "649443007271",
  appId: "1:649443007271:web:edfa5fc2853891f63fe702",
  measurementId: "G-HGBFY01SR1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


export { app, analytics };