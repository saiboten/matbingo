import React from "react";
import styled from "styled-components";
import {
  firebase,
  googleAuthProvider,
  facebookAuthProvider
} from "../firebase/firebase";
import { StyledHeaderH1 } from "../components/StyledHeaderH1";
import { StyledWrapper } from "../components/StyledWrapper";
import { ReactComponent as GoogleIcon } from "./google.svg";
import { ReactComponent as FacebookIcon } from "./facebook.svg";
import { StyledSecondaryActionButtonWithMargins } from "../components/StyledActionButton";

const StyledFacebookIcon = styled(FacebookIcon)`
  fill: #4267b2;
`;

const loginWithGoogle = () => {
  firebase
    .auth()
    .signInWithRedirect(googleAuthProvider)
    .then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      // var token = result.credential.accessToken;
      // The signed-in user info.
      // var user = result.user;
      // ...
    })
    .catch(function(error) {
      console.log(error);
      // Handle Errors here.
      // var errorCode = error.code;
      // var errorMessage = error.message;
      // // The email of the user's account used.
      // var email = error.email;
      // // The firebase.auth.AuthCredential type that was used.
      // var credential = error.credential;
      // ...
    });
};

const loginWithFacebook = () => {
  firebase.auth().languageCode = "nb_NO";
  firebase
    .auth()
    .signInWithRedirect(facebookAuthProvider)
    .then(function(result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      // var token = result.credential.accessToken;
      // The signed-in user info.
      // var user = result.user;
      // ...
    })
    .catch(function(error) {
      console.log(error);
      // Handle Errors here.
      // var errorCode = error.code;
      // var errorMessage = error.message;
      // // The email of the user's account used.
      // var email = error.email;
      // // The firebase.auth.AuthCredential type that was used.
      // var credential = error.credential;
      // ...
    });
};

const StyledActions = styled.div`
  text-align: center;
`;

export const Login = () => {
  return (
    <StyledWrapper backgroundColor="white">
      <StyledHeaderH1>Innlogging</StyledHeaderH1>
      <StyledActions>
        <StyledSecondaryActionButtonWithMargins onClick={loginWithGoogle}>
          <GoogleIcon />
        </StyledSecondaryActionButtonWithMargins>
        <StyledSecondaryActionButtonWithMargins onClick={loginWithFacebook}>
          <StyledFacebookIcon />
        </StyledSecondaryActionButtonWithMargins>
      </StyledActions>
    </StyledWrapper>
  );
};
