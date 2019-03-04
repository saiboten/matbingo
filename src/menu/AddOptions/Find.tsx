import React, { useState } from "react";
import { ListRecipes } from "../../recipes/ListRecipes";
import { firebase } from "../../firebase/firebase";
import {
  StyledActionButton,
  StyledActionButtonWithMargins
} from "../../components/StyledActionButton";
import { RecipeType } from "../../types";
import { RecipeDetails } from "../../recipes/RecipeDetail";
import styled from "styled-components";

const storeSelectedRecipe = (date: Date, recipeId: string) => {
  firebase
    .firestore()
    .collection("days")
    .add({
      date,
      recipe: recipeId
    });

  firebase
    .firestore()
    .collection("recipes")
    .doc(recipeId)
    .update({
      lastTimeSelected: date
    });
};

interface Props {
  date: Date;
  back: () => void;
}

const initialState: RecipeType = {
  name: "",
  description: "",
  id: "",
  ingredients: [],
  weekdays: [],
  lastTimeSelected: new Date(),
  rating: 1
};

const StyledActionBox = styled.div`
  margin-top: 2rem;
`;

export const Find = ({ date, back }: Props) => {
  const [confirm, setConfirm]: [boolean, any] = useState(false);
  const [recipe, setRecipe]: [RecipeType, any] = useState(initialState);

  const confirmCheck = (recipeId: string) => {
    setConfirm(true);
    firebase
      .firestore()
      .collection("recipes")
      .doc(recipeId)
      .get()
      .then((recipeDoc: any) => {
        setRecipe(recipeDoc.data());
      });
  };

  return (
    <>
      {confirm ? (
        <RecipeDetails recipe={recipe} />
      ) : (
        <ListRecipes onChange={(option: any) => confirmCheck(option.value)} />
      )}

      <StyledActionBox>
        {confirm && (
          <StyledActionButtonWithMargins
            onClick={() => storeSelectedRecipe(date, recipe.id)}
          >
            Lagre
          </StyledActionButtonWithMargins>
        )}
        <StyledActionButtonWithMargins onClick={back}>
          Gå tilbake
        </StyledActionButtonWithMargins>
      </StyledActionBox>
    </>
  );
};
