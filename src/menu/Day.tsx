import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import styled from "styled-components";
import { firebase } from "../firebase/firebase";
import { RecipeType } from "../types";
import nbLocale from "date-fns/locale/nb";

interface Props {
  date: Date;
}

const StyledDay = styled.div`
  width: 150px;
  border: 1px solid black;
  display: inline-block;
  padding: 20px 10px;
  text-align: center;
  margin: 5px;
`;

const initialState: RecipeType = {
  name: "",
  description: "",
  id: "",
  ingredients: [],
  weekdays: [],
  lastTimeSelected: new Date(),
  rating: 0
};

const GenerateDay = () => <div>Lag dag</div>;

export const Day = ({ date }: Props) => {
  const [recipe, setRecipe]: [RecipeType, any] = useState(initialState);
  const [recipeFound, setRecipeFound]: any = useState(false);

  useEffect(
    () => {
      setRecipe(initialState);
      const db = firebase.firestore();
      recipeFound(false);
      const daysQuery = db.collection("days").where("date", "==", date);
      daysQuery.get().then(daysMatches => {
        daysMatches.forEach(daysMatch => {
          db.collection("recipes")
            .doc(daysMatch.data().recipe)
            .get()
            .then(doc => {
              recipeFound(true);
              setRecipe(doc.data());
            });
        });
      });
    },
    [date]
  );

  return (
    <StyledDay>
      <p>{format(date, "dddd DD.MM.YYYY", { locale: nbLocale })}</p>
      <div>{recipe.name === "" ? <GenerateDay /> : recipe.name}</div>
    </StyledDay>
  );
};
