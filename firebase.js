import firebaseApp from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA5S9V90vWgtZudPnOgKvKEOQqlvmMiZEo",
  authDomain: "projectmanagementapp-9d0b0.firebaseapp.com",
  databaseURL: "https://projectmanagementapp-9d0b0-default-rtdb.firebaseio.com",
  projectId: "projectmanagementapp-9d0b0",
  storageBucket: "projectmanagementapp-9d0b0.appspot.com",
  messagingSenderId: "366611733672",
  appId: "1:366611733672:web:b12d153c2645c684c8f69d",
  measurementId: "G-B6BEX2FPD6"
};

if (!firebaseApp.apps.length) {
  firebaseApp.initializeApp(firebaseConfig);
}

export default firebaseApp;
