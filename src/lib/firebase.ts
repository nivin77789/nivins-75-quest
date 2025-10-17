import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBCMVfeXwVqrR8PaPoq1lhB7rwMQHfhIGk",
  authDomain: "hard-c7e53.firebaseapp.com",
  projectId: "hard-c7e53",
  storageBucket: "hard-c7e53.firebasestorage.app",
  messagingSenderId: "1036512138129",
  appId: "1:1036512138129:web:e500bcf9a4c92735550030",
  measurementId: "G-2TSQ2DD6DF"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
