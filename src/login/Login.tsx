import React from "react";
import styled from "styled-components";
import {
  firebase,
  googleAuthProvider,
  facebookAuthProvider
} from "../firebase/firebase";
import { StyledHeaderH1, StyledHeaderH2 } from "../components/StyledHeaderH1";
import { ReactComponent as GoogleIcon } from "./google.svg";
import { ReactComponent as FacebookIcon } from "./facebook.svg";
import { StyledSecondaryActionButtonWithMargins } from "../components/StyledActionButton";
import { StyledChef } from "../components/StyledSvgIcons";
import { minBreakPoint } from "../components/Constants";

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

const Paragraph = styled.div`
  font-size: 2rem;
  margin-bottom: 2rem;
`;

export const StyledWrapper = styled.div`
  max-width: 615px;
  margin: 0 auto;
  padding: 15px;

  @media screen and (max-width: ${minBreakPoint}px) {
    margin: 0 auto;
  }
`;

export const Login = () => {
  return (
    <StyledWrapper>
      <StyledHeaderH1>Matbingo.no</StyledHeaderH1>
      <div style={{ textAlign: "center" }}>
        <StyledChef />
      </div>
      <Paragraph>
        Matbingo er en ny smart og innovativ middagsplanlegger som hjelper deg
        med å komme med forslag til middag.
      </Paragraph>
      <StyledHeaderH2>Individuell</StyledHeaderH2>
      <Paragraph>
        Matbingo hensyntar dine hensyn i forhold til hvor ofte du ønsker å spise
        de forskjellige rettene, og hvilke dager de passer å spises. Du legger
        selv inn de rettene du selv kan lage.
      </Paragraph>
      <StyledHeaderH2>Smart</StyledHeaderH2>
      <Paragraph>
        Så lenge du bruker Matbingo til dagen, så har Matbingo full kontroll
        over hvilke retter du spiste sist, dette gjør at retter rulleres.
      </Paragraph>
      <StyledHeaderH2>For hele familien</StyledHeaderH2>
      <Paragraph>
        I Matbingo kan du bli med i en gruppe for hele familien, slik at alle
        kan være med å se menyen, eller å legge inn nye oppskrifter.
      </Paragraph>
      <StyledHeaderH2>Fleksibel</StyledHeaderH2>
      <Paragraph>
        Dersom du en dag ikke har behov for å lage middag en dag, kan dette lett
        legges inn i ukesmenyen, slik at du har kontroll.
      </Paragraph>
      <StyledHeaderH2>PS:</StyledHeaderH2>
      <Paragraph>
        Matbingo.no er fremdeles i en tidlig beta. Mer funksjonalitet kommer.
      </Paragraph>
      <StyledHeaderH1>Innlogging</StyledHeaderH1>
      <Paragraph>
        Logg inn. PS: Foreløpig er det bare Google som funker.
      </Paragraph>
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
