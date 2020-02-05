import React, { useState, useContext, useEffect } from "react";
import { Day } from "./Day";
import { startOfDay, getISOWeek, addDays, subWeeks, addWeeks } from "date-fns";
import styled from "styled-components";
import { firebase } from "../firebase/firebase";

import {
  StyledActionButtonWithMargins,
  StyledActionButtonForText
} from "../components/StyledActionButton";
import { StyledWideWrapper, StyledWrapper } from "../components/StyledWrapper";
import {
  StyledHeaderH1
} from "../components/StyledHeaderH1";
import { StyledNext, StyledPrevious, StyledChef } from "../components/StyledSvgIcons";
import { AddToTrello } from "./AddToTrello";
import { RecipeContext } from "../context/RecipeContext";
import { StyledLink } from "../components/StyledLink";
import { Filter } from "./Filter";
import { WunderlistExportButton } from "./WunderlistExport/WunderlistExportButton";
import { WunderlistListSelector } from "./WunderlistExport/WunderlistListSelector";
import { UserDataContext } from "../context/UserDataContext";
import { UserContext } from "../context/UserContext";

function makeId(length: number) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function redirectToExternalAuthDialog() {
  const wunderlistClientId = "03d2eac308bd127169f5";
  const redirectUrl = "https://matbingo.no/wunderlist-callback";

  const randomString = makeId(30);
  localStorage.setItem('wunderlistAuthState', randomString);
  const location = `https://www.wunderlist.com/oauth/authorize?client_id=${wunderlistClientId}&redirect_uri=${redirectUrl}&state=${randomString}`;
  window.location.href = location;
}

async function getAccessToken(code: string) {
  return fetch(`https://us-central1-dinnerplanner-48f1d.cloudfunctions.net/wunderlistCallback?code=${code}`)
    .then(res => res.json())
    .then((res:any) => res.accessToken);
}

function getUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code') ?? '';
  const state = urlParams.get('state') ?? '';

  return { state, code };
}

function validateResponse(state: string) {
  const originalState = localStorage.getItem('wunderlistAuthState');
  const isValidState = originalState === state;
  if (!isValidState) {
    throw new Error(`Invalid auth response state ${state} !=== ${originalState}'`);
  }
}

function handleWunderlistAuthCallback(userUid: string, setShowWunderlistExportDialog: (value :boolean) => void) {
  const { code, state } = getUrlParams();

  validateResponse(state);

  window.history.pushState(null, 'Matbingo.no', '/');

  getAccessToken(code)
    .then(accessToken => {
      const db = firebase.firestore();
      db.collection("userdata")
        .doc(userUid)
        .set({ wunderlistAccessToken: accessToken },{ merge: true })
        .then(() => {
          setShowWunderlistExportDialog(true);
        });
    });
}

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

const IllustrationContainer = styled.div`
  text-align: center;
`;

export const Week = () => {
  const { recipes } = useContext(RecipeContext);
  const { userdata } = useContext(UserDataContext);
  const { user } = useContext(UserContext);
  const wunderlistAccessToken = userdata.wunderlistAccessToken;

  const [selectedDay, setSelectedDay]: [Date, any] = useState(
    startOfDay(new Date())
  );

  const [addToTrelloDays, setAddToTrelloDays]: [Date[], any] = useState([]);
  const [addToTrelloActive, setAddToTrelloActive]: [boolean, any] = useState(
    false
  );

  const [activeFilters, setActiveFilters]: [Filter[], any] = useState([]);

  const [showWunderlistExportDialog, setShowWunderlistExportDialog] = useState(false);

  // useEffect(() => {
  //   resetAccessTokenValue(user.uid);
  // }, [user.uid]);

  useEffect(() => {
    if (window.location.pathname.includes('wunderlist-callback')) {
      handleWunderlistAuthCallback(user.uid, setShowWunderlistExportDialog);
    }
  }, [user.uid]);

  const handleWunderlistExportClick = () => {
    if (wunderlistAccessToken && !showWunderlistExportDialog) {
      setShowWunderlistExportDialog(true);
    } else {
      redirectToExternalAuthDialog();
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
      <StyledHeaderH1>
        Ukesmeny uke {getISOWeek(selectedDay)}
      </StyledHeaderH1>
      <IllustrationContainer>
        <StyledChef />
      </IllustrationContainer>
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
        <StyledActionButtonForText style={{ marginBottom: "2rem", marginRight: "1rem"}} onClick={() => setAddToTrelloActive(true)}>
          Lag handleliste i Trello
        </StyledActionButtonForText>
      )}
      <WunderlistExportButton
        onClick={handleWunderlistExportClick}
      />
      { wunderlistAccessToken && showWunderlistExportDialog && (
        <WunderlistListSelector
          onDismiss={() => setShowWunderlistExportDialog(false)}
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
