import React, { useState, useEffect } from "react";
import { ListRecipes } from "./ListRecipes";
import { AddRecipe } from "./AddRecipe";
import { StyledWrapper } from "../components/StyledWrapper";
import { RouteComponentProps } from "react-router";
import { StyledNotification } from "../components/StyledNotification";
import { ListRecipesAndRedirect } from "./ListRecipesAndRedirect";

interface MatchParams {
  feedback: string;
}

interface Props extends RouteComponentProps<MatchParams> {}

export const Recipes = ({
  match: {
    params: { feedback }
  }
}: Props) => {
  const [feedbackActive, setFeedbackActive] = useState(false);

  useEffect(() => {
    if (feedback) {
      setTimeout(() => {
        setFeedbackActive(true);
      }, 0);
      setTimeout(() => {
        setFeedbackActive(false);
      }, 2000);
    }
  }, []);

  return (
    <StyledWrapper backgroundColor="white">
      <StyledNotification text="Oppskrift slettet" active={feedbackActive} />
      <ListRecipesAndRedirect />
      <AddRecipe />
    </StyledWrapper>
  );
};
