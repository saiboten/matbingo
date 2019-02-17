import React from "react";
import { WeekSelection } from "./WeekSelection";
import { StyledHeaderH1 } from "../components/StyledHeaderH1";
import { Week } from "./Week";
import { StyledActionButton } from "../components/StyledActionButton";

export const WeekMenu = () => (
  <div>
    <StyledHeaderH1>Ukesmeny!</StyledHeaderH1>
    <StyledActionButton>Generate week</StyledActionButton>
    <WeekSelection />
    <Week />
  </div>
);
