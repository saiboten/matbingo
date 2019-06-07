import React, { useState, useEffect, useContext } from "react";
import { StyledWrapper } from "../components/StyledWrapper";
import { RouteComponentProps } from "react-router";
import { StyledNotification } from "../components/StyledNotification";
import { StyledHeaderH1 } from "../components/StyledHeaderH1";
import { RecipeContext } from "../context/RecipeContext";
import { StyledLink } from "../components/StyledLink";

interface MatchParams {
  feedback: string;
}

interface Props extends RouteComponentProps<MatchParams> {}

export const RecipesContent = ({ feedback }: { feedback: string }) => {
  const [feedbackActive, setFeedbackActive] = useState(false);

  const recipes = useContext(RecipeContext).recipes;

  useEffect(() => {
    if (feedback) {
      setTimeout(() => {
        setFeedbackActive(true);
      }, 0);
      setTimeout(() => {
        setFeedbackActive(false);
      }, 2000);
    }
  }, [feedback]);

  return (
    <>
      <StyledNotification text="Oppskrift slettet" active={feedbackActive} />
      <StyledHeaderH1>Oppskrifter</StyledHeaderH1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap"
        }}
      >
        {recipes.length > 0 && (
          <StyledLink to="/find-recipes">Finn oppskrift</StyledLink>
        )}
        <StyledLink to="/add-recipe">Legg til oppskrift</StyledLink>
      </div>
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
