import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { StyledWrapper } from "../components/StyledWrapper";
import { StyledActionButtonForText } from "../components/StyledActionButton";
import { firebase } from "../firebase/firebase";
import { UserContext } from "../context/UserContext";
import { GroupData } from "../context/GroupDataContext";
import { StyledHeaderH1, StyledHeaderH2 } from "../components/StyledHeaderH1";
import { Route } from "react-router-dom";
import { CreateGroup } from "./CreateGroup";
import { StyledLink } from "../components/StyledLink";
import { Settings } from "../settings/Settings";

const StyledLi = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

export const JoinGroupRouter = () => {
  return (
    <>
      <Route path="/" exact component={JoinOrCreateGroup} />
      <Route path="/settings" component={Settings} />
      <Route path="/create-group/" component={CreateGroup} />
    </>
  );
};

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

  useEffect(
    () => {
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
    },
    [user.email]
  );

  return (
    <StyledWrapper backgroundColor="white">
      <StyledHeaderH1>Middagsgjeng</StyledHeaderH1>
      <p>
        Vil du gå sammen med andre om å bestemme middager? Opprett en gruppe,
        eller bli med i en gruppe du er invitert i.
      </p>
      <StyledLink to="/create-group">Opprett gruppe</StyledLink>
      <ul>
        {groups.length > 0 ? (
          <>
            <StyledHeaderH2>Grupper du er invitert til</StyledHeaderH2>
            {groups.map(el => (
              <StyledLi key={el.owner}>
                <span>Gruppenavn: {el.name}</span>
                <StyledActionButtonForText onClick={() => acceptInvite(el.id)}>
                  Aksepter
                </StyledActionButtonForText>
              </StyledLi>
            ))}
          </>
        ) : (
          <StyledHeaderH2>Du er ikke invitert til noen grupper</StyledHeaderH2>
        )}
      </ul>
    </StyledWrapper>
  );
};
