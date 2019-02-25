import React from "react";
import styled from "styled-components";
import { RecipeType } from "../types";
import { StyledHeaderH1 } from "../components/StyledHeaderH1";

const StyledWrapper = styled.div`
  max-width: 480px;
`;

interface Props {
  recipe: RecipeType;
}

export const RecipeDetails = ({
  recipe: { name, description, ingredients }
}: Props) => (
  <StyledWrapper>
    <StyledHeaderH1>{name}</StyledHeaderH1>
    <p>{description}</p>
    <ul>
      {ingredients.map(el => (
        <li key={el}>{el}</li>
      ))}
    </ul>
  </StyledWrapper>
);
