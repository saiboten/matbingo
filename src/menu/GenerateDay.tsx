import React, { useState } from "react";
import styled from "styled-components";
import { Find } from "./AddOptions/Find";
import { Random } from "./AddOptions/Random";
import { Manual } from "./AddOptions/Manual";
import { StyledActionButtonWithMargins } from "../components/StyledActionButton";
import {
  StyledPlusCircle,
  StyledSearch,
  StyledWrite
} from "../components/StyledSvgIcons";

const StyledButtons = styled.div`
  margin-top: 1rem;
`;

const SelectAction = ({
  setAction
}: {
  setAction: (action: string) => void;
}) => (
  <StyledButtons>
    <StyledActionButtonWithMargins
      onClick={() => {
        setAction("random");
      }}
    >
      <StyledPlusCircle />
    </StyledActionButtonWithMargins>
    <StyledActionButtonWithMargins
      onClick={() => {
        setAction("find");
      }}
    >
      <StyledSearch />
    </StyledActionButtonWithMargins>
    <StyledActionButtonWithMargins
      onClick={() => {
        setAction("manual");
      }}
    >
      <StyledWrite />
    </StyledActionButtonWithMargins>
  </StyledButtons>
);

export const GenerateDay = ({ date }: { date: Date }) => {
  const [action, setAction]: [string, any] = useState("");

  const resetAction = () => setAction("");

  if (action === "random") {
    return <Random back={resetAction} date={date} />;
  } else if (action === "find") {
    return <Find date={date} back={resetAction} />;
  } else if (action === "manual") {
    return <Manual date={date} back={resetAction} />;
  }

  return <SelectAction setAction={setAction} />;
};
