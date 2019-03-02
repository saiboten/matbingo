import React, { useState, useEffect } from "react";
import { ListRecipes } from "./ListRecipes";
import { AddRecipe } from "./AddRecipe";
import { StyledWrapper } from "../components/StyledWrapper";
import { RouteComponentProps } from "react-router";
import { StyledNotification } from "../components/StyledNotification";

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
    <StyledWrapper>
      <StyledNotification text="Oppskrift slettet" active={feedbackActive} />
      <ListRecipes />
      <AddRecipe />
    </StyledWrapper>
  );
};
