import React, { useContext, useState } from "react";
import { StyledWrapper } from "../components/StyledWrapper";
import { StyledHeaderH1 } from "../components/StyledHeaderH1";
import {
  StyledActionButtonForText,
  StyledSecondaryActionButtonWithMargins
} from "../components/StyledActionButton";
import { firebase } from "../firebase/firebase";
import { UserContext } from "../context/UserContext";
import { Redirect } from "react-router";
import { StyledLogOut } from "../components/StyledSvgIcons";
import styled from "styled-components";

const SpaceBetween = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 30rem;
  margin: 0 auto;
`;

const LogOut = (setLeave: any) => {
  firebase
    .auth()
    .signOut()
    .then(function() {
      // Sign-out successful.
    })
    .catch(function(error) {
      // An error happened.
    });

  setLeave(true);
};

export const Settings = () => {
  const user = useContext(UserContext).user;
  const [leave, setLeave] = useState(false);

  const leaveGroup = () => {
    const db = firebase
      .firestore()
      .collection("userdata")
      .doc(user.uid)
      .delete();
    setLeave(true);
  };

  if (leave) {
    return <Redirect to="/" push />;
  }

  return (
    <StyledWrapper backgroundColor="white">
      <StyledHeaderH1>Innstillinger</StyledHeaderH1>
      <SpaceBetween>
        <span>Logg ut</span>
        <StyledSecondaryActionButtonWithMargins
          onClick={() => {
            LogOut(setLeave);
          }}
        >
          <StyledLogOut />
        </StyledSecondaryActionButtonWithMargins>{" "}
      </SpaceBetween>
      <SpaceBetween>
        <span>Forlat gruppe</span>
        <StyledSecondaryActionButtonWithMargins onClick={leaveGroup}>
          <StyledLogOut />
        </StyledSecondaryActionButtonWithMargins>
      </SpaceBetween>
    </StyledWrapper>
  );
};
