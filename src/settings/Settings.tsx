import React, { useContext, useState } from "react";
import { StyledWrapper } from "../components/StyledWrapper";
import { StyledHeaderH1 } from "../components/StyledHeaderH1";
import {
  StyledActionButtonForText,
  StyledSecondaryActionButtonWithMargins,
  StyledSecondaryActionButtonForText
} from "../components/StyledActionButton";
import { firebase } from "../firebase/firebase";
import { UserContext } from "../context/UserContext";
import { Redirect } from "react-router";
import {
  StyledLogOut,
  StyledDeleteIcon,
  StyledSettingsIcon
} from "../components/StyledSvgIcons";
import styled from "styled-components";
import { GroupDataContext } from "../context/GroupDataContext";

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
  const { groupData } = useContext(GroupDataContext);
  const [leave, setLeave] = useState(false);
  const [leaveGroupConfirm, setLeaveGroupConfirm] = useState(false);
  const [gotoAdmin, setGotoAdmin] = useState(false);

  const handleLeaveGroupButtonClick = () => {
    setLeaveGroupConfirm(true);
  };

  const leaveGroup = () => {
    const db = firebase
      .firestore()
      .collection("userdata")
      .doc(user.uid)
      .delete();
    setLeave(true);
  };

  const cancelLeaveGroup = () => {
    setLeaveGroupConfirm(false);
  };

  if (leave) {
    return <Redirect to="/" push />;
  }

  if (gotoAdmin) {
    return <Redirect to="/admin" push />;
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
      {groupData.id !== "" && (
        <SpaceBetween>
          <span>Forlat gruppe</span>
          <StyledSecondaryActionButtonWithMargins
            onClick={handleLeaveGroupButtonClick}
          >
            <StyledDeleteIcon />
          </StyledSecondaryActionButtonWithMargins>
        </SpaceBetween>
      )}
      {groupData.owner === user.uid && (
        <SpaceBetween>
          <span>Administrer gruppe</span>
          <StyledSecondaryActionButtonWithMargins
            onClick={() => setGotoAdmin(true)}
          >
            <StyledSettingsIcon />
          </StyledSecondaryActionButtonWithMargins>
        </SpaceBetween>
      )}

      {leaveGroupConfirm && (
        <p>
          Er du sikker på at du vil forlate gruppen? Du kan alltids bli med i
          gruppen igjen på et senere tidspunkt, så det er ingen krise.
          <div
            style={{
              display: "flex",
              marginTop: "1rem",
              justifyContent: "space-around"
            }}
          >
            <StyledActionButtonForText
              onClick={leaveGroup}
              style={{ marginRight: "1rem" }}
            >
              Ja, forlat gruppe
            </StyledActionButtonForText>
            <StyledSecondaryActionButtonForText onClick={cancelLeaveGroup}>
              Nei, bli i gruppen
            </StyledSecondaryActionButtonForText>
          </div>
        </p>
      )}
    </StyledWrapper>
  );
};
