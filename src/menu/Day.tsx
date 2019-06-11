import React, { useEffect, useState, useContext } from "react";
import { format, isToday } from "date-fns";
import styled from "styled-components";
import { firebase } from "../firebase/firebase";
import { RecipeType } from "../types";
import nbLocale from "date-fns/locale/nb";
import { RecipeDetails } from "./RecipeDetail";
import { GenerateDay } from "./GenerateDay";
import { StyledLocalLoader } from "../components/StyledLocalLoader";
import { primaryColor } from "../components/Constants";
import { RecipeContext } from "../context/RecipeContext";
import { UserDataContext } from "../context/UserDataContext";
import { StyledHeaderH1NoMarginTop } from "../components/StyledHeaderH1";
import {
  StyledActionButtonForText,
  StyledSecondaryActionButtonForText
} from "../components/StyledActionButton";
import { Filter } from "./Filter";

interface Props {
  date: Date;
  addToTrelloActive: boolean;
  toggleShoppingCart: (date: Date) => void;
  isShoppingCartActive: boolean;
  activeFilters: Filter[];
}

interface StyledDayProps {
  active: boolean;
  selected: boolean;
}

const StyledDay = styled.div<StyledDayProps>`
  position: relative;
  width: 48%;
  border: 1px solid black;
  display: inline-block;
  padding: 20px 10px;
  padding-left: 2rem;
  padding-bottom: 4.5rem;
  text-align: left;
  margin: 5px;
  min-height: 100px;
  box-shadow: 1px 2px 5px rgba(0, 0, 0, 0.3);
  color: #000;

  border: ${props =>
    props.active ? `3px solid ${primaryColor}` : "1px solid black"};

  @media screen and (max-width: 530px) {
    width: 100%;
  }

  background-color: ${props => (props.selected ? `${primaryColor}` : "#fff")};
`;

const StyledDate = styled.div`
  position: absolute;
  right: 8px;
  top: 2px;
`;

const initialState: RecipeType = {
  name: "",
  description: "",
  id: "",
  ingredients: [],
  weekdays: [],
  lastTimeSelected: new Date(),
  rating: 1,
  hasBeenSelected: false,
  recipetype: []
};

interface DayData {
  id: string;
  date: Date;
  group: string;
  recipe: string | undefined;
  description: string | undefined;
}

const initialDayData: DayData = {
  id: "",
  date: new Date(),
  group: "",
  recipe: undefined,
  description: undefined
};

const StyledDayContent = styled.div`
  text-align: center;
`;

const StyledLocalLoaderWithMarginTop = styled(StyledLocalLoader)`
  margin-top: 42px;
`;

const DeleteDay = ({
  documentId,
  reset
}: {
  documentId: string;
  reset: () => void;
}) => {
  const [showConfirm, setConfirmed] = useState(false);

  const deleteDay = () => {
    if (showConfirm) {
      const db = firebase.firestore();
      db.collection("days")
        .doc(documentId)
        .delete()
        .then(() => {
          reset();
        });
    } else {
      setConfirmed(true);
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        right: "0",
        bottom: "0",
        marginRight: "5px",
        marginBottom: "5px"
      }}
    >
      {showConfirm && (
        <StyledSecondaryActionButtonForText
          style={{ marginRight: "10px" }}
          onClick={() => setConfirmed(false)}
        >
          Avbryt
        </StyledSecondaryActionButtonForText>
      )}

      <StyledActionButtonForText onClick={deleteDay}>
        {showConfirm ? "Sikker?" : "Slett dag"}
      </StyledActionButtonForText>
    </div>
  );
};

export const Day = ({
  date,
  addToTrelloActive,
  toggleShoppingCart,
  isShoppingCartActive,
  activeFilters
}: Props) => {
  const [recipe, setRecipe]: [RecipeType, any] = useState(initialState);
  const [dayData, setDayData]: [DayData, any] = useState(initialDayData);
  const [loading, setLoading]: any = useState(true);

  const recipeContext = useContext(RecipeContext);
  const userdata = useContext(UserDataContext).userdata;

  const reset = () => {
    setDayData(initialDayData);
    setRecipe(initialState);
  };

  useEffect(
    () => {
      reset();
      const db = firebase.firestore();
      const daysQuery = db
        .collection("days")
        .where("date", "==", date)
        .where("group", "==", userdata.group);
      const unsub = daysQuery.onSnapshot(daysMatchesDoc => {
        if (daysMatchesDoc.empty) {
          setLoading(false);
        }

        daysMatchesDoc.forEach(daysMatch => {
          const dayData: any = daysMatch.data();
          setLoading(false);
          setDayData({
            id: daysMatch.id,
            ...dayData
          });

          if (dayData.recipe) {
            const recipe = recipeContext.recipes.find(
              el => el.id === dayData.recipe
            );

            if (recipe) {
              setRecipe(recipe);
            }
          }
        });
      });
      return () => {
        unsub();
      };
    },
    [date, recipeContext.recipes, userdata.group]
  );

  const today = isToday(date);

  return (
    <StyledDay
      active={today}
      selected={isShoppingCartActive && addToTrelloActive}
    >
      <StyledDate>
        {format(date, "dddd DD.MM", { locale: nbLocale })}
      </StyledDate>
      <StyledDayContent>
        {loading ? (
          <StyledLocalLoaderWithMarginTop />
        ) : (
          <>
            {dayData.description && (
              <>
                {today && <div>Hva skjer i dag?: </div>}
                <StyledHeaderH1NoMarginTop>
                  {dayData.description}
                </StyledHeaderH1NoMarginTop>
                <DeleteDay documentId={dayData.id} reset={reset} />
              </>
            )}
            {recipe.name !== "" && (
              <div
                onClick={() =>
                  addToTrelloActive ? toggleShoppingCart(date) : null
                }
              >
                {today && <div>Dagens meny: </div>}
                <RecipeDetails recipe={recipe} />
                <DeleteDay documentId={dayData.id} reset={reset} />
              </div>
            )}
            {recipe.name === "" && !dayData.description && (
              <GenerateDay date={date} activeFilters={activeFilters} />
            )}
          </>
        )}
      </StyledDayContent>
    </StyledDay>
  );
};
