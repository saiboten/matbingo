import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import styled from "styled-components";
import { firebase } from "../firebase/firebase";
import { RecipeType, RecipeWithRatingType } from "../types";
import nbLocale from "date-fns/locale/nb";
import { RecipeDetails } from "../recipes/RecipeDetail";
import { GenerateDay } from "./GenerateDay";

interface Props {
  date: Date;
}

const StyledDay = styled.div`
  width: 48%;
  border: 1px solid black;
  display: inline-block;
  padding: 20px 10px;
  text-align: center;
  margin: 5px;
  min-height: 100px;

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

export const Day = ({ date }: Props) => {
  const [recipe, setRecipe]: [RecipeType, any] = useState(initialState);
  const [recipeFound, setRecipeFound]: any = useState(false);
  const [showConfirm, setShowConfig]: [boolean, any] = useState(false);

  useEffect(
    () => {
      setRecipe(initialState);
      const db = firebase.firestore();
      setRecipeFound(false);
      const daysQuery = db.collection("days").where("date", "==", date);
      daysQuery.get().then(daysMatches => {
        daysMatches.forEach(daysMatch => {
          db.collection("recipes")
            .doc(daysMatch.data().recipe)
            .get()
            .then(doc => {
              setRecipeFound(true);
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
    <StyledDay>
      <p>{format(date, "dddd DD.MM.YYYY", { locale: nbLocale })}</p>
      <StyledDayContent>
        {recipe.name === "" ? (
          <GenerateDay date={date} />
        ) : (
          <RecipeDetails recipe={recipe} />
        )}
      </StyledDayContent>
    </StyledDay>
  );
};
