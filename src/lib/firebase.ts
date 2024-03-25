// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "aideation-indu.firebaseapp.com",
    projectId: "aideation-indu",
    storageBucket: "aideation-indu.appspot.com",
    messagingSenderId: "167467017102",
    appId: "1:167467017102:web:e89c11ea1451185389fadf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)