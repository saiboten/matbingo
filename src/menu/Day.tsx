import React, { useEffect, useState, useContext } from "react";
import { format, isToday } from "date-fns";
import styled from "styled-components";
import { firebase } from "../firebase/firebase";
import { RecipeType, Ingredient } from "../types";
import nbLocale from "date-fns/locale/nb";
import { RecipeDetails } from "./RecipeDetail";
import { GenerateDay } from "./GenerateDay";
import { StyledLocalLoader } from "../components/StyledLocalLoader";
import { primaryColor } from "../components/Constants";
import { RecipeContext } from "../context/RecipeContext";
import { UserDataContext } from "../context/UserDataContext";

interface Props {
  date: Date;
}

interface StyledDayProps {
  active: boolean;
}

const StyledDay = styled.div<StyledDayProps>`
  width: 48%;
  border: 1px solid black;
  display: inline-block;
  padding: 20px 10px;
  text-align: center;
  margin: 5px;
  min-height: 100px;
  box-shadow: 1px 2px 5px rgba(0, 0, 0, 0.3);

  border: ${props =>
    props.active ? `3px solid ${primaryColor}` : "1px solid black"};

  @media screen and (max-width: 530px) {
    width: 100%;
  }
`;

const StyledSpacedParagraph = styled.p`
  margin-top: 1rem;
  font-weight: bold;
`;

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

const StyledDayContent = styled.div``;

const StyledLocalLoaderWithMarginTop = styled(StyledLocalLoader)`
  margin-top: 42px;
`;

export const Day = ({ date }: Props) => {
  const [recipe, setRecipe]: [RecipeType, any] = useState(initialState);
  const [description, setDescription]: [string, any] = useState("");
  const [loading, setLoading]: any = useState(false);

  const recipeContext = useContext(RecipeContext);
  const userdata = useContext(UserDataContext).userdata;

  useEffect(
    () => {
      setDescription("");
      setRecipe(initialState);
      const db = firebase.firestore();
      setLoading(true);
      const daysQuery = db
        .collection("days")
        .where("date", "==", date)
        .where("group", "==", userdata.group);
      const unsub = daysQuery.onSnapshot(daysMatchesDoc => {
        if (daysMatchesDoc.empty) {
          setLoading(false);
        }

        daysMatchesDoc.forEach(daysMatch => {
          const dayData = daysMatch.data();
          setLoading(false);

          if (dayData.description) {
            setDescription(dayData.description);
          } else {
            const recipe = recipeContext.recipes.find(
              el => el.id === dayData.recipe
            );

            if (recipe) {
              setRecipe(recipe);
            }
          }
        });
      });
      return () => {
        unsub();
      };
    },
    [date]
  );

  return (
    <StyledDay active={isToday(date)}>
      <p>{format(date, "dddd DD.MM.YYYY", { locale: nbLocale })}</p>
      <StyledDayContent>
        {loading ? (
          <StyledLocalLoaderWithMarginTop />
        ) : (
          <>
            {description !== "" && (
              <StyledSpacedParagraph>{description}</StyledSpacedParagraph>
            )}
            {recipe.name !== "" && <RecipeDetails recipe={recipe} />}
            {recipe.name === "" && description === "" && (
              <GenerateDay date={date} />
            )}
          </>
        )}
      </StyledDayContent>
    </StyledDay>
  );
};
