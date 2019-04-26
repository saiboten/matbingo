import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Day } from "./Day";
import { startOfDay, getISOWeek, addDays, subWeeks, addWeeks } from "date-fns";
import styled from "styled-components";
import { StyledActionButtonWithMargins } from "../components/StyledActionButton";
import { StyledWideWrapper, StyledWrapper } from "../components/StyledWrapper";
import {
  StyledHeaderH1,
  StyledAlternateHeaderH1
} from "../components/StyledHeaderH1";
import { StyledNext, StyledPrevious } from "../components/StyledSvgIcons";
import { AddToTrello } from "./AddToTrello";
import { RecipeContext } from "../context/RecipeContext";

const StyledDayList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const StyledButtonGroup = styled.div`
  display: flex;
  justify-content: center;
`;

const NoRecipes = () => {
  return (
    <StyledWrapper backgroundColor="white">
      <StyledHeaderH1>Du har ingen oppskrifter</StyledHeaderH1>
      <p>
        Før du kan lage ukesoppsett må du opprette noen oppskrifter, det kan du
        gjøre <Link to="/recipes">her</Link>!
      </p>
    </StyledWrapper>
  );
};

const WeekSelector = ({
  selectedDay,
  setSelectedDay
}: {
  selectedDay: Date;
  setSelectedDay: (date: Date) => void;
}) => {
  return (
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
  );
};

export const Week = () => {
  const { recipes } = useContext(RecipeContext);

  if (recipes.length == 0) {
    return <NoRecipes />;
  }

  const [selectedDay, setSelectedDay]: [Date, any] = useState(
    startOfDay(new Date())
  );

  const listOfDays = new Array(7)
    .fill("")
    .map((el: any, index: number) => addDays(selectedDay, index));

  return (
    <StyledWideWrapper>
      <StyledAlternateHeaderH1>
        Ukesmeny uke {getISOWeek(selectedDay)}
      </StyledAlternateHeaderH1>
      <WeekSelector selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
      <StyledDayList>
        {listOfDays.map((el: any) => (
          <Day key={el} date={el} />
        ))}
      </StyledDayList>
      <WeekSelector selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
      <AddToTrello listOfDays={listOfDays} />
    </StyledWideWrapper>
  );
};
