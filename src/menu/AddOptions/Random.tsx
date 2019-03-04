import React, { useEffect, useState } from "react";
import { RecipeType, RecipeWithRatingType } from "../../types";
import { RecipeDetails } from "../../recipes/RecipeDetail";
import { StyledActionButtonWithMargins } from "../../components/StyledActionButton";
import { firebase } from "../../firebase/firebase";
import styled from "styled-components";
import { ReactComponent as ConfirmIcon } from "../../components/svg/check.svg";
import { calculate } from "../../calculator/calculate";
import { ReactComponent as Rotate } from "../../components/svg/rotate-ccw.svg";

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
      lastTimeSelected: date
    });
};

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
`;

const StyledCheckIcon = styled(ConfirmIcon)`
  width: 24px;
  height: 24px;
  fill: white;
`;

const StyledRotate = styled(Rotate)`
  width: 24px;
  height: 24px;
  fill: white;
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
  rating: 1
};

export const Random = ({ date, back }: Props) => {
  const [recipe, setRecipe]: [RecipeType, any] = useState(initialState);

  useEffect(() => {
    findRecipe(date).then(recipe => setRecipe(recipe));
  }, []);

  return (
    <>
      <RecipeDetails recipe={recipe} />
      <StyledButtonContainer>
        <StyledActionButtonWithMargins
          onClick={() => {
            storeSelectedRecipe(date, recipe.id);
          }}
        >
          <StyledCheckIcon />
        </StyledActionButtonWithMargins>
        <StyledActionButtonWithMargins
          onClick={() => findRecipe(date).then(recipe => setRecipe(recipe))}
        >
          <StyledRotate />
        </StyledActionButtonWithMargins>
        <StyledActionButtonWithMargins onClick={back}>
          Gå tilbake
        </StyledActionButtonWithMargins>
      </StyledButtonContainer>
    </>
  );
};
