import React, { useState } from "react";
import styled from "styled-components";
import { Find } from "./AddOptions/Find";
import { Random } from "./AddOptions/Random";
import { Manual } from "./AddOptions/Manual";
import { StyledActionButtonWithMargins } from "../components/StyledActionButton";
import {
  StyledSearch,
  StyledWrite,
  StyledDice
} from "../components/StyledSvgIcons";
import { Filter } from "./Filter";

const StyledButtons = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: space-around;
`;

const StyledAction = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const SelectAction = ({
  setAction
}: {
  setAction: (action: string) => void;
}) => (
  <StyledButtons>
    <StyledAction>
      <StyledActionButtonWithMargins
        onClick={() => {
          setAction("random");
        }}
      >
        <StyledDice />
      </StyledActionButtonWithMargins>
      Tilfeldig
    </StyledAction>
    <StyledAction>
      <StyledActionButtonWithMargins
        onClick={() => {
          setAction("find");
        }}
      >
        <StyledSearch />
      </StyledActionButtonWithMargins>
      Søk
    </StyledAction>
    <StyledAction>
      <StyledActionButtonWithMargins
        onClick={() => {
          setAction("manual");
        }}
      >
        <StyledWrite />
      </StyledActionButtonWithMargins>
      Annet
    </StyledAction>
  </StyledButtons>
);

export const GenerateDay = ({
  date,
  activeFilters
}: {
  date: Date;
  activeFilters: Filter[];
}) => {
  const [action, setAction]: [string, any] = useState("");

  const resetAction = () => setAction("");

  if (action === "random") {
    return (
      <Random back={resetAction} date={date} activeFilters={activeFilters} />
    );
  } else if (action === "find") {
    return <Find date={date} back={resetAction} />;
  } else if (action === "manual") {
    return <Manual date={date} back={resetAction} />;
  }

  return <SelectAction setAction={setAction} />;
};
