import React from "react";
import styled from "styled-components";
import { firebase, googleAuthProvider } from "../firebase/firebase";
import { StyledHeaderH1 } from "../components/StyledHeaderH1";
import { StyledSecondaryActionButton } from "../components/StyledActionButton";
import { StyledWrapper } from "../components/StyledWrapper";
import { ReactComponent as GoogleIcon } from "./google.svg";

const login = () => {
  firebase
    .auth()
    .signInWithPopup(googleAuthProvider)
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
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
};

const StyledActions = styled.div`
  text-align: center;
`;

export const Login = () => {
  return (
    <StyledWrapper>
      <StyledHeaderH1>Innlogging</StyledHeaderH1>
      <StyledActions>
        <StyledSecondaryActionButton onClick={login}>
          <GoogleIcon />
        </StyledSecondaryActionButton>
      </StyledActions>
    </StyledWrapper>
  );
};
