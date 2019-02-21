import React from "react";
import { StyledHeaderH1 } from "../components/StyledHeaderH1";
import { Week } from "./Week";
import { StyledWideWrapper } from "../components/StyledWrapper";

export const WeekMenu = () => (
  <StyledWideWrapper>
    <StyledHeaderH1>Ukesmeny!</StyledHeaderH1>
    <Week />
  </StyledWideWrapper>
);
