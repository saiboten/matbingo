import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { firebase } from "../firebase/firebase";
import { RecipeType, RecipeWithRatingType } from "../types";
import { StyledActionButton } from "../components/StyledActionButton";
import { calculate } from "../calculator/calculate";
import { RecipeDetails } from "../recipes/RecipeDetail";
import { ReactComponent as ConfirmIcon } from "../components/svg/check.svg";
import { ReactComponent as PlusCircle } from "../components/svg/plus-circle.svg";
import { ReactComponent as Rotate } from "../components/svg/rotate-ccw.svg";
import { ListRecipes } from "../recipes/ListRecipes";

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
  padding: 5px;
  padding-bottom: 2px;
  border-radius: 5px;
`;

const StyledCheckIcon = styled(ConfirmIcon)`
  width: 24px;
  height: 24px;
  fill: white;
`;

const StyledPlusCircle = styled(PlusCircle)`
  width: 24px;
  height: 24px;
  fill: white;
`;

const StyledRotate = styled(Rotate)`
  width: 24px;
  height: 24px;
  fill: white;
`;

const SelectAction = ({
  date,
  setAction,
  setRecipe
}: {
  setAction: (action: string) => void;
  setRecipe: (recipe: RecipeType) => void;
  date: Date;
}) => (
  <>
    <StyledActionButtonWithMargins
      onClick={() => {
        setAction("random");
        findRecipe(date).then((recipe: any) => setRecipe(recipe));
      }}
    >
      <StyledPlusCircle />
    </StyledActionButtonWithMargins>
    <StyledActionButtonWithMargins
      onClick={() => {
        setAction("find");
      }}
    >
      <p>Finn oppskrift</p>
    </StyledActionButtonWithMargins>
    <StyledActionButtonWithMargins
      onClick={() => {
        setAction("manual");
      }}
    >
      <p>Skriv inn</p>
    </StyledActionButtonWithMargins>
  </>
);

export const GenerateDay = ({ date }: { date: Date }) => {
  const [recipe, setRecipe]: [RecipeType, any] = useState(initialState);
  const [action, setAction]: [string, any] = useState("");
  const [stored, setStored]: [boolean, any] = useState(false);

  if (stored) {
    return <RecipeDetails recipe={recipe} />;
  }

  if (action === "random") {
    return (
      <>
        <RecipeDetails recipe={recipe} />
        <StyledButtonContainer>
          <StyledActionButtonWithMargins
            onClick={() => {
              storeSelectedRecipe(date, recipe.id);
              setStored(true);
            }}
          >
            <StyledCheckIcon />
          </StyledActionButtonWithMargins>
        </StyledButtonContainer>
      </>
    );
  } else if (action === "find") {
    return (
      <ListRecipes
        onChange={(option: any) => storeSelectedRecipe(date, option.value)}
      />
    );
  } else if (action === "manual") {
    return <p>Skriv inn manuelt</p>;
  }

  return (
    <SelectAction setAction={setAction} setRecipe={setRecipe} date={date} />
  );
};
