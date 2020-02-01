import React, { useState, useContext } from "react";
import { Day } from "./Day";
import { startOfDay, getISOWeek, addDays, subWeeks, addWeeks } from "date-fns";
import styled from "styled-components";
import {
  StyledActionButtonWithMargins,
  StyledActionButtonForText
} from "../components/StyledActionButton";
import { StyledWideWrapper, StyledWrapper } from "../components/StyledWrapper";
import {
  StyledHeaderH1,
  StyledAlternateHeaderH1
} from "../components/StyledHeaderH1";
import { StyledNext, StyledPrevious } from "../components/StyledSvgIcons";
import { AddToTrello } from "./AddToTrello";
import { RecipeContext } from "../context/RecipeContext";
import { StyledLink } from "../components/StyledLink";
import { Filter } from "./Filter";
import { WunderlistExportButton } from "./WunderlistExport/WunderlistExportButton";
import { WunderlistListSelector } from "./WunderlistExport/WunderlistListSelector";

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
        Før du kan lage ukesoppsett må du opprette noen oppskrifter,{" "}
        <StyledLink style={{ padding: "0", margin: "0" }} to="/add-recipe">
          det kan du gjøre her
        </StyledLink>
        !
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

  const [selectedDay, setSelectedDay]: [Date, any] = useState(
    startOfDay(new Date())
  );

  const [addToTrelloDays, setAddToTrelloDays]: [Date[], any] = useState([]);
  const [addToTrelloActive, setAddToTrelloActive]: [boolean, any] = useState(
    false
  );

  const [activeFilters, setActiveFilters]: [Filter[], any] = useState([]);

  const [showWunderlistListSelector, setShowWunderlistListSelector] = useState(false);
  const [wunderlistAccessToken] = useState('INSERT_YOUR_ACCESS_TOKEN_HERE'); // TODO: Implement OAuth flow and store accessToken in userdata ?
  const handleWunderlistExportClick = () => {
    if (wunderlistAccessToken && !showWunderlistListSelector) {
      setShowWunderlistListSelector(true);
    } else {
      // Redirect to wunderlist auth dialog
    }
  };

  if (recipes.length === 0) {
    return <NoRecipes />;
  }

  const listOfDays = new Array(7)
    .fill("")
    .map((el: any, index: number) => addDays(selectedDay, index));

  return (
    <StyledWideWrapper>
      <StyledAlternateHeaderH1>
        Ukesmeny uke {getISOWeek(selectedDay)}
      </StyledAlternateHeaderH1>
      <Filter
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
      />
      <WeekSelector selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
      <StyledDayList>
        {listOfDays.map((el: any) => (
          <Day
            key={el}
            date={el}
            activeFilters={activeFilters}
            addToTrelloActive={addToTrelloActive}
            isShoppingCartActive={dateExists(addToTrelloDays, el)}
            toggleShoppingCart={date => {
              if (dateExists(addToTrelloDays, date)) {
                setAddToTrelloDays(deleteDate(addToTrelloDays, date));
              } else {
                setAddToTrelloDays([date, ...addToTrelloDays]);
              }
            }}
          />
        ))}
      </StyledDayList>
      <WeekSelector selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
      {addToTrelloActive ? (
        <AddToTrello
          listOfDays={addToTrelloDays}
          doneCallback={() => {
            setAddToTrelloActive(false);
            setAddToTrelloDays([]);
          }}
        />
      ) : (
        <StyledActionButtonForText onClick={() => setAddToTrelloActive(true)}>
          Lag handleliste
        </StyledActionButtonForText>
      )}
      <WunderlistExportButton
        accessToken={wunderlistAccessToken}
        onClick={handleWunderlistExportClick}
      />
      { showWunderlistListSelector && (
        <WunderlistListSelector
          onDismiss={() => setShowWunderlistListSelector(false)}
          accessToken={wunderlistAccessToken}
          selectedDays={listOfDays}
        />)}
    </StyledWideWrapper>
  );
};

function deleteDate(addToTrelloDays: Date[], date: Date): any {
  return addToTrelloDays.filter(el => el.toString() !== date.toString());
}

function dateExists(addToTrelloDays: Date[], date: Date) {
  return (
    addToTrelloDays.filter(el => el.toString() === date.toString()).length > 0
  );
}
