import React, { useContext } from "react";
import styled from "styled-components";
import { RecipeType, Ingredient, Unit } from "../types";
import { StyledHeaderH1 } from "../components/StyledHeaderH1";
import { IngredientsContext } from "../context/IngredientsContext";

const StyledWrapper = styled.div`
  max-width: 480px;
`;

interface Props {
  recipe: RecipeType;
}

const StyledUl = styled.ul`
  text-align: left;
  display: inline-block;
  margin-top: 10px;
`;

const StyledEmpesizedP = styled.p`
  font-weight: bold;
  margin-bottom: 10px;
`;

export const RecipeDetails = ({
  recipe: { name, description, ingredients }
}: Props) => {
  const ingredientsFromContext = useContext(IngredientsContext).ingredients;

  const ingredientsStrings: Ingredient[] = ingredients.map(ingredient => {
    const res = ingredientsFromContext.find(el => el.id === ingredient);
    return (
      res || {
        name: "",
        unit: "Units" as Unit,
        id: ""
      }
    );
  });

  return (
    <StyledWrapper>
      <StyledHeaderH1>{name}</StyledHeaderH1>
      {description && (
        <>
          <StyledEmpesizedP>Beskrivelse</StyledEmpesizedP>
          <p>{description}</p>
        </>
      )}
      <StyledUl>
        {ingredientsStrings.length > 0 && (
          <>
            <StyledEmpesizedP>Ingredienser</StyledEmpesizedP>
            {ingredientsStrings.map((i: any) => (
              <li key={i.name}>{i.name}</li>
            ))}
          </>
        )}
      </StyledUl>
    </StyledWrapper>
  );
};
