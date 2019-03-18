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
  const [groups, setGroups]: [GroupData[], any] = useState([]);

  const acceptInvite = (groupId: string) => {
    const db = firebase.firestore();
    const doc = db.collection("groups").doc(groupId);
    // Update members in group
    doc.get().then(groupDetails => {
      const data = groupDetails.data();
      const members = data ? data.members : [];
      members.push(user.uid);
      doc.update({
        members
      });
    });

    //Update user
    db.collection("userdata")
      .doc(user.uid)
      .set({
        group: groupId
      });
  };

  useEffect(() => {
    const db = firebase.firestore();

    db.collection("groups")
      .where("invites", "array-contains", user.email)
      .get()
      .then(snapshot => {
        setGroups(
          snapshot.docs.map(el => ({
            ...el.data(),
            id: el.id
          }))
        );
      });
  }, []);

  return (
    <StyledWrapper>
      <StyledActionButtonWithMargins>
        Opprett gruppe
      </StyledActionButtonWithMargins>
      {groups.map(el => (
        <li key={el.owner}>
          {el.name}
          <StyledActionButton onClick={() => acceptInvite(el.id)}>
            Aksepter
          </StyledActionButton>
        </li>
      ))}
    </StyledWrapper>
  );
};
