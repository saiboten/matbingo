import React, { useEffect, useState, useContext } from "react";
import { RecipeType, RecipeWithRatingType } from "../../types";
import { RecipeDetails } from "../RecipeDetail";
import {
  StyledActionButtonWithMargins,
  StyledSecondaryActionButtonWithMargins,
  StyledActionButtonForText
} from "../../components/StyledActionButton";
import { firebase } from "../../firebase/firebase";
import styled from "styled-components";
import { calculate } from "../../calculator/calculate";
import {
  StyledBack,
  StyledCheck,
  StyledRotate
} from "../../components/StyledSvgIcons";
import { UserDataContext, UserData } from "../../context/UserDataContext";
import { Filter } from "../Filter";

interface Props {
  date: Date;
  back: () => void;
  activeFilters: Filter[];
}

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

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
`;

const findRecipe = (
  date: Date,
  userData: UserData,
  activeFilters: Filter[]
) => {
  return new Promise(resolve => {
    const filterFunctions = activeFilters.map(filter => filter.filter);

    firebase
      .firestore()
      .collection("recipes")
      .where("group", "==", userData.group)
      .get()
      .then(snapshot => {
        const unfilteredRecipes = snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
          lastTimeSelected: doc.data().lastTimeSelected.toDate()
        }));

        var recipes = filterFunctions.reduce(
          (recipes, filter) => filter(recipes),
          [...unfilteredRecipes]
        );

        const recipesWithRating = recipes.map(
          (recipe: RecipeWithRatingType) => ({
            ...recipe,
            score: calculate(date, recipe, 20)
          })
        );

        const sortedRecipes = recipesWithRating.map(
          ({ score, ...rest }: any) => ({
            ...score,
            ...rest
          })
        );

        sortedRecipes.sort((el1, el2) => el2.totalScore - el1.totalScore);
        resolve({ sortedRecipes });
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
  hasBeenSelected: false,
  recipetype: []
};

const StyledTd = styled.td``;

export const Random = ({ date, back, activeFilters }: Props) => {
  const [recipe, setRecipe]: [
    RecipeType,
    ((data: RecipeType) => void)
  ] = useState(initialState);

  const [recipes, setRecipes]: [any[], any] = useState([]);
  const [showDetails, setShowDetails]: [boolean, any] = useState(false);

  const userdata = useContext(UserDataContext).userdata;

  useEffect(
    () => {
      findRecipe(date, userdata, activeFilters).then(
        ({ sortedRecipes }: any) => {
          if (sortedRecipes.length > 0) {
            const [first, ...rest] = sortedRecipes;
            setRecipe(first);
            setRecipes(rest);
          }
        }
      );
    },
    [activeFilters, date, userdata]
  );

  return (
    <>
      <StyledButtonContainer>
        <StyledSecondaryActionButtonWithMargins onClick={back}>
          <StyledBack />
        </StyledSecondaryActionButtonWithMargins>
        {recipe && (
          <StyledActionButtonWithMargins
            onClick={() => {
              storeSelectedRecipe(date, recipe.id, userdata.group);
            }}
          >
            <StyledCheck />
          </StyledActionButtonWithMargins>
        )}
        <StyledActionButtonWithMargins
          onClick={() => {
            const [first, ...rest] = recipes;
            setRecipes(rest);
            setRecipe(first);
          }}
        >
          <StyledRotate />
        </StyledActionButtonWithMargins>
      </StyledButtonContainer>
      {recipe ? (
        <RecipeDetails recipe={recipe} />
      ) : (
        <div>Fant ingen oppskrifter med valgte filtre</div>
      )}

      {showDetails ? (
        <>
          <StyledActionButtonForText
            style={{ marginBottom: "1rem", marginTop: "1rem" }}
            onClick={() => setShowDetails(false)}
          >
            Skjul score-detaljer
          </StyledActionButtonForText>
          <table>
            <tr>
              <th style={{ width: "130px", overflow: "hidden" }}>Navn</th>
              <th>Tot</th>
              <th>Dato</th>
              <th>Frek</th>
              <th>Never</th>
              <th>Rand</th>
            </tr>
            {recipes.length > 0 &&
              recipes.map(
                (
                  {
                    name,
                    totalScore,
                    dateScore,
                    frequencyScore,
                    neverEatenScore,
                    randomScore
                  },
                  index
                ) => (
                  <tr
                    style={{ marginBottom: "1rem", textAlign: "left" }}
                    key={index}
                  >
                    <StyledTd>{name}</StyledTd>
                    <StyledTd>{totalScore}</StyledTd>
                    <StyledTd>{dateScore}</StyledTd>
                    <StyledTd>{frequencyScore}</StyledTd>
                    <StyledTd>{neverEatenScore}</StyledTd>
                    <StyledTd>{randomScore}</StyledTd>
                  </tr>
                )
              )}
          </table>
        </>
      ) : (
        <></>
        // <StyledActionButtonForText
        //   style={{ marginTop: "1rem" }}
        //   onClick={() => setShowDetails(true)}
        // >
        //   Se score-detaljer
        // </StyledActionButtonForText>
      )}
    </>
  );
};
