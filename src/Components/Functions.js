import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

import { auth } from "../Firebase/firebase.js";

export const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider().addScope(
    "https://www.googleapis.com/auth/contacts.readonly"
  );
  auth.useDeviceLanguage();

  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      //   console.log(credential);
      //   console.log(token);

      // The signed-in user info.
      const user = result.user;
      //   console.log(user);

      console.log("sign in successfully");
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;

      console.error(errorCode);
      console.error(errorMessage);

      // The email of the user's account used.
      const email = error.email;

      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
};

export const logOut = () => {
  signOut(auth)
    .then(() => {
      // Sign-out successful..
      console.log("logout succesfully");
    })
    .catch((error) => {
      // An error happened.
      console.log(error.code);
      console.log(error.message);
    });
};