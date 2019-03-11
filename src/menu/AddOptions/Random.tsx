import React, { useEffect, useState } from "react";
import { RecipeType, RecipeWithRatingType } from "../../types";
import { RecipeDetails } from "../RecipeDetail";
import {
  StyledActionButtonWithMargins,
  StyledSecondaryActionButtonWithMargins
} from "../../components/StyledActionButton";
import { firebase } from "../../firebase/firebase";
import styled from "styled-components";
import { calculate } from "../../calculator/calculate";
import {
  StyledBack,
  StyledCheck,
  StyledRotate
} from "../../components/StyledSvgIcons";

interface Props {
  date: Date;
  back: () => void;
}

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
      lastTimeSelected: date,
      hasBeenSelected: true
    });
};

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
`;

const findRecipe = (date: Date) => {
  return new Promise(resolve => {
    firebase
      .firestore()
      .collection("recipes")
      .get()
      .then(snapshot => {
        const recipes = snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
          lastTimeSelected: doc.data().lastTimeSelected.toDate()
        }));

        const recipesWithRating = recipes.map(
          (recipe: RecipeWithRatingType) => ({
            ...recipe,
            score: calculate(date, recipe, 50)
          })
        );
        const logThis = recipesWithRating.map(({ name, score }: any) => ({
          ...score,
          name
        }));

        console.log(
          logThis.sort((el1, el2) => el2.totalScore - el1.totalScore)
        );

        const bestRecipe = recipesWithRating.reduce(
          (
            bestRecipe: RecipeWithRatingType,
            testRecipe: RecipeWithRatingType
          ) =>
            bestRecipe.score.totalScore > testRecipe.score.totalScore
              ? bestRecipe
              : testRecipe
        );
        resolve(bestRecipe);
      });
  });
};

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

export const Random = ({ date, back }: Props) => {
  const [recipe, setRecipe]: [RecipeType, any] = useState(initialState);

  useEffect(() => {
    findRecipe(date).then(recipe => setRecipe(recipe));
  }, []);

  return (
    <>
      <StyledButtonContainer>
        <StyledSecondaryActionButtonWithMargins onClick={back}>
          <StyledBack />
        </StyledSecondaryActionButtonWithMargins>
        <StyledActionButtonWithMargins
          onClick={() => {
            storeSelectedRecipe(date, recipe.id);
          }}
        >
          <StyledCheck />
        </StyledActionButtonWithMargins>
        <StyledActionButtonWithMargins
          onClick={() => findRecipe(date).then(recipe => setRecipe(recipe))}
        >
          <StyledRotate />
        </StyledActionButtonWithMargins>
      </StyledButtonContainer>
      <RecipeDetails recipe={recipe} />
    </>
  );
};
