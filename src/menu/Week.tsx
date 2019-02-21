import React, { useState } from "react";
import { Day } from "./Day";
import { startOfWeek, addDays, subWeeks, addWeeks } from "date-fns";
import styled from "styled-components";
import { StyledActionButtonWithMargins } from "../components/StyledActionButton";

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
    addDays(startOfWeek(new Date()), 1)
  );

  return (
    <div>
      <StyledButtonGroup>
        <StyledActionButtonWithMargins
          onClick={() => setSelectedDay(subWeeks(selectedDay, 1))}
        >
          Forrige uke
        </StyledActionButtonWithMargins>
        <StyledActionButtonWithMargins
          onClick={() => setSelectedDay(addWeeks(selectedDay, 1))}
        >
          Neste uke
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
    </div>
  );
};
