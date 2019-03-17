import React, { useState, useEffect, useContext } from "react";
import { StyledWrapper } from "../components/StyledWrapper";
import {
  StyledActionButtonWithMargins,
  StyledActionButton
} from "../components/StyledActionButton";
import { firebase } from "../firebase/firebase";
import { UserContext } from "../context/UserContext";
import { GroupData } from "../context/GroupDataContext";

export const JoinOrCreateGroup = () => {
  const user = useContext(UserContext).user;
  const [invites, setInvites]: [GroupData[], any] = useState([]);

  const acceptInvite = () => {
    // todo accept
  };

  useEffect(() => {
    const db = firebase.firestore();

    db.collection("groups")
      .where("invites", "array-contains", user.email)
      .get()
      .then(snapshot => {
        setInvites(snapshot.docs.map(el => el.data()));
      });
  });

  return (
    <StyledWrapper>
      <StyledActionButtonWithMargins>
        Opprett gruppe
      </StyledActionButtonWithMargins>
      {invites.map(el => (
        <li key={el.owner}>
          {el.name}
          <StyledActionButton onClick={acceptInvite}>
            Aksepter
          </StyledActionButton>
        </li>
      ))}
    </StyledWrapper>
  );
};
