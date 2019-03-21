import React, { useState } from "react";
import { Day } from "./Day";
import { startOfWeek, getISOWeek, addDays, subWeeks, addWeeks } from "date-fns";
import styled from "styled-components";
import { StyledActionButtonWithMargins } from "../components/StyledActionButton";
import { StyledWideWrapper } from "../components/StyledWrapper";
import {
  StyledHeaderH1,
  StyledAlternateHeaderH1
} from "../components/StyledHeaderH1";
import { StyledNext, StyledPrevious } from "../components/StyledSvgIcons";
import { AddToTrello } from "./AddToTrello";

const StyledDayList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const StyledButtonGroup = styled.div`
  display: flex;
  justify-content: center;
`;

export const Week = () => {
  const [selectedDay, setSelectedDay] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  const listOfDays = new Array(7)
    .fill("")
    .map((el: any, index: number) => addDays(selectedDay, index));

  return (
    <StyledWideWrapper>
      <StyledAlternateHeaderH1>
        Ukesmeny uke {getISOWeek(selectedDay)}{" "}
      </StyledAlternateHeaderH1>
      <StyledButtonGroup>
        <StyledActionButtonWithMargins
          onClick={() => setSelectedDay(subWeeks(selectedDay, 1))}
        >
          <StyledPrevious />
        </StyledActionButtonWithMargins>
        <StyledActionButtonWithMargins
          onClick={() => setSelectedDay(addWeeks(selectedDay, 1))}
        >
          <StyledNext />
        </StyledActionButtonWithMargins>
      </StyledButtonGroup>
      <StyledDayList>
        {listOfDays.map((el: any) => (
          <Day key={el} date={el} />
        ))}
      </StyledDayList>
      <AddToTrello listOfDays={listOfDays} />
    </StyledWideWrapper>
  );
};
