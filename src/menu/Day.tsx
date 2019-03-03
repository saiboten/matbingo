import React, { useEffect, useState } from "react";
import { format, isToday } from "date-fns";
import styled from "styled-components";
import { firebase } from "../firebase/firebase";
import { RecipeType, Ingredient } from "../types";
import nbLocale from "date-fns/locale/nb";
import { RecipeDetails } from "../recipes/RecipeDetail";
import { GenerateDay } from "./GenerateDay";
import { StyledLocalLoader } from "../components/StyledLocalLoader";
import { primaryColor } from "../components/Constants";

interface Props {
  date: Date;
}

interface StyledDayProps {
  active: boolean;
}

const StyledDay = styled.div<StyledDayProps>`
  width: 48%;
  border: 1px solid black;
  display: inline-block;
  padding: 20px 10px;
  text-align: center;
  margin: 5px;
  min-height: 100px;
  box-shadow: 1px 2px 5px rgba(0, 0, 0, 0.3);

  border: ${props =>
    props.active ? `3px solid ${primaryColor}` : "1px solid black"};

  @media screen and (max-width: 530px) {
    width: 100%;
  }
`;

const initialState: RecipeType = {
  name: "",
  description: "",
  id: "",
  ingredients: [],
  weekdays: [],
  lastTimeSelected: new Date(),
  rating: 1
};

const StyledDayContent = styled.div``;

const StyledLocalLoaderWithMarginTop = styled(StyledLocalLoader)`
  margin-top: 42px;
`;

export const Day = ({ date }: Props) => {
  const [recipe, setRecipe]: [RecipeType, any] = useState(initialState);
  const [loading, setLoading]: any = useState(false);

  useEffect(
    () => {
      setRecipe(initialState);
      const db = firebase.firestore();
      setLoading(true);
      const daysQuery = db.collection("days").where("date", "==", date);
      daysQuery.get().then(daysMatchesDoc => {
        if (daysMatchesDoc.empty) {
          setLoading(false);
        }

        daysMatchesDoc.forEach(daysMatch => {
          db.collection("recipes")
            .doc(daysMatch.data().recipe)
            .get()
            .then(doc => {
              setLoading(false);
              if (doc.data()) {
                setRecipe(doc.data());
              }
            });
        });
      });
    },
    [date]
  );

  return (
    <StyledDay active={isToday(date)}>
      <p>{format(date, "dddd DD.MM.YYYY", { locale: nbLocale })}</p>
      <StyledDayContent>
        {loading ? (
          <StyledLocalLoaderWithMarginTop />
        ) : (
          <>
            {recipe.name === "" ? (
              <GenerateDay date={date} />
            ) : (
              <RecipeDetails recipe={recipe} />
            )}
          </>
        )}
      </StyledDayContent>
    </StyledDay>
  );
};
