import React, { useState, useEffect } from "react";
import { ListRecipes } from "./ListRecipes";
import { AddRecipe } from "./AddRecipe";
import { StyledWrapper } from "../components/StyledWrapper";
import { RouteComponentProps } from "react-router";
import { StyledNotification } from "../components/StyledNotification";
import { ListRecipesAndRedirect } from "./ListRecipesAndRedirect";
import { StyledButtonWithMargins } from "../components/StyledButton";
import { StyledHeaderH1 } from "../components/StyledHeaderH1";
import { StyledListItemLink } from "../components/StyledList";

interface MatchParams {
  feedback: string;
}

interface Props extends RouteComponentProps<MatchParams> {}

export const RecipesContent = ({ feedback }: { feedback: string }) => {
  const [feedbackActive, setFeedbackActive] = useState(false);
  const [showFindRecipe, setShowFindRecipe] = useState(false);

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
    <>
      <StyledNotification text="Oppskrift slettet" active={feedbackActive} />
      <StyledHeaderH1>Oppskrifter</StyledHeaderH1>
      {showFindRecipe ? (
        <ListRecipesAndRedirect />
      ) : (
        <StyledButtonWithMargins onClick={() => setShowFindRecipe(true)}>
          Finn oppskrift
        </StyledButtonWithMargins>
      )}
      <StyledListItemLink to="/add-recipe">
        Legg til oppskrift
      </StyledListItemLink>
    </>
  );
};

export const Recipes = ({
  match: {
    params: { feedback }
  }
}: Props) => {
  return (
    <StyledWrapper backgroundColor="white">
      <RecipesContent feedback={feedback} />
    </StyledWrapper>
  );
};
