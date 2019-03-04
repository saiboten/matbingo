import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { firebase } from "../firebase/firebase";
import { RecipeType, RecipeWithRatingType } from "../types";
import { StyledActionButton } from "../components/StyledActionButton";
import { calculate } from "../calculator/calculate";
import { RecipeDetails } from "../recipes/RecipeDetail";
import { ReactComponent as PlusCircle } from "../components/svg/plus-circle.svg";
import { ListRecipes } from "../recipes/ListRecipes";
import { Find } from "./AddOptions/Find";
import { Random } from "./AddOptions/Random";

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

const StyledPlusCircle = styled(PlusCircle)`
  width: 24px;
  height: 24px;
  fill: white;
`;

const SelectAction = ({
  setAction
}: {
  setAction: (action: string) => void;
}) => (
  <>
    <StyledActionButtonWithMargins
      onClick={() => {
        setAction("random");
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
  const [action, setAction]: [string, any] = useState("");

  if (action === "random") {
    return <Random back={() => setAction("")} date={date} />;
  } else if (action === "find") {
    return <Find date={date} back={() => setAction("")} />;
  } else if (action === "manual") {
    return <p>Skriv inn manuelt</p>;
  }

  return <SelectAction setAction={setAction} />;
};
