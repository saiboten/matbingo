import React, { useState } from "react";
import styled from "styled-components";
import { firebase } from "../firebase/firebase";
import { RecipeType, RecipeWithRatingType } from "../types";
import { StyledActionButton } from "../components/StyledActionButton";
import { calculate } from "../calculator/calculate";
import { RecipeDetails } from "../recipes/RecipeDetail";

const storeSelectedRecipe = (date: Date, recipe: RecipeType) => {
  firebase
    .firestore()
    .collection("days")
    .add({
      date,
      recipe: recipe.id
    });

  firebase
    .firestore()
    .collection("recipes")
    .doc(recipe.id)
    .set({
      ...recipe,
      lastTimeSelected: date
    });
};

const findRecipe = (date: Date) => {
  return new Promise(resolve => {
    firebase
      .firestore()
      .collection("recipes")
      .onSnapshot(snapshot => {
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

        console.log(logThis);

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

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
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

const StyledActionButtonWithMargins = styled(StyledActionButton)`
  margin: 10px;
`;

export const GenerateDay = ({ date }: { date: Date }) => {
  const [recipe, setRecipe]: [RecipeType, any] = useState(initialState);
  const [showConfirm, setShowConfirm]: [boolean, any] = useState(false);
  const [stored, setStored]: [boolean, any] = useState(false);

  if (stored) {
    return <RecipeDetails recipe={recipe} />;
  }

  return (
    <>
      <RecipeDetails recipe={recipe} />
      <StyledButtonContainer>
        <StyledActionButtonWithMargins
          onClick={() => {
            setShowConfirm(true);
            findRecipe(date).then((recipe: any) => setRecipe(recipe));
          }}
        >
          Lag forslag
        </StyledActionButtonWithMargins>
        {showConfirm && (
          <StyledActionButtonWithMargins
            onClick={() => {
              storeSelectedRecipe(date, recipe);
              setStored(true);
            }}
          >
            Lagre dag
          </StyledActionButtonWithMargins>
        )}
      </StyledButtonContainer>
    </>
  );
};
