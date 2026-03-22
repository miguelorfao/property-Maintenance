// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// To get this config:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project or select existing
// 3. Go to Project settings > General > Your apps
// 4. Add a web app and copy the config here
const firebaseConfig = {
  apiKey: "AIzaSyDmqD_9Dzkx8g97FlwCV-7OcY-r-OtQjzs",
  authDomain: "property-a3aea.firebaseapp.com",
  projectId: "property-a3aea",
  storageBucket: "property-a3aea.firebasestorage.app",
  messagingSenderId: "729582074514",
  appId: "1:729582074514:web:285495261af252c789044b",
  measurementId: "G-JBWZKCZKNG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
let db;
db = getFirestore(app, "properties");
console.log(app.options.projectId);
export { db };
