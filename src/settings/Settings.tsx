import React, { useContext, useState } from "react";
import { StyledWrapper } from "../components/StyledWrapper";
import { StyledHeaderH1 } from "../components/StyledHeaderH1";
import { StyledActionButtonForText } from "../components/StyledActionButton";
import { firebase } from "../firebase/firebase";
import { UserContext } from "../context/UserContext";
import { Redirect } from "react-router";

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
      <StyledActionButtonForText onClick={leaveGroup}>
        Forlat gruppe
      </StyledActionButtonForText>
    </StyledWrapper>
  );
};
