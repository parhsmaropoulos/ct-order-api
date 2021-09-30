import "firebase/auth";
import React from "react";
import app from "firebase/app";

const authConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

class Firebase {
  constructor() {
    app.initializeApp(authConfig);
    this.auth = app.auth();

    this.googleProvider = new app.auth.GoogleAuthProvider();
  }

  signWithGoogle = () => this.auth.signInWithPopup(this.googleProvider);

  signIn = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  signOut = () => this.auth.signOut();

  register = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);
}

const FirebaseContext = React.createContext(null);
const AuthUserContext = React.createContext(null);

const withFirebase = (Component) => (props) =>
  (
    <FirebaseContext.Consumer>
      {(firebase) => <Component {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
  );

export { Firebase, withFirebase, FirebaseContext, AuthUserContext };
