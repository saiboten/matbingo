import React, { useEffect, useState, useContext } from "react";
import { RecipeType, RecipeWithRatingType, ScoreDetails } from "../../types";
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

        // todo apply all filter functions
        var recipes = filterFunctions.reduce(
          (recipes, filter) => {
            var filtered = filter(recipes);
            console.log(filtered);
            return filtered;
          },
          [...unfilteredRecipes]
        );

        const recipesWithRating = recipes.map(
          (recipe: RecipeWithRatingType) => ({
            ...recipe,
            score: calculate(date, recipe, 20)
          })
        );
        const logThis = recipesWithRating.map(({ name, score }: any) => ({
          ...score,
          name
        }));

        console.log(
          logThis.sort((el1, el2) => el2.totalScore - el1.totalScore)
        );

        if (recipesWithRating.length === 0) {
          resolve({ bestRecipe: undefined, logThis });
        } else {
          const bestRecipe = recipesWithRating.reduce(
            (
              bestRecipe: RecipeWithRatingType,
              testRecipe: RecipeWithRatingType
            ) =>
              bestRecipe.score.totalScore > testRecipe.score.totalScore
                ? bestRecipe
                : testRecipe
          );
          resolve({ bestRecipe, logThis });
        }
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
  const [recipe, setRecipe]: [RecipeType, any] = useState(initialState);
  const [scoreDetails, setScoreDetails]: [any[], any] = useState([]);

  const userdata = useContext(UserDataContext).userdata;

  useEffect(() => {
    findRecipe(date, userdata, activeFilters).then((data: any) => {
      setRecipe(data.bestRecipe);
      setScoreDetails(data.logThis);
    });
  }, []);

  console.log(scoreDetails);

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
          onClick={() =>
            findRecipe(date, userdata, activeFilters).then(
              ({ bestRecipe, logThis }: any) => {
                setRecipe(bestRecipe);
                setScoreDetails(logThis);
              }
            )
          }
        >
          <StyledRotate />
        </StyledActionButtonWithMargins>
      </StyledButtonContainer>
      {recipe ? (
        <RecipeDetails recipe={recipe} />
      ) : (
        <div>Fant ingen oppskrifter med valgte filtre</div>
      )}

      <table>
        <tr>
          <th style={{ width: "130px", overflow: "hidden" }}>Navn</th>
          <th>Tot</th>
          <th>Dato</th>
          <th>Frek</th>
          <th>Never</th>
          <th>Rand</th>
        </tr>
        {scoreDetails.length > 0 &&
          scoreDetails.map(
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
  );
};
