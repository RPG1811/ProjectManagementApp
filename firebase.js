import firebaseApp from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBxWQZS7iJ-3_1gY6nRltld1iN1Or0WSSM",
  authDomain: "projectmanagementsystem-adde6.firebaseapp.com",
  projectId: "projectmanagementsystem-adde6",
  storageBucket: "projectmanagementsystem-adde6.appspot.com",
  messagingSenderId: "1072781213410",
  appId: "1:1072781213410:web:bac9ea75f64c664b7168bb",
  measurementId: "G-CVBFZC6VMB"
};

if (!firebaseApp.apps.length) {
  firebaseApp.initializeApp(firebaseConfig);
}

export default firebaseApp;
