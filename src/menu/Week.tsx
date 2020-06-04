import React, { useState } from "react";
import { Day } from "./Day";
import { startOfDay, getISOWeek, addDays, subWeeks, addWeeks } from "date-fns";
import styled from "styled-components";

import {
  StyledActionButtonWithMargins,
  StyledActionButtonForText,
} from "../components/StyledActionButton";
import { StyledWideWrapper } from "../components/StyledWrapper";
import { StyledHeaderH1 } from "../components/StyledHeaderH1";
import {
  StyledNext,
  StyledPrevious,
  BackgroundChef as StyledChef,
} from "../components/StyledSvgIcons";
import { AddToTrello } from "./AddToTrello";
import { Filter } from "./Filter";

// function resetAccessTokenValue(userUid: string) {
//   const db = firebase.firestore();

//   db.collection("userdata")
//     .doc(userUid)
//     .set({ wunderlistAccessToken: null },{ merge: true });
// }

const StyledDayList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const StyledButtonGroup = styled.div`
  display: flex;
  justify-content: center;
`;

// const NoRecipes = () => {
//   return (
//     <StyledWrapper backgroundColor="white">
//       <StyledHeaderH1>Du har ingen oppskrifter</StyledHeaderH1>
//       <p>
//         Før du kan lage ukesoppsett må du opprette noen oppskrifter,{" "}
//         <StyledLink style={{ padding: "0", margin: "0" }} to="/add-recipe">
//           det kan du gjøre her
//         </StyledLink>
//         !
//       </p>
//     </StyledWrapper>
//   );
// };

const WeekSelector = ({
  selectedDay,
  setSelectedDay,
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

const IllustrationContainer = styled.div`
  text-align: center;
  position: relative;
  max-width: 100%;
`;

export const Week = () => {
  const [selectedDay, setSelectedDay]: [Date, any] = useState(
    startOfDay(new Date())
  );

  const [addToTrelloDays, setAddToTrelloDays]: [Date[], any] = useState([]);
  const [addToTrelloActive, setAddToTrelloActive]: [boolean, any] = useState(
    false
  );

  const [activeFilters, setActiveFilters]: [Filter[], any] = useState([]);

  const listOfDays = new Array(7)
    .fill("")
    .map((el: any, index: number) => addDays(selectedDay, index));

  return (
    <StyledWideWrapper>
      <StyledHeaderH1>Ukesmeny uke {getISOWeek(selectedDay)}</StyledHeaderH1>
      <IllustrationContainer>
        <StyledChef />
      </IllustrationContainer>
      <Filter
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
      />
      {addToTrelloActive ? (
        <AddToTrello
          listOfDays={addToTrelloDays}
          doneCallback={() => {
            setAddToTrelloActive(false);
            setAddToTrelloDays([]);
          }}
        />
      ) : (
        <StyledActionButtonForText
          style={{ marginRight: "1rem", marginLeft: "1rem" }}
          onClick={() => setAddToTrelloActive(true)}
        >
          Lag handleliste i Trello
        </StyledActionButtonForText>
      )}
      <WeekSelector selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
      <StyledDayList>
        {listOfDays.map((el: any) => (
          <Day
            key={el}
            date={el}
            activeFilters={activeFilters}
            addToTrelloActive={addToTrelloActive}
            isShoppingCartActive={dateExists(addToTrelloDays, el)}
            toggleShoppingCart={(date) => {
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
    </StyledWideWrapper>
  );
};

function deleteDate(addToTrelloDays: Date[], date: Date): any {
  return addToTrelloDays.filter((el) => el.toString() !== date.toString());
}

function dateExists(addToTrelloDays: Date[], date: Date) {
  return (
    addToTrelloDays.filter((el) => el.toString() === date.toString()).length > 0
  );
}
