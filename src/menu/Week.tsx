import React, { useState } from "react";
import { Day } from "./Day";
import { startOfWeek, getISOWeek, addDays, subWeeks, addWeeks } from "date-fns";
import styled from "styled-components";
import { StyledActionButtonWithMargins } from "../components/StyledActionButton";
import { StyledWideWrapper } from "../components/StyledWrapper";
import { start } from "repl";
import { StyledHeaderH1 } from "../components/StyledHeaderH1";
import { StyledNotification } from "../components/StyledNotification";
import { StyledNext, StyledPrevious } from "../components/StyledSvgIcons";

const StyledDayList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const StyledButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const Week = () => {
  const [selectedDay, setSelectedDay] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  return (
    <StyledWideWrapper>
      <StyledHeaderH1>Ukesmeny uke {getISOWeek(selectedDay)} </StyledHeaderH1>
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
        <Day date={selectedDay} />
        <Day date={addDays(selectedDay, 1)} />
        <Day date={addDays(selectedDay, 2)} />
        <Day date={addDays(selectedDay, 3)} />
        <Day date={addDays(selectedDay, 4)} />
        <Day date={addDays(selectedDay, 5)} />
        <Day date={addDays(selectedDay, 6)} />
      </StyledDayList>
    </StyledWideWrapper>
  );
};
