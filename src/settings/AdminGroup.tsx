import React, { useContext } from "react";
import { StyledWrapper } from "../components/StyledWrapper";
import { StyledHeaderH1 } from "../components/StyledHeaderH1";
import { GroupDataContext } from "../context/GroupDataContext";

export const AdminGroup = () => {
  const { groupData } = useContext(GroupDataContext);

  return (
    <StyledWrapper backgroundColor="white">
      <StyledHeaderH1>Administrer gruppe</StyledHeaderH1>
    </StyledWrapper>
  );
};
