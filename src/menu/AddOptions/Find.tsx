import React, { useState, useContext } from "react";
import { ListRecipes } from "../../recipes/ListRecipes";
import { firebase } from "../../firebase/firebase";
import {
  StyledActionButtonWithMargins,
  StyledSecondaryActionButtonWithMargins
} from "../../components/StyledActionButton";
import { RecipeType } from "../../types";
import { RecipeDetails } from "../RecipeDetail";
import styled from "styled-components";
import { StyledBack, StyledCheck } from "../../components/StyledSvgIcons";
import { UserDataContext } from "../../context/UserDataContext";
import { useRecipes } from "../../hooks/useRecipes";
import { StyledLocalLoader } from "../../components/StyledLocalLoader";

const storeSelectedRecipe = (date: Date, recipeId: string, group: string) => {
  firebase
    .firestore()
    .collection("days")
    .add({
      date,
      recipe: recipeId,
      group
    });

  firebase
    .firestore()
    .collection("recipes")
    .doc(recipeId)
    .update({
      lastTimeSelected: date,
      hasBeenSelected: true
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
  rating: 1,
  hasBeenSelected: false,
  recipetype: []
};

const StyledActionBox = styled.div`
  margin-top: 2rem;
`;

export const Find = ({ date, back }: Props) => {
  const [confirm, setConfirm]: [boolean, any] = useState(false);
  const [recipe, setRecipe]: [RecipeType, any] = useState(initialState);

  const [recipesLoading, recipes] = useRecipes();
  const userData = useContext(UserDataContext).userdata;

  if (recipesLoading) {
    return <StyledLocalLoader />;
  }

  const confirmCheck = (recipeId: string) => {
    setConfirm(true);
    setRecipe(recipes.find(r => r.id === recipeId));
  };

  return (
    <>
      <StyledActionBox>
        <StyledSecondaryActionButtonWithMargins onClick={back}>
          <StyledBack />
        </StyledSecondaryActionButtonWithMargins>
        {confirm && (
          <StyledActionButtonWithMargins
            onClick={() => storeSelectedRecipe(date, recipe.id, userData.group)}
          >
            <StyledCheck />
          </StyledActionButtonWithMargins>
        )}
      </StyledActionBox>

      {confirm ? (
        <RecipeDetails today={false} recipe={recipe} />
      ) : (
        <ListRecipes onChange={(option: any) => confirmCheck(option.value)} />
      )}
    </>
  );
};
