import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDiWynea6wXQPMxKtLlQtqiiZDpimiIHCs",
  authDomain: "bahi-book.firebaseapp.com",
  projectId: "bahi-book",
  storageBucket: "bahi-book.appspot.com",
  messagingSenderId: "108109604682",
  appId: "1:108109604682:web:0fcd7bd1831c6ac46543b3",
  measurementId: "G-8HE2SFD7NR",
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}
export default firebase;
