import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import styled from "styled-components";
import { firebase } from "../firebase/firebase";
import { RecipeType } from "../types";
import nbLocale from "date-fns/locale/nb";
import { RecipeDetails } from "../recipes/RecipeDetail";
import { GenerateDay } from "./GenerateDay";
import { StyledLocalLoader } from "../components/StyledLocalLoader";

interface Props {
  date: Date;
}

const StyledDay = styled.div`
  width: 48%;
  border: 1px solid black;
  display: inline-block;
  padding: 20px 10px;
  text-align: center;
  margin: 5px;
  min-height: 100px;

  @media screen and (max-width: 530px) {
    width: 100%;
  }
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

const StyledDayContent = styled.div``;

const StyledLocalLoaderWithMarginTop = styled(StyledLocalLoader)`
  margin-top: 42px;
`;

export const Day = ({ date }: Props) => {
  const [recipe, setRecipe]: [RecipeType, any] = useState(initialState);
  const [loading, setLoading]: any = useState(false);

  useEffect(
    () => {
      setRecipe(initialState);
      const db = firebase.firestore();
      setLoading(true);
      const daysQuery = db.collection("days").where("date", "==", date);
      daysQuery.get().then(daysMatchesDoc => {
        setLoading(false);

        daysMatchesDoc.forEach(daysMatch => {
          db.collection("recipes")
            .doc(daysMatch.data().recipe)
            .get()
            .then(doc => {
              if (doc.data()) {
                setRecipe(doc.data());
              }
            });
        });
      });
    },
    [date]
  );

  return (
    <StyledDay>
      <p>{format(date, "dddd DD.MM.YYYY", { locale: nbLocale })}</p>
      <StyledDayContent>
        {loading ? (
          <StyledLocalLoaderWithMarginTop />
        ) : (
          <>
            {recipe.name === "" ? (
              <GenerateDay date={date} />
            ) : (
              <RecipeDetails recipe={recipe} />
            )}
          </>
        )}
      </StyledDayContent>
    </StyledDay>
  );
};
