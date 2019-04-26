import React, { useEffect, useState, useContext } from "react";
import { format, isToday } from "date-fns";
import styled from "styled-components";
import { firebase } from "../firebase/firebase";
import { RecipeType, Ingredient } from "../types";
import nbLocale from "date-fns/locale/nb";
import { RecipeDetails } from "./RecipeDetail";
import { GenerateDay } from "./GenerateDay";
import { StyledLocalLoader } from "../components/StyledLocalLoader";
import { primaryColor, secondaryColor } from "../components/Constants";
import { RecipeContext } from "../context/RecipeContext";
import { UserDataContext } from "../context/UserDataContext";
import { StyledHeaderH1NoMarginTop } from "../components/StyledHeaderH1";
import {
  StyledActionButtonForText,
  StyledSecondaryActionButtonForText
} from "../components/StyledActionButton";

interface Props {
  date: Date;
}

interface StyledDayProps {
  active: boolean;
}

const StyledDay = styled.div<StyledDayProps>`
  position: relative;
  width: 48%;
  border: 1px solid black;
  display: inline-block;
  padding: 20px 10px;
  padding-left: 2rem;
  text-align: center;
  margin: 5px;
  min-height: 100px;
  box-shadow: 1px 2px 5px rgba(0, 0, 0, 0.3);
  background-color: #fff;
  color: #000;

  border: ${props =>
    props.active ? `3px solid ${primaryColor}` : "1px solid black"};

  @media screen and (max-width: 530px) {
    width: 100%;
  }
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
  hasBeenSelected: false
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

const StyledDayContent = styled.div``;

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
    <div style={{ textAlign: "right", marginTop: "10px" }}>
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

export const Day = ({ date }: Props) => {
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
    [date]
  );

  const today = isToday(date);

  return (
    <StyledDay active={today}>
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
                {today && <div>I dag skal vi kose oss med: </div>}
                <StyledHeaderH1NoMarginTop>
                  {dayData.description}
                </StyledHeaderH1NoMarginTop>
                <p>Ingen oppskrift denne dagen</p>
                <DeleteDay documentId={dayData.id} reset={reset} />
              </>
            )}
            {recipe.name !== "" && (
              <>
                {today && <div>I dag skal vi kose oss med: </div>}
                <RecipeDetails recipe={recipe} />
                <DeleteDay documentId={dayData.id} reset={reset} />
              </>
            )}
            {recipe.name === "" && !dayData.description && (
              <GenerateDay date={date} />
            )}
          </>
        )}
      </StyledDayContent>
    </StyledDay>
  );
};
