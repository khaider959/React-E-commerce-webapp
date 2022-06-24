import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBqMJx6kNQYTNkxygEPIfrB9OWTRww5ibc",
  authDomain: "cs308-f777f.firebaseapp.com",
  databaseURL: "https://cs308-f777f-default-rtdb.firebaseio.com",
  projectId: "cs308-f777f",
  storageBucket: "cs308-f777f.appspot.com",
  messagingSenderId: "1069691338794",
  appId: "1:1069691338794:web:96ab13dad57126154a4353",
  measurementId: "G-JVK7SJX1LW"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth()
export const db = firebase.firestore()

export default firebase
